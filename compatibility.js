/*
 * Manifest V3 compatibility bridge.
 *
 * Keep the original extension scripts unchanged while mapping the small set of
 * Manifest V2 APIs they use to their Manifest V3 equivalents.
 */
(function installManifestV3Compatibility() {
  "use strict";

  if (!chrome.browserAction && chrome.action) {
    chrome.browserAction = chrome.action;
  }

  if ((!chrome.extension || !chrome.extension.getURL) && chrome.runtime.getURL) {
    chrome.extension = chrome.extension || {};
    chrome.extension.getURL = chrome.runtime.getURL;
  }

  if (!chrome.tabs.executeScript && chrome.scripting) {
    chrome.tabs.executeScript = function executeScript(tabId, details, callback) {
      var execution;

      if (details.file) {
        execution = {
          target: { tabId: tabId },
          files: [details.file]
        };
      } else {
        var invocation = /^\s*([A-Za-z_$][\w$]*)\(\s*\)\s*;?\s*$/.exec(details.code || "");

        if (!invocation) {
          return Promise.reject(new Error("Unsupported legacy script expression."));
        }

        execution = {
          target: { tabId: tabId },
          world: "MAIN",
          func: function invokePageFunction(functionName) {
            if (typeof globalThis[functionName] !== "function") {
              throw new Error(functionName + " is not defined on this page.");
            }

            return globalThis[functionName]();
          },
          args: [invocation[1]]
        };
      }

      var result = chrome.scripting.executeScript(execution);

      if (typeof callback === "function") {
        result.then(callback, function executionFailed() {
          callback();
        });
      }

      return result;
    };
  }
}());
