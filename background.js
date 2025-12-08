/*
 * Filename: \centosa\piden\hurman\converter\content.js
 * Path: \centosa\piden\hurman\converter
 * Created Date: Tuesday, March 3rd 2020, 11:27:19 pm
 * Author: Hurman
 * Email: HurmanKz@Hotmail.com
 * Copyright (c) 2020 Kristal Corpuration.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == "highlightIcon") {
    // chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    //   chrome.pageAction.show(tabs[0].id);
    // });
  }
});

chrome.browserAction.onClicked.addListener(tab => {
  chrome.browserAction.setPopup({ popup: "popup.html" });
});

// Functions:

function fixedEncodeURI(url) {
  return encodeURI(url)
    .replace(/%5B/g, "[")
    .replace(/%5D/g, "]");
}
