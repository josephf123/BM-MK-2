(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){

    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); // Note: https protocol here
    
    ga('create', 'UA-175257786-1', 'auto');
    
    ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
    
    ga('require', 'displayfeatures');
    
    ga('send', 'pageview', "/options.html");
//Whenever a colour is selected, make all the buttons etc change in order to make that the theme of the page
//Make tag manager consistent with the other two pages
//Add favicons into home screen
//Make it easy to create folders and add and delete bookmarks
//Make it easy to add and delete tags
let result;
let moreOptionsClicked = false
let colourConfig;
let allChecked = false
let currentState = "colour"
let currentHomeState;
let colourOptions = [
    "114B5F-03A0B5", "317773-E2D1F9", "48639C-82A0BC", "095256-D17A22","364156-D66853", "8AAAE5-FFFFFF", "A23B72-247BA0","067BC2-F18F01","644536-B2675E",
    "095256-E1612A", "446E80-A23B72", "8F3985-A675A1",
    "5158BB-F18F01","067BC2-685470", "BC5D2E-FBCA9A", "2274A5-FF7733", "446E80-B1DDCA", "0277BD-00695C",
    "247BA0-CA596E", "50635B-BDA63F", "247222-93C0A4", "247BA0-93C0A4","1D2F6F-FAC748",
    "685470-BC5D2E",  "095256-F25F5C", "C0596E-F18F01", "4E6474-61CC3D",  "067BC2-B1DDCA",                                    
]
let currentBackCol;
let currentBookCol;

var search = new Promise(function (resolve, reject) {
    chrome.bookmarks.getTree(function (data) {
        if (data) {
            result = data[0].children[0].children;
            resolve(data)
        }
    })
})



