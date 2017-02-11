// Socket server.js
const WebSocket = require('ws');
const express = require('express');
const SocketServer = require('ws').Server;
const uuid = require('node-uuid');

// Set the port to 4000
const PORT = 4000;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const webSocketServer = new SocketServer({ server });



// Broadcast to all. - where should I put this?
webSocketServer.broadcast = function broadcast(data) {
  // console.log("in broadcast");
  // console.log("broadcast"+data);
  webSocketServer.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {

      client.send(JSON.stringify(data));
    }
  });
};


const COLORS = ["red", "orange", "blue", "green", "black"]

function getRandomColor() {
  return COLORS[Math.floor(Math.random()*COLORS.length)]
}



// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
webSocketServer.on('connection', (socketConnection) => {
  console.log('Client connected');
  console.log(webSocketServer.clients.size);

  let userCount = {
    type: 'userCount',
    userCount: webSocketServer.clients.size
  }

  webSocketServer.broadcast(userCount);


  socketConnection.on('message', function(message) {
    let data = JSON.parse(message);
    // console.log("message parsed: ", data);
    switch(data.type) {
      case "postMessage":
        data['id'] = uuid.v4();
        data['type'] = 'incomingMessage';
        console.log(data);
        // socketConnection.send(JSON.stringify(data));
        webSocketServer.broadcast(data);
        break;
      case "postNotification":
        // handle incoming notification
        data['type'] = 'incomingNotification';
        webSocketServer.broadcast(data);
        break;
      default:
        // show an error in the console if the message type is unknown
        throw new Error("Unknown event type " + data.type);
    }


  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  socketConnection.on('close', () => {
    console.log('Client disconnected');

    let userCount = {
      type: 'userCount',
      userCount: webSocketServer.clients.size
    }
    webSocketServer.broadcast(userCount);
  });
});






