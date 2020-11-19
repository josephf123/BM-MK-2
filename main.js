var stored = function (id){
    return new Promise(function (resolve, reject){
        chrome.storage.local.get([id], function (res) {
            resolve(res[id])
    
        })
    })
}
// Line 1061
const pSBC=(p,c0,c1,l)=>{
	let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
	if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
	if(!this.pSBCr)this.pSBCr=(d)=>{
		let n=d.length,x={};
		if(n>9){
			[r,g,b,a]=d=d.split(","),n=d.length;
			if(n<3||n>4)return null;
			x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
		}else{
			if(n==8||n==6||n<4)return null;
			if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
			d=i(d.slice(1),16);
			if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
			else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
		}return x};
	h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
	if(!f||!t)return null;
	if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
	else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
	a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
	if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
	else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}
let data, popularList, textColour, avgCol, imgUrl, img, bookmarkColourList;

let currentState = "popular"

let hasBeenClicked = false

let maxPerPage = 0;



// chrome.browserAction.onClicked.addListener(function(){
//     console.log("hiya")
//     chrome.tabs.create({'url': chrome.extension.getURL('newTab.html')}, function(tab) {
//         // Tab opened.
//     });
// })

// async function findImgUrl(){
//     imgUrl = await getURL()
//     await imageLoad(imgUrl)
//     // console.log(imgUrl)
//     // img.crossOrigin = '';
//     // img.src = imgUrl    
//     let rgbCol = getAverageRGB(img)
//     avgCol = rgbToHex(rgbCol["r"], rgbCol["g"], rgbCol["b"])
//     console.log(avgCol)
//     console.log("dfsf")
//     let invertedRGB = invertColour(rgbCol["r"], rgbCol["g"], rgbCol["b"])
//     hexCol = rgbToHex(invertedRGB["r"], invertedRGB["g"], invertedRGB["b"])
//     console.log("this")
    
// }

// function imageLoad(src){
//     return new Promise((resolve,reject) =>{
//         img = new Image();
//         img.onload = () => resolve(img)
//         img.src = imgUrl
//         img.crossOrigin = '';
//     })

// }

// async function getURL(){
//     let data = await fetch("https://api.unsplash.com/photos/random?count=1&collections=155105&client_id=a4cc58d9f413a6bf9645e3b03cfb04c23ee7e3bfb2d86b72ada163eef96ecc15")
//     let source = await data.json()
//     source = source[0]["urls"]["regular"]
//     return source
// }

let randomColours = ["D17A22","095256","BC5D2E","FF7733","F7B538","17BEBB","61CC3D","59CD90","067BC2","E1612A","F25F5C",
                    "247BA0","446E80","D62828","F77F00","FCBF49","FDC6B5","fbca9a","5158BB","2E86AB","A23B72","F18F01",
                    "C73E1D","2274A5","32936F","95D9C3","388697", "685470", "B1DDCA", "A9B3CE", "C0596E", "4E6474"]


//Change main colour
//114B5F-03A0B5


chrome.runtime.onInstalled.addListener(async function(details) {
    console.log("Hoowee")
    console.log(details.reason)
    await makeStorage("tags", "Work,Entertainment,For Later,")
    //For now just make it so it is only colours but later I will add photos
    await makeStorage("colConfig", "s")
    // This will be colour order, either col-col, col-random, random-col or random-random
    await makeStorage("colourOrder", "114B5F-03A0B5")
    
    await makeStorage("colourCollection", "114B5F-03A0B5")
    // When the home button is pressed, will it go to default of popular
    await makeStorage("home", "popular")
    // When the application loads, either the default or popular shows up
    await makeStorage("onLoad", "popular")
    
    
});




async function sendPageAndColour(){
    let colCol = await stored("colourCollection")
    console.log(colCol)
    ga('set', 'dimension1', colCol);

    //ga('set', 'dimension2', userID)
    
    ga('send', 'event', 'colour scheme', colCol, "For colours");

    ga('send', 'pageview', "/newTab.html")
}

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){

    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); // Note: https protocol here
    
    ga('create', 'UA-175257786-1', 'auto');
    
    ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
    
    ga('require', 'displayfeatures');

    sendPageAndColour()
    

    // ga(function(tracker) {
    //     // Logs the trackers name.
    //     // (Note: default trackers are given the name "t0")
    //     console.warn(tracker)
    //     console.warn(tracker.get('name'));
      
    //     // Logs the client ID for the current user.
    //     console.warn(tracker.get('clientId'));
      
    //     // Logs the URL of the referring site (if available).
    //     console.warn(tracker.get('storedClientId'));
    // });
    //For the colour that the user uses
    
    

let randomNum1 = Math.round(Math.random() * (randomColours.length - 1))
//let hexCol = "247BA0"
//"AB4E68"
// randomColours[randomNum1]

