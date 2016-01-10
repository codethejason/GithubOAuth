//import modules
var http = require('http');
var dispatcher = require('httpdispatcher');
var request = require('request');
var url = require('url');

var host = 'localhost';
var options = { //for github api
  clientID: '7d71da50c080b8899fa5',
  secret: '30221ba2c9d3ca955b0d7aa64ff57776dad801a1',
  scope: '',
  redirectURI: 'http://'+host+':8080/callback', //make sure this is the same as the callback URI in github
  
};


var token = '';
var state = Math.round(Math.random()*10); //not crypto secure; just a model for a stronger encryption option

//dispatcher routes
dispatcher.setStatic('resources');

//main page
dispatcher.onGet("/", function(req, res) {
  var data = "<!DOCTYPE html><html><body><a href='login'>Login to App</a></body></html>";
  res.write(data);
  res.end();
});

//login page 
dispatcher.onGet("/login", function(req, res) {
  var url = 'https://github.com/login/oauth/authorize'
  + '?client_id=' + options.clientID
  + (options.scope ? '&scope=' + options.scope : '')
  + '&redirect_uri=' + options.redirectURI
  + '&state=' + state
  ;
  res.statusCode = 302;
  res.setHeader('location', url);
  res.end();
});    

dispatcher.onGet("/callback", function(req, res) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  //returns something like { code: '6cd032d64f7b45f0d339', state: '10' }
  if(query.state == state) { //supposed to be if states match

    var arguments = {
      code: query.code,
      client_id: options.clientID,
      client_secret: options.secret
    };
    request.post({url: 'https://github.com/login/oauth/access_token', formData: arguments, headers: {'Accept': 'application/json'}}, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        token = JSON.parse(body).access_token;
        res.statusCode = 302;
        res.setHeader('location', 'dashboard');
        res.end();
      }
    });
    
  }
  else {
    res.end('Sorry, an error occured.');
  }
});

//members page
dispatcher.onGet("/dashboard", function(req, res) {
  printWelcome(res);

});


//print welcome statement
function printWelcome(res) {
  request.get({url: "https://api.github.com/user", headers: {'Authorization': 'token '+token, 'User-Agent': 'Mozilla 5.0'}}, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      var user = body.login;
      printStatement(user, res);
    } else {
      console.log(body);
    }
  });
  
  function printStatement(name, res) {
    res.write("<!DOCTYPE html><html><body><h1>Dashboard</h1>Welcome to your dashboard, "+name+"!</body></html>");
    res.end();
  }
}

//define port for listening for web server
const PORT = 8080;

//handle requests function
function handleRequest (request, response) {
  try {
    //log the request on console
    console.log(request.url);
    //Disptach
    dispatcher.dispatch(request, response);
  } catch(err) {
    console.log(err);
  }
}

//create a server
var server = http.createServer(handleRequest);

//start the server on the port
server.listen(PORT, function () {
  console.log("Server listening on: http://"+host+":%s", PORT);
});
