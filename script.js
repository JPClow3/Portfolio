const form = document.querySelector(".form");

form.addEventListener("submit", function (E) {
  E.preventDefault();
  console.log(E.values);
});