document.addEventListener("DOMContentLoaded", async() => {
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
    if (colConfig == "s"){
        dataColours = await stored("colourOrder")
    }
    else if (colConfig == "r"){
        let arr = await stored("colourCollection")
        let randIndex = Math.round(Math.random() * arr.length)
        console.log(arr.length, randIndex, "h")
        if (randIndex > (arr.length - 1)){
            randIndex = arr.length - 1
        }
        dataColours = arr[randIndex]
    }
    let backgroundColour = dataColours.slice(0,6)
    let hexCol = dataColours.slice(7)
    avgCol = backgroundColour
    // let invert = "93C0A4"
    console.log(hexCol)
    console.log(backgroundColour)
    // if (Math.random() > 0.5){
    //     let temp = hexCol
    //     hexCol = invert
    //     invert = temp
    // }
    console.log(avgCol)
    //avgCol = pSBC(-0.7, "#" + invert)
    //avgCol = avgCol.slice(1)
    $("#bod").css("background-color", backgroundColour)
    //await findImgUrl()
    let hexCol1 = "#" + hexCol
    let hexCol2 = pSBC(-0.2, hexCol1)
    console.log(hexCol1)
    let hexCol3 = pSBC(-0.4, hexCol1)
    let hexCol4 = pSBC(-0.6, hexCol1)
    let hexCol5 = pSBC(-0.7, hexCol1)
    let hexCol6 = pSBC(-0.75, hexCol1)
    bookmarkColourList = [hexCol1, hexCol2 , hexCol3, hexCol4, hexCol5, hexCol6]
    textColour = pickBlackOrWhite(bookmarkColourList[0])
    
    // let backImg = "url(" + imgUrl + ")"
    // $("#bod").css("background-image", backImg)
    console.log("testing")
    console.log(data)
    await onLoadApp()
    console.log("testt")
    await renderTags()
    onSearchBarFocus()
    $(".icon").on("hover", function () {
        console.log("testing")
    })
    $("#tagPage").on("click", function (){
        window.location.href = "tagManage.html"
    })
    $("#optionsPage").on("click", function (){
        window.location.href = "options.html"
    })
    $(".dropdown-item-tag").on("click", function (){
        console.log(this.id)
        displayWithTag(this.id)
    })
    $("#searchButton").on("keyup", function (e){
        console.log(e.target.value)
        searchFunction(e.target.value)
    })
    sortBookmarks()
    await renderFolders()
    $(".dropdown-item-folder").on("click", function (){
        displayWithFolder(this.id)
    })
    $("#saveChangesInfoModal").on("click", function(){
        let textModal = $("textarea")[0].value
        let id = $("textarea")[0].id.substring(1)
        console.log(textModal)
        console.log(id)
        saveChangesModal(id,textModal)

    })
    $("#dropdownFolder").on("click", function(){
        let array = []
        findAllFolders(data, array)
        $("#bookmarks").empty()
        onFocusOrFilter()
        for(var i=0; i < array.length; i++){
            printFolder(array[i])
            onClickOpen(array[i])
        }
    })
    $("#dropdownTag").on("click", async function(){
        let tags = await stored("tags")
        let tagArray = tags.split(",")
        tagArray.pop()
        $("#bookmarks").empty()
        onFocusOrFilter()
        for(var i=0; i < tagArray.length; i++){
            console.log(tagArray[i])
            let array = []
            await find(data, tagArray[i], array)
            let folderStructure = {
                "id": "Tag" + i,
                "children": array,
                "title": tagArray[i],
                "parentId": 0
            }
            printFolder(folderStructure, true)
            console.log("heyo")
            onClickOpen(folderStructure)
        }
       
    })
    $("#homeButton").on("click", async function(){
        let currentHomeState = await stored("home")
        $("#bookmarks").empty()
        onFocusOrFilter()
        if (currentHomeState == "default"){
            for(var i=0; i < data.length; i++){
                if (data[i].children){  
                    printFolder(data[i])
                    
                }
                else if (!data[i].children){
                    printBookmark(data[i])
                }
            }
            initializeFolderOpen()
        }
        else if (currentHomeState == "popular"){
            for(var i=0; i < popularList.length;i++){
                let object = findIt(data, popularList[i])
                printBookmark(object)
            }
        }
        
        
    })
    $("#homeButton").hover(function(){
        $(this).css("color", "white")
        $(this).css("cursor", "pointer")
    }, function(){
        $(this).css("color", "black")
    })

    
})
//For the bookmarks so when you hover over them they go transparent
function buttonHovering(array, colour, exclusive){
    for(let i=0; i < array.length;i++){
        console.log(colour)
        $(array[i]).css("border", "1px solid " + colour)
        if (arguments.length == 3 && arguments[2] == true){
            $(array[i]).addClass("focused")
            changeFocus(array[i], colour)
        }
        else {
            changeFocus(array[i], colour)
            $(array[i]).on("click", function(){
                for(var k=0; k < array.length;k++){
                    if (k == i){
                        $(array[k]).addClass("focused")
                    }
                    else{
                        $(array[k]).removeClass("focused")
                    }
                }
                for(var j=0; j < array.length; j++){
                    changeFocus(array[j], colour)
                }
            })
        }
        
    }

}

function findAllFolders(d, array){
    for(var i=0; i < d.length; i++){
        if (d[i].children){
            array.push(d[i])
        }
    }
}

async function searchTags(searchWord, id){
    let tags = await stored("tags")
    if (tags != undefined){
        tags = tags.split(",")
        tags.pop()
    }
    let storedTags = await stored(id)
    if (storedTags != undefined){
        storedTags = storedTags.split(",")
        storedTags.pop()
    }
    console.log(storedTags, "stored tags")
    let acceptedArray = []
    // I can optimise this to check if the searched word includes a tag that the obj already has
    for(var i=0; i < tags.length;i++){
        if ((tags[i].toUpperCase()).includes(searchWord.toUpperCase())){
            console.log(tags[i])
            acceptedArray.push(tags[i])
            if (storedTags != undefined){
                for(var j=0; j < storedTags.length; j++){
                    console.log(storedTags[j])
                    console.log(tags[i])
                    if (storedTags[j] == tags[i]){
                        acceptedArray = acceptedArray.filter(word => word != tags[i])
                    }
                }
            }
        }
    }
    displayTagOptions(acceptedArray, searchWord, id)
    console.log(acceptedArray)
}

