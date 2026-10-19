import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../src/lib/competitionCalendar.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const sandbox = { exports: {} };
vm.runInNewContext(outputText, sandbox);
const { mergeCompetitionCalendar, validateCalendarDates, formatCalendarDates } = sandbox.exports;
const defaults = [
  { id: 'first', date: '2026-10-17', endDate: '2026-10-18', title: 'J3', category: 'teams', location: 'Salle', details: 'Infos' },
  { id: 'second', date: '2026-11-07', title: 'J4', category: 'teams' },
];
const merged = mergeCompetitionCalendar(defaults, [{ id: 'first', date: '2026-10-24', end_date: null, location: '', details: 'Reporté' }]);
assert.equal(merged.length, defaults.length, 'Une modification ne doit jamais masquer les autres événements');
assert.equal(merged[0].date, '2026-10-24');
assert.equal(merged[0].endDate, undefined, 'Une date de fin supprimée ne doit pas réapparaître');
assert.equal(merged[0].location, '', 'Un lieu effacé doit rester vide');
assert.equal(merged[0].details, 'Reporté');
assert.equal(merged[1].date, defaults[1].date);
assert.equal(defaults[0].date, '2026-10-17', 'Ne pas modifier les données de secours');
assert.equal(mergeCompetitionCalendar(defaults, [])[0].endDate, '2026-10-18');
assert.equal(validateCalendarDates('2026-11-07'), null);
assert.equal(validateCalendarDates('2026-11-07', '2026-11-08'), null);
assert.equal(validateCalendarDates('2028-02-29'), null);
for (const date of ['', '2026-02-29', '2026-02-30', '2026-13-01', '07/11/2026']) {
  assert.ok(validateCalendarDates(date), `Rejeter la date invalide ${date}`);
}
assert.ok(validateCalendarDates('2026-11-07', '2026-11-06'));
assert.ok(validateCalendarDates('2026-11-07', '2026-02-30'));
assert.match(formatCalendarDates('2026-10-31', '2026-11-01'), /oct.*nov/);
assert.match(formatCalendarDates('2026-12-31', '2027-01-01'), /2026.*2027/);
console.log('OK : calendrier complet, dates modifiées/effacées, champs conservés et validation des dates.');
