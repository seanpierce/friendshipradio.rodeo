import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import CHAT_SETTINGS from './settings.js';
import { fileURLToPath } from "url";
import path from "path";

const app = express();
const server = createServer(app);
const MAX_MESSAGES = 50;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, "../../.env")
});

console.log(process.env.CORS_ALLOWED_ORIGINS)

const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ALLOWED_ORIGINS.split(','),
        methods: ["GET", "POST"],
    },
});

const messages = [];
const users = new Map();

io.on(CHAT_SETTINGS.CONNECTION, (socket) => {
    console.log("User connected:", socket.id);

    socket.on("login", (rawUsername, acknowledge) => {
        if (typeof acknowledge !== "function") {
            return;
        }

        const username = String(rawUsername ?? "").trim();
        const normalizedUsername = username.toLowerCase();

        if (!normalizedUsername) {
            acknowledge({ success: false, reason: CHAT_SETTINGS.VALIDATIONS.USERNAME_REQUIRED });
            return;
        }

        const isValid = /^[A-Za-z0-9_-]+$/.test(normalizedUsername);
        if (!isValid) {
            acknowledge({ success: false, reason: CHAT_SETTINGS.VALIDATIONS.NO_SPECIAL_CHARS });
            return;
        }

        const existingSocketId = users.get(normalizedUsername);
        if (existingSocketId && existingSocketId !== socket.id) {
            acknowledge({ success: false, reason: CHAT_SETTINGS.VALIDATIONS.USERNAME_TAKEN });
            return;
        }

        const previousUsername = socket.data.normalizedUsername;
        if (previousUsername && previousUsername !== normalizedUsername) {
            users.delete(previousUsername);
        }

        users.set(normalizedUsername, socket.id);
        socket.data.username = username;
        socket.data.normalizedUsername = normalizedUsername;

        acknowledge({ success: true, username });
    });

    socket.emit(CHAT_SETTINGS.HISTORY, messages.slice(-MAX_MESSAGES));

    socket.on(CHAT_SETTINGS.MESSAGE, ({ message: text } = {}) => {
        const messageText = String(text ?? "").trim();
        if (!socket.data.username || !messageText) {
            return;
        }

        const message = {
            username: socket.data.username,
            message: messageText,
            timestamp: new Date().toISOString(),
        };

        messages.push(message);

        if (messages.length > MAX_MESSAGES) {
            messages.shift();
        }

        io.emit(CHAT_SETTINGS.MESSAGE, message);
    });

    const releaseUsername = () => {
        const username = socket.data.normalizedUsername;
        if (username && users.get(username) === socket.id) {
            users.delete(username);
        }

        delete socket.data.username;
        delete socket.data.normalizedUsername;
    };

    socket.on("logout", releaseUsername);

    socket.on(CHAT_SETTINGS.DISCONNECT, () => {
        console.log("User disconnected:", socket.id);
        releaseUsername();
    });
});

server.listen(3000, () => {
    console.log("Chat server running on port 3000");
});
