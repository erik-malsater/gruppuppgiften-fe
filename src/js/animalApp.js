// globals document, window, module

'use strict';

(function IIFE() {
  const remoteUrl = 'localhost:3000';
  let animalType = '';
  const $animalSelect = document.getElementById('animal-select');
  const $typeSelect = document.getElementById('type-select');
  const $animalDescription = document.getElementById('animal-description');
  const $animalAdd = document.getElementById('animal-add');
  const $myForm = document.getElementById('animal-data');
  const $error = document.getElementById('error');

  function clearElement(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function clearForm(form) {
    form[0].selectedIndex = 0;
    for (let i = 1; i < form.length - 1; i = i + 1) {
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
      .then(response => response.json())
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
      .then(response => response.json())
      .then((data) => {
        let text = JSON.stringify(data.data, null);
        text = text.replace(/['"{}]+/g, '');
        const $text = document.createTextNode(`Type: ${type}, ${text}`);
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

  function listenToType() {
    $typeSelect.addEventListener('change', (e) => {
      const type = e.target.selectedOptions[0].value;
      animalType = type;
      populateSelect(type);
    });
  }

  function validation() {
    $animalAdd.addEventListener('click', (e) => {
      e.preventDefault();
      $animalAdd.setAttribute('data-loaded', 'false');

      const textRegex =  /^[a-z '-]+$/i;
      const numRegex =  /\d/g;
      let formErrors = [];

      if($myForm[0].value === ""){
        formErrors.push($myForm[0].id);
      }

      if(!$myForm[1].value.match(textRegex)){
        formErrors.push($myForm[1].id);
      }

      if(!$myForm[2].value.match(textRegex)){
        formErrors.push($myForm[2].id);
      }

      if(!$myForm[3].value.match(numRegex)){
        formErrors.push($myForm[3].id);
      }

      if(formErrors.length === 0){
        let type = $myForm[0].value;
        let dataObject = {
          name: $myForm[1].value,
          color: $myForm[2].value,
          age: $myForm[3].value,
        };
        $error.innerHTML = "";
        addAnimal(type, dataObject);
      }else{
        let formattedErrors = "";
        for(let i = 0; i < formErrors.length; i++){
          formattedErrors += formErrors[i]+"<br>";
        }
        $error.innerHTML = "The following fields are incorrect: <br>" + formattedErrors;
      }
    });
  }

  function addAnimal(type, dataObject) {
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
      });
  }

  function pageLoaded() {
    listenToSelect();
    listenToType();
    validation();
  }

  window.pageLoaded = pageLoaded;

  module.exports = {
    testString: function testString() {
      return false;
    },
    createOption,
    getByTypeAndId,
    clearElement,
  };
})();
