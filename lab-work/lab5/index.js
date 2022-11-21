console.log("ok");

$("#accordion").accordion({
    heightStyle: "content"
});

$("#slider").slider({
    orientation: "horizontal",
    range: "min",
    min: 0,
    max: 100,
    value: 60,
    slide: function (event, ui) {
        $("#amount").val(ui.value);
    }
});

$( "#date" ).datepicker();
$("#amount").val($("#slider").slider("value"));


$(document).ready(function(){ 
    // фотогалерея з можливістю перегляду збільшених зображень
    $("#gallery").unitegallery(); 
    // слайдер фотографій
    $("#img-slider").unitegallery({
        gallery_theme: "slider"
    }); 
    // слайдер відеоматеріалів 
    $("#video-slider").unitegallery({
        gallery_theme: "slider"
    });
}); 


$('.gif').gifplayer();