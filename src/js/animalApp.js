// globals document, window, module
"use strict";

(function IIFE(){
  const remoteUrl = 'localhost:3000';
  let animalType = '';
  const $animalSelect = document.getElementById('animal-select');
  const $typeSelect = document.getElementById('type-select');
  const $animalDescription = document.getElementById('animal-description');
  const $animalAdd = document.getElementById('animal-add');
  const $myForm = document.getElementById('animal-data');

  function clearElement(element) {
    while(element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function clearForm(form) {
    form[0].selectedIndex = 0;
    for(let i = 1; i < form.length - 1; i++) {
      form[i].value = '';
    }
  }

  function createOption(value, text) {
    const $option = document.createElement('option');
    $option.setAttribute('value', value);
    const $optionText = document.createTextNode(text);
    $option.appendChild($optionText);
    return $option;
  }

  

  function populateSelect(type) {
    clearElement($animalSelect);
    $animalSelect.setAttribute('data-loaded', 'false');
    fetch(`http://${remoteUrl}/${type}s`)
      .then((response) => response.json())
      .then((data) => {
        const animals = data.data;
        const $defaultOption = createOption(null, 'Select animal');
        $animalSelect.appendChild($defaultOption);
        animals.forEach((animal) => {
          const $option = createOption(animal.id, animal.name);
          $animalSelect.appendChild($option);
        });
        $animalSelect.setAttribute('data-loaded', 'true');
      });
  }

  function getByTypeAndId(type, id) {
    $animalDescription.setAttribute('data-loaded', 'false');
    clearElement($animalDescription);
    
    fetch(`http://${remoteUrl}/${type}/${id}`)
      .then((response) => response.json())
      .then((data) => {
        let text = JSON.stringify(data.data, null, '\t');
        text = text.replace(/['"{}]+/g, '');
        const $text = document.createTextNode('Type: ' + type + ', ' + text);
        $animalDescription.appendChild($text);
        $animalDescription.setAttribute('data-loaded', 'true');
      });
  }

  function listenToSelect() {
    $animalSelect.addEventListener('change', (e) => {
      const id = e.target.selectedOptions[0].value;
      getByTypeAndId(animalType, id);
    });
  }

  function listenToType(){
    $typeSelect.addEventListener('change', (e) => {
      const type = e.target.selectedOptions[0].value;
      animalType = type;
      populateSelect(type);
    });
  }

  function listenToAdd() {
    $animalAdd.addEventListener('click', (e) => {
      e.preventDefault();
      $animalAdd.setAttribute('data-loaded', 'false');
      const type = $myForm[0].value;
      const dataObject = {
        name: $myForm[1].value,
        color: $myForm[2].value,
        age: $myForm[3].value
      };
      clearForm($myForm);
      fetch(`http://${remoteUrl}/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataObject),
      })
        .then(() => {
          $animalAdd.setAttribute('data-loaded', 'true');
          populateSelect(type);
        });
    });
  }

  function pageLoaded() {
    listenToSelect();
    listenToType();
    listenToAdd();
  }

  window.pageLoaded = pageLoaded;

  module.exports = {
    testString: function testString() {
      return false;
    },
    createOption,
  };
})();
