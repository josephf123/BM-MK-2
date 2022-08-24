var stored = function (id) {
    return new Promise(function (resolve, reject) {
        chrome.storage.local.get([id], function (res) {
            resolve(res[id])

        })
    })
}
// Line 1061
let data, popularList, textColour, backgroundCol, foregroundCol, imgUrl, img, bookmarkColourList;

let currentState = "popularButtonSort"

let hasBeenClicked = false

let maxPerPage = 0;





chrome.runtime.onInstalled.addListener(async function (details) {
    console.log("Hoowee")
    console.log(details.reason)
    let colourOptions = [
        "114B5F-03A0B5", "317773-E2D1F9", "48639C-82A0BC", "095256-D17A22", "364156-D66853", "A23B72-247BA0", "067BC2-F18F01", "644536-B2675E",
        "095256-E1612A", "446E80-A23B72", "8F3985-A675A1",
        "5158BB-F18F01", "067BC2-685470", "BC5D2E-FBCA9A", "2274A5-FF7733", "446E80-B1DDCA", "0277BD-00695C",
        "247BA0-CA596E", "50635B-BDA63F", "247222-93C0A4", "247BA0-93C0A4", "1D2F6F-FAC748",
        "685470-BC5D2E", "095256-F25F5C", "C0596E-F18F01", "4E6474-61CC3D", "067BC2-B1DDCA",
        "B298DC-B298DC", "6A6A6A-C1C1C1"
    ]
    if (details.reason == "install") {
        await makeStorage("tags", ["Work", "Entertainment", "For Later"])
        //For now just make it so it is only colours but later I will add photos
        await makeStorage("colConfig", "r")
        // This will be colour order, either col-col, col-random, random-col or random-random
        await makeStorage("colourOrder", "114B5F-03A0B5")

        await makeStorage("colourCollection", colourOptions)
        // When the home button is pressed, will it go to default of popular
        await makeStorage("home", "popular")
        // When the application loads, either the default or popular shows up
        await makeStorage("onLoad", "popular")
        // All the pinned items on screen
        // await makeStorage("pinnedItems", ["popularButtonSort", "defaultButtonSort", "newButtonSort", "tagsButtonSort", "foldersButtonSort", "allFiltersButtonSort"])
        // $("#updateMessage").modal("show")
    }
    // else if (details.reason == "update"){

    //     // showUpdatePins()
    //     // $("#updateMessage").modal("show")
    // }
    //If the user doesn't have the data for pinnedItems, it will create one
    let checkPinnedStatus = await stored("pinnedItems")
    if (checkPinnedStatus == undefined) {
        await makeStorage("pinnedItems", ["popularButtonSort", "newButtonSort", "foldersButtonSort", "allFiltersButtonSort"])
    }
    let colourArrayStatus = await stored("colourArray")
    if (colourArrayStatus == undefined) {
        await makeStorage("colourArray", colourOptions)
    }


});




document.addEventListener("DOMContentLoaded", async () => {
    // chrome.tabs.query({"active": false, "currentWindow": true }, function (tabs) {
    //     console.log(tabs);
    // });
    data = await search
    console.log("testing")
    // let rgbofHex = hexToRgb(hexCol)
    // let inverted = invertColour(rgbofHex["r"], rgbofHex["g"], rgbofHex["b"])
    //let invert = rgbToHex(inverted["r"], inverted["g"], inverted["b"])
    let colConfig = await stored("colConfig")
    let dataColours;
    if (colConfig == "s") {
        dataColours = await stored("colourOrder")
    }
    else if (colConfig == "r") {
        let arr = await stored("colourCollection")
        let randIndex = Math.round(Math.random() * arr.length)
        console.log(arr.length, randIndex, "h")
        if (randIndex > (arr.length - 1)) {
            randIndex = arr.length - 1
        }
        dataColours = arr[randIndex]
    }
    let backgroundColour = dataColours.slice(0, 6)
    let hexCol = dataColours.slice(7)
    backgroundCol = backgroundColour;
    foregroundCol = hexCol;
    // let invert = "93C0A4"
    console.log(hexCol)
    console.log(backgroundColour)
    // if (Math.random() > 0.5){
    //     let temp = hexCol
    //     hexCol = invert
    //     invert = temp
    // }
    console.log(backgroundCol)
    //avgCol = avgCol.slice(1)
    $("#bod").css("background-color", hexCol)
    $("#bookmarks").css("background-color", backgroundColour)
    console.log($("#bod").css("background-color"))
    console.log($("#bookmarks").css("background-color"))
    // $("#middleLine").css("background-color", backgroundColour)
    //await findImgUrl()
    let hexCol1 = "#" + hexCol
    let hexCol2 = hexCol1;
    let hexCol3 = hexCol1;
    let hexCol4 = hexCol1;
    let hexCol5 = hexCol1;
    let hexCol6 = hexCol1
    bookmarkColourList = [hexCol1, hexCol2, hexCol3, hexCol4, hexCol5, hexCol6]
    textColour = pickBlackOrWhite(bookmarkColourList[0])

    // let backImg = "url(" + imgUrl + ")"
    // $("#bod").css("background-image", backImg)
    console.log("testing")
    console.log(data)
    await onLoadApp()
    console.log("testt")
    // await renderTags()
    onSearchBarFocus()


    $(".icon").on("hover", function () {
        console.log("testing")
    })
    $("#tagPage").on("click", function () {
        window.location.href = "tagManage.html"
    })
    $("#optionsPage").on("click", function () {
        window.location.href = "options.html"
    })
    // $(".dropdown-item-tag").on("click", function (){
    //     console.log(this.id)
    //     displayWithTag(this.id)
    // })
    $("#searchButton").on("keyup", function (e) {
        console.log(e.target.value)
        searchFunction(e.target.value)
    })
    // await renderFolders()
    $(".dropdown-item-folder").on("click", function () {
        displayWithFolder(this.id)
    })
    $("#saveChangesInfoModal").on("click", function () {
        let textModal = $("textarea")[0].value
        let id = $("textarea")[0].id.substring(1)
        console.log(textModal)
        console.log(id)
        saveChangesModal(id, textModal)

    })
    $("#dropdownFolder").on("click", function () {
        let array = []
        findAllFolders(data, array)
        $("#bookmarks").empty()
        onFocusOrFilter()
        for (var i = 0; i < array.length; i++) {
            printFolder(array[i])
            onClickOpen(array[i])
        }
    })
    $("#bookmarks").on("click", () => {
        if (!hasBeenClicked) {
            initialExpandingHome()
            $("#bookmarks").popover("hide")
        }
    })
    await addFilteringButtons(true)
    // pinningBookmarks()
    // sortBookmarks()
    // $("#updateMessage").modal("show")
    // $("#bookmarks").popover({title: "Click me!", content: "Clicking in this area (not the bookmarks) expands it out", trigger: "manual"})
    // $("#bookmarks").popover("show")
    changeFontSizeIfTooBig()
    $("#bookmarks").css("background-color", backgroundColour)




})

function changeFontSizeIfTooBig() {
    $(".bookmark").each(function () {
        console.log(this.id)
        jsEl = document.getElementById(this.id)
        if (checkOverflow(jsEl)) {
            currFont = $(this).css("font-size").slice(0, -2)
            console.log(currFont)
            $(this).css("font-size", currFont - 4)
        }
    })
}

function checkOverflow(el) {
    var curOverf = el.style.overflow;

    if (!curOverf || curOverf === "visible")
        el.style.overflow = "hidden";

    var isOverflowing = el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;

    el.style.overflow = curOverf;

    return isOverflowing;
}

// Add functionality later if people want pins (don't think they will)

// async function isPinnedBookmark(id) {
//     let pinnedBookmarksArr = await stored("pinnedBookmarks")
//     if (!pinnedBookmarksArr) {
//         pinnedBookmarksArr = []
//     }
//     if (pinnedBookmarksArr.indexOf(String(id)) == -1) {
//         return false
//     } else {
//         return true
//     }
// }

// function pinningBookmarks() {
//     console.log("yoqpeor")
//     return
// }


function printOpenAllChildren(obj) {
    /////////////////////////////////
    // Copy and pasted from printFolder
    let fragment = document.createDocumentFragment();
    let folderDiv = document.createElement("div")
    folderDiv.className = "folder btn col-2 m-3 btn-sm"
    folderDiv.id = obj.id
    folderDiv.style = "border: 2px solid " + bookmarkColourList[checkIncep(obj, data)] + "; font-size: 120%; opacity: 0.6;border-radius: 1.5em; background-color:" + backgroundCol
    let bookmarkRowDivision = document.createElement("div")
    bookmarkRowDivision.className = "d-flex flex-row margin"
    bookmarkRowDivision.style = "overflow-wrap: anywhere;"

    let bookmarkText = document.createElement("p")
    bookmarkText.innerHTML = "Open all inside the folder"
    bookmarkText.class = "d-inline-flex"
    fragment.appendChild(folderDiv)
    folderDiv.appendChild(bookmarkRowDivision)
    bookmarkRowDivision.appendChild(bookmarkText)

    //////////////

    folderDiv.addEventListener("click", function () {
        for (var i = 0; i < obj.children.length; i++) {
            chrome.tabs.create({ "url": obj.children[i].url, "active": false })
        }
    })
    document.getElementById("bookmarks").appendChild(fragment)
}


function pinFunctionality(element) {
    element.on("click", async (e) => {
        e.stopImmediatePropagation()
        let pinnedTabs = await stored("pinnedItems")
        let id = element[0].id
        id = id.slice(0, -3)
        id = id + "ButtonSort"
        console.log("does this even work?")
        if (element.hasClass("pinned")) {
            element.removeClass("pinned")
            console.log(id)
            pinnedTabs = pinnedTabs.filter(item => item != id)
            console.log(pinnedTabs)
        }
        else {
            element.addClass("pinned")
            pinnedTabs.push(id)
        }
        await makeStorage("pinnedItems", pinnedTabs)
        $("#middleLine").empty()
        await addFilteringButtons()
    })
}

function buttonDrag(element) {
    element.on("dragstart", function (e) {
        element.css("opacity", "0.4")
        e.originalEvent.dataTransfer.setData('Text', element[0].id)
    })
    element.on("dragend", function (e) {
        element.css("opacity", "1")
    })
    element.on("dragover", (e) => {
        e.preventDefault()
    })
    element.on("drop", async (e) => {
        e.preventDefault()
        let dragFrom = e.originalEvent.dataTransfer.getData('Text')
        let dragTo = e.target.id
        console.log(dragFrom)
        console.log(dragTo)
        swapPinnedPositions(dragFrom, dragTo)
        $("#middleLine").empty()
        await addFilteringButtons()
    })
}

function showUpdatePins() {
    console.log("Hello?")
}

async function swapPinnedPositions(a, b) {
    let pinnedTabs = await stored("pinnedItems")
    console.log(pinnedTabs)
    console.log(a)
    console.log(b)
    if (a == "" || b == "") {
        return
    }
    let aIndex = pinnedTabs.findIndex(x => x == a)
    let bIndex = pinnedTabs.findIndex(x => x == b)
    if (aIndex != null && bIndex != null) {
        let tmp = pinnedTabs[aIndex]
        pinnedTabs[aIndex] = pinnedTabs[bIndex]
        pinnedTabs[bIndex] = tmp
        console.log(pinnedTabs)
        await makeStorage("pinnedItems", pinnedTabs)
    }

}

