var result;
var count = 0;
var objectValue;
var colours = ["#ED6A5A", "#F4F1BB", "#9BC1BC", "#2CC1CC", "#E6EBE0", "#4C56DB", "#916482"]
var alph = "abcdefghijklmnopqrstuvwxyz".split("")
document.addEventListener("DOMContentLoaded", async() => {
    await search
    await title()
    let width = await findColNum()
    await grid2(result, width)
})

var search = new Promise(function (resolve, reject) {
    chrome.bookmarks.getTree(function (data) {
        if (data) {
            result = data[0].children[0].children;
            resolve(data)
            //console.log(data)
        }
    })
})

async function findColNum(){
    let colNum = await stored("tags")
    colNum = colNum.split(",").length -1
    return colNum
}


async function grid2(result, x){
    let isBookmarkNext = true;
    let data = result
    async function betterGrid(data, isBookmarkNext){
        for(var i=0; i < data.length; i++){
            if(data[i].children){
                console.log(data[i])
                await gridFolder(data[i], x)
                let isBookmarkNext = true;
                let checkDataIncep = data[i]
                console.log(data[i+1])
                if (checkIncep(data[i], result) >= 1){
                    while (checkIncep(checkDataIncep, result) >= 1) {
                        checkDataIncep = findIt(result, data[i].parentId)
                    }
                }
                let place = findIndex(checkDataIncep, result)
                console.log(result[place+1])
                if (result[place+1].children){
                    isBookmarkNext = false
                }
                await betterGrid(data[i].children, isBookmarkNext)
            }
            else{
                console.log(data[i])
                if (checkIncep(data[i], result) >= 1 && i == (data.length - 1) && isBookmarkNext){
                    await gridBookmark(data[i], x, "last")
                }
                else{
                    await gridBookmark(data[i], x)
                }
            }
        }
    }
    await betterGrid(data, isBookmarkNext)
    
}



function checkIncep(object, data){
    let value = -1
    return checkInception(object, data, value)
}

function checkInception(object, data, value){
    total = value + 1
    console.log(total)
    console.log(object)
    if (object.parentId != 1){
        checkInception(findIt(data, object.parentId), data, total)
    }
    return total
}

function findIndex(object, data){
    for(var i=0; i<data.length; i++){
        if (data[i].children){
            findIndex(object, data[i].children)
        }
        if (data[i] == object){
            return i
        }
    }
}

async function gridBookmark(bookmark, x, position){
    let incep = checkIncep(bookmark, result)
    let styleVariable = "";
    if (incep >= 1){
        styleVariable = "border-left: 1px solid;"
        if (position == "last"){
            styleVariable += "border-bottom: 1px solid;"
        }
    }

    let backgroundColour = "#778899"
    if (incep >= 1){
        backgroundColour = "#5a6977"
    }
    let globOnline = true;
    let bookmarkTag = await stored(String(bookmark.id))
    if (bookmarkTag == undefined){
        globOnline = false
    }
    let btext = bookmark.title
    if (btext.length > 80){
        btext = btext.slice(0,80) + "..."
    }
    if (btext.length > 75) {
        btext = btext.slice(0,75) + "..."
    }
    let rowDiv = $("<div>", {"class": "row d-flex", id: "r" + String(bookmark.id)})
    let div = $("<div>", {
        "class": "p-1 col-5",
        "id": "@" + String(bookmark.id),
        "style": styleVariable
    })
    let a = $("<a>", {
        "text": btext,
        "href": bookmark.url,
        "class": "agrid",
        "style": "color: #6a1b9a;"
    })

    $(rowDiv).hover(function () {
        $(div).css("background-color", "#4285F4")
        }, function () {
            $(div).css("background-color", "#778899")
        })
    a.appendTo(div)
    div.appendTo(rowDiv)
    //What is this x for?
    //x is the number of columns needed
    for(var i=0; i < x; i++){
        let online;
        if (!globOnline){
            online = false
        }
        else{
            online = await checkIfTagged(bookmarkTag, i) 
        }
        let identification = String(alph[i]) + String(bookmark.id)
        let styleAttribute = "border-bottom: 1px solid; "
        if (i%2==0){
            styleAttribute += "border-left: 1px solid;border-right: 1px solid;"
        }
        let $div = $("<div>", {"class": "grid p-1 flex-fill", id: identification, "style": styleAttribute})
        $div.on("click", async function(){
            let type = identification.charAt(0)
            let id = identification.slice(1)
            let bookmarkTag = await stored(String(id))
            let alreadyThere = await checkIfAlready(bookmarkTag, type)
            if (alreadyThere){
                await removeStorage($div, id, type)
            }
            else{
                await setStorage($div, id, type)
            }            

        })
        $div.appendTo(rowDiv)
        //First check if it has any tag at all bcz most of them won't
        simpleHover($div, online, colours[i], backgroundColour )
    }
    rowDiv.appendTo("#grid")

}

