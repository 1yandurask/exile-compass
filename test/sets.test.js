'use strict';

// Наборы предметов идут по порядку с деревом; набор камней выбирается вручную
const test = require('node:test');
const assert = require('node:assert/strict');
const { matchByOrder, cleanTitle, stageView } = require('../src/pob');

const sets = (...titles) => titles.map((title) => ({ title, groups: [], uniques: [] }));

test('наборы идут по порядку вместе с деревом, названия не важны', () => {
  const skill = sets('Leveling', 'Something', 'Act 10', 'Maps');
  assert.deepEqual([0, 1, 2, 3].map((i) => matchByOrder(i, skill)), [0, 1, 2, 3]);
});

test('наборов меньше, чем этапов — дальше остаётся последний; наборов нет — ничего', () => {
  assert.deepEqual([0, 1, 2, 3].map((i) => matchByOrder(i, sets('A', 'B'))), [0, 1, 1, 1]);
  assert.equal(matchByOrder(2, []), -1);
});

test('этап 2 → набор предметов 2, а камни — из выбранного набора; старые билды тоже', () => {
  // Сохранённый раньше билд: без activeSkillSet, с запомненным по этапу набором
  const build = {
    stages: [{ title: 'Act 1', skillSet: 0, nodes: [] }, { title: 'Act 2', skillSet: 2, nodes: [] }, { title: 'Act 3', skillSet: 2, nodes: [] }],
    skillSets: sets('G1', 'G2', 'G3'),
    itemSets: sets('I1', 'I2', 'I3'),
  };
  assert.equal(stageView(build, 1).skillSetTitle, 'G1', 'без активного набора — первый');
  assert.equal(stageView(build, 2, { skillSet: 1 }).skillSetTitle, 'G2');
  assert.equal(stageView(build, 1).itemSetTitle, 'I2');
  assert.equal(stageView(build, 1, { skillSet: 9 }).skillSetTitle, 'G1', 'несуществующий набор — по умолчанию');
});

test('цветовые коды PoB убираются из названий', () => {
  assert.equal(cleanTitle('^xE05030Act 2^7'), 'Act 2');
});
