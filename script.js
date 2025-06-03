document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = {
    name: document.querySelector('input[name="name"]').value,
    email: document.querySelector('input[name="email"]').value,
    message: document.querySelector('textarea[name="message"]').value
  };

  // Wysyłka do Azure Function
  fetch("https://submitform-api.azurewebsites.net/api/submitForm?code=nNq8JE9yb4MFDorPYAPaBta9XFfu7wMiRxNZfVx_bV7DAzFu_ssLIg==", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  })
    .then(response => response.json())
    .then(data => {
      alert("Dziękujemy! Twoja wiadomość została wysłana.");

      // EmailJS v4 – wywołanie wysyłki maila
      emailjs.send("service_om6pfoz", "template_knk9bj9", formData)
        .then(function (response) {
          console.log("E-mail wysłany!", response.status, response.text);
        }, function (error) {
          console.error("Błąd e-maila:", error);
        });
      // Wysyłka auto-reply do użytkownika
emailjs.send("service_om6pfoz", "template_qpf9ipi", formData)
  .then(function (response) {
    console.log("Auto-reply wysłany!", response.status, response.text);
  }, function (error) {
    console.error("Błąd auto-reply:", error);
  });

    })
    .catch(error => {
      console.error("Błąd:", error);
      alert("Wystąpił problem z wysyłką formularza.");
    });
});
