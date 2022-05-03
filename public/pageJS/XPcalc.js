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
// $(document).ready(function() {
//     let mainElement = $(".elements")
//     //select all mainElement child elements and put them in array
//     let mainElementChildren = mainElement.children()
//     //select all mainElement child elements and put them in array
//     let mainElementChildrenArray = []
//     for(let i = 0; i < mainElementChildren.length; i++){
//         if (mainElementChildren[i].tagName != "BR"){
//             mainElementChildrenArray.push(mainElementChildren[i])
//         }
//     }
//     mainElementChildrenArray.forEach(element => {
//         // let LvlValue = $(element).find("#LvlValue").text()
//         let currentXP = $(element).find("#currentXP").text()
//         let neededLvlXP = $(element).find("#neededLvlXP").text()
//         let progressBar = $(element).find(".progress-bar")
//         let progressBarCrop = (currentXP / neededLvlXP)*100
//         progressBar.css("clip-path", "inset(0 0 0 "+progressBarCrop+"%)")
//     });
// });