async function addFilteringButtons() {
    let blackOrWhiteText = pickBlackOrWhite(backgroundCol)
    let textColourForFilter;
    if (blackOrWhiteText) {
        textColourForFilter = "black"
    }
    else {
        textColourForFilter = "#D3D3D3"
    }
    let popularButton = $("<div>", {
        class: "flex-fill dropdown-sort clickableItem",
        style: "padding-top: 3px; margin-bottom: 10px;border-radius: 20px;margin-left: 8px; margin-right: 8px;text-align: center; background-color:" + backgroundCol + "; color:" + textColourForFilter,
        text: "Popular",
        id: "popularButtonSort"
    })
    popularButton.attr("draggable", "true")
    buttonDrag(popularButton)
    let defaultButton = $("<div>", {
        class: "flex-fill dropdown-sort clickableItem",
        style: "padding-top: 3px; margin-bottom: 10px;border-radius: 20px;margin-left: 8px; margin-right: 8px;text-align: center; background-color:" + backgroundCol + "; color:" + textColourForFilter,
        text: "Default",
        id: "defaultButtonSort"
    })
    defaultButton.attr("draggable", "true")
    buttonDrag(defaultButton)
    let newButton = $("<div>", {
        class: "flex-fill dropdown-sort clickableItem",
        style: "padding-top: 3px; margin-bottom: 10px;border-radius: 20px; margin-left: 8px; margin-right: 8px;text-align: center; background-color:" + backgroundCol + "; color:" + textColourForFilter,
        text: "New",
        id: "newButtonSort"
    })
    newButton.attr("draggable", "true")
    buttonDrag(newButton)
    let tagButtonEncapsulate = $("<div>", {
        class: "dropdown flex-fill",
        style: "margin-left: 8px; margin-right: 8px; margin-bottom: 10px;"
    })
    let tagButton = $("<div>", {
        class: "dropdown-toggle clickableItem",
        style: "padding-top:3px; height: 100%;border-radius: 20px;text-align: center; background-color:" + backgroundCol + "; color:" + textColourForFilter,
        text: "Tags",
        id: "tagsButtonSort"
    })
    tagButton.attr("data-toggle", "dropdown")
    tagButton.attr("draggable", "true")

    buttonDrag(tagButton)
    let folderButtonEncapsulate = $("<div>", {
        class: "dropdown flex-fill",
        style: "margin-left: 8px; margin-right: 8px;  margin-bottom: 10px;"
    })
    let folderButton = $("<div>", {
        class: "dropdown-toggle clickableItem",
        style: "padding-top: 3px; height:100%; border-radius: 20px;text-align: center; background-color:" + backgroundCol + "; color:" + textColourForFilter,
        text: "Folders",
        id: "foldersButtonSort"
    })
    folderButton.attr("data-toggle", "dropdown")
    folderButton.attr("draggable", "true")

    buttonDrag(folderButton)
    let allFiltersEncapsulate = $("<div>", {
        class: "dropdown flex-fill",
        style: "margin-left: 8px; margin-right: 8px;  margin-bottom: 10px;"
    })
    let allFilters = $("<div>", {
        class: "flex-fill dropdown-toggle clickableItem",
        style: "padding-top: 3px; height: 100%;border-radius: 20px;text-align: center; background-color:" + backgroundCol + "; color:" + textColourForFilter,
        text: "All filters",
        id: "all FiltersButtonSort"
    })
    allFilters.attr("data-toggle", "dropdown")
    allFilters.attr("draggable", "true")

    allFiltersEncapsulate.css("height", $("#middleLine").css("height"))
    let bigDiv = $("<div>", {
        class: "row flex-fill",
        style: "margin-left: 1%; margin-right: 1%; padding-top: 2px; padding-bottom: 2px;"
    })
    let biggerDiv = $("<div>", {
        class: "row",
        style: "margin-left: 5%; margin-right: 5%; padding-top: 2px; padding-bottom: 2px"
    })
    let settingsCog = $("<i>", {
        text: "settings",
        class: "material-icons mt-1 clickableItem",
        style: "font-size: 30px"
    })
    let swapIcon = $("<i>", {
        text: "cached",
        class: "material-icons mt-1 clickableItem",
        style: "font-size: 30px"

    })
    swapIcon.attr("aria-label", "Swap colours")
    let middleLineHeight = $("#middleLine").css("height")
    bigDiv.css("height", middleLineHeight)



    tagButtonEncapsulate.append(tagButton)
    let div = $("<div>", {
        class: "dropdown-menu",
        style: "border-radius: 20px"

    })
    let tags = await stored("tags")
    console.log(tags)
    for (var i = 0; i < tags.length; i++) {
        let aligningDiv = $("<div>", {
            class: "row mr-0 ml-0"
        })
        let a = $("<a>", {
            class: "dropdown-item tag-select-filter clickableItem",
            text: tags[i],
            style: "border-radius: 1.5em;",
            id: "tagFilter" + tags[i]

        })
        // let tagPush = $("<i>", {
        //     class: "material-icons ml-3 mt-1 mr-1",
        //     text: "push_pin"
        // })
        aligningDiv.append(a)
        // aligningDiv.append(tagPush)
        div.append(aligningDiv)
    }


    //Add divider and then manage tags div
    tagButtonEncapsulate.append(div)

    let div2 = $("<div>", {
        class: "dropdown-menu",
        style: "border-radius: 20px; max-height: 500px; min-width: 270px;overflow-y:scroll"

    })
    let folderArray = []
    findAllFolders(data, folderArray)
    for (var i = 0; i < folderArray.length; i++) {
        let aligningDiv = $("<div>", {
            class: "row mr-0 ml-0 clickableItem",
        })
        let title = folderArray[i].title
        if (title.length > 25) {
            title = title.slice(0, 25) + "..."
        }
        let a = $("<a>", {
            class: "dropdown-item folder-select-filter clickableItem",
            text: title,
            style: "border-radius: 1.5em;",
            id: "folderFilter" + folderArray[i].id

        })
        // let folderPush = $("<i>", {
        //     class: "material-icons ml-3 mt-1 mr-1 mr-auto",
        //     text: "push_pin"
        // })
        aligningDiv.append(a)
        // aligningDiv.append(folderPush)
        div2.append(aligningDiv)
    }

    folderButtonEncapsulate.append(folderButton)
    folderButtonEncapsulate.append(div2)

    let div3 = $("<div>", {
        class: "dropdown-menu",
        style: "border-radius: 20px; min-width: 160px"

    })
    let defLi = $("<li>")
    let filterDefaultButton = $("<div>", {
        class: "d-flex"
    })
    let defPush = $("<i>", {
        class: "material-icons mr-1 clickableItem pins",
        text: "push_pin",
        id: "defaultPin"
    })
    pinFunctionality(defPush)
    let defClick = $("<a>", {
        class: "dropdown-item dropdown-sort clickableItem",
        text: "Default",
        style: "border-radius:1.5em"
    })
    filterDefaultButton.append(defClick)
    filterDefaultButton.append(defPush)
    defLi.append(filterDefaultButton)
    div3.append(defLi)
    let popLi = $("<li>")
    let filterPopularButton = $("<div>", {
        class: "d-flex"
    })
    let popPush = $("<i>", {
        class: "material-icons mr-1 clickableItem pins",
        text: "push_pin",
        id: "popularPin"
    })
    pinFunctionality(popPush)
    let popClick = $("<a>", {
        class: "dropdown-item dropdown-sort clickableItem",
        text: "Popular"
    })
    filterPopularButton.append(popClick)
    filterPopularButton.append(popPush)
    popLi.append(filterPopularButton)
    div3.append(popLi)
    let newLi = $("<li>")
    let filterNewButton = $("<div>", {
        class: "d-flex"
    })
    let newPush = $("<i>", {
        class: "material-icons mr-1 clickableItem pins",
        text: "push_pin",
        id: "newPin"
    })
    pinFunctionality(newPush)
    let newClick = $("<a>", {
        class: "dropdown-item dropdown-sort clickableItem",
        text: "New"
    })
    filterNewButton.append(newClick)
    filterNewButton.append(newPush)
    newLi.append(filterNewButton)
    div3.append(newLi)
    let tagsLi = $("<li>", {
        class: "dropdown-submenu"
    })
    let tagFilterDiv = $("<div>", {
        class: "d-flex",
        style: "border-radius: 2.5em"
    })
    let tagPush = $("<i>", {
        class: "material-icons mt-1 ml-4 mr-1 clickableItem pins",
        text: "push_pin",
        id: "tagsPin"
    })
    pinFunctionality(tagPush)
    let tagsClick = $("<a>", {
        class: "dropdown-item dropdown-toggle clickableItem",
        text: "Tags",
        style: "border-radius:2.5em; "
    })
    let tagsInside = $("<ul>", {
        class: "dropdown-menu",
        style: "width: 15em; border-radius: 1.5em; max-height: 400px;"
    })
    tagFilterDiv.append(tagsClick)
    tagFilterDiv.append(tagPush)
    tagsLi.append(tagFilterDiv)
    tagsLi.append(tagsInside)
    div3.append(tagsLi)
    let foldersLi = $("<li>", {
        class: "dropdown-submenu"
    })
    let foldersFilterDiv = $("<div>", {
        class: "d-flex",
        style: "border-radius: 2.5em"
    })
    let foldersPush = $("<i>", {
        class: "material-icons mt-1 ml-4 mr-1 clickableItem pins",
        text: "push_pin",
        id: "foldersPin"
    })
    pinFunctionality(foldersPush)
    let foldersClick = $("<a>", {
        class: "dropdown-item dropdown-toggle clickableItem",
        text: "Folder",
        style: "border-radius:2.5em;"
    })
    let folderInside = $("<ul>", {
        class: "dropdown-menu",
        style: "width: 15em; border-radius: 1.5em; max-height: 400px;overflow-y:scroll;overflow-x:hide"
    })
    foldersFilterDiv.append(foldersClick)
    foldersFilterDiv.append(foldersPush)
    foldersLi.append(foldersFilterDiv)
    foldersLi.append(folderInside)
    div3.append(foldersLi)
    for (var i = 0; i < tags.length; i++) {
        let aligningDiv = $("<div>", {
            class: "row "
        })
        let a = $("<a>", {
            class: "dropdown-item tag-select-filter clickableItem",
            text: tags[i],
            style: "border-radius: 1.5em; width: 70%; position: relative; left: 15px",
            id: "tagAllFilter" + tags[i]

        })
        let innerTagPush = $("<i>", {
            class: "material-icons ml-3 mt-1 clickableItem innerTag",
            text: "push_pin",
            id: "T_" + tags[i] + "Pin"
        })
        aligningDiv.append(a)
        aligningDiv.append(innerTagPush)
        tagsInside.append(aligningDiv)
        pinFunctionality(innerTagPush)
    }
    for (var i = 0; i < folderArray.length; i++) {
        let title = folderArray[i].title
        if (title.length > 20) {
            title = title.slice(0, 20) + "..."
        }
        let aligningDiv = $("<div>", {
            class: "row mr-0 ml-0"
        })
        let a = $("<a>", {
            class: "dropdown-item folder-select-filter clickableItem",
            text: title,
            style: "border-radius: 10px; width:80%",
            id: "folderAllFilter" + folderArray[i].id

        })
        let innerFolderPush = $("<i>", {
            class: "material-icons ml-3 mt-1 clickableItem ",
            text: "push_pin",
            id: "F_" + folderArray[i].id + "Pin"
        })
        aligningDiv.append(a)
        aligningDiv.append(innerFolderPush)
        folderInside.append(aligningDiv)
        pinFunctionality(innerFolderPush)
    }

    allFiltersEncapsulate.append(allFilters)
    allFiltersEncapsulate.append(div3)
    if (arguments.length == 1) {
        let whichIsFocused = await stored("onLoad")
        if (whichIsFocused == "popular") {
            popularButton.addClass("focused")
        } else if (whichIsFocused == "default") {
            defaultButton.addClass("focused")
        } else {

        }
    }

    biggerDiv.append(swapIcon)

    let allPinnedButtons = [defaultButton, popularButton, newButton, tagButton, folderButton, allFilters]

    let pinnedTabsOrder = await stored("pinnedItems")


    for (var i = 0; i < pinnedTabsOrder.length; i++) {
        console.log("The", i, "th is ", pinnedTabsOrder[i])
        if (pinnedTabsOrder[i] == "defaultButtonSort") {
            bigDiv.append(defaultButton)
            defPush.addClass("pinned")
        }
        else if (pinnedTabsOrder[i] == "popularButtonSort") {
            bigDiv.append(popularButton)
            popPush.addClass("pinned")
        }
        else if (pinnedTabsOrder[i] == "newButtonSort") {
            bigDiv.append(newButton)
            newPush.addClass("pinned")

        }
        else if (pinnedTabsOrder[i] == "tagsButtonSort") {
            bigDiv.append(tagButtonEncapsulate)
            tagPush.addClass("pinned")

        }
        else if (pinnedTabsOrder[i] == "foldersButtonSort") {
            bigDiv.append(folderButtonEncapsulate)
            foldersPush.addClass("pinned")
        }
        else {
            let startingPart = pinnedTabsOrder[i].slice(0, 2)
            console.log(startingPart)
            if (startingPart == "T_") {
                let tagName = pinnedTabsOrder[i].slice(2,)
                tagName = tagName.slice(0, -10)
                console.log(tagName)
                let tagDiv = $("<div>", {
                    class: "flex-fill dropdown-sort clickableItem tag-select-filter",
                    style: "padding-top: 3px; margin-bottom: 10px;border-radius: 20px;margin-left: 8px; margin-right: 8px;text-align: center; background-color:" + backgroundCol + "; color:" + textColourForFilter,
                    id: "T_" + tagName + "ButtonSort",
                    text: tagName
                })
                tagDiv.attr("draggable", "true")
                buttonDrag(tagDiv)
                //To make the hovering functionality with colours work
                allPinnedButtons.push(tagDiv)
                bigDiv.append(tagDiv)
            }
            else if (startingPart == "F_") {
                let folderId = pinnedTabsOrder[i].slice(2,)
                folderId = folderId.slice(0, -10)
                console.log(folderId)
                let folderObj = findIt(data, folderId)
                let folderDiv = $("<div>", {
                    class: "flex-fill dropdown-sort clickableItem folder-select-filter",
                    style: "padding-top: 3px; margin-bottom: 10px;border-radius: 20px;margin-left: 8px; margin-right: 8px;text-align: center; background-color:" + backgroundCol + "; color:" + textColourForFilter,
                    id: "F_" + folderId + "ButtonSort",
                    text: folderObj.title
                })
                console.log(folderObj)
                folderDiv.attr("draggable", "true")
                buttonDrag(folderDiv)
                //To make the hovering functionality with colours work
                allPinnedButtons.push(folderDiv)
                bigDiv.append(folderDiv)
                let folderPin = "F_" + folderId + "Pin"
                $("#" + folderPin).addClass("pinned")
            }
        }
    }
    bigDiv.append(allFiltersEncapsulate)
    biggerDiv.append(bigDiv)
    biggerDiv.append(settingsCog)

    $("#middleLine").append(biggerDiv)

    let allFilterWidth = allFiltersEncapsulate.css("width")
    div3.css("width", allFilterWidth)

    //To add "pinned" to the icon for tags
    $(".innerTag").each(function () {
        for (var i = 0; i < pinnedTabsOrder.length; i++) {
            let start = pinnedTabsOrder[i].slice(0, 2)
            let checkingTag = $(this)[0].id.slice(0, -3)
            let otherTag = pinnedTabsOrder[i].slice(0, -10)
            if (start == "T_") {
                if (checkingTag == otherTag) {
                    $(this).addClass("pinned")
                    console.log($(this)[0])
                }
            }
        }
    })

    //Add "pinned" to the icon for folders
    for (var x = 0; x < folderArray.length; x++) {
        for (var i = 0; i < pinnedTabsOrder.length; i++) {
            let start = pinnedTabsOrder[i].slice(0, 2)
            if (start == "F_") {
                let checkingFolder = "F_" + folderArray[x].id
                let otherFolder = pinnedTabsOrder[i].slice(0, -10)
                if (checkingFolder == otherFolder) {
                    console.log(checkingFolder)
                    let folderPushString = "#F_" + folderArray[x].id + "Pin"
                    console.log(folderPushString)
                    $(folderPushString).addClass("pinned")
                }
            }
        }
    }
    let lighterCol = backgroundCol;
    buttonHovering(allPinnedButtons, "#" + backgroundCol, lighterCol)

    swapIcon.on("click", async () => {
        let dataColours;
        let colConfig = await stored("colConfig")
        if (colConfig == "s") {
            dataColours = await stored("colourOrder")
            let backCol = dataColours.slice(0, 6)
            let frontCol = dataColours.slice(7)
            await makeStorage("colourOrder", frontCol + "-" + backCol)
            location.reload()
        }
        else if (colConfig == "r") {
            location.reload()

        }


    })
    settingsCog.on("click", async () => {
        window.location.href = "options.html"
    })

    $(".tag-select-filter").on("click", async (e) => {
        let id = e.target.id
        if (id.slice(0, 2) == "T_") {
            id = id.slice(2,)
            id = id.slice(0, -10)
        }
        else if (id.slice(0, 12) == "tagAllFilter") {
            id = id.slice(12,)
        }
        else if (id.slice(0, 9) == "tagFilter") {
            id = id.slice(9,)
        }
        let tagArray = []
        await findTagArray(data, id, tagArray)
        console.log(tagArray)
        if (tagArray.length != 0) {
            currentState = "T+" + id
            hasBeenClicked = true
            onFocusOrFilter()
            $("#bookmarks").off("scroll")
            $("#bookmarks").empty()
            for (var i = 0; i < tagArray.length; i++) {
                if (tagArray[i].children) {
                    printFolder(tagArray[i])
                    onClickOpen(tagArray[i])
                }
                else {
                    printBookmark(tagArray[i])
                }
            }
            changeFontSizeIfTooBig()
        }
        else {
            $("#errorMessage").modal("show")
            let string = 'Sorry, there are no bookmarks that are under the tag "' + id + '"'
            $("#errorBody").text(string)
        }
        console.log(tagArray)

    })
    $(".folder-select-filter").on("click", (e) => {
        e.preventDefault()
        let id = e.target.id
        console.log(id, "this is id")
        if (id.slice(0, 2) == "F_") {
            id = id.slice(2,)
            id = id.slice(0, -10)
        }
        else if (id.slice(0, 15) == "folderAllFilter") {
            id = id.slice(15,)
        }
        else if (id.slice(0, 12) == "folderFilter") {
            id = id.slice(12,)
        }
        let object = findIt(data, id)
        console.log(object)
        let objectChildren = object.children
        if (objectChildren.length > 0) {
            currentState = "F+" + id
            hasBeenClicked = true
            onFocusOrFilter()
            $("#bookmarks").off("scroll")
            $("#bookmarks").empty()
            for (var i = 0; i < objectChildren.length; i++) {
                if (objectChildren[i].children) {
                    printFolder(objectChildren[i])
                    onClickOpen(objectChildren[i])
                }
                else {
                    printBookmark(objectChildren[i])
                }
            }
            printOpenAllChildren(object)
            changeFontSizeIfTooBig()
        }
        else {
            $("#errorMessage").modal("show")
            let string = 'Sorry, there are no bookmarks that are in folder "' + object.title + '"'
            $("#errorBody").text(string)
        }
    })

    popularButton.on("click", () => {
        currentState = "popularButtonSort"
        hasBeenClicked = true
        console.log("This should only happen once")
        paginateLoadingFilter(popularList)
    })
    filterPopularButton.on("click", () => {
        currentState = "popularButtonSort"
        hasBeenClicked = true
        paginateLoadingFilter(popularList)
    })
    defaultButton.on("click", () => {
        currentState = "defaultButtonSort"
        hasBeenClicked = true
        paginateLoadingFilter(data)
    })
    filterDefaultButton.on("click", () => {
        currentState = "defaultButtonSort"
        hasBeenClicked = true
        paginateLoadingFilter(data)
    })
    newButton.on("click", () => {
        currentState = "newButtonSort"
        hasBeenClicked = true
        let copyOfData = $.extend(true, [], data);
        let reversedData = copyOfData.reverse()
        console.log(copyOfData)
        paginateLoadingFilter(reversedData)
    })
    filterNewButton.on("click", () => {
        currentState = "newButtonSort"
        hasBeenClicked = true
        let copyOfData = $.extend(true, [], data);
        let reversedData = copyOfData.reverse()
        console.log(copyOfData)
        paginateLoadingFilter(reversedData)
    })
}

