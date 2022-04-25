const modal = $(".modal");
const errorMessage = $(".modal").find(".error-handler")
$(document).ready(function() {
    $(".message").hide();
    $(".menu").click(function() {
        //get element's 2nd class name
        var elementClass = $(this).parent().parent().attr("class").split(" ")[1];
        $(".message."+elementClass).slideToggle();
    });
});
//open modal
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
function textChangeInsideModal() {
    $(".btn-progress").click(function() {
        let newText = $(this).parent().parent().find(".title").text()
        $(".modal h1").text(newText.toUpperCase())
        $(".modal p:first").text(`of ${newText.toUpperCase()} related activities`)
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
        $("#hamburger-close-button").click(function() {
            $('.hamburgerModal').toggleClass("show-modal");
        });
    });

    function outsideClick() {
        $(document).click(function(event) {
            if ($(event.target).hasClass("hamburgerModal")) {
                $('.hamburgerModal').removeClass("show-modal");
            }
        });
    }

addEventListener("click", openModal);
addEventListener("click", clickOutsideModal);
addEventListener('click', outsideClick)