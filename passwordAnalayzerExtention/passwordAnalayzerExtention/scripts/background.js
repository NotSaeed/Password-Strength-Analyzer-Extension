chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openPopupWithPassword') {
        chrome.storage.local.set({ userPassword: message.password }, () => {
            chrome.action.openPopup();
        });
    }
});

// Clear stored password when popup is closed
chrome.runtime.onConnect.addListener((port) => {
    if (port.name === 'popup') {
        port.onDisconnect.addListener(() => {
            chrome.storage.local.remove('userPassword');
        });
    }
});