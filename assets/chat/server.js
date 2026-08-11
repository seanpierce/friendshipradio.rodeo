import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:8000",
        methods: ["GET", "POST"]
    }
});

const messages = [];

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

        // Send the most recent 50 messages to this newly connected client
    socket.emit("chat history", messages.slice(-50));

    socket.on("chat message", (data) => {
        const message = {
            username: data.username,
            message: data.message,
            timestamp: new Date().toISOString()
        };

        messages.push(message);

        // Optional: prevent this array from growing forever
        if (messages.length > 50) {
            messages.shift();
        }

        io.emit("chat message", message);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(3000, () => {
    console.log("Chat server running at http://localhost:3000");
});