var result;
var count = 0;
var objectValue;
var colours = ["#ED6A5A", "#F4F1BB", "#9BC1BC", "#2CC1CC", "#E6EBE0", "#4C56DB", "#916482"]
var colour1 = "#AED4E6"
var alph = "abcdefghijklmnopqrstuvwxyz".split("")

document.addEventListener("DOMContentLoaded", async() => {
    result = await search
    await title()
    let width = await findColNum()
    await grid2(result, width)
})

var search = new Promise(function (resolve, reject) {
    chrome.bookmarks.getTree(function (data) {
        if (data) {
            thingo = data[0].children[0].children;
            resolve(thingo)
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
    let isFolderBehind = true
    let data = result
    async function betterGrid(data, isBookmarkNext){
        for(var i=0; i < data.length; i++){
            if(data[i].children){
                await gridFolder(data[i], x)
                let isBookmarkNext = true;
                let checkDataIncep = data[i]
                if (checkIncep(data[i], result) >= 1){
                    while (checkIncep(checkDataIncep, result) >= 1) {
                        checkDataIncep = findIt(result, data[i].parentId)
                    }
                }
                let place = findIndex(checkDataIncep, result)
                if (result[place-1].children){
                    isFolderBehind = false
                }
                if (result[place+1].children){
                    isBookmarkNext = false
                }
                await betterGrid(data[i].children, isBookmarkNext)
            }
            else{
                if (checkIncep(data[i], result) >= 1 && i == (data.length - 1) && isBookmarkNext){
                    await gridBookmark(data[i], x, "last")
                }
                else if (checkIncep(data[i], result) >= 1 && i == (data.length - 1) && isFolderBehind){
                    await gridBookmark(data[i], x, "folderNext")
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
        if (position == "folderNext"){
            styleVariable += "margin-top:-1px;"
        }
        else if (position == "last"){
            styleVariable += "border-bottom: 1px solid;"
        }
    }

    let backgroundColour = colour1
    if (incep >= 1){
        backgroundColour = pSBC(incep * -0.2, colour1)
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
            $(div).css("background-color", colour1)
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
        if (online){
            simpleHover($div, online, colours[i], pSBC((incep) * 0.2, colour1))
        }
        else{
            simpleHover($div, online, colours[i], pSBC((incep) * -0.2, colour1))
        }
    }
    rowDiv.appendTo("#grid")

}

async function gridFolder(object, x){
    let globOnline = true;
    let folderTag = await stored(String(object.id))
    if (folderTag == undefined){
        globOnline = false
    }
    let rowDiv = $("<div>", {"class":"row d-flex", id: "r" + String(object.id)})
    let div = $("<div>", {
        "class": "p-1 col-5",
        "id": "@" + String(object.id),
        "style": "border-top: 1px solid;border-left: 1px solid;border-bottom: 1px solid;"
    })
    let p = $("<p>", {
        "text": object.title,
        "class": "agrid",
        "style": "flex: 1; display: flex"
    })

    $(rowDiv).hover(function () {
        $(div).css("background-color", "#2BBBAD")
        }, function () {
            $(div).css("background-color", colour1)
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
        let identification = String(alph[i]) + String(object.id)
        let styleAttribute = "border-bottom: 1px solid; "
        if (i%2==0){
            styleAttribute += "border-left: 1px solid;border-right: 1px solid;"
        }
        let $div = $("<div>", {"class":"grid p-1 flex-fill", id: identification, "style": styleAttribute})
        $div.on("click", async function(){
            let type = identification.charAt(0)
            let id = identification.slice(1)
            let folderTag = await stored(String(id))
            let alreadyThere = await checkIfAlready(folderTag, type)
            if (alreadyThere){
                await removeStorage($div, id, type)
                await removeStorageFolder($div, id, type, object.children)
            }
            else{
                await setStorage($div, id, type)
                await setStorageFolder($div, id, type, object.children)
            }
            
        })
        $div.appendTo(rowDiv)
        //First check if it has any tag at all bcz most of them won't
        let incep = checkIncep(object,result)
        if (online){
            simpleHover($div, online, colours[i], pSBC((incep + 1) * 0.2, colour1))
        }
        else{
            simpleHover($div, online, colours[i], pSBC((incep + 1) * -0.2, colour1))
        }
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
    titleTitle.style = "border-style:solid none solid solid; border-width: 1px; background-color: #AED4E6;"
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

//Need to fix nested hover (not the folder's folder but the folder's folder's bookmarks )
async function setStorageFolder(element, id, type, data){
    for(var i=0; i < data.length; i++){
        let bookmarkId = data[i].id
        let element = $("#" + type + bookmarkId)
        console.log()
        await setStorage(element, bookmarkId, type)
        if (data[i].children){
            await setStorageFolder(element, id, type, data[i].children)
        }
    }
}

async function removeStorageFolder(element, id, type, data){
    console.log("ooga boogs")
    for(var i=0; i < data.length; i++){
        let bookmarkId = data[i].id
        let element = $("#" + type + bookmarkId)
        console.log()
        await removeStorage(element, bookmarkId, type)
        if (data[i].children){
            await removeStorageFolder(element, id, type, data[i].children)
        }
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
    console.log(prev)
    if(prev && prev != ","){
        newTag = prev + tags[tagIndex] + "," 
    }
    else {
        newTag = tags[tagIndex] + ","
    }
    if (prev == undefined || !(prev.includes(tags[tagIndex]))){
            await makeStorage(id, newTag)
    }
    element.css("background-color", colours[index])
    let newID = element[0].id.slice(1)
    let object = findIt(result, newID)
    let score = checkScore(object)
    let background = pSBC((score + 2) * 0.2, colour1)
    simpleHover(element, true, colours[tagIndex], background)

    
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
    let backgroundCol = colour1
    let score = checkScore(object)
    backgroundCol = pSBC(score * -0.2, colour1)
    element.css("background-color", backgroundCol)
    simpleHover(element, false, colours[index], backgroundCol)


}
function checkScore(obj){
    let inc = checkIncep(obj,result)
    let chi = 0
    if (obj.children){
        chi = 1
    }
    return (inc + chi)

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

let pSBC=(p,c0,c1,l)=>{
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