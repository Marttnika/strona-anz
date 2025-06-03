document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.querySelector("#submissionsTable tbody");

  fetch("https://submitform-api.azurewebsites.net/api/getSubmissions?code=dg2lIz8EUmpWLQQCcHO_sY1edc_jF0EYvqhOFDkdp_e8AzFuZIc7gA==")
    .then(response => response.json())
    .then(data => {
      data.forEach(entry => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${entry.name}</td>
          <td>${entry.email}</td>
          <td>${entry.message}</td>
          <td>${new Date(entry.timestamp).toLocaleString()}</td>
        `;

        tableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error("Błąd podczas pobierania zgłoszeń:", error);
      const row = document.createElement("tr");
      row.innerHTML = "<td colspan='4'>Nie udało się pobrać danych.</td>";
      tableBody.appendChild(row);
    });
});
