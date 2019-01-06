/* eslint-disable no-console */
/**
 * @file ./src/js/view.js
 * This file will be in charge of the data displayed
 * in the DOM and be in charge of event listeners and
 * user reaction.
 */

class View {

  static init() {
    console.log('Initializing the view!');

    this.vehicles = Controller.getVehicles();

    this.currentVehicle = Controller.getCurrentVehicle();

    this.render();
  }

  static render() {
    this.renderModelNav( this.currentVehicle );
  }

  /**
   * This function will render the model navigation on top.
   * @param {object} vehicle The current vehicle to render.
   */
  static renderModelNav( vehicle ) {
    // Select the model navigation button selector.
    let modelSelectorBtn = document.querySelector('#vehicle-model__button');
    // Set it's value to the current selected model.
    modelSelectorBtn.innerHTML = vehicle.name;

    // TODO: Add a listener for list dropdown.

    // Select the vehicle model listbox list container.
    let modelListbox = document.querySelector('#vehicle-model__listbox');

    // Loop throught the vehicles and create a list with li elements.
    let modelList = this.vehicles
      .map(model => `
        <li id="${model.id}" role="option" aria-selected="${model.id === vehicle.id}">
          ${model.name}
        </li>`)
      .join('');

    // Display the list to the DOM.
    modelListbox.innerHTML = modelList;
  }

}
