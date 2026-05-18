const samplePath = "../sample-data/reconciliation_output.csv";

const statusLabels = {
  reconciled: "Reconciled",
  missing_from_reporting: "Missing",
  duplicate_reporting_rows: "Duplicates",
  delayed_reporting_load: "Delayed",
  status_mismatch: "Status mismatch",
  amount_mismatch: "Amount mismatch",
};

let rows = [];
let activeStatus = "all";

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(",");

  return lines.map((line) => {
    const values = line.split(",");
    return headers.reduce((record, header, index) => {
      record[header] = values[index] || "";
      return record;
    }, {});
  });
}

function countByStatus(records) {
  return records.reduce((counts, row) => {
    const status = row.reconciliation_status;
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});
}

function formatStatus(status) {
  return statusLabels[status] || status.replaceAll("_", " ");
}

function renderCards() {
  const counts = countByStatus(rows);
  const cardData = [
    ["Total", rows.length],
    ["Reconciled", counts.reconciled || 0],
    ["Missing", counts.missing_from_reporting || 0],
    ["Delayed", counts.delayed_reporting_load || 0],
    ["Duplicates", counts.duplicate_reporting_rows || 0],
    ["Mismatches", (counts.status_mismatch || 0) + (counts.amount_mismatch || 0)],
  ];

  document.getElementById("summary-cards").innerHTML = cardData
    .map(([label, value]) => `<article class="card"><strong>${value}</strong><span>${label}</span></article>`)
    .join("");
}

function renderFilters() {
  const statuses = ["all", ...Object.keys(countByStatus(rows))];

  document.getElementById("filters").innerHTML = statuses
    .map((status) => {
      const label = status === "all" ? "All" : formatStatus(status);
      const active = status === activeStatus ? "active" : "";
      return `<button class="${active}" data-status="${status}" type="button">${label}</button>`;
    })
    .join("");

  document.querySelectorAll("[data-status]").forEach((button) => {
    button.addEventListener("click", () => {
      activeStatus = button.dataset.status;
      render();
    });
  });
}

function visibleRows() {
  if (activeStatus === "all") {
    return rows;
  }
  return rows.filter((row) => row.reconciliation_status === activeStatus);
}

function renderTable() {
  const records = visibleRows();
  document.getElementById("record-count").textContent = `${records.length} of ${rows.length} records`;

  document.getElementById("records").innerHTML = records
    .map((row) => {
      const status = row.reconciliation_status;
      return `
        <tr>
          <td>${row.business_key}</td>
          <td><span class="status ${status}">${formatStatus(status)}</span></td>
          <td>${row.source_status || "-"}</td>
          <td>${row.report_status || "-"}</td>
          <td>${row.source_amount || "-"} / ${row.report_amount || "-"}</td>
          <td>${row.reporting_row_count}</td>
          <td>${row.last_loaded_at || "-"}</td>
        </tr>
      `;
    })
    .join("");
}

function render() {
  renderCards();
  renderFilters();
  renderTable();
}

async function loadSample() {
  try {
    const response = await fetch(samplePath);
    if (!response.ok) throw new Error("Sample CSV not available");
    rows = parseCsv(await response.text());
    render();
  } catch {
    document.getElementById("records").innerHTML =
      '<tr><td colspan="7">Open this through a local web server or use Load CSV.</td></tr>';
  }
}

document.getElementById("csv-upload").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    rows = parseCsv(String(reader.result));
    activeStatus = "all";
    render();
  };
  reader.readAsText(file);
});

loadSample();
