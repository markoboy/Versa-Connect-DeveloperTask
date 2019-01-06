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

    this.url = Controller.getUrl();

    this.render();
  }

  static render() {
    // Check if there is a change with the currentVehicle in order to render the changes.
    if (this.oldVehicle !== this.currentVehicle) {

      this.renderModelNav( this.currentVehicle );

      this.renderMainBillboard( this.currentVehicle );

      this.oldVehicle = this.currentVehicle;
    }
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

  static renderMainBillboard( vehicle ) {
    // Select the main billboard container and set its background image.
    let bbContainer = document.querySelector('#main-billboard');
    bbContainer.style.backgroundImage = `url(${this.url.images}${vehicle.billboardImage})`;

    // Set the heading and the description of the billboard.
    let heading = document.querySelector('#main-billboard .card-container__heading');
    heading.innerHTML = vehicle.name;

    let description = document.querySelector('#main-billboard .card-container__paragraph');
    description.innerHTML = vehicle.billboardDesc;

    // TODO: Set the corrent link to the enquiry.
  }

}