document.addEventListener('DOMContentLoaded', async function(){
    currentHomeState = await stored("home")
    await search
    colourConfig = await stored("colConfig")
    colourSpecify()
    if (colourConfig == "s"){
        $("#singleColour").addClass("focused")
        // currentBackCol = await stored("colourOrder")
        // currentBackCol = "#" + currentBackCol.slice(0,6)
        // $("body").css("background-color", currentBackCol)
        // currentBookCol = await stored("colourOrder")
        // currentBookCol = "#" + currentBookCol.slice(7)
    }
    else if (colourConfig == "r"){
        await makeStorage("colourOrder", "random")
        $("#rotateColour").addClass("focused")
        console.log($("body"))
    }
    else{
        console.log("nope")
    }
    let dataCol = await stored("colourOrder")
    
    if (dataCol == "random"){
        let arr = await stored("colourCollection")
        let randIndex = Math.round(Math.random() * arr.length)
        if (randIndex > (arr.length - 1)){
            randIndex = arr.length - 1
        }
        dataCol = arr[randIndex]
    }
    //Make it one of the random ones if on rotate
    let backCol = dataCol.slice(0,6)
    let bookCol = dataCol.slice(7)

    $("body").css("background-color", "#" + backCol)

    showPreview()

    if (colourConfig == "r"){
        $("#backgroundColour").val("Rotating") 
        $("#bookmarkColour").val("Rotating") 
    }
    else{
        $("#backgroundColour").val(backCol) 
        $("#bookmarkColour").val(bookCol) 
    }

    $("#colourPicker").css("border", "1.5px solid #" + bookCol)
    $("#selectOwn").css("border", "1.5px solid #" + bookCol)
    

    $("#tagPage").on("click", function (){
        window.location.href = "tagManage.html"
    })
    $("#homePage").on("click", function (){
        console.log("This sucks")
        window.location.href = "newTab.html"
    })
    $("#clearTags").on("click", async function (){
        await clearTags(result)
        alertFunction("successfully cleared tags", "success")
    })
    $("#clearInfo").on("click", async function (){
        await clearInfo(result)
        alertFunction("successfully cleared info", "success")
    })
    $("#confirmButton").on("click", async function (){
        let bookmarkColour = $("#bookmarkColour")[0].value
        let backgroundColour = $("#backgroundColour")[0].value
        if (isHexColor(backgroundColour) && isHexColor(bookmarkColour)){
            if (backgroundColour == bookmarkColour){
                alertFunction("Error: Have two different colours for the background and bookmarks", "error")
            }
            else{
                let string = backgroundColour + "-" + bookmarkColour
                await makeStorage("colourOrder", string)
                await makeStorage("colourCollection", string)
                alertFunction("Successfully saved colours", "success")
                location.reload()
            }
        }
        else{
            alertFunction("Error: Please enter valid hex codes", "error")
        }
        console.log(bookmarkColour)
    })
    $("#resetButton").on("click", async function (){
        await makeStorage("colourOrder", "114B5F-03A0B5")
        await makeStorage("colourCollection", "114B5F-03A0B5")
        $("#backgroundColour").val("114B5F") 
        $("#bookmarkColour").val("03A0B5") 
        alertFunction("Successfully reset colours", "success")
        location.reload()

    })
    $(".optButX").hover(function(){
        console.log("sdf")
        $(this).css("background-color", "white")
        $(this).css("border-width", "0.08em")
        $(this).css("border-color", "#5F9EA0")
    }, function(){
        $(this).css("background-color", "#5F9EA0")
        console.log("qqq")
    })
    $("#rotateColour").on("click", async function(){
        await makeStorage("colConfig", "r")
        colourConfig = "r"
        checkForDisabled()
        colourSpecify()
    })
    $("#singleColour").on("click", async function(){
        await makeStorage("colConfig", "s")
        colourConfig = "s"
        manyCheckVerify()
        colourSpecify()
        location.reload()
    })
    $("#selectAll").on("click", async function() {
        if (allChecked == false){
            let selectedArr = []
            for(var i=0; i< colourOptions.length;i++){
                document.getElementById("$" + i).checked = true
                selectedArr.push(colourOptions[i])
            }
            await makeStorage("colourCollection", selectedArr)
            allChecked = true
        }
        else if (allChecked == true){
            let selectedArr = []
            for(var i=0; i< colourOptions.length;i++){
                document.getElementById("$" + i).checked = false
            }
            if (selectedArr.length == 0){
                selectedArr.push("114B5F-03A0B5")
            }
            await makeStorage("colourCollection", selectedArr)
            allChecked = false
        }
        
    })
    $("#colourButton").on("click", function(){
        $("#memoryOption").css("display", "none")
        $("#configurationOption").css("display", "none")
        $("#colourOption").css("display", "")

    })
    $("#memoryButton").on("click", function(){
        $("#colourOption").css("display", "none")
        $("#configurationOption").css("display", "none")
        $("#memoryOption").css("display", "")
    })
    $("#configurationButton").on("click", function(){
        $("#memoryOption").css("display", "none")
        $("#colourOption").css("display", "none")
        $("#configurationOption").css("display", "")
    })
    if (currentHomeState == "popular"){
        $("#popularHomeAction").addClass("focused")
    }
    else if (currentHomeState == "default"){
        $("#defaultHomeAction").addClass("focused")
    }
    $("#defaultHomeAction").on("click", async function (){
        currentHomeState = "default"
        await makeStorage("home", "default")
    })
    $("#popularHomeAction").on("click", async function (){
        currentHomeState = "popular"
        await makeStorage("home", "popular")
    })
    showMoreOptions()
    checkWhenLoad()
    let conButtons = ["#colourButton", "#memoryButton", "#configurationButton"]
    buttonHovering(conButtons, "#" + bookCol)
    let chosingButtons = ["#singleColour", "#rotateColour"]
    buttonHovering(chosingButtons, "#" + bookCol)
    let homeButtons = ["#defaultHomeAction", "#popularHomeAction"]
    buttonHovering(homeButtons, "#" + bookCol)
    let memoryButtons = ["#clearTags", "#clearInfo"]
    buttonHovering(memoryButtons, "#" + bookCol, true)

    $("#flipCol").on("click", async function(){
        let dataCol = await stored("colourOrder")
        let backCol = dataCol.slice(0,6)
        let bookCol = dataCol.slice(7)  
        console.log(backCol)
        console.log(bookCol)
        let colCombo = bookCol + "-" + backCol
        console.log(colCombo)
        await makeStorage("colourOrder", colCombo)
        await makeStorage("colourCollection", colCombo)
        location.reload()
    })
})




