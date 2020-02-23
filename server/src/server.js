const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = 5000;
let openPositions = {
    isSelected1: true,
    isSelected2: true,
    isSelected3: true,
    isSelected4: true,
};

io.on("connection", socket => {
    console.log("a user connected blyat! ");
    socket.on("message", msg => {
        // console.log("We got: ",msg);
        io.emit("message", msg);
    });

    socket.on("roleSelectorMessage", msg => {
        console.log("role be like...", msg);
        io.emit("roleSelectorMessage", msg);
        openPositions = msg;
    });

    socket.emit('getOpenRoles', openPositions);
});

server.listen(port, () => console.log("server running on port:" + port));