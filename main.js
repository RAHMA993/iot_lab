const express = require("express");
const path = require("path");
const WebSocket = require("ws");

const instance = express();
const port = 4401;

// HTTP server
const server = instance.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// WebSocket server
const webSocket = new WebSocket.Server({ server });

let clientData = [];

webSocket.on("connection", function (ws) {
    console.log("Client connected");
    
    // Send the current list of data to the new client
    const data = JSON.stringify({ type: "update", clientData });
    ws.send(data);
    // Listen for messages (form submissions) from clients
    ws.on("message", function (msg) {
      const { fname, lname, email, password, birthday, gender, description, favLang, isChecked } = JSON.parse(msg);
      clientData.push({ fname, lname, email, password, birthday, gender, description, favLang, isChecked });

      const data = JSON.stringify({ type: "update", clientData });
      webSocket.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
      });
    });
});
    


// Serve static files (including index.html and style.css)
instance.use(express.static(path.join(__dirname, "/")));  // Ensure static files are served correctly

// Serve index.html when the root path is accessed
instance.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});