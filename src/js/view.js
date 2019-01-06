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

    // Set the current details to render.
    this.currentDetails = 'dimensions';
    // Get the vehicle details buttons.
    this.vehicleDetailsBtn = document.querySelectorAll('.vehicle-details__nav__btn');
    // Initialize the event listeners to the buttons.
    this.initVehicleDetailsBtn( this.currentDetails );

    this.render();
  }

  static render() {
    // Check if there is a change with the currentVehicle in order to render the changes.
    if (this.oldVehicle !== this.currentVehicle) {

      this.renderModelNav( this.currentVehicle );

      this.renderMainBillboard( this.currentVehicle );

      this.oldVehicle = this.currentVehicle;
    }

    // If the vehicle or the details changed render the changes.
    if (this.oldVehicle !== this.currentVehicle
        || this.oldDetails !== this.currentDetails) {
      this.renderVehicleDetails( this.currentDetails );
      this.oldDetails = this.currentDetails;
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

  static initVehicleDetailsBtn() {
    // Loop through all the details buttons.
    this.vehicleDetailsBtn.forEach( btn => {
      // Add a click listener to each of them.
      btn.addEventListener('click', () => {
        // If the btn clicked is not the active one change the currentDetails and render.
        if (this.currentDetails !== btn.dataset.detail) {
          this.currentDetails = btn.dataset.detail;
          this.render();
        }
      });
    });
  }

  /**
   * Handle details active button and render the details page.
   * @param {string} detail The name of the detail to be rendered.
   */
  static renderVehicleDetails( detail ) {
    // Loop through each details button to change the active button.
    this.vehicleDetailsBtn.forEach( btn => {
      if (btn.dataset.detail === detail) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });

    let vehicleDetailsContainer = document.querySelector('#vehicle-details-container');

    switch (detail) {
    case 'dimensions':
      vehicleDetailsContainer.innerHTML = this.renderDimensionsDetails( this.currentVehicle);
      break;
    case 'layouts':
      vehicleDetailsContainer.innerHTML = this.renderLayoutsDetails( this.currentVehicle );
      break;
    case 'color':
      vehicleDetailsContainer.innerHTML = this.renderColorDetails( this.currentVehicle );
      break;
    case 'interior':
      vehicleDetailsContainer.innerHTML = this.renderInteriorDetails( this.currentVehicle );
      break;
    default:
      console.error(`${detail} is a wrong argument for vehicle details!`);
    }
  }

  /**
   * It returns the template of the vehicle dimensions details page.
   * @param {object} dimensions The vehicle's dimensions to get the data from.
   */
  static renderDimensionsDetails( { dimensions } ) {
    let headers = [],
      rows = '';

    // Get the side headers.
    for(let prop in dimensions.short) {
      headers.push( prop );
    }

    // Loop through each header and create the table rows.
    headers.forEach( header => {
      let th = `${header.charAt(0).toUpperCase()}${header.slice(1).replace('_', ' ')}`;

      rows += `
        <tr>
          <th class="dimensions__table__heading">${th}</th>
          <td class="dimensions__table__short">${dimensions.short[header]}</td>
          <td class="dimensions__table__long">${dimensions.long[header]}</td>
        </tr>
      `;
    });

    return (
      `
          <article class="flex vehicle-details__dimensions">
            <table class="text--left dimensions__table">
              <thead>
                <tr>
                  <td></td>
                  <th>Short</th>
                  <th>Long</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
            <div class="flex flex--center-align dimensions__image-container">
              <img src="${this.url.images}${dimensions.image}" alt="${this.currentVehicle.name} dimensions">
            </div>
          </article>
      `
    );
  }

  static renderLayoutsDetails( { layouts } ) {
    return layouts;
  }

  static renderColorDetails( { colors } ) {
    return colors;
  }

  static renderInteriorDetails( { interior } ) {
    return interior;
  }

}
