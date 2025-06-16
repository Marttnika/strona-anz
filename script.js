document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  if (window.appInsights) {
    appInsights.trackEvent({ name: "submit_click" });
  }

  const name = document.querySelector('input[name="name"]').value.trim();
  const email = document.querySelector('input[name="email"]').value.trim();
  const message = document.querySelector('textarea[name="message"]').value.trim();
  const recaptchaResponse = grecaptcha.getResponse();

  // Walidacja pól
  if (name.length < 3) {
    alert("Podaj imię i nazwisko (minimum 3 znaki).");
    return;
  }

  if (!validateEmail(email)) {
    alert("Podaj poprawny adres e-mail.");
    return;
  }

  if (message.length < 10) {
    alert("Wiadomość powinna mieć minimum 10 znaków.");
    return;
  }

  if (!recaptchaResponse) {
    alert("Potwierdź, że nie jesteś robotem.");
    return;
  }

  const formData = { name, email, message };

  // Wysyłka do Azure Function
  fetch("https://submitform-api.azurewebsites.net/api/submitForm?code=https://submitform-api.azurewebsites.net/api/submitForm?code=6LmwEVmNnuGrXyQWAGbltHP0r9v0Ych1odeG1crQhCG_AzFuaGzsdw==", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Błąd odpowiedzi serwera.");
      }
      return response.json();
    })
    .then(data => {
      alert("Dziękujemy! Twoja wiadomość została wysłana.");

      // Email do biura
      emailjs.send("service_om6pfoz", "template_knk9bj9", formData)
        .then(function (response) {
          console.log("E-mail wysłany!", response.status, response.text);
        })
        .catch(function (error) {
          console.error("Błąd e-maila:", error);
        });

      // Auto-reply do użytkownika
      emailjs.send("service_om6pfoz", "template_qpf9ipi", formData)
        .then(function (response) {
          console.log("Auto-reply wysłany!", response.status, response.text);
        })
        .catch(function (error) {
          console.error("Błąd auto-reply:", error);
        });
    })
    .catch(error => {
      console.error("Błąd:", error);
      alert("Wystąpił problem z wysyłką formularza.");
    });
});

// Pomocnicza funkcja walidująca adres e-mail
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}
