import CHAT_SETTINGS from './settings.js';

// Get socket url from data attribute (populated via Django template).
// 1. Get this script (cannot self-reference since this is a module type script).
const scriptElem = document.querySelectorAll('[data-chat-socket-listen-url]')[0];
// 2. Extract attribute value.
const dataUrl = scriptElem.getAttribute('data-chat-socket-listen-url');
// 3. Create socket.
const socket = io(dataUrl);

socket.on(CHAT_SETTINGS.CONNECT, () => {
    console.log("Connected to chat server:", socket.id);
});

socket.on(CHAT_SETTINGS.DISCONNECT, () => {
    console.log("Disconnected from chat server");
});

socket.on(CHAT_SETTINGS.MESSAGE, (data) => {
    renderMessage(data);
});

socket.on(CHAT_SETTINGS.HISTORY, (messages) => {
    messages.forEach((data) => {
        renderMessage(data);
    });
    scrollToBottom();
});

/**
 * Creates the HTML markup for a chat message, and appends it to the chat messages element.
 * 
 * @param {*} data 
 */
const renderMessage = (data) => {
    const messages = document.getElementById("chat-messages");

    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message");

    const timestampElement = document.createElement("span");
    timestampElement.classList.add("chat-message-timestamp");
    timestampElement.textContent = formatTimestamp(data.timestamp);

    const usernameElement = document.createElement("span");
    usernameElement.classList.add("chat-message-username");
    if (userIsMe(data.username)) {
        usernameElement.classList.add("me");
    }
    usernameElement.textContent = data.username;

    const textElement = document.createElement("span");
    textElement.textContent = `: ${data.message}`;

    messageElement.appendChild(timestampElement);
    messageElement.appendChild(usernameElement);
    messageElement.appendChild(textElement);
    messages.appendChild(messageElement);
};

const formatTimestamp = (timestamp) =>
    new Date(timestamp)
        .toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })
        .replace(" ", "");

const userIsMe = (username) => {
    const localUsername = localStorage.getItem(CHAT_SETTINGS.LOCAL_STORE_KEY);
    return Boolean(
        localUsername && username.toLowerCase() === localUsername.toLowerCase(),
    );
};

const scrollToBottom = () => {
    const chatMessages = document.getElementById(CHAT_SETTINGS.ELEMENTS.CHAT_MESSAGES_DIV);
    chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
    });
}

/**
 * Checks if a username is stored in localStorage.
 * If found, logs in the user to the chat with that username.
 */
const checkLocalStorageUsername = () => {
    const username = localStorage.getItem(CHAT_SETTINGS.LOCAL_STORE_KEY);
    if (username) {
        console.log(`Username found in localStorage: ${username}`);
        logInToChat(username);
    } else {
        const usernameInput = document.getElementById(CHAT_SETTINGS.ELEMENTS.USERNAME_INPUT);
        usernameInput.addEventListener("keypress", logInOnEnterKey);

        const loginButton = document.getElementById(CHAT_SETTINGS.ELEMENTS.LOGIN_BUTTON);
        loginButton.addEventListener("click", () => logInToChat());
    }
};

/**
 * Saves the provided username to localStorage.
 * @param {string} username - The username to save.
 */
const saveUsername = (username) => {
    localStorage.setItem(CHAT_SETTINGS.LOCAL_STORE_KEY, username);
    const chatUsernameDisplay = document.getElementById(CHAT_SETTINGS.ELEMENTS.USERNAME_DISPLAY);
    chatUsernameDisplay.innerText = username;
};

/**
 * Logs in the user to the chat with the provided username.
 * If no username is provided, it retrieves the username from the input field.
 * @param {string|null} username - The username to log in with. If null, retrieves from input field.
 */
const logInToChat = (username = null) => {
    const usernameInput = document.getElementById(CHAT_SETTINGS.ELEMENTS.USERNAME_INPUT);
    const actualUsername = username || usernameInput.value.trim();

    if (actualUsername) {
        saveUsername(actualUsername);
        console.log(`Logged in as: ${actualUsername}`);

        // Show the chat interface or connect to the chat server
        const requireLogin = document.getElementById(CHAT_SETTINGS.ELEMENTS.REQUIRED_LOGIN_DIV);
        const chatLogin = document.getElementById(CHAT_SETTINGS.ELEMENTS.LOGIN_CONTAINER);
        requireLogin.style.display = "block";
        chatLogin.style.display = "none";
        usernameInput.value = "";

        // Attach event listeners
        const messageInput = document.getElementById(CHAT_SETTINGS.ELEMENTS.MESSAGE_INPUT);
        messageInput.addEventListener("keypress", sendMessageOnEnterKey);

        const sendButton = document.getElementById(CHAT_SETTINGS.ELEMENTS.MESSAGE_SEND_BUTTON);
        sendButton.addEventListener("click", sendMessage);

        const logoutButton = document.getElementById(CHAT_SETTINGS.ELEMENTS.LOGOUT_BUTTON);
        logoutButton.addEventListener("click", logout);
    } else {
        console.log("Please enter a valid username.");
    }
};

/**
 * Event handler for the Enter key press in the username input field.
 * If the Enter key is pressed, it triggers the login process.
 * @param {KeyboardEvent} event - The keyboard event.
 */
const logInOnEnterKey = (event) => {
    if (event.key === "Enter") {
        logInToChat();
    }
};

/**
 * Event handler for the Enter key press in the message input field.
 * If the Enter key is pressed, it triggers the send message process.
 * @param {KeyboardEvent} event - The keyboard event.
 */
const sendMessageOnEnterKey = (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
};

/**
 * Sends the message entered in the chat input field.
 * If the message is valid, it logs the message and clears the input field.
 */
const sendMessage = () => {
    const messageInput = document.getElementById(CHAT_SETTINGS.ELEMENTS.MESSAGE_INPUT);
    const message = messageInput.value.trim();

    if (!message) {
        return;
    }

    const username = localStorage.getItem(CHAT_SETTINGS.LOCAL_STORE_KEY);

    socket.emit("chat message", {
        username,
        message,
    });

    messageInput.value = "";
    scrollToBottom();
};

/**
 * Logs the user out of the chat.
 * Remove their username fomr localStorage and reset the UI to the "logged-out" state.
 */
const logout = () => {
    localStorage.removeItem(CHAT_SETTINGS.LOCAL_STORE_KEY);

    const requireLogin = document.getElementById(CHAT_SETTINGS.ELEMENTS.REQUIRED_LOGIN_DIV);
    requireLogin.style.display = "none";

    const chatLogin = document.getElementById(CHAT_SETTINGS.ELEMENTS.LOGIN_CONTAINER);
    chatLogin.style.display = "flex";

    const chatUsernameDisplay = document.getElementById(CHAT_SETTINGS.ELEMENTS.USERNAME_DISPLAY);
    chatUsernameDisplay.innerText = "";

    const usernameInput = document.getElementById(CHAT_SETTINGS.ELEMENTS.USERNAME_INPUT);
    usernameInput.addEventListener("keypress", logInOnEnterKey);

    const loginButton = document.getElementById(CHAT_SETTINGS.ELEMENTS.LOGIN_BUTTON);
    loginButton.addEventListener("click", () => logInToChat());
};

// Initialize chat functionality when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    checkLocalStorageUsername();
});
