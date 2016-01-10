//import modules
var http = require('http');
var dispatcher = require('httpdispatcher');
var request = require('request');
var url = require('url');


var options = {
  clientID: '7d71da50c080b8899fa5',
  secret: '30221ba2c9d3ca955b0d7aa64ff57776dad801a1',
  scope: '',
  redirectURI: 'http://localhost:8080/callback'
};


var token = '';
var state = Math.round(Math.random()*10);

//dispatcher routes
dispatcher.setStatic('resources');

//main page
dispatcher.onGet("/", function(req, res) {
  var data = "<html><body><a href='login'>Login to App</a></body></html>";
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
    res.writeHead(200, {'Content-Type': 'text/plain'});
    token = requestToken(query.code);
    var username = getUsername(token);
    res.end();
  }
  else {
    res.end('Sorry, an error occured.');
  }
});

                 
function requestToken(code) {
  var arguments = {
    code: code,
    client_id: options.clientID,
    client_secret: options.secret,
    state: state
  };
  request.post({url: 'https://github.com/login/oauth/access_token', formData: arguments, headers: {'Accept': 'application/json'}}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var token = JSON.parse(body).access_token;
      return token;
    }
})
};

function getUsername() {
  console.log("Getting username");
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
  console.log("Server listening on: http://localhost:%s", PORT);
});