//For the bookmarks so when you hover over them they go transparent
function buttonHovering(array, colour, lighterColor, exclusive) {
    for (let i = 0; i < array.length; i++) {
        console.log(colour)
        $(array[i]).css("border", "2px solid " + colour)
        console.log("does this work")
        if (arguments.length == 4 && arguments[3] == true) {
            $(array[i]).addClass("focused")
            changeFocus(array[i], colour, lighterColor)
        }
        else {
            changeFocus(array[i], colour, lighterColor)
            $(array[i]).on("click", function () {
                for (var k = 0; k < array.length; k++) {
                    if (k == i) {
                        $(array[k]).addClass("focused")
                    }
                    else {
                        $(array[k]).removeClass("focused")
                    }
                }
                for (var j = 0; j < array.length; j++) {
                    changeFocus(array[j], colour, lighterColor)
                }
            })
        }
    }
}

function changeFocus(obj, col, lighterColor) {
    if ($(obj).hasClass("focused")) {
        $(obj).css("background-color", col)
        if (pickBlackOrWhite(col)) {
            $(obj).css("color", "#D3D3D3")
        }
        else {
            $(obj).css("color", "black")
        }
        $(obj).hover(function () {
            console.log(lighterColor)
            $(obj).css("background-color", lighterColor)
            if (pickBlackOrWhite(bookmarkColourList[0])) {
                $(obj).css("color", "#D3D3D3")
            }
            else {
                $(obj).css("color", "black")
            }
        }, function () {
            $(obj).css("background-color", col)
            if (pickBlackOrWhite(col)) {
                $(obj).css("color", "#D3D3D3")
            }
            else {
                $(obj).css("color", "black")
            }
        })
    }
    else {
        console.log("what what what ")
        $(obj).css("background-color", "transparent")
        if (pickBlackOrWhite(bookmarkColourList[0])) {
            $(obj).css("color", "#D3D3D3")
        }
        else {
            $(obj).css("color", "black")
        }
        $(obj).hover(function () {
            $(obj).css("background-color", col)
            if (pickBlackOrWhite(col)) {
                $(obj).css("color", "#D3D3D3")
            }
            else {
                $(obj).css("color", "black")
            }
        }, function () {
            $(obj).css("background-color", "transparent")
            if (pickBlackOrWhite(bookmarkColourList[0])) {
                $(obj).css("color", "#D3D3D3")
            }
            else {
                $(obj).css("color", "black")
            }
        })
    }

}

