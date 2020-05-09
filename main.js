
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


let maxPerPage = 0



async function findImgUrl(){
    imgUrl = await getURL()
    await imageLoad(imgUrl)
    // console.log(imgUrl)
    // img.crossOrigin = '';
    // img.src = imgUrl    
    let rgbCol = getAverageRGB(img)
    avgCol = rgbToHex(rgbCol["r"], rgbCol["g"], rgbCol["b"])
    console.log(avgCol)
    console.log("dfsf")
    let invertedRGB = invertColour(rgbCol["r"], rgbCol["g"], rgbCol["b"])
    hexCol = rgbToHex(invertedRGB["r"], invertedRGB["g"], invertedRGB["b"])
    console.log("this")
    
}

function imageLoad(src){
    return new Promise((resolve,reject) =>{
        img = new Image();
        img.onload = () => resolve(img)
        img.src = imgUrl
        img.crossOrigin = '';
    })

}

async function getURL(){
    let data = await fetch("https://api.unsplash.com/photos/random?count=1&collections=155105&client_id=a4cc58d9f413a6bf9645e3b03cfb04c23ee7e3bfb2d86b72ada163eef96ecc15")
    let source = await data.json()
    source = source[0]["urls"]["regular"]
    return source
}

let randomColours = ["D17A22","095256","BC5D2E","FF7733","F7B538","17BEBB","61CC3D","59CD90","067BC2","E1612A","F25F5C",
                    "247BA0","446E80","D62828","F77F00","FCBF49","FDC6B5","fbca9a","5158BB","2E86AB","A23B72","F18F01",
                    "C73E1D","2274A5","32936F","95D9C3","388697", "685470", "B1DDCA", "A9B3CE", "C0596E", "4E6474"]


chrome.runtime.onInstalled.addListener(async function() {
    await makeStorage("tags", "Work,Entertainment,For Later,")
    await makeStorage("colour", "2BBBAD")
})
let randomNum1 = Math.round(Math.random() * (randomColours.length - 1))
let hexCol = randomColours[randomNum1]
// randomColours[randomNum1]

document.addEventListener("DOMContentLoaded", async() => {
    let rgbofHex = hexToRgb(hexCol)
    let inverted = invertColour(rgbofHex["r"], rgbofHex["g"], rgbofHex["b"])
    let invert = rgbToHex(inverted["r"], inverted["g"], inverted["b"])
    console.log(hexCol)
    console.log(invert)
    if (Math.random() > 0.5){
        let temp = hexCol
        hexCol = invert
        invert = temp
    }
    console.log(avgCol)
    avgCol = invert
    //avgCol = pSBC(-0.7, "#" + invert)
    //avgCol = avgCol.slice(1)
    $("#bod").css("background-color", invert)
    //await findImgUrl()
    let hexCol1 = "#" + hexCol
    let hexCol2 = pSBC(-0.4, hexCol1)
    console.log(hexCol1)
    let hexCol3 = pSBC(-0.8, hexCol1)
    bookmarkColourList = [hexCol1, hexCol2 , hexCol3 ]
    textColour = pickBlackOrWhite(bookmarkColourList[0])
    data = await search
    let backImg = "url(" + imgUrl + ")"
    $("#bod").css("background-image", backImg)
    console.log("testing")
    console.log(data)
    renderPop(data)
    console.log("testt")
    await renderTags()
    onSearchBarFocus()
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
    $("#bookmarks").on("mouseover", function (){
        $(this).css("opacity", 1)
    })
    sortBookmarks()
    await renderFolders()

})

