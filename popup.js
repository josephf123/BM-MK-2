openAndMove()
function openAndMove(){
    let oldTabId;
    let oldTabIndex;
    chrome.tabs.query({active: true, currentWindow: true}, function(tab){
        oldTabId = tab[0].id
        oldTabIndex = tab[0].index
        chrome.tabs.create({'index': oldTabIndex},function(tab) {
            console.log(tab)
        })
        chrome.tabs.remove(oldTabId, function(){
        })

    })
}

