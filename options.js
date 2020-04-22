let result;
var search = new Promise(function (resolve, reject) {
    chrome.bookmarks.getTree(function (data) {
        if (data) {
            result = data[0].children[0].children;
            resolve(data)
        }
    })
})
document.addEventListener('DOMContentLoaded', async function(){
    await search
    $("#clearTags").on("click", function (){
        clearTags(result)
        document.location.reload()
    })
    $("#clearInfo").on("click", function (){
        clearInfo(result)
    })
    $("#colour").on("keyup", function(){
        let col = $("#colour")[0].value
        if (isHexColor(col)){
            chrome.storage.local.set({"colour": col}, function(){
                console.log("This is the thing: "+ col)
            })
            console.log("this")
        }
        else{
            console.log("gaq")
        }
    })
    let imageData = await getImage()
    let imagURL = imageData.url
    let imag = $("<img>", {
        "src": imagURL,
    })
    $("#t").after(imag)
})

async function getImage(){
    let data = await fetch('https://source.unsplash.com/random/1600x900')
    return data
}

function isHexColor (hex) {
    return typeof hex === 'string'
        && hex.length === 6
        && !isNaN(Number('0x' + hex))
  }

function clearInfo(res){
    for(var i=0; i < res.length;i++){
        if(res[i].children){
            clearInfo(res[i].children)
        }
        else{
            let resId = "i" + res[i].id
            chrome.storage.local.remove(resId, function(){
                console.log("All are cleared")
            })
        }
    }
}
function clearTags(res){
    for(var i=0; i < res.length;i++){
        if(res[i].children){
            clearTags(res[i].children)
        }
        else{
            let resId = res[i].id
            chrome.storage.local.remove(resId, function(){
                console.log("All are cleared!")
            })
        }
    }
}
