let netfunnel, duplicate
let toggle = !hasListener(gateway);
init()

async function init(){
    netfunnel = btoa(unescape(encodeURIComponent(await (await fetch(chrome.runtime.getURL('./resources/netfunnel.js'))).text())))
    duplicate = btoa(unescape(encodeURIComponent(await (await fetch(chrome.runtime.getURL('./resources/duplicate.js'))).text())))
    setView()
    chrome.browserAction.onClicked.addListener(function(tab) {
        toggle = hasListener(gateway);
        if (toggle == false){
            chrome.webRequest.onBeforeRequest.addListener(
                gateway,
                { urls: ["https://sugang.korea.ac.kr/resources/js/netfunnel.js*", "https://sugang.korea.ac.kr/resources/js/duplicate.js*"], types:["script"] },
                ["blocking"]
            );
        } else {
            chrome.webRequest.onBeforeRequest.removeListener(gateway)
        }
        setView()
    });
}

function setView() {
    chrome.browserAction.setIcon({path: !toggle ? "icons/on.png" : "icons/off.png", tabId:null})
    chrome.browserAction.setTitle({title: !toggle? "헬퍼 일하는중" : "헬퍼 쉬는중", tabId:null})
}


function hasListener(listener) {
    return chrome.webRequest.onBeforeRequest.hasListener(listener)
}
  
function gateway(details) {
    return {
        redirectUrl : `data:text/javascript;base64,${details.url.toLowerCase().includes("netfunnel") ? netfunnel : duplicate}`
    }
}
