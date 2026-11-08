$(document).ready(function() {
    if (typeof jQuery === 'undefined') return;
    
    if ($("#home-carousel").length || $("#about-carousel").length) {
        initializeCarousel("#home-carousel", "home-carousel");
        initializeCarousel("#about-carousel", "about-carousel");
    }
});

function initializeCarousel(placeholderSelector, uniqueId) {
    const $container = $(placeholderSelector);

    if ($container.length === 0) return;

    $container.load("components/carousel.html", function() {
        const $carouselElement = $container.find(".carousel");
        $carouselElement.attr("id", uniqueId);

        //bind buttons to unique carousel ID
        $container.find("[data-bs-slide-to], [data-bs-slide]").each(function() {
            $(this).attr("data-bs-target", "#" + uniqueId);
        });

        $container.find(".slide-1").attr("src", $container.attr("data-img1"));
        $container.find(".slide-2").attr("src", $container.attr("data-img2"));
        $container.find(".slide-3").attr("src", $container.attr("data-img3"));

        const myCarousel = new bootstrap.Carousel($carouselElement[0], {
            interval: 5000,
            ride: "carousel",
            touch: true
        });

        //added overrides for buttons since original ones were not working properly
        $container.find(".carousel-control-next").on("click", function(e) {
            e.preventDefault();
            myCarousel.next();
        });

        $container.find(".carousel-control-prev").on("click", function(e) {
            e.preventDefault();
            myCarousel.prev();
        });

        $container.find("[data-bs-slide-to]").on("click", function(e) {
            e.preventDefault();
            const slideIndex = parseInt($(this).attr("data-bs-slide-to"));
            myCarousel.to(slideIndex);
        });

        console.log("Carousel component [" + uniqueId + "] successfully mounted and initialized.");
    });
}