function findAllFolders(d, array) {
    for (var i = 0; i < d.length; i++) {
        if (d[i].children) {
            array.push(d[i])
        }
    }
}

// function tagConvert(tagArr){
//     let tagArray = []
//     if (tag)
//     if (tagArr.length == 0){
//         tagArray = tagString.split(",")
//         tagArray.pop()
//     }
//     else {
//         tagArray = ["No tags"]
//     }
//     return tagArray
// }

async function searchTags(searchWord, id) {
    let tags = await stored("tags")
    let storedTags = await stored(id)
    if (storedTags == undefined) {
        storedTags = []
    }
    console.log(storedTags, "stored tags")
    let acceptedArray = []
    // I can optimise this to check if the searched word includes a tag that the obj already has
    for (var i = 0; i < tags.length; i++) {
        if ((tags[i].toUpperCase()).includes(searchWord.toUpperCase())) {
            console.log(tags[i])
            acceptedArray.push(tags[i])
            if (storedTags != []) {
                for (var j = 0; j < storedTags.length; j++) {
                    console.log(storedTags[j])
                    console.log(tags[i])
                    if (storedTags[j] == tags[i]) {
                        acceptedArray = acceptedArray.filter(word => word !== tags[i])
                    }
                }
            }
        }
    }
    console.log(acceptedArray, "this is accepted array")
    displayTagOptions(acceptedArray, searchWord, id)
    console.log(acceptedArray)
}

function displayTagOptions(arr, word, objId) {
    let isWordInArr = false
    if (word == "") {
        isWordInArr = true
    }
    // This makes it stop working but it was also not working before this so idk
    let largeTagDiv = $("<div id='largeTagDiv' style='position: absolute; z-index: 5; width:434px;height: 300px;overflow: auto'></div>")
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].toUpperCase() == word.toUpperCase()) {
            isWordInArr = true
        }
        let tagDiv = $("<div class='d-inline-flex addTag pl-2' style='background-color: white; height: 50px; width: 434px;'></div>")
        tagDiv.css("border", "1px solid black")
        // tagDiv.css("font-size", "22px")
        tagDiv.css("border-width", 0)
        tagDiv.css("border-left-width", "1px")
        tagDiv.css("border-right-width", "1px")
        tagDiv.css("z-index", "5")
        if (isWordInArr && i == arr.length - 1) {
            tagDiv.css("border-bottom-width", "1px")
        }
        tagDiv.attr("id", arr[i])
        tagDiv.text(arr[i])
        largeTagDiv.append(tagDiv)
    }
    if (!isWordInArr) {
        let addTagString = "<div id='" + word + "' class='d-inline-flex addTag createTag pl-2' style='background-color: white; height: 50px; width: 434px;border: 1px solid black;'></div>"
        let addTag = $(addTagString)
        if (arr.length == 0) {
            addTag.css("border-top-width", 0)
        }
        addTag.text("Add tag: " + word)
        largeTagDiv.append(addTag)
    }
    $("#inputTags").after(largeTagDiv)
    $(".addTag").each(function () {
        console.log("bruhhhhh")
        $(this).hover(function () {
            $(this).css("background-color", bookmarkColourList[0])
        }, function () {
            $(this).css("background-color", "white")
        })
        $(this).on("click", async function (event) {
            event.stopPropagation();
            console.log(event)
            let tagName = this.id
            let tags = await stored(objId)
            if (tags == undefined) {
                tags = []
            }
            tagName = tagName.charAt(0).toUpperCase() + tagName.slice(1)
            console.log(tagName)
            tags.push(tagName)
            console.log(tags)
            await makeStorage(objId, tags)
            console.log("this just worked")
            if ($(this).hasClass("createTag")) {
                let allTags = await stored("tags")
                let newTagAdding = tagName.charAt(0).toUpperCase() + tagName.slice(1)
                allTags.push(newTagAdding)
                await makeStorage("tags", allTags)
            }
            // $("<div>", {
            //     text: tags[i],
            //     class: "btn m-2 d-inline-flex btn-primary",
            //     style: "border-radius: 1.5em"
            // })
            await displayIconModal(objId)
            $("#middleLine").empty()
            await addFilteringButtons()
            // await renderTags()
        })
    })
    $("#inputTags").on("focusout", function (e) {
        console.log(e)
        console.log(e.target.id)
        console.log("yea baby")
        setTimeout(function () {
            $("#largeTagDiv").remove()
        }, 200)

    })
    console.log("Add tag:", word)
}

async function saveChangesModal(id, text) {
    let key = "i" + id
    await makeStorage(key, text)
}

async function displayIconModal(id) {
    console.log(id)
    let object = findIt(data, id)
    let tags = await stored(id)
    if (object.children) {
        $("#removeBookmarkModal").css("display", "none")
        $("#removeFolderModal").css("display", "")
        // $("#removeFolderModal").css("background-color", foregroundCol)
        $("#removeFolderModal").addClass("btn btn-outline-danger")
    }
    else {
        $("#removeFolderModal").css("display", "none")
        $("#removeBookmarkModal").css("display", "")
        // $("#removeBookmarkModal").css("background-color", foregroundCol)
        $("#removeBookmarkModal").addClass("btn btn-outline-danger")

    }
    $("#saveChangesInfoModal").css("background-color", backgroundCol)
    console.log(tags)
    if (tags == undefined || tags == [] || tags.length == 0) {
        tags = ["No Tags"]
    }
    else {

    }
    console.log(tags)
    $("#infoModal").empty()
    $("#infoTitle").text(object.title)
    let url = $("<a>", {
        href: object.url,
        text: object.url,
        class: "d-flex",
        style: "max-width: 400px; overflow:hidden"
    })
    let pinButton = $("<div>", {
        class: "badge m-2 clickableItem",
        text: "pin",
        style: "font-weight: normal; font-size: large; width: 60px;background-color: #" + foregroundCol
    })
    let unpinButton = $("<div>", {
        class: "badge m-2 clickableItem",
        text: "unpin",
        style: "font-weight: normal; font-size: large; width: 60px;background-color: #" + foregroundCol
    })
    
    // Maybe add this feature later (whats the point of it tho). Wouldn't they just pin stuff that they use heaps,
    // this will just be their most popular bookmarks


    // pinButton.on("click", async function () {
    //     let pinnedBookmarksArr = await stored("pinnedBookmarks")
    //     console.log(pinnedBookmarksArr)
    //     if (!pinnedBookmarksArr) {
    //         pinnedBookmarksArr = []
    //     }
    //     let index = pinnedBookmarksArr.indexOf(id)
    //     if (index == -1) {
    //         pinnedBookmarksArr.push(id)
    //     }
    //     await makeStorage("pinnedBookmarks", pinnedBookmarksArr)
    //     console.log(id)
    //     console.log("qow")
    //     console.log(pinnedBookmarksArr)
    //     return displayIconModal(id)

    // })
    // unpinButton.on("click", async function () {
    //     let pinnedBookmarksArr = await stored("pinnedBookmarks")
    //     if (!pinnedBookmarksArr) {
    //         pinnedBookmarksArr = []
    //     }
    //     let index = pinnedBookmarksArr.indexOf(String(id))
    //     if (index != -1) {
    //         pinnedBookmarksArr.splice(index, 1)
    //     }
    //     await makeStorage("pinnedBookmarks", pinnedBookmarksArr)
    //     console.log(id)
    //     console.log("qow")
    //     return displayIconModal(id)
    // })
    let tagParagraph = $("<p class='margin' style='text-align: center; margin-bottom:0px; font-size: 20px;'>Tags</p>")
    let div = $("<div id='containsTags'class='ml-2'>")
    for (var i = 0; i < tags.length; i++) {
        let tag = $("<div>", {
            class: "btn m-2 d-inline-flex clickableItem",
            style: "border-radius: 1.5em; background-color: #" + backgroundCol,
            id: "clickToNavigate_" + tags[[i]]
        })
        let tagIncluded = tags[i]
        let tagTextText = "<p class='mb-0'>" + tags[i] + "</p>"
        let tagText = $(tagTextText)

        let deleteTagIconText = "<i id=" + '' + "deleteButton_" + tagIncluded + ' ' + "class='material-icons ml-1 clickableItem' style='position:relative; left: 5px;'>cancel</i>"
        let deleteTagIcon = $(deleteTagIconText)
        tagText.appendTo(tag)
        tag.appendTo(div)

        if (tags[i] != "No Tags") {
            deleteTagIcon.appendTo(tag)
            tag.on("click", async (e) => {
                e.preventDefault()
                let id = tag[0].id
                id = id.replace("clickToNavigate_", "")
                console.log(id)
                $("#informationModal").modal('hide')
                await displayWithTag(id)
            })
        }
        deleteTagIcon.on("click", async (e) => {
            e.preventDefault()
            e.stopPropagation()
            let storedTags = await stored(object.id)
            console.log(object)
            if (storedTags != ([] || undefined)) {
                let newTags = storedTags.filter(f => f !== tagIncluded)
                console.log(newTags)
                console.log(newTags)
                await makeStorage(object.id, newTags)
                await displayIconModal(object.id)

            }

        })

    }
    let addTagSearch = $("<div class='form-group mb-4 mx-3' style='z-index: 4'></div>")
    let inTagSearch = $("<input id='inputTags' placeholder='Search or create tags' class='form-control' style='border-width: 0; border-bottom-width: 1px; border-radius: 0; padding-left: 0;z-index: 5'>")
    inTagSearch.appendTo(addTagSearch)
    let infoTitle = $("<p class='margin pt-3' style='font-size: 20px; text-align: center;'>Info</p>")
    // let infoSubscript = $("<p class='margin d-inline-flex pt-3' style='float:right; color: #A9A9A9'>max chars: 200</p>")
    let textInformation = await stored("i" + id)
    if (textInformation == undefined) {
        textInformation = ""
    }
    // FIXXXX
    //searchTags("", id)
    // $("#infoModal").on("click", function(e){
    //     console.log(e.target.id)
    //     if (e.target.id != "infoModal" && e.target.id != ""){
    //         console.log("Hi five brosef")
    //     }
    // })

    inTagSearch.on("focus", function (e) {
        console.log("this is the rythm of the night")
        e.stopImmediatePropagation();
        console.log(e.isImmediatePropagationStopped())
        console.log(e)
        console.log("t")
        searchTags("", id)
    })

    inTagSearch.on("keyup", function (e) {
        $("#largeTagDiv").remove()
        if (e.target.value != "") {
            searchTags(e.target.value, id)
        }
    })
    $("#removeBookmarkModal").on("click", () => {
        $("#confirmBody").empty()
        console.log(id)
        $("#confirmationMessage").modal("show")
        let message = $("<p>", {
            "text": "Are you sure you want to delete this bookmark. Once deleted, it can't be retrieved."
        })
        let confirmButton = $("<div>", {
            class: "btn btn-danger clickableItem",
            text: "Delete",
            style: "position:sticky;left:100%"

        })
        let cancelButton = $("<div>", {
            class: "btn btn-secondary clickableItem",
            text: "Cancel"
        })


        cancelButton.on("click", async () => {
            $("#confirmationMessage").modal("hide")
            await displayIconModal(id)
        })
        confirmButton.on("click", async () => {
            console.log("delteeee")
            await deleteBookmark(id)
            location.reload()
        })
        $("#confirmBody").append(message)
        $("#confirmBody").append(cancelButton)
        $("#confirmBody").append(confirmButton)
    })
    $("#removeFolderModal").css("cursor", "pointer")
    $("#removeFolderModal").on("click", () => {
        $("#confirmBody").empty()
        console.log(id)
        $("#confirmationMessage").modal("show")
        let message = $("<p>", {
            "text": "Are you sure you want to delete this folder and the content inside. Once deleted, it can't be retrieved."
        })
        let confirmButton = $("<div>", {
            class: "btn btn-danger",
            text: "Delete",
            style: "position:sticky;left:100%"

        })
        let cancelButton = $("<div>", {
            class: "btn btn-secondary",
            text: "Cancel"
        })
        cancelButton.css("cursor", "pointer")
        confirmButton.css("cursor", "pointer")
        cancelButton.on("click", async () => {
            $("#confirmationMessage").modal("hide")
            await displayIconModal(id)
        })
        confirmButton.on("click", async () => {
            console.log("delteeee")
            await deleteFolder(id)
            location.reload()
        })
        $("#confirmBody").append(message)
        $("#confirmBody").append(cancelButton)
        $("#confirmBody").append(confirmButton)
    })

    if (object.children) {
        var biggerDivOpenChild = $("<div>", {
            class: "d-flex"
        })
        var openChildrenDiv = $("<div>", {
            class: "btn clickableItem",
            text: "Open all bookmarks inside the folder",
            style: "width: 90%; margin: auto"

        })
        openChildrenDiv.css("background-color", bookmarkColourList[0])
        openChildrenDiv.on("click", function () {
            for (var i = 0; i < object.children.length; i++) {
                chrome.tabs.create({ "url": object.children[i].url, "active": false })
            }
        })
    }
    let tagDivision = $("<div style='border-width: 0px 0px 0px 0px; border-style: solid; border-color: #03a0bf;min-height: 200px;'></div>")
    tagDivision.append(tagParagraph)
    tagDivision.append(addTagSearch)
    tagDivision.append(div)
    $("#infoModal").append(tagDivision)
    $("#infoTitle").append(url)

    // Might add this later 

    // if (await isPinnedBookmark(id)) {
    //     $("#infoTitle").append(unpinButton)
    // } else {
    //     $("#infoTitle").append(pinButton)
    // }


    if (object.children) {
        $("#infoModal").append(biggerDivOpenChild)
        biggerDivOpenChild.append(openChildrenDiv)
    }
    $("#informationModal").modal('show')

}