async function renderFolders(){
    let newlyPressed = false
    if (arguments.length == 1){
        newlyPressed = true
    }
    if (newlyPressed){
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
        console.warn($folder)
        console.log(isNew)
        let check = await stored("newFolder")
        console.log(check)
        console.log("WWWOAWEOWAEAWE")
        for(var j=0; j < $folder.length; j++){
            let folderId = $folder[j].id.slice(1)
            console.log("this is folder id")
            console.log(folderId)
            if (check.id == folderId){
                isNew = true
                console.log("WWWOAWEOWAEAWE")
            }
        }
        if (!isNew){
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

    console.log(tags)
}


function initializeFolderOpen(){
    $(".folder").each( function () {
        console.log("fdsfd")
        let object = findIt(result, this.id)
        onClickOpen(object)

    })
}

function onClickOpen(object) {
    let buttonId = "#" + String(object.id)
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
                    onClickOpen(findIt(result, object.children[i].id))
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
    let currentState = $("#dropdownButton").text()
    $(".dropdown-sort").on("click", function() {
        onFocusOrFilter()
        let changeState = this.innerHTML
        if (first || currentState != changeState){
            first = false
            if (changeState == "Default"){
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
                for(var i=0; i < popularList.length;i++){
                    let object = findIt(data, popularList[i])
                    printBookmark(object)
                }
            }
        }
        

    })
}


async function displayWithTag(tagName){
    let array = []
    async function find(data){
        for(var i=0; i< data.length;i++){
            if (await checkIfTag(data[i], tagName)){
                console.log("123")
                array.push(data[i])
            }

            // if (data[i].children){
            //     if (await checkIfTag(data[i], tagName)){
            //         console.log("123")
            //         array.push(data[i])
            //     }
            //     find(data[i].children)
            // }
            // else{
            //     if (await checkIfTag(data[i], tagName)){
            //         console.log("123")
            //         array.push(data[i])
            //     }
            // }
        }
    }
    await find(data)
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
    if ((red*0.299 + green*0.587 + blue*0.114) > 150){
        return false
    }
    return true
}

function onSearchBarFocus(){
    $("#searchButton").focus(() => {
        onFocusOrFilter()
        

        let children = maxPerPage
        for(var i=children; popularList.length > i;i++){
            let object = findIt(data, popularList[i])
            printBookmark(object)
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

function printFolder(object){
    let fragment = document.createDocumentFragment();
    let folderDiv = document.createElement("div")
    folderDiv.className = "folder btn col-2 m-3 btn-sm"
    folderDiv.id = object.id
    folderDiv.style = "border: 2px solid " + bookmarkColourList[checkIncep(object, data)] +"; font-size: 120%; opacity: 0.3; background-color:" + avgCol

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
        $(folderDiv).hover(function () {

        })
    })

    $(folderDiv).mouseenter(function(){
        if (!$(folderDiv).hasClass("open")){
            $(folderDiv).css("opacity", 1)
        }
        else{
            $(folderDiv).css("opacity", 0.3)
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
            $(folderDiv).css("opacity", 0.3)
        }

        //$(folderDiv).css("background-color", "white")
    })

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
    bookmarkRowDivision.appendChild(bookmarkIcon)
    if (arguments.length == 2){
        document.getElementById(arguments[1]).after(fragment)
    }
    else{
        document.getElementById("bookmarks").appendChild(fragment)
    }

}

function printBookmark(object, parent){
    let hasParent = (arguments.length == 2) ? true : false
    let fragment = document.createDocumentFragment();
    let bookmarkDiv = document.createElement("div")
    bookmarkDiv.className = "bookmark btn col-2 m-3 btn-sm"
    bookmarkDiv.id = object.id
    //Problem with incep
    console.log(checkIncep(object, data))
    console.log(bookmarkColourList)
    if (hasParent){
        bookmarkDiv.style = "background-color: " + avgCol +";border-radius: 13px; font-size: 120%; border: 3px solid" + bookmarkColourList[0]
        textColour = pickBlackOrWhite(avgCol)

    }
    else{
        bookmarkDiv.style = "background-color: " + bookmarkColourList[checkIncep(object, data)] +"; font-size: 120%;"

    }

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
    bookmarkRowDivision.appendChild(bookmarkText)
    bookmarkRowDivision.appendChild(bookmarkIcon)
    if (arguments.length == 2){
        document.getElementById(arguments[1]).after(fragment)
    }
    else{
        document.getElementById("bookmarks").appendChild(fragment)
    }

}

// Popular finding algorithm
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function renderPop(data){
    let list = [];
    await getAllInside(list, data)
    console.log(list)
    popularList = sortDescend(list)
    popularList = removeDuplicates(popularList)
    let counter = 0
    console.log($("#bookmarks").height())
    console.log($("#bod").height())
    while ($("#bookmarks").height() < ($("#bod").height()/3)){
        for(var i=0; i < 5; i++){
            let index = counter * 5 + i
            let object = findIt(data, popularList[index])
            printBookmark(object)
            maxPerPage ++
        }
        counter++
    }
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

var stored = function (id){
    return new Promise(function (resolve, reject){
        chrome.storage.local.get([id], function (res) {
            resolve(res[id])
    
        })
    })
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





































