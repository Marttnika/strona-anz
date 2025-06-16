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

  function updateHeaderArrows() {
    tableHeaders.forEach((th, index) => {
      const columnMap = ["name", "email", "message", "timestamp"];
      const column = columnMap[index];
      if (column === currentSortColumn) {
        th.textContent = th.dataset.base + (sortAscending ? " ⬆️" : " ⬇️");
      } else {
        th.textContent = th.dataset.base;
      }
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
    updateHeaderArrows();
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

    // Dodaj znak BOM (UTF-8) dla poprawnego wyświetlania polskich znaków w Excelu
    const csvContent = "\uFEFF" + csvRows.map(row =>
      row.map(cell => `"${cell}"`).join(",")
    ).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "zgloszenia.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const columnMap = ["name", "email", "message", "timestamp"];
  tableHeaders.forEach((th, index) => {
    th.dataset.base = th.textContent.trim();
    th.addEventListener("click", () => {
      sortData(columnMap[index]);
    });
  });

  exportBtn.addEventListener("click", () => {
    exportToCSV(submissions);
  });

  fetch("https://submitform-api.azurewebsites.net/api/getSubmissions?code=1V-T6-P2z-QXEfTD6428YatctBfH6bROGxsusLJsgS1_AzFuRXuz5A==")
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