async function searchFunction(searchWord) {
    console.log(currentState)
    let searchW = searchWord.toUpperCase()
    console.log(searchW)

    let displayedBookmarks = false;
    console.log(currentState.slice(0, 2))
    if (currentState.slice(0, 2) == "T+") {
        let tagName = currentState.slice(2)
        let array = []
        await findTagArray(data, tagName, array)
        if (array.length > 0) {
            displayedBookmarks = array
        }
    }
    else if (currentState.slice(0, 2) == "F+") {
        console.log("wasa")
        let folderId = currentState.slice(3)
        console.log("this is FOLDER ID", folderId)
        let object = findIt(data, folderId)
        console.log(object)
        if (object.children.length > 0) {
            displayedBookmarks = object.children
        }

    }
    else if (currentState == "popularButtonSort") {
        let array = []
        for (var i = 0; i < popularList.length; i++) {
            let object = findIt(data, popularList[i])
            array.push(object)
        }
        console.log(array)
        displayedBookmarks = array
    }
    else if (currentState == "defaultButtonSort") {
        displayedBookmarks = data
    }
    else if (currentState == "newButtonSort") {
        let copyOfData = $.extend(true, [], data);
        let reversedData = copyOfData.reverse()
        displayedBookmarks = reversedData
    }
    // let allBookmarks = $("#bookmarks").children()
    // console.log(allBookmarks)
    let searchArray = []
    if (displayedBookmarks != false) {
        console.log(displayedBookmarks)
        await insideSearch(searchW, displayedBookmarks, searchArray)
    }
    console.log(searchArray)
    let all = $("#bookmarks").children()
    for (var i = 0; i < all.length; i++) {
        all[i].remove()
    }
    for (var i = 0; i < searchArray.length; i++) {
        console.log(searchArray[i])
        if (searchArray[i].children) {
            printFolder(searchArray[i])
            onClickOpen(searchArray[i])
        }
        else {
            printBookmark(searchArray[i])
        }
    }
}

async function insideSearch(searchWord, listBookmark, searchArray) {
    for (var i = 0; i < listBookmark.length; i++) {
        let id;
        (listBookmark[i].id.startsWith("a")) ? id = listBookmark[i].id.slice(1) : id = listBookmark[i].id
        console.log(id)
        let object = findIt(data, id)
        if (object.children) {
            let infoData = await stored("i" + object.id)
            console.log(infoData)
            if (infoData == undefined) {
                infoData = ""
            }
            let allData = (object.title + infoData).toUpperCase()
            if (allData.includes(searchWord)) {
                searchArray.push(object)
            }
            await insideSearch(searchWord, listBookmark[i].children, searchArray)
        }
        else {
            let infoData = await stored("i" + object.id)
            console.log(infoData)

            if (infoData == undefined) {
                infoData = ""
            }
            let allData = (object.url + object.title + infoData).toUpperCase()
            if (allData.includes(searchWord)) {
                searchArray.push(object)
            }
        }

    }
}


function displayWithFolder(folderName) {
    let folderId = folderName.slice(1)
    let object = findIt(data, folderId)
    let objectChildren = object.children
    if (objectChildren.length > 0) {
        currentState = "F+" + folderName
        $("#bookmarks").off("scroll")
        hasBeenClicked = true
        onFocusOrFilter()
        $("#bookmarks").empty()
        for (var i = 0; i < objectChildren.length; i++) {
            if (objectChildren[i].children) {
                printFolder(objectChildren[i])
                onClickOpen(objectChildren[i])
            }
            else {
                printBookmark(objectChildren[i])
            }
        }
    }
    else {
        $("#errorMessage").modal("show")
        let string = 'Sorry, there are no bookmarks that are in folder "' + object.title + '"'
        $("#errorBody").text(string)
    }



}


async function findTagArray(data, tagName, array) {
    for (var i = 0; i < data.length; i++) {
        if (await checkIfTag(data[i], tagName)) {
            array.push(data[i])
        }
    }
}

async function displayWithTag(tagName) {
    let array = []
    await findTagArray(data, tagName, array)
    if (array.length != 0) {
        currentState = "T+" + tagName
        $("#bookmarks").off("scroll")
        hasBeenClicked = true
        onFocusOrFilter()
        $("#bookmarks").empty()
        for (var i = 0; i < array.length; i++) {
            console.log("###################")
            console.log(array)
            if (array[i].children) {
                printFolder(array[i])
                onClickOpen(array[i])
            }
            printBookmark(array[i])
        }
    }
    else {
        $("#errorMessage").modal("show")
        let string = 'Sorry, there are no bookmarks that are under the tag "' + tagName + '"'
        $("#errorBody").text(string)
    }
    console.log(array)
}

// async function renderFolders(){
//     if (arguments.length == 1){
//         console.log("This is running")
//         let final = await stored("newFolder")
//         let title = final.title
//         if (title.length >= 15){
//             title = title.slice(0,11) + "..."
//         }
//         console.log(title.length)
//         let drop = $("<a>", {
//             "class": "dropdown-item btn-m hober dropdown-item-folder",
//             "text": title,
//             "id": "f" + final.id
//         })
//         drop.insertBefore($("#folderDivider"))
//     }
//     else{
//         let isNew = false
//         let folderArray = []
//         let $folder;
//         if ($("#folderMenu")[0]){
//             $folder = $("#folderMenu")[0].children
//         }
//         else{
//             $folder = []
//         }
//         data = await search
//         findFolders(data, folderArray)
//         console.log("this is folders")
//         console.log(folderArray)
//         for(var i=0; i < folderArray.length; i++){
//             let title = folderArray[i].title
//             if (title.length >= 15){
//                 title = title.slice(0,11) + "..."
//             }
//             console.log(title.length)
//             let div = $("<div>", {
//                 class : "d-flex"
//             })
//             let drop = $("<a>", {
//                 "class": "dropdown-item btn-m hober dropdown-item-folder",
//                 "text": title,
//                 "id": "f" + folderArray[i].id
//             })
//             let icon = $("<i>", {
//                 id : "pin_folder_" + folderArray[i].id,
//                 class : "material-icons ml-1 mt-1",
//                 style : "color: #555;",
//                 text : "push_pin"
//             })
//             icon.on("click", async (e) => {
//                 let id = e.target.id
//                 id = "f_" + id.replace("pin_folder_","")
//                 console.log(id)
//                 let allPinned = await stored("pinnedItems")
//                 allPinned.push(id)
//                 makeStorage("pinnedItems", allPinned)
//             })

//             div.append(icon)
//             div.append(drop)
//             $("#folderMenu").append(div)
//         }
//         console.log(isNew)
//         let check = await stored("newFolder")
//         console.log(check)
//         console.log("WWWOAWEOWAEAWE")
//         if (check != undefined){
//             for(var j=0; j < $folder.length; j++){
//                 let folderId = $folder[j].id.slice(1)
//                 console.log("this is folder id")
//                 console.log(folderId)
//                 if (check.id == folderId){
//                     isNew = true
//                     console.log("WWWOAWEOWAEAWE")
//                 }
//             }
//         }
//         if (!isNew && check != undefined){
//             let final = await stored("newFolder")
//             let title = final.title
//             if (title.length >= 15){
//                 title = title.slice(0,11) + "..."
//             }
//             console.log(title.length)
//             let drop = $("<a>", {
//                 "class": "dropdown-item btn-m hober dropdown-item-folder",
//                 "text": title,
//                 "id": "f" + final.id
//             })
//             $("#folderMenu").append(drop)
//         }


