/**
 * Checks if a username is stored in localStorage.
 * If found, logs in the user to the chat with that username.
 */
const checkLocalStorageUsername = () => {
    const username = localStorage.getItem('username');
    if (username) {
        console.log(`Username found in localStorage: ${username}`);
        logInToChat(username);
    } else {
        const usernameInput = document.getElementById('chat-username');
        usernameInput.addEventListener('keypress', logInOnEnterKey);

        const loginButton = document.getElementById('chat-login-button');
        loginButton.addEventListener('click', () => logInToChat());
    }
};

/**
 * Saves the provided username to localStorage.
 * @param {string} username - The username to save.
 */
const saveUsername = (username) => {
    localStorage.setItem('username', username);
    const chatUsernameDisplay = document.getElementById('chat-username-display');
    chatUsernameDisplay.innerText = username;
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
        saveUsername(actualUsername);
        console.log(`Logged in as: ${actualUsername}`);

        // Show the chat interface or connect to the chat server
        const requireLogin = document.getElementById('require-login');
        const chatLogin = document.getElementById('chat-login-container');
        requireLogin.style.display = 'block';
        chatLogin.style.display = 'none';
        usernameInput.value = '';

        // Attach event listeners
        const messageInput = document.getElementById('chat-input');
        messageInput.addEventListener('keypress', sendMessageOnEnterKey);

        const sendButton = document.getElementById('chat-send');
        sendButton.addEventListener('click', sendMessage);

        const logoutButton = document.getElementById('chat-logout');
        logoutButton.addEventListener('click', logout);

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
    const messageInput = document.getElementById('chat-input');
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

const logout = () => {
    localStorage.clear('username');

    const requireLogin = document.getElementById('require-login');
    requireLogin.style.display = 'none';
    
    const chatLogin = document.getElementById('chat-login-container');
    chatLogin.style.display = 'flex';

    const chatUsernameDisplay = document.getElementById('chat-username-display');
    chatUsernameDisplay.innerText = '';

    const usernameInput = document.getElementById('chat-username');
    usernameInput.addEventListener('keypress', logInOnEnterKey);

    const loginButton = document.getElementById('chat-login-button');
    loginButton.addEventListener('click', () => logInToChat());
}

// Initialize chat functionality when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    checkLocalStorageUsername();
});