document.addEventListener("DOMContentLoaded", function() {
    if (window.jQuery) {
        
        $("#navbar-placeholder").load("components/navbar.html", function(response, status, xhr) {
            if (status == "error") {
                console.error("Failed to load navbar: " + xhr.status + " " + xhr.statusText);
            } else {
                console.log("Navbar successfully injected from components folder.");             
                highlightCurrentPageLink();
            }
        });

        $("#footer-placeholder").load("components/footer.html", function(response, status, xhr) {
            if (status == "error") {
                console.error("Failed to load footer: " + xhr.status + " " + xhr.statusText);
            }else {
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
