document.addEventListener("DOMContentLoaded", function() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        $("body").addClass("dark-mode");
    }

    $(document).on("click", "#darkModeToggle", function() {
        $("body").toggleClass("dark-mode");

        if ($("body").hasClass("dark-mode")) {
            localStorage.setItem("theme", "dark");
            $(this).text("Light Mode");
        } else {
            localStorage.setItem("theme", "light");
            $(this).text("Dark Mode");
        }
    });

    if (window.jQuery) {
        $("#navbar-placeholder").load("components/navbar.html", function(response, status, xhr) {
            if (status == "error") {
                console.error("Failed to load navbar: " + xhr.status + " " + xhr.statusText);
            } else {
                console.log("Navbar successfully injected from components folder.");             
                highlightCurrentPageLink();
                if ($("body").hasClass("dark-mode")) {
                    $("#darkModeToggle").text("Light Mode");
                } else {
                    $("#darkModeToggle").text("Dark Mode");
                }
            }
        });

        $("#footer-placeholder").load("components/footer.html", function(response, status, xhr) {
            if (status == "error") {
                console.error("Failed to load footer: " + xhr.status + " " + xhr.statusText);
            } else {
                console.log("Footer successfully injected from components folder.");
            }
        });

        initializeCarousel("#home-carousel", "home-carousel");
    } else {
        console.error("jQuery is missing! Please ensure jQuery is loaded before this script.");
    }
});

function highlightCurrentPageLink() {
    let currentPath = window.location.pathname.split("/").pop();

    if (currentPath === "") {
        currentPath = "index.html";
    }

    $(".navbar-nav .nav-link").removeClass("active");

    $(".navbar-nav .nav-link").each(function() {
        let linkHref = $(this).attr("href");
        
        if (linkHref === currentPath) {
            $(this).addClass("active");
        }
    });
}

function initializeCarousel(placeholderSelector, uniqueId) {
    const container = document.querySelector(placeholderSelector);
    if (!container) return;

    $(container).load("components/carousel.html", function() {
        const carouselElement = container.querySelector(".carousel");
        carouselElement.setAttribute("id", uniqueId);

        container.querySelectorAll("[data-bs-slide-to], [data-bs-slide]").forEach(button => {
            button.setAttribute("data-bs-target", "#" + uniqueId);
        });

        container.querySelector(".slide-1").src = container.getAttribute("data-img1");
        container.querySelector(".slide-2").src = container.getAttribute("data-img2");
        container.querySelector(".slide-3").src = container.getAttribute("data-img3");

        const myCarousel = new bootstrap.Carousel(carouselElement, {
            interval: 5000,
            ride: "carousel",
            touch: true
        });

        $(container).find(".carousel-control-next").on("click", function(e) {
            e.preventDefault();
            myCarousel.next();
        });

        $(container).find(".carousel-control-prev").on("click", function(e) {
            e.preventDefault();
            myCarousel.prev();
        });

        $(container).find("[data-bs-slide-to]").on("click", function(e) {
            e.preventDefault();
            const slideIndex = parseInt($(this).attr("data-bs-slide-to"));
            myCarousel.to(slideIndex);
        });

        console.log("Carousel component [" + uniqueId + "] successfully mounted and initialized.");
    });
}