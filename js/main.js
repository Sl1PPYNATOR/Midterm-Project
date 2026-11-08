document.addEventListener("DOMContentLoaded", function() {
    //checks and applys theme preference if there
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

    //load navbar and footer from components folder (debug checks because it was not working in the begining)
    if (window.jQuery) {
        $("#navbar-placeholder").load("components/navbar.html", function(status, xhr) {
            if (status == "error") {
                console.error("Failed to load navbar: " + xhr.status + " " + xhr.statusText);
            } else {
                console.log("Navbar successfully injected from components folder.");             
                highlightCurrentPageLink();
                //synch dark mode button text
                if ($("body").hasClass("dark-mode")) {
                    $("#darkModeToggle").text("Light Mode");
                } else {
                    $("#darkModeToggle").text("Dark Mode");
                }
            }
        });

        $("#footer-placeholder").load("components/footer.html", function(status, xhr) {
            if (status == "error") {
                console.error("Failed to load footer: " + xhr.status + " " + xhr.statusText);
            } else {
                console.log("Footer successfully injected from components folder.");
            }
        });
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
