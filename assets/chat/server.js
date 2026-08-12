import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import CHAT_SETTINGS from './settings.js';

const app = express();
const server = createServer(app);
const MAX_MESSAGES = 50;

console.log(process.env.CORS_ALLOWED_ORIGINS)

const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ALLOWED_ORIGINS.split(','),
        methods: ["GET", "POST"],
    },
});

const messages = [];

io.on(CHAT_SETTINGS.CONNECTION, (socket) => {
    console.log("User connected:", socket.id);

    socket.emit(CHAT_SETTINGS.HISTORY, messages.slice(-MAX_MESSAGES));

    socket.on(CHAT_SETTINGS.MESSAGE, ({ username, message: text }) => {
        const message = {
            username,
            message: text,
            timestamp: new Date().toISOString(),
        };

        messages.push(message);

        if (messages.length > MAX_MESSAGES) {
            messages.shift();
        }

        io.emit(CHAT_SETTINGS.MESSAGE, message);
    });

    socket.on(CHAT_SETTINGS.DISCONNECT, () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(3000, () => {
    console.log("Chat server running on port 3000");
});
