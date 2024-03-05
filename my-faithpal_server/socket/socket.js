import { Server } from "socket.io";

const io = new Server({ cors: "http://localhost:3000"});

let onlineUsers = [];

io.on("connection", (socket) => {
    console.log("new connection", socket.id);

    // listen to a connection
    socket.on("addNewUser", (userID) => {

        if (!onlineUsers.some((user) => user.userID === userID)) {
            onlineUsers.push({
                userID,
                socketId: socket.id,
            });

            io.emit("getOnlineUsers", onlineUsers);
            console.log("onlineUsers: ", onlineUsers);
        }
    });

    //add message
    socket.on("sendMessage", (message) => {
       // console.log("Person receiving message: ", message.recipientId)
        //console.log("Online users before find ", onlineUsers)

        const user = onlineUsers.find(( user) => user.userID === message.recipientId[0]);
    /*
        console.log("Online users after find", onlineUsers)
        console.log("Person receiving message: ", user)
        console.log("this is the message", message)*/

        if (user) {
            io.to(user.socketId).emit("getMessage", message);
        }
    });

    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

        io.emit("getOnlineUsers", onlineUsers);
    });
});

io.listen(8000);