const strTest = require('../../src/js/animalApp').testString;

describe('test test', () => {
  test('test smoke test', () => {
    expect(strTest()).toBe(false);
  });
});
