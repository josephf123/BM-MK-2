let data;
let popularList;
let bookmarkColourList = ["#E94F37", "#FFBA08", "#D00000"]


chrome.runtime.onInstalled.addListener(async function() {
    await makeStorage("tags", "Work,Entertainment,For Later,")
    await makeStorage("colour", "2BBBAD")
})


document.addEventListener("DOMContentLoaded", async() => {
    data = await search
    console.log(data)
    renderPop(data)
    onSearchBarFocus()
    $("#tagPage").on("click", function (){
        window.location.href = "tagManage.html"
    })
    $("#optionsPage").on("click", function (){
        window.location.href = "options.html"
    })
})

function onSearchBarFocus(){
    $("#searchButton").focus(() => {
        $("#searchContainer").addClass("searchContainerFocus")
        $("#bookmarks").addClass("divFocus")
        let children = $("#bookmarks").children().length
        $("#bookmarks").css("height", "65%")
        for(var i=children; popularList.length > i;i++){
            let object = findIt(data, popularList[i].id)
            printBookmark(object)
        }
    })
    
    
}


function checkIncep(object, data){
    let value = -1
    function checkInception(object, data, value){
        total = value + 1
        if (object.parentId != 1){
            checkInception(findIt(data, object.parentId), data, total)
        }
        return total
    }    
    return checkInception(object, data, value)
}



let search = new Promise(function (resolve) {
    chrome.bookmarks.getTree(function (data) {
        if (data) {
            result = data[0].children[0].children;
            resolve(result) 
        }
    })
})

var makeStorage = function (id, text){
    return new Promise(function (resolve, reject){
        chrome.storage.local.set({[id]: text})
        resolve(text)
    })
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

function printBookmark(object){
    let fragment = document.createDocumentFragment();
    let bookmarkDiv = document.createElement("div")
    bookmarkDiv.className = "bookmark btn col-2 m-3 btn-sm"
    bookmarkDiv.id = object.id
    bookmarkDiv.style = "background-color: " + bookmarkColourList[checkIncep(object, data)] +"; font-size: 120%;"

    let bookmarkClickable = document.createElement("a")
    bookmarkClickable.href = object.url
    bookmarkClickable.class = "m-3 clickable"
    bookmarkClickable.id = "a" + object.id

    let bookmarkRowDivision = document.createElement("div")
    bookmarkRowDivision.className = "d-flex flex-row margin"
    bookmarkRowDivision.style = "overflow-wrap: anywhere;"

    let bookmarkText = document.createElement("p")
    bookmarkText.innerHTML = object.title
    if (object.title.length >= 50) {
        bookmarkText.style = "width:70%; font-size: 80%"
    }
    else{
        bookmarkText.style = "width:70%; color: black"
    }
    bookmarkText.class = "d-inline-flex"
    

    let bookmarkIcon = document.createElement("i")
    bookmarkIcon.innerHTML = "info"
    $(bookmarkIcon).addClass("d-inline-flex material-icons icon mt-1 item-info ml-auto")
    bookmarkIcon.id = "i" + object.id

    $(bookmarkIcon).hover(function(){
        $(bookmarkIcon).css("cursor", "pointer")
        $(bookmarkIcon).css("color", "white")
        $(bookmarkText).css("color", "black")
    }, function(){
        $(bookmarkIcon).css("cursor", "default")
        $(bookmarkIcon).css("color", "black")
        $(bookmarkDiv).hover(function () {

        })
    })

    $(bookmarkDiv).mouseenter(function(){
        $(bookmarkText).css("color", "white")
        $(bookmarkIcon).mouseenter(function(){
            $(bookmarkIcon).css("cursor", "pointer")
            $(bookmarkIcon).css("color", "white")
            $(bookmarkText).css("color", "black")
        }).mouseleave(function(){
            $(bookmarkIcon).css("cursor", "default")
            $(bookmarkIcon).css("color", "black")
            $(bookmarkText).css("color", "white")

        })
    }).mouseleave(function(){
        $(bookmarkText).css("color", "black")
    })
    // $(bookmarkDiv).hover(function () {
    //     $(bookmarkText).css("color", "white");
    // }, function () {
    //     $(bookmarkText).css("color", "black");
    // });

    fragment.appendChild(bookmarkClickable)
    bookmarkClickable.appendChild(bookmarkDiv)
    bookmarkDiv.appendChild(bookmarkRowDivision)
    bookmarkRowDivision.appendChild(bookmarkText)
    bookmarkRowDivision.appendChild(bookmarkIcon)

    document.getElementById("bookmarks").appendChild(fragment)


}

// Popular finding algorithm
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function renderPop(data){
    let list = [];
    await getAllInside(list, data)
    popularList = sortDescend(list)
    let counter = 0
    console.log($("#bookmarks").height())
    console.log($("#bod").height())
    while ($("#bookmarks").height() < ($("#bod").height()/3)){
        for(var i=0; i < 5; i++){
            let index = counter * 5 + i
            let object = findIt(data, popularList[index].id)
            console.log(object)
            printBookmark(object)
        }
        counter++
    }
}

async function getAllInside(list, data){
    for (var i=0; i < data.length; i++){
        if(!data[i].children){
            await findAllVisits(list, data[i].id, data[i].url)
        }
        else if (data[i].children){
            getAllInside(list, data[i].children)
        }
    }
}

var findAllVisits = function (list, id, theURL){
    return new Promise(function (resolve, reject){
        chrome.history.getVisits({ 'url': theURL }, function (res) {
            list.push({"id": id, "visits": res.length})
            resolve(res.length)
    
        })
    })
}

function sortDescend(list) {
    let sortedList = list.slice(0)
    sortedList.sort(function(a,b){
        return b.visits - a.visits
    })
    console.log(sortedList)
    return sortedList
    
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
















