async function gridFolder(folder, x){
    let globOnline;
    let folderTag = await stored(String(folder.id))
    if (folderTag == undefined){
        globOnline = false
    }
    let rowDiv = $("<div>", {"class":"row d-flex", id: "r" + String(folder.id)})
    let div = $("<div>", {
        "class": "p-1 col-5",
        "id": "@" + String(folder.id),
        "style": "border-top: 1px solid;border-left: 1px solid;border-bottom: 1px solid;"
    })
    let p = $("<p>", {
        "text": folder.title,
        "class": "agrid",
        "style": "flex: 1; display: flex"
    })

    $(rowDiv).hover(function () {
        $(div).css("background-color", "#2BBBAD")
        }, function () {
            $(div).css("background-color", "#778899")
        }
    )
    p.appendTo(div)
    div.appendTo(rowDiv)
    for(var i=0; i < x; i++){
        let online;
        if (!globOnline){
            online = false
        }
        else{
            online = await checkIfTagged(folderTag, i)
        }
        let identification = String(alph[i]) + String(folder.id)
        let styleAttribute = "border-bottom: 1px solid; "
        if (i%2==0){
            styleAttribute += "border-left: 1px solid;border-right: 1px solid;"
        }
        let $div = $("<div>", {"class":"grid p-1 flex-fill", id: identification, "style": styleAttribute})
        $div.on("click", async function(){
            let type = identification.charAt(0)
            let id = identification.slice(1)
            let folderTag = await stored(String(id))
            console.log(folderTag)
            let alreadyThere = await checkIfAlready(folderTag, type)
            console.log(alreadyThere)
            if (alreadyThere){
                console.log("removing")
                await removeStorage($div, id, type)
            }
            else{
                await setStorage($div, id, type)
            }
            
        })
        $div.appendTo(rowDiv)
        //First check if it has any tag at all bcz most of them won't
        simpleHover($div, online, colours[i], "#5a6977")
    }
    rowDiv.appendTo("#grid")
}



async function title(){
    let fragment = document.createDocumentFragment();
    let colNames = await stored("tags")
    colNames = colNames.split(",")
    colNames.pop()
    let titleRow = document.createElement("div")
    titleRow.className = "row d-flex"
    titleRow.style = "flex:1"
    titleRow.id = "titleRow"
    fragment.appendChild(titleRow)
    let titleTitle = document.createElement("div")
    titleTitle.className = "col-5 p-1"
    titleTitle.style = "border-style:solid none solid solid; border-width: 1px; background-color: #778899;"
    titleTitle.innerHTML = "Bookmark Title"
    titleRow.appendChild(titleTitle)
    for(var i=0; i < colNames.length; i++){
        let styleAttribute = "flex:1;text-align:center; border-top: 1px solid;border-bottom:1px solid;background-color:" + colours[i] 
        if (i%2 == 0){
            styleAttribute += ";border-left: 1px solid;border-right: 1px solid"
        }
        let tagName = document.createElement("div")
        tagName.style = styleAttribute
        tagName.innerHTML = colNames[i]
        titleRow.appendChild(tagName)
    }
    document.getElementById("grid").appendChild(fragment)
}

