let io = null;

exports.init = (server) => {
  io = require("socket.io")(server, { cors: { origin: "*" } });
};

exports.emitNewMessage = (userId, contactId, message) => {
  if (io) {
    console.log(`🔔 Emitting new message for user from socket/index.js ${userId}`);
    io.to(userId.toString()).emit("newMessage", { contactId, message });
  }
};
