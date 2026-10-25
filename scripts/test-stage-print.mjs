import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../src/lib/stagePrint.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const sandbox = { exports: {} };
vm.runInNewContext(outputText, sandbox);
const { stagePrintHtml } = sandbox.exports;
const fullWeek = {
  first_name: 'Élodie', last_name: '<script>test</script>', emergency_phone: null,
  monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, paid: true,
};
const html = stagePrintHtml('Toussaint <2026>', [fullWeek, {
  ...fullWeek, last_name: 'Martin', emergency_phone: '06 00 00 00 00',
  tuesday: false, wednesday: false, thursday: false, friday: false, paid: false,
}], 20, 80);
const euro = value => value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
assert.ok(html.includes('Toussaint &lt;2026&gt;'));
assert.ok(html.includes('&lt;script&gt;test&lt;/script&gt;'));
assert.ok(!html.includes('<script>'));
assert.ok(html.includes('Élodie'));
assert.ok(html.includes('06 00 00 00 00'));
assert.ok(html.includes('<td>—</td>'));
for (const day of ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']) assert.ok(html.includes(`<th>${day}</th>`));
assert.equal((html.match(/&#10003;/g) || []).length, 6);
assert.ok(html.includes(`Total : ${euro(100)} — Payé : ${euro(80)} — Reste : ${euro(20)}`));
assert.ok(html.includes('<td>Oui</td>'));
assert.ok(html.includes('<td>Non</td>'));
assert.ok(html.includes('A4 landscape'));
assert.ok(html.includes('table-header-group'));
assert.ok(stagePrintHtml('Autre stage', [], 15, 75).includes('Autre stage'));
const admin = fs.readFileSync(new URL('../src/components/admin/GenericStageAdmin.tsx', import.meta.url), 'utf8');
assert.ok(admin.includes('stagePrintHtml(title, rows, dailyPrice, packagePrice)'));
assert.ok(admin.includes('onClick={print} disabled={loading || !rows.length || saving !== null}'));
assert.ok(admin.includes('popup.print()'));
console.log('OK : impression de chaque stage, tarifs, paiements, jours, échappement HTML et mise en page.');
