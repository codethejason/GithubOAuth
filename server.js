//import modules
var http = require('http');
var dispatcher = require('httpdispatcher');

//dispatcher routes
dispatcher.setStatic('resources');

//A sample GET request    
dispatcher.onGet("/page1", function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Page One');
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