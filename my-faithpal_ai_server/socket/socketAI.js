import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();
const io = new Server({ cors: process.env.CLIENT_SERVER_URL });

let onlineUsers = [];

io.on("connection", (socket) => {
    console.log("new connection", socket.id);

    const id_AI = process.env.AI_ID;

    // listen to a connection
    socket.on("addNewUser", (userID) => {
        if (!onlineUsers.some((user) => user.userID === userID)) {
            onlineUsers.push({
                userID,
                socketId: socket.id,
            });
            onlineUsers.push({
                userID: id_AI,
                socketId: socket.id,
            });
            io.emit("getOnlineUsers", onlineUsers);
            console.log("onlineUsers: ", onlineUsers);
        }
    });

    // add message
    socket.on("sendMessage", (message) => {
        console.log("Person receiving message: ", message.recipientId);
        console.log("Online users before find ", onlineUsers);

        const user = onlineUsers.find((user) => user.userID === message.recipientId[0]);

        console.log("Online users after find", onlineUsers);
        console.log("Person receiving message: ", user);
        console.log("This is the message", message.text);

        if (user) {
            io.to(user.socketId).emit("getMessage", {
                recipientId: message.recipientId,
                text: message.text,
            });
        }
    });

    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

        io.emit("getOnlineUsers", onlineUsers);
    });
});

io.listen(process.env.PORT);
