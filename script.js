document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  document.getElementById("status").textContent = "Wysyłanie...";
  // Tu w kolejnych krokach dodamy wysyłkę danych
});
