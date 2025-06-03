document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = {
    name: document.querySelector('input[name="name"]').value,
    email: document.querySelector('input[name="email"]').value,
    message: document.querySelector('textarea[name="message"]').value
  };

  fetch("https://submitform-api.azurewebsites.net/api/submitForm?code=nNq8JE9yb4MFDorPYAPaBta9XFfu7wMiRxNZfVx_bV7DAzFu_ssLIg==", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  })
    .then(response => response.json())
    .then(data => {
      alert("Dziękujemy! Twoja wiadomość została wysłana.");
    })
    .catch(error => {
      console.error("Błąd:", error);
      alert("Wystąpił problem z wysyłką formularza.");
    });
});
