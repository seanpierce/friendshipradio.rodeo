/**
 * Strings used in the socket.io chat app.
 */
export default {
    CONNECT: "connect",
    CONNECTION: "connection", // yes, it's different from "connect"
    DISCONNECT: "disconnect",
    MESSAGE: "chat message",
    HISTORY: "chat history",
    LOCAL_STORE_KEY: "username",
    ELEMENTS: {
        USERNAME_INPUT: "chat-username",
        LOGIN_BUTTON: "chat-login",
        USERNAME_DISPLAY: "chat-username-display",
        REQUIRED_LOGIN_DIV: "require-login",
        LOGIN_CONTAINER: "chat-login-container",
        MESSAGE_INPUT: "chat-input",
        MESSAGE_SEND_BUTTON: "chat-send",
        LOGOUT_BUTTON: "chat-logout",
        CHAT_MESSAGES_DIV: "chat-messages",
        LOGIN_ERROR_DIV: "login-error"
    },
    VALIDATIONS: {
        USERNAME_TAKEN: "Username already taken",
        USERNAME_REQUIRED: "Please enter a username",
        NO_SPECIAL_CHARS: "Username may not contain special characters"
    }
}