//         let divider = $("<div>",{
//             "class": "dropdown-divider",
//             "id": "folderDivider"
//         })
//         let addNew = $("<div>",{
//             "id": "dropdownAdd",
//             "class": "dropdown-item btn-m hober",
//             "style": "width: 160px",
//             "text": "Add folder"
//         })
//         $("#folderMenu").append(divider)
//         $("#folderMenu").append(addNew)
//         addNew.on("click", function (){
//             addFolder()
//         })
//     }

// }

let destroy = function (id) {
    return new Promise(function (resolve) {
        chrome.storage.local.remove(id, function () {
            console.log(id)
            console.log("is cleared")
        })
    })
}

// async function addFolder(){
//     $('#newTagName').val('');
//     $("#newTag").modal("show")
//     $('#newTag').on('shown.bs.modal', function() {
//         $('#newTagName').trigger('focus');
//     });
//     $("#saveTagChangesModal").off()
//     $("#newTagName").off()
//     $("#newTagName").on("keyup", function(event) {
//         console.log("sakfkjsd")
//         // Number 13 is the "Enter" key on the keyboard
//         if (event.keyCode === 13) {
//             event.preventDefault()
//           // Cancel the default action, if needed
//           // Trigger the button element with a click
//             $("#saveTagChangesModal").trigger("click")
//         }

//     });
//     $("#saveTagChangesModal").on("click", async function() {
//         console.log("treyvaughn")
//         let tagName = $("#newTagName")[0].value
//         await create(tagName, "1")
//         //$("#folderMenu").empty()
//         console.log("Success")
//         renderFolders(true)

//     })
// }

// async function manage_tags(){
//     console.log("gafds")
//     $("#manage_tags_place").empty()
//     $('#newTagName').val('');
//     $("#manage_tags").modal("show")
//     $("#addNewTagButton").off()
//     let tags = await stored("tags")
//     if (tags == undefined || tags == []){
//         console.log("Wawwawa")
//         let noTagsMessage = $("<div>", {
//             class : "btn btn-warning",
//             text : "You currently have no tags. Make some!",
//             style : "width: 100%"
//         })
//         $("#manage_tags_place").append(noTagsMessage)
//     }
//     else {
//         for (var x=0; x < tags.length; x++){
//             let outerDiv = $("<div>", {
//                 class : "d-flex p-1"
//             })
//             let tagDiv = $("<div>", {
//                 class : "btn",
//                 text : tags[x],
//                 style: "width:100%; border: 1px solid #dee2e6"
//             })
//             let tagDelete = $("<i>", {
//                 class : "material-icons",
//                 text : "delete",
//                 style: "font-size: 30px;",
//                 id: "deleteTag_" + tags[x]
//             })
//             tagDelete.css("cursor", "pointer")
//             tagDelete.on("click", async () => {
//                 let id = tagDelete[0].id
//                 id = id.replace("deleteTag_", "")
//                 let tagArray = await stored("tags")
//                 tagArray = tagArray.filter(e => e !== id)
//                 await makeStorage("tags", tagArray)
//                 manage_tags()

//             })
//             outerDiv.append(tagDiv)
//             outerDiv.append(tagDelete)
//             $("#manage_tags_place").append(outerDiv)
//         }
//         $('#manage_tags').on('shown.bs.modal', function() {
//             $('#newTagName').trigger('focus');
//         });
//     }
//     $("#saveTagChangesModal").off()
//     $("#newTagName").off()
//     $("#newTagName").on("keyup", function(event) {
//         console.log("sakfkjsd")
//         // Number 13 is the "Enter" key on the keyboard
//         if (event.keyCode === 13) {
//             event.preventDefault()
//           // Cancel the default action, if needed
//           // Trigger the button element with a click
//             $("#addNewTagButton").trigger("click")
//         }
//     });
//     $("#addNewTagButton").on("click", async function() {
//         console.log("waddup")
//         let tagName = $("#newTagName")[0].value
//         let tagArray = await stored("tags")
//         if (tagName.charAt(tagName.length -1) == " "){
//             tagName = tagName.slice(0,-1)
//         }
//         for (var i=0; i < tagArray.length; i++){
//             if (tagArray[i].toUpperCase() == tagName.toUpperCase()){
//                 return
//             }
//         }

//         if (tagName != []){
//             let newTagString = tagName.charAt(0).toUpperCase() + tagName.slice(1)
//             tagArray = tagArray.push(newTagString)
//             await makeStorage("tags", tagArray)
//             $("#tagMenu").empty()
//             console.log("Success")
//             await renderTags()
//             manage_tags()
//         }


//     })

// }

function findFolders(data, array) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].children) {
            array.push(data[i])
            findFolders(data[i].children, array)
        }
    }
}

// async function renderTags(){
//     if (textColour){
//         $("#dropdownButton").css("color", "#D3D3D3")
//     }
//     $("#tagMenu").empty()
//     $("#dropdownButton").css("background-color", bookmarkColourList[0])
//     let tags = await stored("tags")
//     if (tags.length){
//         for(var i=0; i < tags.length; i++){
//             let div = $("<div>", {
//                 class : "d-flex"
//             })
//             let drop = $("<a>", {
//                 "class": "dropdown-item btn-m hober dropdown-item-tag",
//                 "text": tags[i],
//                 "id": tags[i]
//             })
//             let icon = $("<i>", {
//                 id : "pin_tag_" + tags[i],
//                 class : "material-icons ml-1 mt-1",
//                 style : "color: #555;",
//                 text : "push_pin"
//             })
//             icon.on("click", async (e) => {
//                 let id = e.target.id
//                 id = "t_" + id.replace("pin_tag_", "")
//                 let allPinned = await stored("pinnedItems")
//                 allPinned.push(id)
//                 makeStorage("pinnedItems", allPinned)
//                 console.log(id)
//             })
//             div.append(icon)
//             div.append(drop)
//             $("#tagMenu").append(div)
//         }
//         let divider = $("<div>",{
//             "class": "dropdown-divider"
//         })
//         $("#tagMenu").append(divider)

//     }

//     let manageTags = $("<div>",{
//         "id": "dropdownAdd",
//         "class": "dropdown-item btn-m hober",
//         "style": "width: 160px",
//         "text": "Manage tags"
//     })
//     // document.getElementById("myForm").reset()
//     manageTags.on("click", async function (){
//         await manage_tags()
//     })
//     $("#tagMenu").append(manageTags)

//     $(".dropdown-item-tag").on("click", function (){
//         console.log(this.id)
//         displayWithTag(this.id)
//     })
//     if (tags.length > 6){
//         $("#tagMenu").css("height", "300px")
//     }
//     console.log(tags)
// }


function initializeFolderOpen() {
    $(".folder").each(function () {
        console.log("fdsfd")
        let object = findIt(data, this.id)
        onClickOpen(object)

    })
}

function onClickOpen(object) {
    let buttonId = "#" + String(object.id)
    console.log(buttonId)
    $(buttonId).on("click", function () {
        if (!$(buttonId).hasClass("open")) {
            for (var i = object.children.length - 1; i >= 0; i--) {
                if (!object.children[i].children) {
                    printBookmark(object.children[i], object.id);

                }
                else {
                    console.log("wh")
                    console.log(object.children[i])
                    printFolder(object.children[i], object.id)
                    onClickOpen(findIt(data, object.children[i].id))
                }
            }
            $(buttonId).addClass("open")

        }
        else {
            clickClose(object, 1)
        }
        // $("i").off("click")
        // iconEvent()

    })

}

function clickClose(obj) {
    let objId = "#" + String(obj.id)
    for (var i = 0; i < obj.children.length; i++) {
        if (obj.children[i].children) {
            clickClose(obj.children[i])
        }
        let stringId = "#" + String(obj.children[i].id)
        $(stringId).removeClass("open")
        $(stringId).remove()
        // $("#a" + obj.children[i].id).remove()
        // $("#b" + obj.children[i].id).remove()
        console.log("successfully killed" + stringId)

    }
    $(objId).removeClass("open");
    if (arguments.length == 1) {
        $(objId).remove();
    }
}

// function sortBookmarks(){
//     console.log("WTR")

//     let first = true
//     let curState = "popularButtonSort"
//     $(".dropdown-sort").on("click", async function() {
//         console.log("WTR")
//         onFocusOrFilter()
//         let changeState = this.id
//         console.log(changeState)
//         if (first || curState != changeState){
//             first = false
//             if (changeState == "defaultButtonSort"){
//                 currentState = "defaultButtonSort"
//                 hasBeenClicked = true
//                 $("#bookmarks").off("scroll")
//                 $("#bookmarks").empty()
//                 for(var i=0; i < data.length; i++){
//                     if (data[i].children){  
//                         printFolder(data[i])

//                     }
//                     else if (!data[i].children){
//                         printBookmark(data[i])
//                     }
//                 }
//                 initializeFolderOpen()

//             }
//             else if (changeState == "popularButtonSort"){
//                 currentState = "popularButtonSort"
//                 hasBeenClicked = true
//                 $("#bookmarks").off("scroll")
//                 $("#bookmarks").empty()
//                 for(var i=0; i < popularList.length;i++){
//                     let object = findIt(data, popularList[i])
//                     printBookmark(object)
//                 }
//             }
//             else if (changeState == "newButtonSort"){
//                 currentState = "newButtonSort"
//                 hasBeenClicked = true
//                 $("#bookmarks").off("scroll")
//                 $("#bookmarks").empty()
//                 for(var i=data.length -1; i >= 0; i--){
//                     if (data[i].children){  
//                         printFolder(data[i])

//                     }
//                     else if (!data[i].children){
//                         printBookmark(data[i])
//                     }
//                 }
//                 initializeFolderOpen()
//             }
//             else{
//                 console.log("nope")
//             }
//         }


//     })
// }


async function checkIfTag(object, tag) {
    let objectTag = await stored(object.id)
    console.log(objectTag)
    if (objectTag != undefined) {
        console.log("hazas")
        for (var i = 0; i < objectTag.length; i++) {
            if (objectTag[i] == tag) {
                return true
            }
        }
        return false
    }
    else {
        return false
    }
}








function pickBlackOrWhite(colour) {
    let red = colour.slice(1, 3)
    red = parseInt(red, 16)
    let green = colour.slice(3, 5)
    green = parseInt(green, 16)
    let blue = colour.slice(5, 7)
    blue = parseInt(blue, 16)
    console.log(red * 0.299 + green * 0.587 + blue * 0.114)
    if ((red * 0.299 + green * 0.587 + blue * 0.114) > 110) {

        return false
    }
    return true
}

function onSearchBarFocus() {
    $("#searchButton").focus(() => {
        initialExpandingHome()
    })
}

function onFocusOrFilter() {
    $("#searchContainer").addClass("searchContainerFocus")
    let menuLength = $("#dropdownButton").css("width")
    $("#dropdownAdd").css("width", menuLength)
    $("#bookmarks").addClass("divFocus")
    $("#bookmarks").css("height", "65%")
    $("#bookmarks").css("width", "90%")
    $("#bookmarks").scrollTop(0)
    $("#middleLine").addClass("middleLine")

}


