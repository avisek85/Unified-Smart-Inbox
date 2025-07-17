let io = null;

exports.init = (server) => {
  io = require("socket.io")(server, { cors: { origin: "*" } });
};

exports.emitNewMessage = (userId, contactId, message) => {
  if (io) {
    io.to(userId.toString()).emit("newMessage", { contactId, message });
  }
};
