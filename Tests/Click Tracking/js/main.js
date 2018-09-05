$(function () {


    TweenMax.from("#hero-main-text", 1, {
        opacity: 0,
        y: 400
    });

    TweenMax.from("#hero-secondary-text", 1, {
        opacity: 0,
        y: -400
    });

    var $box = $('.button-scale');

    $box.hover(
        function () {
            TweenLite.to($(this), 0.1, {
                scale: 1.1
            });
        },
        function () {
            TweenLite.to($(this), 0.1, {
                scale: 1
            });
        }
    );

   

});
