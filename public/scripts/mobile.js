document.addEventListener("DOMContentLoaded", function () {
  var openers = document.querySelectorAll("[data-mobile-open]");
  var closers = document.querySelectorAll("[data-mobile-close]");

  function closeDrawer() {
    document.body.classList.remove("mobile-nav-open");
  }

  openers.forEach(function (button) {
    button.addEventListener("click", function () {
      document.body.classList.add("mobile-nav-open");
    });
  });

  closers.forEach(function (button) {
    button.addEventListener("click", closeDrawer);
  });
});
