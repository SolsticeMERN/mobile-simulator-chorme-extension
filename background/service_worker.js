/**
 * Mobile Responsive Simulator - Background Service Worker (Manifest V3)
 * Provides 1-Click Instant Simulation: Click the extension icon on any website,
 * and it automatically grabs the website's URL and displays the simulation.
 * Click again, and it returns to the desktop website.
 */

// Initialize default settings upon installation
chrome.runtime.onInstalled.addListener((details) => {
  chrome.storage.local.get(['defaultDevice', 'showMockup', 'theme', 'customDevices', 'multiDevices'], (res) => {
    const defaults = {
      defaultDevice: res.defaultDevice || 'iphone-16-pro',
      showMockup: res.showMockup !== undefined ? res.showMockup : true,
      theme: res.theme || 'light',
      customDevices: res.customDevices || [],
      multiDevices: res.multiDevices || ['iphone-16-pro', 'samsung-s24-ultra', 'ipad-pro-11', 'macbook-air-13']
    };
    chrome.storage.local.set(defaults);
  });

  // Create context menus for quick testing if supported
  if (chrome.contextMenus) {
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: 'open-simulator-page',
        title: 'Test this page in Mobile Simulator',
        contexts: ['page']
      });

      chrome.contextMenus.create({
        id: 'open-simulator-link',
        title: 'Test this link in Mobile Simulator',
        contexts: ['link']
      });
    });
  }
});

/**
 * 1-Click Toolbar Icon Click Handler:
 * Automatically gets the current website URL and opens the simulation immediately!
 */
if (typeof chrome !== 'undefined' && chrome.action && chrome.action.onClicked) {
  chrome.action.onClicked.addListener(async (tab) => {
  if (!tab || !tab.id) return;

  const currentUrl = tab.url || '';
  const simulatorBase = chrome.runtime.getURL('simulator/index.html');

  // If already in the simulator, 1-click returns to desktop website
  if (currentUrl.startsWith(simulatorBase)) {
    try {
      const urlObj = new URL(currentUrl);
      const originalUrl = urlObj.searchParams.get('url');
      if (originalUrl) {
        chrome.tabs.update(tab.id, { url: originalUrl });
        return;
      }
    } catch (e) {
      console.error('Error parsing original URL:', e);
    }
  }

  // User is on a website: grab URL automatically
  let targetUrl = currentUrl;
  if (!targetUrl || targetUrl.startsWith('chrome://') || targetUrl.startsWith('edge://') || targetUrl.startsWith('about:') || targetUrl.startsWith('chrome-extension://')) {
    targetUrl = 'https://example.com';
  }

  chrome.storage.local.get(['defaultDevice'], (res) => {
    const defaultDevice = res.defaultDevice || 'iphone-16-pro';
    const params = new URLSearchParams({
      url: targetUrl,
      device: defaultDevice,
      mode: 'single'
    });

    const simulatorUrl = `${simulatorBase}?${params.toString()}`;

    // Always open in a new tab right next to current tab
    chrome.tabs.create({ url: simulatorUrl, index: tab.index + 1, active: true });
  });
});
}

// Handle context menu clicks safely
if (chrome.contextMenus && chrome.contextMenus.onClicked) {
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    let targetUrl = '';
    if (info.menuItemId === 'open-simulator-link' && info.linkUrl) {
      targetUrl = info.linkUrl;
    } else if (info.pageUrl) {
      targetUrl = info.pageUrl;
    } else if (tab && tab.url) {
      targetUrl = tab.url;
    }

    if (targetUrl) {
      openSimulatorTab(targetUrl);
    }
  });
}

// Handle messages from simulator
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'OPEN_SIMULATOR') {
    openSimulatorTab(message.url, message.device, message.mode);
    sendResponse({ success: true });
  } else if (message.action === 'GET_CURRENT_TAB') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      sendResponse({ url: activeTab ? activeTab.url : '' });
    });
    return true;
  }
});

/**
 * Open or focus the simulator tab with the desired URL
 */
function openSimulatorTab(url, deviceId, mode) {
  let simulatorUrl = chrome.runtime.getURL('simulator/index.html');
  const params = new URLSearchParams();
  
  if (url && !url.startsWith('chrome://') && !url.startsWith('chrome-extension://')) {
    params.set('url', url);
  }
  if (deviceId) {
    params.set('device', deviceId);
  }
  if (mode) {
    params.set('mode', mode);
  }

  const queryString = params.toString();
  if (queryString) {
    simulatorUrl += '?' + queryString;
  }

  chrome.tabs.create({ url: simulatorUrl });
}
