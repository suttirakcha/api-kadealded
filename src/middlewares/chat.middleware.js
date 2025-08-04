export const chatMiddleware = (io) => {
  const users = new Map(); // socketId -> username
  const socketsByUsername = new Map(); // username -> socketId

  // Socket.IO events
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("register", (username) => {
      users.set(socket.id, username);
      socketsByUsername.set(username, socket.id);
      console.log(`Registered user ${username} with socket ${socket.id}`);

      // Notify admin of updated user list
      io.to("admin-room").emit(
        "user-list",
        Array.from(socketsByUsername.keys())
      );
    });

    socket.on("join-admin", () => {
      socket.join("admin-room");
      console.log("Admin joined room");
      socket.emit("user-list", Array.from(socketsByUsername.keys()));
    });

    socket.on("send-to-admin", ({ from, message }) => {
      io.to("admin-room").emit("receive-message", { from, message });
    });

    socket.on("send-to-user", ({ to, message }) => {
      const socketId = socketsByUsername.get(to);
      if (socketId) {
        io.to(socketId).emit("receive-message", { from: "admin", message });
      }
    });

    socket.on("disconnect", () => {
      const username = users.get(socket.id);
      users.delete(socket.id);
      socketsByUsername.delete(username);
      io.to("admin-room").emit(
        "user-list",
        Array.from(socketsByUsername.keys())
      );
      console.log(`Disconnected ${username}`);
    });
  });
};
