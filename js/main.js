
document.addEventListener("DOMContentLoaded", function() {
    if (window.jQuery) {
        $("#navbar-placeholder").load("components/navbar.html", function(response, status, xhr) {
            if (status == "error") {
                console.error("Failed to load navbar: " + xhr.status + " " + xhr.statusText);
            } else {
                console.log("Navbar successfully injected from components folder.");
            }
        });
    } else {
        console.error("jQuery is missing! Please ensure jQuery is loaded before this script.");
    }
});
