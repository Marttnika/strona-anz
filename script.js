import emailjs from 'https://cdn.emailjs.com/dist/email.min.mjs';

// Inicjalizacja EmailJS (user ID podajesz tylko tutaj – nie w send)
emailjs.init("VFlTg8z-1RIfLjz-R");

document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = {
    name: document.querySelector('input[name="name"]').value,
    email: document.querySelector('input[name="email"]').value,
    message: document.querySelector('textarea[name="message"]').value
  };

  // Wysyłka danych do Azure Function
  fetch("https://submitform-api.azurewebsites.net/api/submitForm?code=nNq8JE9yb4MFDorPYAPaBta9XFfu7wMiRxNZfVx_bV7DAzFu_ssLIg==", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  })
    .then(response => response.json())
    .then(data => {
      alert("Dziękujemy! Twoja wiadomość została wysłana.");

      // Wysyłka e-maila przez EmailJS (v4 – bez userId tutaj!)
      emailjs.send("service_om6pfoz", "template_knk9bj9", formData)
        .then((response) => {
          console.log("E-mail wysłany!", response.status, response.text);
        })
        .catch((error) => {
          console.error("Błąd e-maila:", error);
        });
    })
    .catch(error => {
      console.error("Błąd:", error);
      alert("Wystąpił problem z wysyłką formularza.");
    });
});