function displayTagOptions(arr, word, objId){
    let isWordInArr = false
    if (word == ""){
        isWordInArr = true
    }
    // This makes it stop working but it was also not working before this so idk
    let largeTagDiv = $("<div id='largeTagDiv' style='position: absolute; z-index: 5; width:434px;height: 300px;overflow: auto'></div>")
    for(var i=0; i < arr.length; i++){
        if (arr[i].toUpperCase() == word.toUpperCase()){
            isWordInArr = true
        }
        let tagDiv = $("<div class='d-inline-flex addTag pl-2' style='background-color: white; height: 50px; width: 434px;'></div>") 
        tagDiv.css("border", "1px solid black")
        // tagDiv.css("font-size", "22px")
        tagDiv.css("border-width", 0)
        tagDiv.css("border-left-width", "1px")
        tagDiv.css("border-right-width", "1px")
        tagDiv.css("z-index", "5")
        if (isWordInArr && i == arr.length -1){
            tagDiv.css("border-bottom-width", "1px")
        }
        tagDiv.attr("id", arr[i])
        tagDiv.text(arr[i])
        largeTagDiv.append(tagDiv)
    }
    if (!isWordInArr){
        let addTagString = "<div id='" + word + "' class='d-inline-flex addTag createTag pl-2' style='background-color: white; height: 50px; width: 434px;border: 1px solid black;'></div>"
        let addTag = $(addTagString)
        if (arr.length == 0){
            addTag.css("border-top-width", 0)
        }
        addTag.text("Add tag: " + word)
        largeTagDiv.append(addTag)
    }
    $("#inputTags").after(largeTagDiv)
    $(".addTag").each(function(){
        console.log("bruhhhhh")
        $(this).hover(function(){
            $(this).css("background-color", "blue")
        }, function(){
            $(this).css("background-color", "white")
        })
        $(this).on("click", async function(event){
            event.stopPropagation();
            console.log(event)
            let tagName = this.id
            let tags = await stored(objId)
            if (tags == undefined){
                tags = ""
            }
            tagName = tagName.charAt(0).toUpperCase() + tagName.slice(1)
            tags = tags + tagName + ","
            console.log(tags)
            await makeStorage(objId, tags)
            console.log("this just worked")
            if ($(this).hasClass("createTag")){
                let ta = await stored("tags")
                ta = ta + tagName.charAt(0).toUpperCase() + tagName.slice(1) +","
                await makeStorage("tags", ta)
            }
            $("<div>", {
                text: tags[i],
                class: "btn m-2 d-inline-flex btn-primary",
                style: "border-radius: 1.5em"
            })
            await displayIconModal(objId)
        })
    })
    $("#inputTags").on("focusout", function(e){
        console.log(e)
        console.log(e.target.id)
        console.log("yea baby")
        setTimeout(function(){
            $("#largeTagDiv").remove()
        }, 200)
        
    })
    console.log("Add tag:", word)
}

async function saveChangesModal(id, text){
    let key = "i" + id
    await makeStorage(key, text)
}

