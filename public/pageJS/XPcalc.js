const delay = ms => new Promise(res => setTimeout(res, ms))
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
function turnOnSpinner() {
    $(".inModal").toggleClass("active")
    setTimeout(function() {
        $(".inModal").toggleClass("animation")
    })
}
function turnOffSpinner() {
    animationDuration = ($(".inModal.active").css("transition").split(" ")[1].split("s")[0])*1000
    setTimeout(function() {
        $(".inModal").toggleClass("animation")
    }, animationDuration)
    $(".inModal").toggleClass("active")
}
//NaN input prevention
$(document).ready(function() {
    $(".btn-add-progress").click(function() {
        var minutes = $("input:text").val();
        errorMessage.text(null)
        parseInt(minutes)
        skillName = $(".modal").find("h1").text().toLowerCase()
        if (isNaN(minutes) == true) {
            errorMessage.text("Please enter a number!")
            errorMessage.css("opacity", "1")
            $("input:text").val("");
        }
        else if (minutes == "") {
            errorMessage.text("Please enter a number!")
            errorMessage.css("opacity", "1")
            $("input:text").val("");
        }
        else {
            let loggedData = {
                skillname: skillName,
                minutes: minutes,
                calculatedXP: minutes*sessionStorage[skillName]
            }
            // let loggedDataJSON = JSON.stringify(loggedData)
            $.ajax({
                url: "/addMinutes",
                method: "PUT",
                data: loggedData,
            })
            // If it works you get this: { 'success': 'success' }
            // If the limit doesn't allow it you get this: { 'error': 'Limit exceeded' }
            .always(function() {
                turnOnSpinner()
            })
            //handle failed request
            .fail(function(jqXHR, textStatus, errorThrown) {
                alert("Request failed: " + textStatus + " - " + errorThrown)
                turnOffSpinner()
            })
            .done(function(data, textStatus, jqXHR) {
                if (data.success == "success") {
                    turnOffSpinner()
                    addMinutes(skillName,minutes)
                    $("input:text").val("");
                    errorMessage.text(null)
                    modal.toggleClass("show-modal")
                }
                if (data.error == "Limit exceeded") {
                    turnOffSpinner()
                    errorMessage.text("You have reached your daily limit!")
                    errorMessage.css("opacity", "1")
                    $("input:text").val("");
                }
            });
        }
    });
});
function progressbarCrop(currentXP, neededLvlXP, progressBar) {
    let progressBarCrop = (currentXP / neededLvlXP)*100
    progressBar.css("clip-path", "inset(0 0 0 "+progressBarCrop+"%)")
}
async function addMinutes(skill,minutes){
    let skillName = skill.toLowerCase()
    let detectedSkill = $(".elements").find("."+skillName)
    let currentXP = parseInt(detectedSkill.find("#currentXP").text())
    let functionMinutes = parseInt(minutes)
    let progressBar = detectedSkill.find(".progress-bar")
    xpInput = Math.round((parseInt(functionMinutes)*sessionStorage[skillName]))+currentXP
    if (xpInput < parseInt(detectedSkill.find("#neededLvlXP").text())) {
        detectedSkill.find("#currentXP").text(xpInput)
        progressbarCrop(xpInput, parseInt(detectedSkill.find("#neededLvlXP").text()), progressBar)
        $.getJSON("/skills", function(respondedData) {
            findStrongestStat(respondedData)
            findTotalXp(respondedData)
        });
    }
    else{
        let animationDurationFast = 500
        let animationDuration = ($(".progress-bar").css("transition").split(" ")[1].split("s")[0])*1000
        while (xpInput >= parseInt(detectedSkill.find("#neededLvlXP").text())) {
            xpInput = xpInput - parseInt(detectedSkill.find("#neededLvlXP").text())
            detectedSkill.find("#currentXP").text(parseInt(detectedSkill.find("#neededLvlXP").text()))
            progressbarCrop(parseInt(detectedSkill.find("#neededLvlXP").text()), parseInt(detectedSkill.find("#neededLvlXP").text()), progressBar)
            await delay(animationDuration)
            detectedSkill.find("#LvlValue").text(parseInt(detectedSkill.find("#LvlValue").text())+1)
            visualLevelUp()
            await delay(parseInt($(".elements").attr("data-timetakenforlvlup"))+200)
            $(".progress-bar").css("transition", "clip-path "+animationDurationFast/1000+"s")
            progressbarCrop(0, parseInt(detectedSkill.find("#neededLvlXP").text()), progressBar)
            await delay(animationDurationFast)
            detectedSkill.find("#currentXP").text(0)
            detectedSkill.find("#neededLvlXP").text(Math.round(parseInt(detectedSkill.find("#neededLvlXP").text())*1.15))
            $(".progress-bar").css("transition", "clip-path "+animationDuration/1000+"s")
            if (xpInput < parseInt(detectedSkill.find("#neededLvlXP").text())) {
                detectedSkill.find("#currentXP").text(xpInput)
                progressbarCrop(xpInput, parseInt(detectedSkill.find("#neededLvlXP").text()), progressBar)
                $.getJSON("/skills", function(respondedData) {
                    findStrongestStat(respondedData)
                    findTotalXp(respondedData)
                });
            }
        }
    }
}