const {testString, createOption} = require('../../src/js/animalApp');

describe('animalApp.js', () => {
  test('test smoke test', () => {
    expect(testString()).toBe(false);
  });

  describe('createOption', () => {
    test('should return a option element containing "TestName" and with attribute value set to 1', () => {
      const option = createOption(1, "TestName");
      expect(option.nodeName).toBe("OPTION");
      expect(parseInt(option.getAttribute('value'))).toEqual(1);
      expect(option.innerHTML).toBe("TestName");
    });
  });
});
