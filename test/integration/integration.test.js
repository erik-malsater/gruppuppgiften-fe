const mockedResponse = {
  data:
    {
      id: 1, name: 'Pikachu', color: 'Yellow', age: 11,
    },
};

const mockedJsonPromise = Promise.resolve(mockedResponse);

const mockedFetchPromise = Promise.resolve({
  json: () => mockedJsonPromise,
});

describe('integrationtest for listenToSelect getByTypeAndId', () => {
  let fetchBackup;
  let getByTypeAndId;
  beforeAll(() => {
    document.body.innerHTML = '<p id="animal-description" data-loaded="false">Please make your selection</p>';
    fetchBackup = window.fetch;
    window.fetch = jest.fn().mockReturnValue(mockedFetchPromise);
    getByTypeAndId = require('../../src/js/animalApp').getByTypeAndId;
  });
  afterAll(() => {
    if (fetchBackup) {
      window.fetch = fetchBackup;
    }
  });

  it('should clear inner html of animal-description using clearElement and fill it with fetched animal and change attribute data-loaded to true', (done) => {
    // Setup
    const expectedOutcome = 'Type: pokemon, id:1,name:Pikachu,color:Yellow,age:11';
    const $animalDescription = document.getElementById('animal-description');
    expect($animalDescription.innerHTML).toBe('Please make your selection');
    // Test-run
    getByTypeAndId('pokemon', '1');
    // Verify
    expect($animalDescription.getAttribute('data-loaded')).toBe('false');
    // Resolve the promises and keep verifying
    process.nextTick(() => {
      expect($animalDescription.getAttribute('data-loaded')).toBe('true');
      expect($animalDescription.innerHTML).toBe(expectedOutcome);
      done();
    });
  });
});