function checkIncep(object, data) {
    let value = -1
    function checkInception(object, data, value) {
        total = value + 1
        if (object.parentId > 1) {
            checkInception(findIt(data, object.parentId), data, total)
        }
        return total
    }
    return checkInception(object, data, value)
}



let search = new Promise(function (resolve) {
    chrome.bookmarks.getTree(function (data) {
        if (data) {
            let result = data[0].children[0].children;
            resolve(result)
        }
    })
})

let create = function (name, parentId) {
    return new Promise(function (resolve) {
        chrome.bookmarks.create({
            "parentId": parentId,
            "title": name
        }, async function (folder) {
            console.log(folder)
            await makeStorage("newFolder", folder)
            await stored("newFolder")
            resolve(folder)
        })
    })
}



var makeStorage = function (id, text) {
    return new Promise(function (resolve, reject) {
        chrome.storage.local.set({ [id]: text })
        resolve(text)
    })
}

var deleteBookmark = function (id) {
    return new Promise(function (resolve, reject) {
        chrome.bookmarks.remove(id, () => {
            console.log("you removed ", id)
            resolve(id)
        })
    })
}

var deleteFolder = function (id) {
    return new Promise(function (resolve, reject) {
        chrome.bookmarks.removeTree(id, () => {
            console.log("you removed ", id)
            resolve(id)
        })
    })
}

// function findIt(dataArray, objectId) {
//     let checking = false
//     let objectValue;
//     for (var i = 0; i < dataArray.length; i++) {
//         if (dataArray[i].children) {
//             if (dataArray[i].id == objectId) {
//                 checking = true
//                 objectValue = dataArray[i]
//             }
//             else {
//                 findIt(dataArray[i].children, objectId)
//             }
//         }
//         else {
//             if (dataArray[i].id == objectId) {
//                 checking = true
//                 objectValue = dataArray[i]
//             }
//         }
//     }
//     if (checking) {
//         console.log("this")
//         return objectValue
//     }
// }


function innerfindIt(dataArray, objectId) {
    for (var i = 0; i < dataArray.length; i++) {
        if (dataArray[i].id == objectId) {
            let object = dataArray[i]
            return object

        }
        else {
            if (dataArray[i].children) {
                if (innerfindIt(dataArray[i].children, objectId) != false) {
                    return innerfindIt(dataArray[i].children, objectId)
                }

            }
            else {
                continue;
            }
        }
    }
    return false

}

function findIt(dataArray, objectId) {
    let found = false
    let object;
    return innerfindIt(dataArray, objectId)
}



function printFolder(object) {
    let fragment = document.createDocumentFragment();
    let folderDiv = document.createElement("div")
    folderDiv.className = "folder btn col-2 m-3 btn-sm"
    folderDiv.id = object.id
    folderDiv.style = "border: 2px solid " + bookmarkColourList[checkIncep(object, data)] + "; font-size: 120%; opacity: 0.6;border-radius: 1.5em; background-color:" + backgroundCol
    if (arguments.length == 2 && arguments[1] == true) {
        folderDiv.style = "border: 2px solid " + bookmarkColourList[checkIncep(object, data)] + "; font-size: 120%;border-radius: 1.5em; background-color:" + backgroundCol
    }
    let bookmarkRowDivision = document.createElement("div")
    bookmarkRowDivision.className = "d-flex flex-row margin"
    bookmarkRowDivision.style = "overflow-wrap: anywhere;"

    let bookmarkText = document.createElement("p")
    bookmarkText.innerHTML = object.title
    if (object.title.length >= 50) {
        bookmarkText.style = "width:70%; font-size: 80%"
    }
    else {
        bookmarkText.style = "width:70%;"
    }

    bookmarkText.class = "d-inline-flex"
    if (arguments.length == 1) {
        console.log("Im a fat phony")
        var bookmarkIcon = document.createElement("i")
        bookmarkIcon.innerHTML = "info"
        $(bookmarkIcon).addClass("d-inline-flex material-icons icon mt-1 item-info ml-auto")
        $(bookmarkIcon).on("click", function (e) {
            e.stopPropagation()
            displayIconModal(object.id)

        })
        $(bookmarkIcon).hover(function () {
            $(bookmarkIcon).css("cursor", "pointer")
            $(bookmarkIcon).css("color", "white")
            $(bookmarkText).css("color", "black")
        }, function () {
            $(bookmarkIcon).css("cursor", "default")
            $(bookmarkIcon).css("color", "black")
            $(folderDiv).hover(function () {

            })
        })
        $(folderDiv).mouseenter(function () {
            if (!$(folderDiv).hasClass("open")) {
                $(folderDiv).css("opacity", 1)
            }
            else {
                $(folderDiv).css("opacity", 0.6)
            }
            //$(folderDiv).css("background-color", bookmarkColourList[checkIncep(object, data)])
            $(bookmarkIcon).mouseenter(function () {
                $(bookmarkIcon).css("cursor", "pointer")
                $(bookmarkIcon).css("color", "white")
            }).mouseleave(function () {
                $(bookmarkIcon).css("cursor", "default")
                $(bookmarkIcon).css("color", "black")

            })
        }).mouseleave(function () {
            if (!$(folderDiv).hasClass("open")) {
                $(folderDiv).css("opacity", 0.6)
            }

            //$(folderDiv).css("background-color", "white")
        })
    }



    // $(folderDiv).on("click", function(){
    //     for(var i=0; i < object.children.length; i++){
    //         console.log(object.children[i])
    //         if (object.children[i].children){
    //             printFolder(object.children[i], object.id)
    //         }
    //         else{
    //             printBookmark(object.children[i], object.id)
    //         }
    //     }

    // })

    fragment.appendChild(folderDiv)
    folderDiv.appendChild(bookmarkRowDivision)
    bookmarkRowDivision.appendChild(bookmarkText)
    if (arguments.length == 1) {
        bookmarkRowDivision.appendChild(bookmarkIcon)
    }

    if (arguments.length == 2 && arguments[1] != true) {
        document.getElementById(arguments[1]).after(fragment)
    }
    else {
        document.getElementById("bookmarks").appendChild(fragment)
    }

}

function findDomain(url) {
    let expression = /https?:\/\/[a-zA-Z0-9_\.]+\//
    if (expression.exec(url)) {
        let domain = expression.exec(url)[0]
        return domain
    }
    return false
}

function printBookmark(object, parent) {
    console.log(object)
    let hasParent;
    if (arguments.length == 2) {
        hasParent = true
    }
    else {
        hasParent = false
    }
    let fragment = document.createDocumentFragment();
    let bookmarkDiv = document.createElement("div")
    console.log("testing ")
    bookmarkDiv.className = "bookmark btn col-2 m-3 btn-sm"
    console.log(object.id)
    bookmarkDiv.id = object.id
    //Problem with incep
    // if (hasParent){
    //     bookmarkDiv.style = "background-color: " + avgCol +";border-radius: 13px; font-size: 120%; border: 3px solid" + bookmarkColourList[0]
    //     //textColour = pickBlackOrWhite(avgCol)

    // }

    bookmarkDiv.style = "background-color: " + bookmarkColourList[checkIncep(object, data)] + "; font-size: 120%; border-radius: 1.5em; height:120px;"


    let bookmarkClickable = document.createElement("a")
    bookmarkClickable.href = object.url
    bookmarkClickable.class = "m-3 clickable"
    bookmarkClickable.id = "a" + object.id

    bookmarkClickable.addEventListener("click", function (e) {
        e.stopImmediatePropagation()
    });
    let bookmarkRowDivision = document.createElement("div")
    bookmarkRowDivision.className = "d-flex justify-content-between flex-row-reverse"
    // bookmarkRowDivision.style = "overflow-wrap: anywhere;"

    let bookmarkRowDivisionText = document.createElement("div")
    bookmarkRowDivisionText.className = "d-flex flex-grow-1 margin"
    bookmarkRowDivisionText.style = "overflow-wrap: anywhere;"

    let bookmarkText = document.createElement("p")
    let bookmarkTitle = object.title
    bookmarkText.className = "flex-fill flex-grow-1"
    let bookmarkTextStyleString = "margin-bottom:0px;"
    if (bookmarkTitle.length > 20 && bookmarkTitle.length < 40) {
        bookmarkTextStyleString += "margin-top: 0px;"
        console.log("tgb")
    }
    else if (bookmarkTitle.length > 40) {
        bookmarkTitle = bookmarkTitle.slice(0, 40) + "..."
        bookmarkTextStyleString += "font-size: 80%; margin-top: 0px;"
    }
    else {
        bookmarkTextStyleString += "margin-top: 8px; font-size: 110%;"
    }
    bookmarkText.innerHTML = bookmarkTitle

    if (textColour) {
        bookmarkTextStyleString += "color: #D3D3D3;"
    }
    console.log(bookmarkTextStyleString)
    bookmarkText.style = bookmarkTextStyleString
    // if (object.title.length >= 50) {
    //     if (textColour){
    //         bookmarkText.style = "color: #D3D3D3;width:70%; font-size: 80%"
    //     }
    //     else{
    //         bookmarkText.style = "width:70%; font-size: 80%"
    //     }
    // }
    // else{
    //     if (textColour){
    //         bookmarkText.style = "color: #D3D3D3; width:70%"
    //     }
    //     else{
    //         bookmarkText.style = "width:70%;"
    //     }
    // }
    console.log(object)
    let domain = findDomain(object.url)
    console.log(domain)
    let favicon = document.createElement("img")
    // favicon.src = "chrome://favicon/" + domain
    // favicon.src = domain + "favicon.ico"

    // let sendMessage = "chrome-search://ntpicon/?size=24%401x&url=" + domain
    let sendMessage = "https://plus.google.com/_/favicon?domain=" + domain

    switch (domain) {
        case "https://www.youtube.com/":
            sendMessage = "https://www.youtube.com/s/desktop/ee2e5595/img/favicon_32.png"
            break;
        case "https://mail.google.com/":
            sendMessage = "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico"
            break;
        case "https://drive.google.com/":
            sendMessage = "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png"
            break;
        case "https://classroom.google.com/":
            sendMessage = "https://ssl.gstatic.com/classroom/favicon.png"
            break;
        case "https://github.com/":
            sendMessage = "https://github.githubassets.com/favicons/favicon.svg"
            break;
        case "https://calendar.google.com/":
            sendMessage = "https://calendar.google.com/googlecalendar/images/favicons_fttmIIlBXU2Ldf6JaL09WmFY3NDc1zq1/v3/calendar_19.ico"
            break;
        case "https://docs.google.com/":
            sendMessage = "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico"
        case "https://keep.google.com/":
            sendMessage = "https://ssl.gstatic.com/keep/keep_2020q4v2.ico"
        default:
            break;
    }

    // This is for some google domains since they don't return the right thing
    if (object.url.includes("https://docs.google.com/spreadsheets")) {
        sendMessage = "https://ssl.gstatic.com/docs/spreadsheets/favicon3.ico"
    }
    if (object.url.includes("https://docs.google.com/document")) {
        sendMessage = "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico"
    }
    if (object.url.includes("https://docs.google.com/presentation")) {
        sendMessage = "https://ssl.gstatic.com/docs/presentations/images/favicon5.ico"
    }



    favicon.src = sendMessage
    console.log(sendMessage)
    favicon.style = "width: 24px; height: 24px; margin: 4px 0px 0px 4px"


    let bookmarkIcon = document.createElement("i")
    bookmarkIcon.innerHTML = "info"
    bookmarkIcon.classList.add("d-inline-flex");
    bookmarkIcon.classList.add("material-icons");
    bookmarkIcon.classList.add("icon");
    bookmarkIcon.classList.add("mt-1");
    bookmarkIcon.classList.add("mr-1");
    bookmarkIcon.classList.add("item-info");
    // $(bookmarkIcon).addClass("d-inline-flex material-icons icon mt-2 mr-1 item-info")
    bookmarkIcon.id = "i" + object.id
    bookmarkIcon.addEventListener("click", function (e) {
        e.preventDefault()
        e.stopImmediatePropagation()
        displayIconModal(object.id)
    });
    // $(bookmarkIcon).on("click", function (e){
    //     e.preventDefault()
    //     displayIconModal(object.id)

    // })
    bookmarkIcon.addEventListener("mouseover", function (e) {
        bookmarkIcon.style.cursor = "pointer"
        bookmarkIcon.style.color = "white"
        bookmarkText.style.color = "black"
    });
    bookmarkIcon.addEventListener("mouseout", function (e) {
        bookmarkIcon.style.cursor = "default"
        bookmarkIcon.style.color = "black"
        bookmarkText.style.color = "white"
    });
    // $(bookmarkIcon).hover(function(){
    //     $(bookmarkIcon).css("cursor", "pointer")
    //     $(bookmarkIcon).css("color", "white")
    //     $(bookmarkText).css("color", "black")
    // }, function(){
    //     $(bookmarkIcon).css("cursor", "default")
    //     $(bookmarkIcon).css("color", "black")
    // })

    $(bookmarkDiv).mouseenter(function () {
        if (textColour) {
            $(bookmarkText).css("color", "black")
        }
        else {
            $(bookmarkText).css("color", "#D3D3D3")
        }
        $(bookmarkIcon).mouseenter(function () {
            $(bookmarkIcon).css("cursor", "pointer")
            $(bookmarkIcon).css("color", "white")
            $(bookmarkText).css("color", "black")
        }).mouseleave(function () {
            $(bookmarkIcon).css("cursor", "default")
            $(bookmarkIcon).css("color", "black")
            $(bookmarkText).css("color", "#D3D3D3")

        })
    }).mouseleave(function () {
        if (textColour) {
            $(bookmarkText).css("color", "#D3D3D3")
        }
        else {
            $(bookmarkText).css("color", "black")
        }
    })

    fragment.appendChild(bookmarkClickable)
    bookmarkClickable.appendChild(bookmarkDiv)
    bookmarkDiv.appendChild(bookmarkRowDivision)
    bookmarkDiv.appendChild(bookmarkRowDivisionText)
    bookmarkRowDivision.appendChild(bookmarkIcon)
    bookmarkRowDivisionText.appendChild(bookmarkText)
    bookmarkRowDivision.appendChild(favicon)


    if (arguments.length == 2) {
        document.getElementById(arguments[1]).after(fragment)
    }
    else {
        document.getElementById("bookmarks").appendChild(fragment)
    }

}

