const modal = $(".modal");
const errorMessage = $(".modal").find(".error-handler")
//fetch skill data from server response
function textChangeInsideModal() {
    $(".btn-progress").click(function() {
        let newText = $(this).parent().parent().find(".title").text()
        $(".modal h1").text(newText.toUpperCase())
        $(".modal p:first").text(`of ${newText.toUpperCase()} related activities`)
        modal.addClass("show-modal");
    });
}
function openModal() {
    $(".btn-progress").click(function() {
        modal.addClass("show-modal");
    });
}
//detect click outside modal
function clickOutsideModal() {
    $(document).click(function(event) {
        if ($(event.target).hasClass("modal")||$(event.target).hasClass("close-button")) {
            modal.removeClass("show-modal");
            errorMessage.text(null)
        }
    });
}
// function closeModalOnInputConfirm() {
//     $(".btn-add-progress").click(function() {
//         modal.toggleClass("show-modal");
//     });
// }
//add ENTER key event listener on modal 
function addEnterKeyListener() {
    $(".modal").keypress(function(e) {
        if (e.which == 13) {
            $(".btn-add-progress").click();
        }
    });
}

function visualLevelUp() {
    //track how much time function is taking
    let startTime = new Date();
    skillName = $(".modal").find("h1").text().toLowerCase();
    targetSkill = $(".element."+skillName);
    levelUpSign = $(targetSkill).find(".levelUpFlexContainer");
    animationDuration = ($(".levelUpTransition").css("transition").split(" ")[1].split("s")[0])*1000
    animationDurationFlex = ($(".levelUpFlex").css("transition").split(" ")[1].split("s")[0])*1000
    //select all child elements of targetSkill except element with class "levelUpFlexContainer"
    targetSkill.children().not(".levelUpFlexContainer").each(function() {
        let targetElement = $(this);
        targetElement.toggleClass("levelUpTransition")
        targetElement.toggleClass("levelUpOpacity")
    });
    setTimeout(function() {
        targetSkill.toggleClass("animatedElement")
        targetSkill.toggleClass("levelUpTransition")
    }, animationDuration);
    setTimeout(function() {
        levelUpSign.toggleClass("levelUpFlex")
    }, animationDuration);
    setTimeout(function() {
        setTimeout(function() {
            levelUpSign.toggleClass("levelUpFlex")
        }, animationDurationFlex);
        setTimeout(function() {
            targetSkill.toggleClass("animatedElement")
            setTimeout(function() {
                targetSkill.toggleClass("levelUpTransition")
                setTimeout(function() {
                    targetSkill.children().not(".levelUpFlexContainer").each(function() {
                        let targetElement = $(this);
                        targetElement.toggleClass("levelUpOpacity")
                    })
                    setTimeout(function() {
                        targetSkill.children().not(".levelUpFlexContainer").each(function() {
                            let targetElement = $(this);
                            targetElement.toggleClass("levelUpTransition")
                            let endTime = new Date();
                            let timeTaken = endTime - startTime;
                            $(".elements").attr("data-timeTakenForLvlUp", timeTaken)
                        });
                    }, animationDuration/2);;
                }, animationDuration);
            }, animationDuration);
        }, animationDurationFlex);
    }, animationDuration);
}
$(document).ready(function() {
    fetch("jsonfile.json")
        .then(response => response.json())
        .then(data => {
            //loop through all stats
            for (let i = 0; i < data.stats.length; i++) {
                if (data.stats[i].visible == true) {
                        //create div for each stat
                    let Lvl = data.stats[i].currentLVL
                    let XP = data.stats[i].currentXP
                    let XPneeded = data.stats[i].xpNeeded
                    let currentSkillName = data.stats[i].skillName
                    let newDiv = document.createElement("div")
                    elementClassname = data.stats[i].skillName.toLowerCase()
                    newDiv.className = "element "+elementClassname
                    newDiv.innerHTML = `
                    <div class="row1">
                        <div class="titleRow">
                            <p class="title ${elementClassname}">${currentSkillName}</p>
                            <p class="level ${elementClassname}">Lvl 
                                <span id="LvlValue">${Lvl}</span>
                            </p>
                        </div>
                        <button class="btn-progress ${elementClassname}">Add progress</button>
                    </div>
                    <div class="progressBarRow">
                        <div class="progress-bar__container" style="box-shadow: 0 0 5px rgba(222, 29, 51, 1);background-color: rgba(222, 29, 51, 1)"">
                            <div class="progress-bar"></div>
                        </div>
                        <div class="xp__container">
                            <p class="xp ${elementClassname}">
                                <span id="currentXP">${XP}</span>
                                <span>/</span>
                                <span id="neededLvlXP">${XPneeded}</span>
                                <span id="XPtext">XP</span>
                            </p>
                        </div>
                        <img src="icons8-pull-down-24.png" alt="menu" class="menu">
                    </div>
                        <div class="levelUpFlexContainer">
                            <div class="levelUpText">Level UP!</div>
                        </div>
                    </div>`
                    $(".elements").append(newDiv)
                    let explanationMessage = document.createElement("div")
                    explanationMessage.className = "explanation message " + elementClassname
                    explanationMessageHolder = []
                    for (let t = 0; t < data.stats[i].explanation.length; t++) {
                        explanationMessageHolder.push("<li>"+data.stats[i].explanation[t].toString()+"</li>")
                    }
                    explanationMessage.innerHTML = `
                    <p class="par">This is an explanation of what is included in this category:</p>
                    <ul class="ul">
                        ${explanationMessageHolder.join("")}
                    </ul>`
                    $(newDiv).after(explanationMessage)
                    $(explanationMessage).after("<br/>")
                    $(".message").hide();
                }
                else{
                    i++
                }
            }
            textChangeInsideModal()
            $(".menu").click(function() {
                //get element's 2nd class name
                var elementClass = $(this).parent().parent().attr("class").split(" ")[1];
                $(".message."+elementClass).slideToggle();
            });
        })
    });

// $(document).ready(function() {
//     $(".message").hide();
//     $(".menu").click(function() {
//         //get element's 2nd class name
//         var elementClass = $(this).parent().parent().attr("class").split(" ")[1];
//         $(".message."+elementClass).slideToggle();
//     });
// });
//open modal
addEventListener("click", openModal);
addEventListener("click", clickOutsideModal);