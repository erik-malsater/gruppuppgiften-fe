import chromedriver from 'chromedriver';
import { Builder, until, By } from 'selenium-webdriver';
import server from '../../app';

describe('e2e test for adding an animal', () => {
	let listeningServer;
	let driver;
  
	const PORT = 8081;
	const baseUrl = `localhost:${PORT}`;
	const timeout = 1000;

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
    
    test('filling out form and submitting will clear form and top selects', (done) => {
      driver.wait(until.elementLocated(By.id('add-type-select')), timeout)
        .then((select) => {
          driver.wait(until.elementIsVisible(select));
          select.click();
          return select;
        })
        .then((select) => select.findElements(By.tagName('option')))
        .then((options) => {
          driver.wait(until.elementIsVisible(options[1]));
          return options[1].click();
        })
        .then(() => driver.wait(until.elementLocated(By.id('add-animal-name')), timeout))
        .then((nameInput) => {
          nameInput.sendKeys('Majsan');
        })
        .then(() => driver.wait(until.elementLocated(By.id('add-animal-color')), timeout))
        .then((colorInput) => {
          colorInput.sendKeys('Blå');
        })
        .then(() => driver.wait(until.elementLocated(By.id('add-animal-age')), timeout))
        .then((ageInput) => {
          ageInput.sendKeys('9');
        })
        .then(() => driver.wait(until.elementLocated(By.id('animal-add')), timeout))
        .then((button) => {
          button.click();
        })
        .then(() => driver.findElement(By.id('add-type-select')).getAttribute("value"))
        .then((option) => {
          expect(option).toBe(""); 
        })
        .then(() => driver.findElement(By.id('add-animal-name')).getAttribute("value"))
        .then((input) => {
          expect(input).toBe(""); 
        })
        .then(() => driver.findElement(By.id('add-animal-color')).getAttribute("value"))
        .then((input) => {
          expect(input).toBe(""); 
        })
        .then(() => driver.findElement(By.id('add-animal-age')).getAttribute("value"))
        .then((input) => {
          expect(input).toBe(""); 
          done();
        });
    });
});