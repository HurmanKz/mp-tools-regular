document.addEventListener("DOMContentLoaded", () => {
  var ytCaptionInterval = setInterval(() => {
    chrome.tabs.query({currentWindow: true, active: true}, tabs => {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
          tabs[0].id,
          {code: 'convertCaptionAutomatically();'});
      });
    });
  }, 16);
  document.querySelector(".btn-recheck").addEventListener("click", () => {
    chrome.tabs.query({currentWindow: true, active: true}, tabs => {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
          tabs[0].id,
          {code: 'getUnderReviewVideosInfo();'});
      });
    });
  }, false);
}, false);