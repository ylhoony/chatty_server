// Socket server.js
const WebSocket = require('ws');
const express = require('express');
const SocketServer = require('ws').Server;

// Set the port to 4000
const PORT = 4000;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const webSocketServer = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
webSocketServer.on('connection', (socketConnection) => {
  console.log('Client connected');

  socketConnection.on('message', function(message) {
    let data = JSON.parse(message);
    console.log("Message received in 4000: ", data.username, " said ", data.content);

  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  socketConnection.on('close', () => console.log('Client disconnected'));
});