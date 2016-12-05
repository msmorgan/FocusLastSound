var enabledWindows = {};

function onTabCreated(tab) {
    updateIcon(tab.id, enabledWindows[tab.windowId]);
}

function onTabMoved(tabId, moveInfo) {
    updateIcon(tabId, enabledWindows[moveInfo.windowId]);
}

function onTabUpdated(tabId, changeInfo, tab) {
    var enabled = enabledWindows[tab.windowId];
    if (enabled && changeInfo.audible != null && changeInfo.audible) {
        chrome.tabs.update(tabId, {selected: true});
    }
}

function toggle() {
    chrome.windows.getCurrent({populate: true}, function (window) {
        var enabled = enabledWindows[window.id] = !enabledWindows[window.id];

        var tabs = window.tabs;
        window.tabs.forEach(function (tab) {
            updateIcon(tab.id, enabled);
        });
    });
}

function updateIcon(tabId, enabled) {
    var iconSrc = enabled ? "active.gif" : "inactive.gif";
    chrome.browserAction.setIcon({path: iconSrc, tabId: tabId});
}

chrome.browserAction.onClicked.addListener(toggle);
chrome.browserAction.setIcon({path: "inactive.gif"});

chrome.tabs.onCreated.addListener(onTabCreated);
chrome.tabs.onMoved.addListener(onTabMoved);
chrome.tabs.onUpdated.addListener(onTabUpdated);