async function findColNum(){
    let colNum = await stored("tags")
    colNum = colNum.split(",").length -1
    return colNum
}

function countAll(){
    let counter = 0
    function countInside(data){
        for(var i=0;i<data.length;i++){
            if (data[i].children){
                countInside(data[i].children)
            }
            else{
                counter++
            }
        }
    }
    countInside(result)
    return counter
}

var stored = function (id){
    return new Promise(function (resolve, reject){
        chrome.storage.local.get([id], function (res) {
            resolve(res[id])
    
        })
    })
}



async function checkIfTagged(fold, index){
    if (fold != undefined){
        let tags = await stored("tags")
        tags = tags.split(",")
        tags.pop()
        let thisTag = tags[index]
        if (fold.includes(thisTag)){
            return true
        }
        else{

            return false
        }
    }
    else {
        return false
    }
}

async function setStorage(element, id, type){
    let index = typeToIndex(type)
    let tags = await stored("tags")
    let tagIndex, newTag;
    tags = tags.split(",")
    tags.pop()    
    for(var i=0; i < alph.length;i++){
        if(alph[i] == type){
            tagIndex = i
            break
        }
        
    }
    let prev = await stored(id)
    if(prev && prev != ","){
        newTag = prev + tags[tagIndex] + "," 
    }
    else {
        newTag = tags[tagIndex] + ","
    }
    await makeStorage(id, newTag)
    element.css("background-color", colours[index])
    element.on("mouseout", function(){
        let id = element[0].id.slice(1)
        let object = findIt(result, id)
        if (checkIncep(object, result) >= 1){
            simpleHover(element, true, colours[i], "#5a6977")
        }
        else{
            simpleHover(element, true, colours[i], "#778899")
        }
    })
    
}

var makeStorage = function (id, text){
    return new Promise(function (resolve, reject){
        chrome.storage.local.set({[id]: text})
        resolve(text)
    })
}

async function removeStorage(element, id, type){
    let index = typeToIndex(type)
    let tags = await stored("tags")
    let tagIndex, newTag;
    tags = tags.split(",")
    tags.pop()
    for(var i=0; i < alph.length;i++){
        if(alph[i] == type){
            tagIndex = i
            break
        }
        
    }
    let prev = await stored(id)
    let str = tags[tagIndex] + ","
    newTag = prev.replace(str, "")
    if ((newTag.charAt(newTag.length) != ",")){
        newTag.concat(",")
    }
    await makeStorage(id, newTag)
    let object = findIt(result, id)
    let backgroundCol = "#778899"
    if (checkIncep(object, result) >= 1){
        backgroundCol = "#5a6977"
    }
    element.css("background-color", backgroundCol)
    element.on("mouseout", function(){
        simpleHover(element, false, colours[index], backgroundCol)
    })

}

function simpleHover(element, bool, col1, col2){
    if (!bool){
        let temp;
        temp = col1
        col1 = col2
        col2 = temp
    }
    element.css("background-color", col1)
    element.hover(function(){
        $(this).css("background-color", col2)
    }, function () {
        $(this).css("background-color", col1)  
    })

}
async function checkIfAlready(fold, type){
    if (fold != undefined){
        let tags = await stored("tags")
        let tagIndex
        tags = tags.split(",")
        tags.pop()

        for(var i=0; i < alph.length;i++){
            if(alph[i] == type){
                tagIndex = i
                break
            }    
        }
        let thisTag = tags[tagIndex]

        if (fold.includes(thisTag)){
            return true
        }
        else{

            
            return false
        }
    }
    else{

        return false
    }

}

function typeToIndex(type){
    for(var i=0; i < alph.length;i++){
        if(alph[i] == type){
            return i
        }    
    }
    return false
}
function findIt(data, objectId) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].children) {
            if (data[i].id == objectId) {
                objectValue = data[i]
            }
            else {
                findIt(data[i].children, objectId)
            }
        }
        else {
            if (data[i].id == objectId) {
                objectValue = data[i]
            }
        }
    }
    if (objectValue) {
        return objectValue
    }
}