function changeButtonColour(colour){
    //Make all button colours the same
    $(".buttonCol").each(function(index){
        $(this).css("background-colour", colour)
    })
}


// function checkHomeState(){
//     if (currentHomeState == "default"){
//         console.log("hello it is i")
//         $("#defaultHomeAction").removeClass("btn-outline-warning")
//         $("#defaultHomeAction").addClass("btn-warning")
//         $("#popularHomeAction").removeClass("btn-warning")
//         $("#popularHomeAction").addClass("btn-outline-warning")
//     }
//     else if (currentHomeState == "popular"){
//         console.log("whoahodshohasdohf")
//         $("#popularHomeAction").removeClass("btn-outline-warning")
//         $("#popularHomeAction").addClass("btn-warning")
//         $("#defaultHomeAction").removeClass("btn-warning")
//         $("#defaultHomeAction").addClass("btn-outline-warning")

//     }
// }


function checkForDisabled(){
    for(var i=0; i < colourOptions.length; i++){
        document.getElementById("$" + i).disabled = false
    }
}

async function manyCheckVerify(){
    let many = 0
    for(var i=0; i < colourOptions.length; i++){
        if (document.getElementById("$" + i).checked){
            many += 1
        }
    }
    if (many > 1){
        for(var i=0; i < colourOptions.length; i++){
            document.getElementById("$" + i).checked = false
        }
    }
    await makeStorage("colourCollection", "114B5F-03A0B5")
    await makeStorage("colourOrder", "114B5F-03A0B5")
    document.getElementById("$0").checked = true
}

async function checkWhenLoad(){
    if (colourConfig == "s"){
        let colOrder = await stored("colourOrder")
        console.log(colOrder)

        for(var i=0; i < colourOptions.length; i++){
            if (colourOptions[i] == colOrder){
                document.getElementById("$" + i).checked = true
            }
        }
    }
    else if (colourConfig == "r"){
        let colArray = await stored("colourCollection")
        for(var i=0; i < colourOptions.length; i++){
            for(var j=0; j < colArray.length; j++){
                if (colArray[j] == colourOptions[i]){
                    document.getElementById("$" + i).checked = true
                }
            }
        }
    }
}


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

function changeFocus(obj, col){
        if ($(obj).hasClass("focused")){
            $(obj).css("background-color", col)
            $(obj).hover(function(){
                $(obj).css("background-color", "transparent")
            }, function(){
                $(obj).css("background-color", col)
            })
        }
        else{
            console.log("what what what ")
            $(obj).css("background-color", "transparent")
            $(obj).hover(function(){
                $(obj).css("background-color", col)
            }, function(){
                $(obj).css("background-color", "transparent")
            })
        }
    
}



function colourSpecify(){
    if (colourConfig == "s"){
        $("#selectAllDiv").css("display", "none")
    }
    else if (colourConfig == "r"){
        $("#selectAllDiv").css("display", "")
    }
}




function displayDemoColour(colourString, i){
    let backCol = "#" + colourString.slice(0,6)
    let bookCol = "#" + colourString.slice(7)
    let outerDiv = $("<div>", {
        "class": "m-3",
        "style": "flex-direction: row;"
    })
    let checkbox = $("<input>", {
        "type": "checkbox",
        "id": "$" + i,
        "class": "checkboxes"
    })
    let backEl = $("<div>", {
        "class": "btn mx-4",
        "style": "background-color:" + backCol + "; width: 80%;"
    })
    let bookEl = $("<div>", {
        "class": "d-flex btn",
        "style": "background-color:" + bookCol + "; width: 70%; margin: 0 auto; justify-content: center",
        "text" : "Bookmark"
    })
    backEl.append(bookEl)
    outerDiv.append(checkbox)
    outerDiv.append(backEl)
    $("#optionColour").append(outerDiv)
}

