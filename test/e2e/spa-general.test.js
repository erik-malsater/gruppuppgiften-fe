import chromedriver from 'chromedriver';
import { Builder, until, By } from 'selenium-webdriver';
import server from '../../app';

let listeningServer;
let driver;

const PORT = 8088;
const baseUrl = `localhost:${PORT}/`;
const timeout = 30000;

describe('html tests', () => {
  beforeAll((done) => {
    listeningServer = server.listen(PORT);

    driver = new Builder().forBrowser('chrome').build();
    driver.get(baseUrl)
      .then(done);
  });

  afterAll((done) => {
    listeningServer.close();
    driver.quit()
      .then(done);
  });

  test('smoke test', (done) => {
    // Find an element that is available in the static html of the page
    driver.wait(until.elementLocated(By.id('animal-listing')), timeout)
      .then(element => element.getAttribute('id'))
      // Get its id and check that it is identical to the id we started with
      // (yes, it's a pretty stupid test - it just validates that the server and
      // selenium are working)
      .then((id) => {
        expect(id).toBe('animal-listing');
        done();
      });
  });

  test('populate select', (done) => {
    // First find the select-tag and open it
    driver.wait(until.elementLocated(By.id('type-select')), timeout)
      .then((select) => {
        driver.wait(until.elementIsVisible(select));
        select.click();
        return select;
      })
      // List the options and simulate a click on the second item
      .then(select => select.findElements(By.tagName('option')))
      .then((options) => {
        options[2].click();
      })
      .then(() => driver.wait(until.elementLocated(By.id('animal-select')), timeout))
      .then(element => {
        if (!element) {
          throw new Error('animal-select not found');
        }
        return element;
      })
      .then((select) => {
        driver.wait(until.elementIsVisible(select));
        select.click();
        return select;
      })
      // List the options and simulate a click on the second item
      .then(select => select.findElements(By.tagName('option')))
      .then((options) => {
        driver.wait(until.elementIsVisible(options[2]));
        options[2].click();
      })

      // Wait for the animal description to update
      .then(() => driver.wait(until.elementLocated(By.id('animal-description')), timeout))
      // Get the animal description text and validate it
      .then(description => description.getText())
      .then((text) => {
        expect(text.length).toBeGreaterThan(0);
        done();
      });
  });
});
