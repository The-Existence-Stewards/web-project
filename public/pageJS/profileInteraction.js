const explanations = {
    "intelligence": [
            "Challenge yourself by:",
            "Reading",
            "Studying",
            "Learning a new skill (e.g. a musical instrument)"
        ],
    "strength": [
        "Here are some activities that affect your strength:",
            "Weightlifting",
            "Powerlifting",
            "CrossFit",
            "Gymnastics",
            "Swimming"
        ],
    "agility": [
        "Here are some exercises that you can do to improve your agility:",
            "Plyometric Agility Hurdles",
            "Speed Ladder Agility Drills",
            "Plyometric Box Drills",
            "Lateral Plyometric Jumps",
            "Tuck Jumps",
            "Dot Drills"
        ],
    "endurance": [
        "Here are some activities that affect your endurance:",
            "Running",
            "Cycling",
            "Cross-country skiing",
            "Rowing",
            "Swimming"
        ],
    "charisma": [
        "See how you socialize with people, for example:",
            "Meeting with friends",
            "Going out",
            "Having conversations with your sports-mates, or colleagues"
        ],
    "crafting": [
        "Here's what may be included in this category:",
            "DIY",
            "Painting",
            "Drawing",
            "Woodwork",
            "Crochet, knitting"
    ]
}
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
//add ENTER key event listener on modal 
function addEnterKeyListener() {
    $(".modal").keypress(function(e) {
        if (e.which == 13) {
            $(".btn-add-progress").click();
        }
    });
}
function findStrongestStat(data) {
    data.sort(function (a, b) {
        return b.lvl - a.lvl;
    });
    let similarLevels = []
    similarLevels.push(data.at(0))
    for (let i = 0; i < data.length-1; i++) {
        if (parseInt(data.at(i).lvl) == parseInt(data.at(i+1).lvl)) {
            similarLevels.push(data.at(i+1))
        }
        else{
            break
        }
    }
    if (similarLevels.length > 1) {
        similarLevels.sort(function (a, b) {
            return b.currentxp/b.xptonextlvl - a.currentxp/a.xptonextlvl;
        });
        //leave only first 2 elements in array
        similarLevels.splice(2, similarLevels.length-2)
        if ((similarLevels[0].currentxp/similarLevels[0].xptonextlvl) == (similarLevels[1].currentxp/similarLevels[1].xptonextlvl)) {
            $("#strongestStatHolder").text(`${similarLevels[0].skillname}/${similarLevels[1].skillname}`)
        }
        else {
            $("#strongestStatHolder").text(`${similarLevels[0].skillname}`)
        }
        
    }
    else{
        $("#strongestStatHolder").text(`${similarLevels[0].skillname}`)
    }
}
function findTotalXp(data) {
    let totalXp = 0;
    data.forEach(function(element) {
        totalXp += element.totalxp
    });
    $("#totalXpHolder").text(`${totalXp} XP`)
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

function calculateVisualLevelUp() {
    //track how much time function is taking
    let startTime = new Date();
    targetSkill = $(".element.endurance");
    levelUpSign = $(targetSkill).find(".levelUpFlexContainer");
    animationDuration = ($(".levelUpTransition").css("transition").split(" ")[1].split("s")[0])*1000
    animationDurationFlex = ($(".levelUpFlex").css("transition").split(" ")[1].split("s")[0])*1000
    levelUpSign.css("display", "none")
    //select all child elements of targetSkill except element with class "levelUpFlexContainer"
    targetSkill.children().not(".levelUpFlexContainer").each(function() {
        let targetElement = $(this);
        targetElement.toggleClass("levelUpTransition")
    });
    setTimeout(function() {
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
            setTimeout(function() {
                targetSkill.toggleClass("levelUpTransition")
                setTimeout(function() {
                    targetSkill.children().not(".levelUpFlexContainer").each(function() {
                        let targetElement = $(this);
                    })
                    setTimeout(function() {
                        targetSkill.children().not(".levelUpFlexContainer").each(function() {
                            let targetElement = $(this);
                            targetElement.toggleClass("levelUpTransition")
                            levelUpSign.css("display", "none")
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
    $.ajax({
        url: "/username",
        type: 'GET',
        success: function(res) {
            var text = res;
            $("#greeting").text(`Hello, ${text}!`)
            $("#dudeMcDavid").text(`${text}`)
        }
    });
});

$(document).ready(function() {
    $.getJSON("/skills", function(respondedData) {
        let data = respondedData
            //loop through all stats
            for (let i = 0; i < data.length; i++) {
                        //create div for each stat
                    let Lvl = data[i].lvl
                    let XP = data[i].currentxp
                    let XPneeded = data[i].xptonextlvl
                    let currentSkillName = data[i].skillname
                    let newDiv = document.createElement("div")
                    elementClassname = data[i].skillname.toLowerCase()
                    //send multiplier data to localStorage
                    sessionStorage.setItem(elementClassname, data[i].multiplier)
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
                        <div class="progress-bar__container" style="box-shadow: 0 0 5px var(--${elementClassname}-progress-bar);background-color: var(--${elementClassname}-progress-bar)"">
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
                        <img src="images/icons8-pull-down-24.png" alt="menu" class="menu">
                    </div>
                        <div class="levelUpFlexContainer">
                            <div class="levelUpText">Level UP!</div>
                        </div>
                    </div>`
                    $(".elements").append(newDiv)
                    let explanationMessage = document.createElement("div")
                    explanationMessage.className = "explanation message " + elementClassname
                    explanationMessageHolder = []
                    //search for value behind variable elementClassname in object explanations
                    for (let key in explanations) {
                        if (key == elementClassname) {
                            for (let t = 1; t < explanations[key].length; t++) {
                                explanationMessageHolder.push("<li>"+explanations[key][t].toString()+"</li>")
                            }
                            explanationMessage.innerHTML = `
                            <p class="par">${explanations[key][0]}</p>
                            <ul class="ul">
                                ${explanationMessageHolder.join("")}
                            </ul>`
                            $(newDiv).after(explanationMessage)
                            $(explanationMessage).after("<br/>")
                            $(".message").hide();
                        }
                    }
                }
            findStrongestStat(data)
            findTotalXp(data)
            textChangeInsideModal()
            $(".menu").click(function() {
                //get element's 2nd class name
                var elementClass = $(this).parent().parent().attr("class").split(" ")[1];
                $(".message."+elementClass).slideToggle();
            });
        })
        .then(function() {
            setTimeout(function() {
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
                    let currentXP = $(element).find("#currentXP").text()
                    let neededLvlXP = $(element).find("#neededLvlXP").text()
                    let progressBar = $(element).find(".progress-bar")
                    let progressBarCrop = (currentXP / neededLvlXP)*100
                    progressBar.css("clip-path", "inset(0 0 0 "+progressBarCrop+"%)")
                });
                $("#circleSpinner").hide()
                calculateVisualLevelUp()
            })
        });
    });

//open modal
    function toggleHamburgerModal() {
        $(".hamburgerModal").toggleClass("show-modal-hamburger");
    };

    $(document).ready(function() {
        $("#hamburger-close-button").click(function() {
            $('.hamburgerModal').toggleClass("show-modal-hamburger");
        });
    });

    function outsideClick() {
        $(document).click(function(event) {
            if ($(event.target).hasClass("hamburgerModal")) {
                $('.hamburgerModal').removeClass("show-modal-hamburger");
            }
        });
    }

addEventListener("click", openModal);
addEventListener("click", clickOutsideModal);
addEventListener('click', outsideClick)