async function displayIconModal(id){
    let object = findIt(data, id)
    let tags = await stored(id)
    if (tags != undefined){
        tags = tags.split(",")
        tags.pop()
    }
    else{
        tags = ["No Tags"]
    }
    console.log(tags)
    $("#infoModal").empty()
    let row = $("<div class='row margin py-2' style='margin-left: 0px'></div>")
    let urlTitle = $("<div style='font-size: 20px;'>URL</div>")
    let url = $("<a>",{
        href: object.url,
        text: object.url,
        class: "ml-2"
    })
    urlTitle.appendTo(row)
    url.appendTo(row)
    $("#infoTitle").text(object.title)
    
    let tagParagraph = $("<p class='margin' style='text-align: center; margin-bottom:0px; font-size: 20px;'>Tags</p>")
    let div = $("<div id='containsTags'class='ml-2'>")
    for(var i=0;i < tags.length; i++){
        let tag = $("<div>", {
            class: "btn m-2 d-inline-flex btn-primary",
            style: "border-radius: 1.5em"
        })
        let tagTextText = "<p class='mb-0'>" + tags[i] + "</p>"
        let tagText = $(tagTextText)
        
        let deleteTagIconText = "<i class='material-icons ml-1' style='position:relative; left: 5px'>cancel</i>"
        let deleteTagIcon = $(deleteTagIconText)
        tagText.appendTo(tag)
        deleteTagIcon.appendTo(tag)
        tag.appendTo(div)
    }
    let addTagSearch = $("<div class='form-group mb-4 mx-3' style='z-index: 4'></div>")
    let inTagSearch = $("<input id='inputTags' placeholder='Search or create tags' class='form-control' style='border-width: 0; border-bottom-width: 1px; border-radius: 0; padding-left: 0;z-index: 5'>")
    inTagSearch.appendTo(addTagSearch)
    let infoTitle = $("<p class='margin pt-3' style='font-size: 20px; text-align: center;'>Info</p>")
    // let infoSubscript = $("<p class='margin d-inline-flex pt-3' style='float:right; color: #A9A9A9'>max chars: 200</p>")
    let textInformation = await stored("i" + id)
    if (textInformation == undefined){
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

    inTagSearch.on("focus", function(e){
        console.log("this is the rythm of the night")
        e.stopImmediatePropagation();
        console.log(e.isImmediatePropagationStopped())
        console.log(e)
        console.log("t")
        searchTags("", id)
    })
    
    inTagSearch.on("keyup", function (e){
        $("#largeTagDiv").remove()
        if (e.target.value != ""){
            searchTags(e.target.value, id)
        }
    })
    
    
    // $(".modal-content").on("click", function(){
    //     if (inTagSearch.is(":focus")){
    //         //Leave
    //     }
    //     else{
    //         $("#largeTagDiv").remove()
    //     }
    // })

    // inTagSearch.on("blur", function(e){

    //     console.log("t")
    //     console.log(e)
    //     $("#largeTagDiv").remove()
        
        
    // })
    let textbox = $("<textarea>", {
        row: "5",
        style: "margin-left: 45px; width:405px;", 
        text: textInformation, maxlength: "200", 
        class : "form-control",
        id: "m" + id
    })
    if (object.children){
        var openChildrenDiv = $("<div>", {
            id: "this",
            class: "btn btn-success mx-2 my-3",
            text: "Open all bookmarks inside the folder"
    
        })
        openChildrenDiv.on("click", function(){
            for(var i=0; i < object.children.length; i++){
                chrome.tabs.create({"url": object.children[i].url, "active": false})
            }
        })
    }
    let tagDivision = $("<div style='border-width: 0px 0px 0px 0px; border-style: solid; border-color: #03a0bf;min-height: 200px;'></div>")

    let line = $("<div style='background-color: #dee2e6; height: 1px;' class='my-2'></div>")
    // $("#infoModal").append(row)
    tagDivision.append(tagParagraph)
    tagDivision.append(addTagSearch)
    tagDivision.append(div)
    // $("#infoModal").append(tagParagraph)
    // $("#infoModal").append(addTagSearch)
    // $("#infoModal").append(div)
    $("#infoModal").append(tagDivision)
    $("#infoModal").append(line)
    $("#infoModal").append(infoTitle)
    // $("#infoModal").append(infoSubscript)
    $("#infoModal").append(textbox)
    if (object.children){
        $("#infoModal").append(openChildrenDiv)
    }
    $("#informationModal").modal('show')
}


async function searchFunction(searchWord){
    console.log(currentState)
    let searchW = searchWord.toUpperCase()
    console.log(searchW)

    let displayedBookmarks = false;
    console.log(currentState.slice(0,2))
    if (currentState.slice(0,2) == "T+"){
        let tagName = currentState.slice(2)
        let array = []
        await find(data, tagName, array)
        if (array.length > 0){
            displayedBookmarks = array
        }
        i
    }
    else if (currentState.slice(0,2) == "F+"){
        console.log("wasa")
        let folderId = currentState.slice(2)
        let object = findIt(data, folderId)
        console.log(object)
        if (object.children.length > 0){
            displayedBookmarks = object.children
        }
        
    }
    else if (currentState == "popular"){
        let array = []
        for(var i=0; i < popularList.length;i++){
            let object = findIt(data, popularList[i])
            array.push(object)
        }
        console.log(array)
        displayedBookmarks = array
    }
    else if (currentState == "default"){
        displayedBookmarks = data
    }
    // let allBookmarks = $("#bookmarks").children()
    // console.log(allBookmarks)
    let searchArray = []
    if (displayedBookmarks != false){
        console.log(displayedBookmarks)
        await insideSearch(searchW, displayedBookmarks, searchArray)
    }
    console.log(searchArray)
    let all = $("#bookmarks").children()
    for(var i=0; i < all.length; i++){
        all[i].remove()
    }
    for (var i=0; i < searchArray.length; i++){
        console.log(searchArray[i])
        if (searchArray[i].children){
            printFolder(searchArray[i])
            onClickOpen(searchArray[i])
        }
        else{
            printBookmark(searchArray[i])
        }
    }
}

async function insideSearch(searchWord, listBookmark, searchArray){
    for (var i=0; i < listBookmark.length; i++){
        let id;
        (listBookmark[i].id.startsWith("a")) ?  id = listBookmark[i].id.slice(1) : id = listBookmark[i].id
        console.log(id)
        let object = findIt(data, id)
        if (object.children){
            let infoData = await stored("i" + object.id)
            console.log(infoData)
            if (infoData == undefined){
                infoData = ""
            }
            let allData = (object.title + infoData).toUpperCase()
            if (allData.includes(searchWord)){
                searchArray.push(object)
            }
            await insideSearch(searchWord, listBookmark[i].children, searchArray)
        }
        else{
            let infoData = await stored("i" + object.id)
            console.log(infoData)

            if (infoData == undefined){
                infoData = ""
            }
            let allData = (object.url + object.title + infoData).toUpperCase() 
            if (allData.includes(searchWord)){
                searchArray.push(object)
            }
        }

    }
}


function displayWithFolder(folderName){
    let folderId = folderName.slice(1)
    let object = findIt(data, folderId)
    let objectChildren = object.children
    if (objectChildren.length > 0){
        currentState = "F+" + folderName
        hasBeenClicked = true
        onFocusOrFilter()
        $("#bookmarks").empty()
        for (var i=0; i < objectChildren.length; i++){
            if (objectChildren[i].children){
                printFolder(objectChildren[i])
                onClickOpen(objectChildren[i])
            }
            else{
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


async function find(data, tagName, array){
    for(var i=0; i< data.length;i++){
        if (await checkIfTag(data[i], tagName)){
            console.log("123")
            array.push(data[i])
        }
    }
}

async function displayWithTag(tagName){
    let array = []
    await find(data, tagName, array)
    if (array.length != 0){
        currentState = "T+" + tagName
        hasBeenClicked = true
        onFocusOrFilter()
        $("#bookmarks").empty()
        for(var i=0; i < array.length; i++){
            console.log("###################")
            console.log(array)
            if (array[i].children){
                printFolder(array[i])
                onClickOpen(array[i])
            }
            printBookmark(array[i])
        }
    }
    else{
        $("#errorMessage").modal("show")
        let string = 'Sorry, there are no bookmarks that are under the tag "' + tagName + '"'
        $("#errorBody").text(string)
    }
    console.log(array)
}

async function renderFolders(){
    if (arguments.length == 1){
        console.log("This is running")
        let final = await stored("newFolder")
        let title = final.title
        if (title.length >= 15){
            title = title.slice(0,11) + "..."
        }
        console.log(title.length)
        let drop = $("<a>", {
            "class": "dropdown-item btn-m hober dropdown-item-folder",
            "text": title,
            "id": "f" + final.id
        })
        drop.insertBefore($("#folderDivider"))
    }
    else{
        let isNew = false
        let folderArray = []
        let $folder = $("#folderMenu")[0].children
        data = await search
        findFolders(data, folderArray)
        console.log("this is folders")
        console.log(folderArray)
        for(var i=0; i < folderArray.length; i++){
            let title = folderArray[i].title
            if (title.length >= 15){
                title = title.slice(0,11) + "..."
            }
            console.log(title.length)
            let drop = $("<a>", {
                "class": "dropdown-item btn-m hober dropdown-item-folder",
                "text": title,
                "id": "f" + folderArray[i].id
            })
            $("#folderMenu").append(drop)
        }
        console.log(isNew)
        let check = await stored("newFolder")
        console.log(check)
        console.log("WWWOAWEOWAEAWE")
        if (check != undefined){
            for(var j=0; j < $folder.length; j++){
                let folderId = $folder[j].id.slice(1)
                console.log("this is folder id")
                console.log(folderId)
                if (check.id == folderId){
                    isNew = true
                    console.log("WWWOAWEOWAEAWE")
                }
            }
        }
        if (!isNew && check != undefined){
            let final = await stored("newFolder")
            let title = final.title
            if (title.length >= 15){
                title = title.slice(0,11) + "..."
            }
            console.log(title.length)
            let drop = $("<a>", {
                "class": "dropdown-item btn-m hober dropdown-item-folder",
                "text": title,
                "id": "f" + final.id
            })
            $("#folderMenu").append(drop)
        }
        
    
        let divider = $("<div>",{
            "class": "dropdown-divider",
            "id": "folderDivider"
        })
        let addNew = $("<div>",{
            "id": "dropdownAdd",
            "class": "dropdown-item btn-m hober",
            "style": "width: 160px",
            "text": "Add folder"
        })
        $("#folderMenu").append(divider)
        $("#folderMenu").append(addNew)
        addNew.on("click", function (){
            addFolder()
        })
    }
    
}

let destroy = function (id){
    return new Promise(function (resolve){
        chrome.storage.local.remove(id, function(){
            console.log(id)
            console.log("is cleared")
        })
    })
}

async function addFolder(){
    $('#newTagName').val('');
    $("#newTag").modal("show")
    $('#newTag').on('shown.bs.modal', function() {
        $('#newTagName').trigger('focus');
    });
    $("#saveTagChangesModal").off()
    $("#newTagName").off()
    $("#newTagName").on("keyup", function(event) {
        console.log("sakfkjsd")
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            event.preventDefault()
          // Cancel the default action, if needed
          // Trigger the button element with a click
            $("#saveTagChangesModal").trigger("click")
        }
    });
    $("#saveTagChangesModal").on("click", async function() {
        console.log("treyvaughn")
        let tagName = $("#newTagName")[0].value
        await create(tagName, "1")
        //$("#folderMenu").empty()
        console.log("Success")
        renderFolders(true)
        
    })
}

function addTag(){
    console.log("gafds")
    $('#newTagName').val('');
    $("#newTag").modal("show")
    $('#newTag').on('shown.bs.modal', function() {
        $('#newTagName').trigger('focus');
    });
    $("#saveTagChangesModal").off()
    $("#newTagName").off()
    $("#newTagName").on("keyup", function(event) {
        console.log("sakfkjsd")
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            event.preventDefault()
          // Cancel the default action, if needed
          // Trigger the button element with a click
            $("#saveTagChangesModal").trigger("click")
        }
    });
    $("#saveTagChangesModal").on("click", async function() {
        console.log("waddup")
        let tagName = $("#newTagName")[0].value
        let tags = await stored("tags")
        let tagArray = tags.split(",")
        tagArray.pop()
        for (var i=0; i < tagArray.length; i++){
            if (tagArray[i].toUpperCase() == tagName.toUpperCase()){
                return
            }
        }
        tags = tags + tagName.charAt(0).toUpperCase() + tagName.slice(1) +","
        await makeStorage("tags", tags)
        $("#tagMenu").empty()
        console.log("Success")
        await renderTags()
        
    })

}

function findFolders(data, array){
    for(var i=0; i < data.length; i++){
        if (data[i].children){
            array.push(data[i])
            findFolders(data[i].children, array)
        }
    }
}

async function renderTags(){
    if (textColour){
        $("#dropdownButton").css("color", "#ffffff")
    }
    $("#dropdownButton").css("background-color", bookmarkColourList[0])
    let tags = await stored("tags")
    tags = tags.split(",")
    tags.pop()
    for(var i=0; i < tags.length; i++){
        let drop = $("<a>", {
            "class": "dropdown-item btn-m hober dropdown-item-tag",
            "text": tags[i],
            "id": tags[i]
        })
        $("#tagMenu").append(drop)
    }
    let divider = $("<div>",{
        "class": "dropdown-divider"
    })
    let addNew = $("<div>",{
        "id": "dropdownAdd",
        "class": "dropdown-item btn-m hober",
        "style": "width: 160px",
        "text": "Add tags"
    })
    // document.getElementById("myForm").reset()
    addNew.on("click", function (){
        addTag()
    })
    $("#tagMenu").append(divider)
    $("#tagMenu").append(addNew)

    $(".dropdown-item-tag").on("click", function (){
        console.log(this.id)
        displayWithTag(this.id)
    })
    if (tags.length > 6){
        $("#tagMenu").css("height", "300px")
    }
    console.log(tags)
}


function initializeFolderOpen(){
    $(".folder").each( function () {
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




function sortBookmarks(){
    let first = true
    let curState = $("#dropdownButton").text()
    $(".dropdown-sort").on("click", async function() {
        onFocusOrFilter()
        let changeState = this.innerHTML
        console.log(changeState)
        if (first || curState != changeState){
            first = false
            if (changeState == "Default"){
                currentState = "default"
                hasBeenClicked = true
                $("#bookmarks").empty()
                for(var i=0; i < data.length; i++){
                    if (data[i].children){  
                        printFolder(data[i])
                        
                    }
                    else if (!data[i].children){
                        printBookmark(data[i])
                    }
                }
                initializeFolderOpen()

            }
            else if (changeState == "Popular"){
                currentState = "popular"
                hasBeenClicked = true
                $("#bookmarks").empty()
                for(var i=0; i < popularList.length;i++){
                    let object = findIt(data, popularList[i])
                    printBookmark(object)
                }
            }
            else if (changeState == "Newly added"){
                currentState = "Newly added"
                hasBeenClicked = true
                $("#bookmarks").empty()
                for(var i=data.length -1; i >= 0; i--){
                    if (data[i].children){  
                        printFolder(data[i])
                        
                    }
                    else if (!data[i].children){
                        printBookmark(data[i])
                    }
                }
                initializeFolderOpen()
            }
            else{
                console.log("nope")
            }
        }
        

    })
}


async function displayWithTag(tagName){
    let array = []
    await find(data, tagName, array)
    if (array.length != 0){
        onFocusOrFilter()
        $("#bookmarks").empty()
        for(var i=0; i < array.length; i++){
            console.log("###################")
            console.log(array)
            if (array[i].children){
                printFolder(array[i])
                onClickOpen(array[i])
            }
            printBookmark(array[i])
        }
    }
    else{
        $("#errorMessage").modal("show")
        let string = 'Sorry, there are no bookmarks that are under the tag "' + tagName + '"'
        $("#errorBody").text(string)
    }
    console.log(array)
}

async function checkIfTag(object, tag){
    let tagString = tag + ","
    let objectTag = await stored(object.id)
    console.log(objectTag)
    if (objectTag != undefined){
        console.log("hazas")
        if(objectTag.includes(tagString)){
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








function pickBlackOrWhite(colour){
    let red = colour.slice(1,3)
    red = parseInt(red, 16)
    let green = colour.slice(3,5)
    green = parseInt(green, 16)
    let blue = colour.slice(5,7)
    blue = parseInt(blue, 16)
    console.log(red*0.299 + green*0.587 + blue*0.114)
    if ((red*0.299 + green*0.587 + blue*0.114) > 110){
        
        return false
    }
    return true
}

function onSearchBarFocus(){
    
    $("#searchButton").focus(() => {
        onFocusOrFilter()
        $("#expandIcon").remove()
        if (!hasBeenClicked){
            hasBeenClicked = true
            let children = maxPerPage
            for(var i=children; popularList.length > i;i++){
                let object = findIt(data, popularList[i])
                printBookmark(object)
            }
        }
        
    })
    
    
}

function onFocusOrFilter(){
    $("#searchContainer").addClass("searchContainerFocus")
    let menuLength = $("#dropdownButton").css("width")
    $("#dropdownAdd").css("width", menuLength)
    $("#bookmarks").addClass("divFocus")
    $("#bookmarks").css("height", "65%")
    $("#bookmarks").scrollTop(0)
}


function checkIncep(object, data){
    let value = -1
    function checkInception(object, data, value){
        total = value + 1
        if (object.parentId > 1){
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

let create = function (name, parentId){
    return new Promise(function (resolve){
        chrome.bookmarks.create({
            "parentId": parentId,
            "title": name
        },  async function (folder){
            console.log(folder)
            await makeStorage("newFolder", folder)
            await stored("newFolder")
            resolve(folder)
        })
    })
}



var makeStorage = function (id, text){
    return new Promise(function (resolve, reject){
        chrome.storage.local.set({[id]: text})
        resolve(text)
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
    for (var i = 0; i < dataArray.length; i++){
        if (dataArray[i].id == objectId) {
            let object = dataArray[i]
            return object
            
        }
        else{
            if (dataArray[i].children) {
                if (innerfindIt(dataArray[i].children, objectId) != false){
                    return innerfindIt(dataArray[i].children, objectId)
                }
                
            }
            else{
                continue;
            }
        }
    }
    return false

}

function findIt(dataArray, objectId){
    let found = false
    let object;
    return innerfindIt(dataArray, objectId)
}



function printFolder(object){
    let fragment = document.createDocumentFragment();
    let folderDiv = document.createElement("div")
    folderDiv.className = "folder btn col-2 m-3 btn-sm"
    folderDiv.id = object.id
    folderDiv.style = "border: 2px solid " + bookmarkColourList[checkIncep(object, data)] +"; font-size: 120%; opacity: 0.6;border-radius: 1.5em; background-color:" + avgCol
    if (arguments.length == 2 && arguments[1] == true){
        folderDiv.style = "border: 2px solid " + bookmarkColourList[checkIncep(object, data)] +"; font-size: 120%;border-radius: 1.5em; background-color:" + avgCol
    }
    let bookmarkRowDivision = document.createElement("div")
    bookmarkRowDivision.className = "d-flex flex-row margin"
    bookmarkRowDivision.style = "overflow-wrap: anywhere;"

    let bookmarkText = document.createElement("p")
    bookmarkText.innerHTML = object.title
    if (object.title.length >= 50) {
        bookmarkText.style = "width:70%; font-size: 80%"
    }
    else{
        bookmarkText.style = "width:70%;"
    }
    
    bookmarkText.class = "d-inline-flex"
    if (arguments.length == 1){
        console.log("Im a fat phony")
        var bookmarkIcon = document.createElement("i")
        bookmarkIcon.innerHTML = "info"
        $(bookmarkIcon).addClass("d-inline-flex material-icons icon mt-1 item-info ml-auto")
        $(bookmarkIcon).on("click", function (e){
            event.stopPropagation()
            displayIconModal(object.id)
    
        })
        $(bookmarkIcon).hover(function(){
            $(bookmarkIcon).css("cursor", "pointer")
            $(bookmarkIcon).css("color", "white")
            $(bookmarkText).css("color", "black")
        }, function(){
            $(bookmarkIcon).css("cursor", "default")
            $(bookmarkIcon).css("color", "black")
            $(folderDiv).hover(function () {
    
            })
        })
        $(folderDiv).mouseenter(function(){
            if (!$(folderDiv).hasClass("open")){
                $(folderDiv).css("opacity", 1)
            }
            else{
                $(folderDiv).css("opacity", 0.6)
            }
            //$(folderDiv).css("background-color", bookmarkColourList[checkIncep(object, data)])
            $(bookmarkIcon).mouseenter(function(){
                $(bookmarkIcon).css("cursor", "pointer")
                $(bookmarkIcon).css("color", "white")
            }).mouseleave(function(){
                $(bookmarkIcon).css("cursor", "default")
                $(bookmarkIcon).css("color", "black")
    
            })
        }).mouseleave(function(){
            if (!$(folderDiv).hasClass("open")){
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
    if (arguments.length == 1){
        bookmarkRowDivision.appendChild(bookmarkIcon)
    }
    
    if (arguments.length == 2 && arguments[1] != true){
        document.getElementById(arguments[1]).after(fragment)
    }
    else{
        document.getElementById("bookmarks").appendChild(fragment)
    }

}

function findDomain(url){
    let expression = /https?:\/\/[a-zA-Z0-9_\.]+\//
    if (expression.exec(url)){
        let domain = expression.exec(url)[0]
        return domain
    }
    return false
}

function printBookmark(object, parent){
    console.log(object)
    let hasParent;
    if (arguments.length == 2){
        hasParent = true
    }
    else{
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

    bookmarkDiv.style = "background-color: " + bookmarkColourList[checkIncep(object, data)] +"; font-size: 120%; border-radius: 1.5em"


    let bookmarkClickable = document.createElement("a")
    bookmarkClickable.href = object.url
    bookmarkClickable.class = "m-3 clickable"
    bookmarkClickable.id = "a" + object.id

    let bookmarkRowDivision = document.createElement("div")
    bookmarkRowDivision.className = "d-flex flex-row-reverse margin"
    bookmarkRowDivision.style = "overflow-wrap: anywhere;"

    let bookmarkText = document.createElement("p")
    bookmarkText.innerHTML = object.title
    bookmarkText.className = "flex-fill"
    if (object.title.length >= 50) {
        if (textColour){
            bookmarkText.style = "color: #ffffff;width:70%; font-size: 80%"
        }
        else{
            bookmarkText.style = "width:70%; font-size: 80%"
        }
    }
    else{
        if (textColour){
            bookmarkText.style = "color: #ffffff; width:70%"
        }
        else{
            bookmarkText.style = "width:70%;"
        }
    }
    let domain = findDomain(object.url)
    console.log(domain)
    let favicon = document.createElement("img")
    // favicon.src = "chrome://favicon/" + domain
    // favicon.src = domain + "favicon.ico"

    // let sendMessage = "chrome-search://ntpicon/?size=24%401x&url=" + domain
    let sendMessage = "https://plus.google.com/_/favicon?domain=" + domain

    switch(domain){
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
        default:
            break;
    }

    favicon.src = sendMessage
    console.log(sendMessage)
    favicon.style = "width: 24px; height: 24px; margin: 4px 0px 0px 4px"
    

    let bookmarkIcon = document.createElement("i")
    bookmarkIcon.innerHTML = "info"
    bookmarkIcon.classList.add("d-inline-flex");
    bookmarkIcon.classList.add("material-icons");
    bookmarkIcon.classList.add("icon");
    bookmarkIcon.classList.add("mt-2");
    bookmarkIcon.classList.add("mr-1");
    bookmarkIcon.classList.add("item-info");
    // $(bookmarkIcon).addClass("d-inline-flex material-icons icon mt-2 mr-1 item-info")
    bookmarkIcon.id = "i" + object.id
    bookmarkIcon.addEventListener("click", function(e){
        e.preventDefault()
        displayIconModal(object.id)
    });
    // $(bookmarkIcon).on("click", function (e){
    //     e.preventDefault()
    //     displayIconModal(object.id)

    // })
    bookmarkIcon.addEventListener("mouseover", function(e){
        bookmarkIcon.style.cursor = "pointer"
        bookmarkIcon.style.color = "white"
        bookmarkText.style.color = "black"
    });
    bookmarkIcon.addEventListener("mouseout", function(e){
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

    $(bookmarkDiv).mouseenter(function(){
        if (textColour){
            $(bookmarkText).css("color", "black")
        }
        else{
            $(bookmarkText).css("color", "white")
        }
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
        if (textColour){
            $(bookmarkText).css("color", "white")
        }
        else{
            $(bookmarkText).css("color", "black")
        }
    })

    fragment.appendChild(bookmarkClickable)
    bookmarkClickable.appendChild(bookmarkDiv)
    bookmarkDiv.appendChild(bookmarkRowDivision)
    bookmarkRowDivision.appendChild(bookmarkIcon)
    bookmarkRowDivision.appendChild(bookmarkText)
    bookmarkRowDivision.appendChild(favicon)

    
    if (arguments.length == 2){
        document.getElementById(arguments[1]).after(fragment)
    }
    else{
        document.getElementById("bookmarks").appendChild(fragment)
    }

}

// Popular finding algorithm
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function onLoadApp(){
    let onLoad = await stored("onLoad")
    if (onLoad == "popular"){
        let list = []
        await getAllInside(list,data)
        popularList = sortDescend(list)
        popularList = removeDuplicates(popularList)
        let counter = 0
        let endIt = false
        while ($("#bookmarks").height() < ($("#bod").height()/3) || endIt){
            for(var i=0; i < 5; i++){
                let index = counter * 5 + i
                console.log(popularList[index])
                let object;
                if (index < popularList.length){
                    object = findIt(data, popularList[index])
                    printBookmark(object)
                    maxPerPage ++
                }
                else{
                    //Do nothing
                    endIt = true
                    break
                }
                
            }
            if (endIt){
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
        outerDiv.append(expandIcon)
        $("#bookmarks").append(outerDiv)
        //$("#bookmarks").append(expandIcon)
        expandIcon.on("click", function(){
            expandIcon.remove()
            onFocusOrFilter()
            let children = maxPerPage
            for(var i=children; popularList.length > i;i++){
                let object = findIt(data, popularList[i])
                printBookmark(object)
            }
            hasBeenClicked = true
        })
        expandIcon.hover(function(){
            expandIcon.css("cursor", "pointer")
        }, function(){
            expandIcon.css("cursor", "")
    
        })
    }
    else if (onLoad == "default"){
        console.log("heyo")
    }
}



async function renderPop(data){
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
    while ($("#bookmarks").height() < ($("#bod").height()/4)){
        for(var i=0; i < 5; i++){
            tester += 1
            let index = counter * 5 + i
            console.log(popularList[index])
            let object = findIt(data, popularList[index])
            console.log(object)
            printBookmark(object)
            maxPerPage ++
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
    expandIcon.on("click", function(){
        expandIcon.remove()
        onFocusOrFilter()
        let children = maxPerPage
        for(var i=children; popularList.length > i;i++){
            let object = findIt(data, popularList[i])
            printBookmark(object)
        }
        hasBeenClicked = true
    })
    expandIcon.hover(function(){
        expandIcon.css("cursor", "pointer")
    }, function(){
        expandIcon.css("cursor", "")

    })
}
function removeDuplicates(list){
    let idList = []
    for(var i=0; i < list.length;i++){
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



async function getAllInside(list, dataArray){
    for (var i=0; i < dataArray.length; i++){
        if(!dataArray[i].children){
            await findAllVisits(list, dataArray[i].id, dataArray[i].url)
        }
        else if (dataArray[i].children){
            await getAllInside(list, dataArray[i].children)
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


function getAverageRGB(imgEl) {

    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
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
    } catch(e) {
        /* security error, img on diff domain */
        return defaultRGB;
    }

    length = data.data.length;

    while ( (i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);

    return rgb;

}

function rgbToHex(r,g,b){
    let partOne = r.toString(16)
    let partTwo = g.toString(16)
    let partThree = b.toString(16)
    if (partOne.length == 1){
        partOne = "0" + partOne
    }
    if (partTwo.length == 1){
        partTwo = "0" + partTwo
    }
    if (partThree.length == 1){
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

function invertColour(r,g,b){
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





