function showMoreOptions(){
    //Make it so a thing appears on the right hand side that can help pick colour themes from a lot of options
    $("#multipleColours").css("display", "")
    console.log("do stuff")
    for(var i=0; i< colourOptions.length;i++){
        displayDemoColour(colourOptions[i], i)
    }
    $(".checkboxes").on("click", async function(){
        let id = this.id.slice(1)
        if (colourConfig == "s"){
            let obj = document.getElementById(this.id)
            if (obj.checked == true){
                // disableCheck(id)
                unCheckOthers(id)
                storeColour(id)
            }
            else{
                console.log("Wait...")
                console.log("melon")
                //If the box is unchecked, it goes back to the original colour scheme, number 0
                let colCombination = colourOptions[0]
                await makeStorage("colourOrder", colCombination)
                await makeStorage("colourCollection", colCombination)
                $("#toggling").css("display", "none")
            }
        }
        else if (colourConfig == "r"){
            let selectedArr = []
            for(var i=0; i< colourOptions.length;i++){
                if (document.getElementById("$" + i).checked){
                    selectedArr.push(colourOptions[i])
                }
            }
            if (selectedArr.length == 0){
                selectedArr.push("247BA0-93C0A4")
            }
            await makeStorage("colourCollection", selectedArr)
        }

        
        
        console.log(id)
    })
}

function unCheckOthers(index){
    for(var i=0; i< colourOptions.length;i++){
        if (i != index){
            console.log(i, index)
            document.getElementById("$" + i).checked = false
        }
    }
}

async function storeColour(index){
    let colCombination = colourOptions[index]
    await makeStorage("colourOrder", colCombination)
    await makeStorage("colourCollection", colCombination)
    location.reload()
    

}

function disableCheck(index){
    for(var i=0; i< colourOptions.length;i++){
        if (i != index){
            console.log(i, index)
            document.getElementById("$" + i).disabled = true
        }
    }
    console.log("poggers")
    console.log(index)
}

function undisableCheck(index){
    for(var i=0; i< colourOptions.length;i++){
        console.log(i, index)
        document.getElementById("$" + i).disabled = false
    }
}

async function showPreview(){
    let dataCol;
    if (colourConfig == "r"){
        let arr = await stored("colourCollection")
        let randIndex = Math.round(Math.random() * arr.length)
        console.log(arr.length, randIndex, "h")
        if (randIndex > (arr.length - 1)){
            randIndex = arr.length - 1
        }
        dataCol = arr[randIndex]
    }
    else{
        dataCol = await stored("colourOrder")
    }
    console.log("the data col is", dataCol)
    let backCol = dataCol.slice(0,6)
    let bookCol = dataCol.slice(7)
    $("#demoBackground").css("background-color", "#" + backCol)
    $(".demoBookmark").css("background-color", "#" + bookCol)
    $("#toggling").css("display", "")
}

    // $("#backgroundColour").on("keyup", function(){
    //     let col = $("#backgroundColour")[0].value
    //     if (isHexColor(col)){
    //         chrome.storage.local.set({"colour": col}, function(){
    //             console.log("This is the thing: "+ col)
    //         })
    //         console.log("this")
    //     }
    //     else{
    //         console.log("gaq")
    //     }
    // })
var stored = function (id){
    return new Promise(function (resolve, reject){
        chrome.storage.local.get([id], function (res) {
            resolve(res[id])
    
        })
    })
}


var makeStorage = function (id, text){
    return new Promise(function (resolve, reject){
        chrome.storage.local.set({[id]: text})
        resolve(text)
    })
}

function alertFunction(message, fun){

    if (fun == "error"){
        $("#alertz").hide()
        document.getElementById("alertx").innerHTML = message + '<a href="#" class="close" id="linkClosex">&times;</a>'
        $("#alertx").show()
        $("#linkClosex").on("click", function(){
            $("#alertx").hide()
        })
    }
    if (fun == "success"){
        $("#alertx").hide()
        document.getElementById("alertz").innerHTML = message + '<a href="#" class="close" id="linkClose">&times;</a>'
        $("#alertz").show()
        $("#linkClose").on("click", function(){
            $("#alertz").hide()
        })
    }
    
}

function isHexColor (hex) {
    return typeof hex === 'string'
        && hex.length === 6
        && !isNaN(Number('0x' + hex))
  }

async function clearInfo(res){
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
async function clearTags(res){
    for(var i=0; i < res.length;i++){
        if(res[i].children){
            chrome.storage.local.remove(res[i].id, function(){
                console.log("All are cleared!")
            })
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
