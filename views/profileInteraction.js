const modal = $(".modal");


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
        }
    });
}
function textChangeInsideModal() {
    $(".btn-progress").click(function() {
        let newText = $(this).parent().parent().find(".title").text()
        $(".modal h1").text(newText.toUpperCase())
        $(".modal p").text(`of ${newText.toUpperCase()} related activities`)
    });
}
function closeModalOnInputConfirm() {
    $(".btn-add-progress").click(function() {
        modal.removeClass("show-modal");
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

addEventListener("click", openModal);
addEventListener("click", clickOutsideModal);
addEventListener("click", closeModalOnInputConfirm);