const hamburgerMenu = document.getElementById("menuButton")

hamburgerMenu.addEventListener("click", function() {
    document.getElementById("mobileMenu").classList.toggle('hidden');
});