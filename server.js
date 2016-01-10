//import modules
var http = require('http');
var dispatcher = require('httpdispatcher');
var request = require('request');


var state = Math.round(Math.random()*10);

var options = {
  clientID: '7d71da50c080b8899fa5',
  secret: '',
  scope: '',
  redirectURI: 'http://37.187.42.14:8080/callback'
};
//dispatcher routes
dispatcher.setStatic('resources');


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
  var url = require('url');
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  //returns something like { code: '6cd032d64f7b45f0d339', state: '10' }
  if(query.state == 10) { //supposed to be if states match
    res.writeHead(200, {'Content-Type': 'text/plain'});
    requestToken(query.code);
  }
  else {
    res.end('Sorry, an error occured.');
  }
});

dispatcher.onGet("/dashboard", function(req, res) {
  res.end("Hello, you made it!");
}

                 
var requestToken = function (code) {
  var arguments = {
    code: code,
    client_id: options.clientID,
    client_secret: options.secret,
    redirect_uri: 'http://37.187.42.14:8080/oauth/dashboard',
    state: state
  };
  request.post('https://github.com/login/oauth/access_token', formData: arguments, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.end(body);
    }
})
};

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
