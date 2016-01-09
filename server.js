//import modules
var http = require('http');
var dispatcher = require('httpdispatcher');

var options = {
  clientID: '7d71da50c080b8899fa5',
  scope: '',
  redirectURI: 'http://192.111.152.115:17210/oauth/dashboard'
};
//dispatcher routes
dispatcher.setStatic('resources');


//login page 
dispatcher.onGet("/login", function(req, res) {
  var state = 'hello';
  var url = 'https://github.com/login/oauth/authorize'
  + '?client_id=' + options.clientID
  + (options.scope ? '&scope=' + options.scope : '')
  + '&redirect_uri=' + options.redirectURI
  + '&state=' + state
  ;
  res.statusCode = 302
  res.setHeader('location', url)
  res.end()
});    

dispatcher.onGet("/callback", function(req, res) {
  res.end('hello, this is a callback');
});

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