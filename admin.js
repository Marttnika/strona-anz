document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.querySelector("#submissionsTable tbody");
  const exportBtn = document.getElementById("exportBtn");
  const tableHeaders = document.querySelectorAll("#submissionsTable thead th");
  let submissions = [];
  let currentSortColumn = null;
  let sortAscending = true;

  function renderTable(data) {
    tableBody.innerHTML = "";
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
  }

  function sortData(column) {
    if (currentSortColumn === column) {
      sortAscending = !sortAscending;
    } else {
      currentSortColumn = column;
      sortAscending = true;
    }

    submissions.sort((a, b) => {
      const valA = a[column];
      const valB = b[column];

      if (column === "timestamp") {
        return sortAscending
          ? new Date(valA) - new Date(valB)
          : new Date(valB) - new Date(valA);
      }

      if (typeof valA === "string") {
        return sortAscending
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return 0;
    });

    renderTable(submissions);
  }

  function exportToCSV(data) {
    const csvRows = [
      ["Imię i nazwisko", "Email", "Wiadomość", "Data"]
    ];

    data.forEach(entry => {
      csvRows.push([
        entry.name,
        entry.email,
        entry.message,
        new Date(entry.timestamp).toLocaleString()
      ]);
    });

    const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "zgloszenia.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  tableHeaders.forEach((th, index) => {
    const columnMap = ["name", "email", "message", "timestamp"];
    th.addEventListener("click", () => {
      sortData(columnMap[index]);
    });
  });

  exportBtn.addEventListener("click", () => {
    exportToCSV(submissions);
  });

  fetch("https://submitform-api.azurewebsites.net/api/getSubmissions?code=dg2lIz8EUmpWLQQCcHO_sY1edc_jF0EYvqhOFDkdp_e8AzFuZIc7gA==")
    .then(response => response.json())
    .then(data => {
      submissions = data;
      currentSortColumn = "timestamp";
      sortAscending = false;
      sortData("timestamp");
    })
    .catch(error => {
      console.error("Błąd podczas pobierania zgłoszeń:", error);
      const row = document.createElement("tr");
      row.innerHTML = "<td colspan='4'>Nie udało się pobrać danych.</td>";
      tableBody.appendChild(row);
    });
});
