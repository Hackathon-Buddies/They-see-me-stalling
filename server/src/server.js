const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = 5000;

io.on("connection", socket => {
    console.log("a user connected blyat! ");
    socket.on("message", msg => {
        console.log("We got: ",msg);
        io.emit("message", msg);
    });

    socket.on("roleSelectorMessage", msg => {
        console.log("role be like...", msg);
        io.emit("roleSelectorMessage", msg)
    })

});

server.listen(port, () => console.log("server running on port:" + port));