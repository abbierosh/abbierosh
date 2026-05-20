const samplePath = "../sample-data/api-payloads.json";

const requiredFields = ["event_id", "subscriber_id", "event_type", "occurred_at", "source_system"];
const knownEventTypes = ["email_sent", "email_delivered", "email_opened", "email_clicked", "email_bounced"];

let results = [];
let activeSeverity = "all";

function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === "";
}

function hasIsoTimestamp(value) {
  if (isBlank(value)) return false;
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value);
}

function severityRank(severity) {
  return { failed: 3, warning: 2, pass: 1 }[severity] || 0;
}

function worstSeverity(issues) {
  if (issues.some((issue) => issue.severity === "failed")) return "failed";
  if (issues.some((issue) => issue.severity === "warning")) return "warning";
  return "pass";
}

function issueText(issues) {
  if (!issues.length) return "No issues found";
  return issues.map((issue) => issue.message).join("; ");
}

function impactText(issues) {
  if (!issues.length) return "Payload can be processed normally";
  return [...new Set(issues.map((issue) => issue.impact))].join("; ");
}

function validatePayloads(payloads) {
  const eventIdCounts = payloads.reduce((counts, payload) => {
    if (!isBlank(payload.event_id)) {
      counts[payload.event_id] = (counts[payload.event_id] || 0) + 1;
    }
    return counts;
  }, {});

  return payloads
    .map((payload, index) => {
      const issues = [];

      requiredFields.forEach((field) => {
        if (isBlank(payload[field])) {
          issues.push({
            severity: "failed",
            message: `Missing ${field}`,
            impact: impactForMissingField(field),
          });
        }
      });

      if (!isBlank(payload.event_id) && eventIdCounts[payload.event_id] > 1) {
        issues.push({
          severity: "warning",
          message: "Duplicate event_id",
          impact: "Could duplicate reporting or trigger repeated processing",
        });
      }

      if (!isBlank(payload.event_type) && !knownEventTypes.includes(payload.event_type)) {
        issues.push({
          severity: "warning",
          message: "Unknown event_type",
          impact: "Workflow or reporting logic may ignore the event",
        });
      }

      if (!isBlank(payload.occurred_at) && !hasIsoTimestamp(payload.occurred_at)) {
        issues.push({
          severity: "warning",
          message: "Timestamp is not ISO UTC",
          impact: "Reporting order or freshness checks may be wrong",
        });
      }

      issues.sort((a, b) => severityRank(b.severity) - severityRank(a.severity));

      return {
        rowNumber: index + 1,
        eventId: payload.event_id || `row-${index + 1}`,
        subscriberId: payload.subscriber_id || "-",
        eventType: payload.event_type || "-",
        severity: worstSeverity(issues),
        issues,
      };
    })
    .sort((a, b) => severityRank(b.severity) - severityRank(a.severity));
}

function impactForMissingField(field) {
  const impacts = {
    event_id: "Cannot deduplicate the event",
    subscriber_id: "Cannot match event to a profile",
    event_type: "Cannot decide which workflow or metric should use it",
    occurred_at: "Cannot place event correctly in reporting",
    source_system: "Cannot trace where the event came from",
  };
  return impacts[field] || "Payload may not process correctly";
}

function countBySeverity(records) {
  return records.reduce((counts, record) => {
    counts[record.severity] = (counts[record.severity] || 0) + 1;
    return counts;
  }, {});
}

function renderCards() {
  const counts = countBySeverity(results);
  const cardData = [
    ["Total", results.length],
    ["Passed", counts.pass || 0],
    ["Warnings", counts.warning || 0],
    ["Failed", counts.failed || 0],
  ];

  document.getElementById("summary-cards").innerHTML = cardData
    .map(([label, value]) => `<article class="card"><strong>${value}</strong><span>${label}</span></article>`)
    .join("");
}

function renderFilters() {
  const severities = ["all", "failed", "warning", "pass"];
  document.getElementById("filters").innerHTML = severities
    .map((severity) => {
      const active = severity === activeSeverity ? "active" : "";
      const label = severity === "all" ? "All" : severity[0].toUpperCase() + severity.slice(1);
      return `<button class="${active}" data-severity="${severity}" type="button">${label}</button>`;
    })
    .join("");

  document.querySelectorAll("[data-severity]").forEach((button) => {
    button.addEventListener("click", () => {
      activeSeverity = button.dataset.severity;
      render();
    });
  });
}

function visibleResults() {
  if (activeSeverity === "all") return results;
  return results.filter((result) => result.severity === activeSeverity);
}

function renderTable() {
  const records = visibleResults();
  document.getElementById("record-count").textContent = `${records.length} of ${results.length} payloads`;

  document.getElementById("records").innerHTML = records
    .map((result) => `
      <tr>
        <td>${result.eventId}</td>
        <td><span class="pill ${result.severity}">${result.severity}</span></td>
        <td>${result.eventType}</td>
        <td>${result.subscriberId}</td>
        <td>${issueText(result.issues)}</td>
        <td>${impactText(result.issues)}</td>
      </tr>
    `)
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
    if (!response.ok) throw new Error("Sample JSON not available");
    const payloads = await response.json();
    results = validatePayloads(payloads);
    render();
  } catch {
    document.getElementById("records").innerHTML =
      '<tr><td colspan="6">Open this through a local web server or use Load JSON.</td></tr>';
  }
}

document.getElementById("json-upload").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const payloads = JSON.parse(String(reader.result));
    results = validatePayloads(payloads);
    activeSeverity = "all";
    render();
  };
  reader.readAsText(file);
});

loadSample();
