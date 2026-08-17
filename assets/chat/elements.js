import CHAT_SETTINGS from './settings.js';

const chatElements = CHAT_SETTINGS.ELEMENTS;

const getElement = (id) => document.getElementById(id);

export const getUsernameInput = () =>
    getElement(chatElements.USERNAME_INPUT);

export const getLoginButton = () =>
    getElement(chatElements.LOGIN_BUTTON);

export const getUsernameDisplay = () =>
    getElement(chatElements.USERNAME_DISPLAY);

export const getRequiredLoginDiv = () =>
    getElement(chatElements.REQUIRED_LOGIN_DIV);

export const getLoginContainer = () =>
    getElement(chatElements.LOGIN_CONTAINER);

export const getMessageInput = () =>
    getElement(chatElements.MESSAGE_INPUT);

export const getMessageSendButton = () =>
    getElement(chatElements.MESSAGE_SEND_BUTTON);

export const getLogoutButton = () =>
    getElement(chatElements.LOGOUT_BUTTON);

export const getChatMessagesDiv = () =>
    getElement(chatElements.CHAT_MESSAGES_DIV);

export const getLoginErrorDiv = () =>
    getElement(chatElements.LOGIN_ERROR_DIV);
