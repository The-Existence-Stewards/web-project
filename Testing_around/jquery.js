// Changing the content of the header
$("#header").html("Different Title");
// Add a new class to an element (if you want to change -> remove and add class)
$("#greeting").addClass("green");

// Adding a new element
let subheading = $("<h2>Sub heading</h2>");
// Creates a new elemnt and puts it at the end of the body
// subheading.append("body");
// Takes it and puts it after the header (if you want to keep it at both places use .clone() after the first insertion)
subheading.insertAfter("#header");

$("#header").on("click", function (){
    $("#header").html($("#header").html() + " was clicked")
});