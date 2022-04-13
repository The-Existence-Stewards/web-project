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

addEventListener("click", openModal);
addEventListener("click", clickOutsideModal);