// Popular finding algorithm
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function onLoadApp() {
    let onLoad = await stored("onLoad")
    if (onLoad == "popular") {
        let list = []
        await getAllInside(list, data)
        popularList = sortDescend(list)
        popularList = removeDuplicates(popularList)
        let counter = 0
        let endIt = false
        while ($("#bookmarks").height() < ($("#bod").height() / 2) || endIt) {
            for (var i = 0; i < 5; i++) {
                let index = counter * 5 + i
                console.log(popularList[index])
                let object;
                if (index < popularList.length) {
                    object = findIt(data, popularList[index])
                    printBookmark(object)
                    maxPerPage++
                }
                else {
                    //Do nothing
                    endIt = true
                    break
                }

            }
            if (endIt) {
                break
            }
            counter++
        }
        let outerDiv = $("<div>", {
            class: "d-flex justify-content-center"
        })
        let expandIcon = $("<i>", {
            text: "expand_more",
            class: "material-icons",
            style: "font-size: 52px; color: " + bookmarkColourList[0],
            id: "expandIcon"
        })
        // outerDiv.append(expandIcon)
        $("#bookmarks").append(outerDiv)
        //$("#bookmarks").append(expandIcon)
        console.log("hello?")
        expandIcon.on("click", function () {
            initialExpandingHome()
        })
        expandIcon.hover(function () {
            expandIcon.css("cursor", "pointer")
        }, function () {
            expandIcon.css("cursor", "")

        })
    }
    else if (onLoad == "default") {
        console.log("heyo")
    }
}

function initialExpandingHome() {
    if (currentState == "popularButtonSort") {
        paginateLoadingFilter(popularList)
    }
}


function paginateLoadingFilter(filterArray) {
    $("#bookmarks").off("scroll")
    onFocusOrFilter()
    let startPoint = 0
    $("#bookmarks").empty()
    let isObject = true
    console.log(typeof(filterArray[0]))
    // I don't know what this means
    if (typeof (filterArray[0]) == "string") {
        isObject = false
    }
    console.log("object val is", isObject)
    for (var i = startPoint; 100 + startPoint > i; i++) {
        if (i < filterArray.length) {
            if (isObject) {
                if (filterArray[i].children) {
                    console.log("here")
                    printFolder(filterArray[i])
                    onClickOpen(filterArray[i])
                }
                else {
                    printBookmark(filterArray[i])
                }

            }
            else {
                let object = findIt(data, filterArray[i])
                printBookmark(object)
            }

        }
    }
    changeFontSizeIfTooBig()
    startPoint += 100
    $("#bookmarks").on("scroll", () => {
        let totLength = document.getElementById("bookmarks").scrollHeight
        let scrolledLength = $("#bookmarks").height() + $("#bookmarks").scrollTop()
        if (scrolledLength + 200 > totLength) {
            console.log("$$$$$")
            for (var i = startPoint; 100 + startPoint > i; i++) {
                if (i < filterArray.length) {
                    if (isObject) {
                        let object = filterArray[i]
                        if (object.children) {
                            printFolder(object)
                            onClickOpen(object)
                        } else {
                            printBookmark(object)
                        }
                    }
                    else {
                        let object = findIt(data, filterArray[i])
                        if (object.children) {
                            printFolder(object)
                            onClickOpen(object)
                        } else {
                            printBookmark(object)
                        }
                    }

                }
                else {
                    $("#bookmarks").off("scroll")
                }
            }
            startPoint += 100
            changeFontSizeIfTooBig()
        }
    })
}


async function renderPop(data) {
    let list = [];
    await getAllInside(list, data)
    console.log(list)
    popularList = sortDescend(list)
    popularList = removeDuplicates(popularList)
    console.log(popularList)
    let tester = 0
    let counter = 0
    console.log($("#bookmarks").height())
    console.log($("#bod").height())
    while ($("#bookmarks").height() < ($("#bod").height() / 4)) {
        for (var i = 0; i < 5; i++) {
            tester += 1
            let index = counter * 5 + i
            console.log(popularList[index])
            let object = findIt(data, popularList[index])
            console.log(object)
            printBookmark(object)
            maxPerPage++
        }
        counter++
    }
    console.log(tester)
    let outerDiv = $("<div>", {
        class: "d-flex justify-content-center"
    })
    let expandIcon = $("<i>", {
        text: "expand_more",
        class: "material-icons",
        style: "font-size: 52px; color: " + bookmarkColourList[0],
        id: "expandIcon"
    })
    outerDiv.append(expandIcon)
    $("#bookmarks").append(outerDiv)
    //$("#bookmarks").append(expandIcon)
    expandIcon.on("click", function () {
        expandIcon.remove()
        onFocusOrFilter()
        let children = maxPerPage
        for (var i = children; popularList.length > i; i++) {
            let object = findIt(data, popularList[i])
            printBookmark(object)
        }
        hasBeenClicked = true
    })
    expandIcon.hover(function () {
        expandIcon.css("cursor", "pointer")
    }, function () {
        expandIcon.css("cursor", "")

    })
}
function removeDuplicates(list) {
    let idList = []
    for (var i = 0; i < list.length; i++) {
        idList.push(list[i].id)
    }
    console.log(idList)
    return idList
}

// function removeDuplicates(list){
//     let idList = []
//     for(var i=0; i < list.length;i++){
//         idList.push(list[i].id)
//     }
//     console.log(idList)
//     return idList.filter((value,index) => {
//         let obj = findIt(result, value)
//         console.log(obj)
//         for (var i=0; i < idList.length; i++){
//             let obj2 = findIt(result, idList[i])
//             console.log(obj2)
//             console.log(`This is index ${index}and this is i ${i}`)
//             console.log(`this is 1 ${obj.url} and two ${obj2.url}`)
//             if (obj.url == obj2.url && index != i){
//                 console.log("butt scrolls are for trolls")
//                 return false
//             }
//         }
//         return true
//     })

// }



async function getAllInside(list, dataArray) {
    for (var i = 0; i < dataArray.length; i++) {
        if (!dataArray[i].children) {
            await findAllVisits(list, dataArray[i].id, dataArray[i].url)
        }
        else if (dataArray[i].children) {
            await getAllInside(list, dataArray[i].children)
        }
    }
}

var findAllVisits = function (list, id, theURL) {
    return new Promise(function (resolve, reject) {
        chrome.history.getVisits({ 'url': theURL }, function (res) {
            list.push({ "id": id, "visits": res.length })
            resolve(res.length)

        })
    })
}

function sortDescend(list) {
    let sortedList = list.slice(0)
    sortedList.sort(function (a, b) {
        return b.visits - a.visits
    })
    console.log(sortedList)
    return sortedList

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function getAverageRGB(imgEl) {

    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = { r: 0, g: 0, b: 0 },
        count = 0;

    if (!context) {
        console.log("thihihih")
        return defaultRGB;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch (e) {
        /* security error, img on diff domain */
        return defaultRGB;
    }

    length = data.data.length;

    while ((i += blockSize * 4) < length) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i + 1];
        rgb.b += data.data[i + 2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);

    return rgb;

}

function rgbToHex(r, g, b) {
    let partOne = r.toString(16)
    let partTwo = g.toString(16)
    let partThree = b.toString(16)
    if (partOne.length == 1) {
        partOne = "0" + partOne
    }
    if (partTwo.length == 1) {
        partTwo = "0" + partTwo
    }
    if (partThree.length == 1) {
        partThree = "0" + partThree
    }
    console.log(r)
    console.log(g)
    console.log(b)
    return (partOne + partTwo + partThree)
}

function hexToRgb(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    let dict = {
        "r": r,
        "g": g,
        "b": b
    }
    return dict
}

function invertColour(r, g, b) {
    let invertRed = 255 - r
    let invertGreen = 255 - g
    let invertBlue = 255 - b
    let inverted = {
        "r": invertRed,
        "g": invertGreen,
        "b": invertBlue
    }
    return inverted
}





































