
$(function calculateXpfromElement(){
    let mainElement = $(".elements")
    //select all mainElement child elements and put them in array
    let mainElementChildren = mainElement.children()
    //select all mainElement child elements and put them in array
    let mainElementChildrenArray = []
    for(let i = 0; i < mainElementChildren.length; i++){
        if (mainElementChildren[i].tagName != "BR"){
            mainElementChildrenArray.push(mainElementChildren[i])
        }
    }
    mainElementChildrenArray.forEach(element => {
        // let LvlValue = $(element).find("#LvlValue").text()
        let currentXP = $(element).find("#currentXP").text()
        let neededLvlXP = $(element).find("#neededLvlXP").text()
        let progressBar = $(element).find(".progress-bar")
        let progressBarCrop = (currentXP / neededLvlXP)*100
        progressBar.css("clip-path", "inset(0 0 0 "+progressBarCrop+"%)")
    });
});
//print out data from input field when button is pressed
$(document).ready(function() {
    $(".btn-add-progress").click(function() {
        var minutes = $("input:text").val();
        skillName = $(".modal").find("h1").text().toLowerCase()
        addMinutes(skillName,minutes)
    });
});
function progressbarCrop(currentXP, neededLvlXP, progressBar) {
    let progressBarCrop = (currentXP / neededLvlXP)*100
    progressBar.css("clip-path", "inset(0 0 0 "+progressBarCrop+"%)")
}
function addMinutes(skill,minutes) {
    let skillName = skill.toLowerCase()
    let detectedSkill = $(".elements").find("."+skillName)
    let currentXP = $(detectedSkill).find("#currentXP").text()
    let neededLvlXP = $(detectedSkill).find("#neededLvlXP").text()
    let progressBar = $(detectedSkill).find(".progress-bar")
    let newXP = parseInt(currentXP) + parseInt(minutes)
    $(detectedSkill).find("#currentXP").text(newXP)
    progressbarCrop(newXP, neededLvlXP, progressBar)
}


