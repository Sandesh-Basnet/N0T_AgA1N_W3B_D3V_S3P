document.addEventListener("DOMContentLoaded", () => {
  const dropdownBtns = document.querySelectorAll(".dropdown-btn");

  dropdownBtns.forEach((x) => {
    x.addEventListener("click", (event) => {
      event.stopPropagation();
      const dropdownContent =
        x.parentElement.getElementsByClassName("dropdown-content")[0];
      dropdownContent.classList.toggle("show");
    });
  });

  // Close the dropdown if the user clicks anywhere else on the page
  window.addEventListener("click", () => {
    const dropdowns = document.querySelectorAll(".dropdown-content");
    dropdowns.forEach((x) => x.classList.remove("show"));
  });
});
