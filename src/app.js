const server = require("http").createServer(app);
const socket = require("./sockets");
socket.init(server);
