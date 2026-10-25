type PrintableRegistration = {
  first_name: string;
  last_name: string;
  emergency_phone: string | null;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  paid: boolean;
};

const days = [
  { key: "monday", label: "Lundi" },
  { key: "tuesday", label: "Mardi" },
  { key: "wednesday", label: "Mercredi" },
  { key: "thursday", label: "Jeudi" },
  { key: "friday", label: "Vendredi" },
] as const;

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
}[char]!));
const euro = (value: number) => value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

export function stagePrintHtml(title: string, rows: PrintableRegistration[], dailyPrice: number, packagePrice: number) {
  const count = (row: PrintableRegistration) => days.filter((day) => row[day.key]).length;
  const amount = (row: PrintableRegistration) => count(row) === 5 ? packagePrice : count(row) * dailyPrice;
  const total = rows.reduce((sum, row) => sum + amount(row), 0);
  const paidTotal = rows.filter((row) => row.paid).reduce((sum, row) => sum + amount(row), 0);
  const headers = days.map((day) => `<th>${day.label}</th>`).join("");
  const body = rows.map((row) => `<tr>
    <td>${escapeHtml(row.last_name)}</td><td>${escapeHtml(row.first_name)}</td>
    <td>${escapeHtml(row.emergency_phone || "—")}</td>
    ${days.map((day) => `<td>${row[day.key] ? "&#10003;" : "&mdash;"}</td>`).join("")}
    <td>${count(row)}</td><td>${euro(amount(row))}</td><td>${row.paid ? "Oui" : "Non"}</td>
  </tr>`).join("");

  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">
    <title>${escapeHtml(title)} — inscriptions et paiements</title>
    <style>
      @page { size: A4 landscape; margin: 12mm; }
      body { font-family: Arial, sans-serif; color: #171717; }
      h1 { font-size: 24px; }
      table { width: 100%; border-collapse: collapse; font-size: 11px; }
      th, td { border: 1px solid #bbb; padding: 8px 5px; text-align: center; }
      th { background: #eee; }
      td:first-child, td:nth-child(2) { text-align: left; }
      td:nth-child(3), td:nth-last-child(2) { white-space: nowrap; }
      thead { display: table-header-group; }
      tr { break-inside: avoid; }
    </style></head><body>
    <h1>${escapeHtml(title)} — inscriptions et paiements</h1>
    <p>Total : ${euro(total)} — Payé : ${euro(paidTotal)} — Reste : ${euro(total - paidTotal)}</p>
    <table><thead><tr><th>Nom</th><th>Prénom</th><th>Téléphone</th>${headers}<th>Jours</th><th>Somme</th><th>Payé</th></tr></thead>
    <tbody>${body}</tbody></table></body></html>`;
}
