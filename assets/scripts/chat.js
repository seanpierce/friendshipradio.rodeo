/**
 * Checks if a username is stored in localStorage.
 * If found, logs in the user to the chat with that username.
 */
const checkLocalStorageUsername = () => {
    const username = localStorage.getItem('username');
    if (username) {
        console.log(`Username found in localStorage: ${username}`);
        logInToChat(username);
    }
};

/**
 * Saves the provided username to localStorage.
 * @param {string} username - The username to save.
 */
const saveUsernameToLocalStorage = (username) => {
    localStorage.setItem('username', username);
};

/**
 * Logs in the user to the chat with the provided username.
 * If no username is provided, it retrieves the username from the input field.
 * @param {string|null} username - The username to log in with. If null, retrieves from input field.
 */
const logInToChat = (username = null) => {
    const usernameInput = document.getElementById('chat-username');
    const actualUsername = username || usernameInput.value.trim();

    if (actualUsername) {
        saveUsernameToLocalStorage(actualUsername);
        console.log(`Logged in as: ${actualUsername}`);
        // Here you can add code to initialize the chat with the username

        // Show the chat interface or connect to the chat server
        const requireLogin = document.getElementById('require-login');
        const chatLogin = document.getElementById('chat-login-container');

        // Show the chat interface
        requireLogin.style.display = 'block';
        chatLogin.style.display = 'none';
    } else {
        console.log('Please enter a valid username.');
    }
};

/**
 * Event handler for the Enter key press in the username input field.
 * If the Enter key is pressed, it triggers the login process.
 * @param {KeyboardEvent} event - The keyboard event.
 */
const logInOnEnterKey = (event) => {
    if (event.key === 'Enter') {
        logInToChat();
    }
};

/**
 * Event handler for the Enter key press in the message input field.
 * If the Enter key is pressed, it triggers the send message process.
 * @param {KeyboardEvent} event - The keyboard event.
 */
const sendMessageOnEnterKey = (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
};

/**
 * Sends the message entered in the chat input field.
 * If the message is valid, it logs the message and clears the input field.
 */
const sendMessage = () => {
    const messageInput = document.getElementById('chat-message');
    const message = messageInput.value.trim();

    if (message) {
        console.log(`Sending message: ${message}`);
        // Here you can add code to send the message to the chat server

        // Clear the input field after sending
        messageInput.value = '';
    } else {
        console.log('Please enter a valid message.');
    }
};

/**
 * Initializes the chat functionality by setting up event listeners.
 */
const initializeChat = () => {
    const usernameInput = document.getElementById('chat-username');
    const messageInput = document.getElementById('chat-message');
    const loginButton = document.getElementById('chat-login-button');
    const sendButton = document.getElementById('chat-send-button');

    // Event listener for Enter key in username input
    usernameInput.addEventListener('keypress', logInOnEnterKey);

    // Event listener for Enter key in message input
    messageInput.addEventListener('keypress', sendMessageOnEnterKey);

    // Event listener for login button click
    loginButton.addEventListener('click', () => logInToChat());

    // Event listener for send button click
    sendButton.addEventListener('click', sendMessage);
};

// Initialize chat functionality when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    checkLocalStorageUsername();
    initializeChat();
});