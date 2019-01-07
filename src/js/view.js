/* eslint-disable no-console */
/**
 * @file ./src/js/view.js
 * This file will be in charge of the data displayed
 * in the DOM and be in charge of event listeners and
 * user reaction.
 */

class View {

  static init() {
    this.vehicles = Controller.getVehicles();

    this.currentVehicle = Controller.getCurrentVehicle();

    this.url = Controller.getUrl();

    // Set the current details to render.
    this.currentDetails = 'dimensions';
    // Get the vehicle details buttons.
    this.vehicleDetailsBtn = document.querySelectorAll('.vehicle-details__nav__btn');
    // Initialize the event listeners to the buttons.
    this.initVehicleDetailsBtn( this.currentDetails );

    this.currentColor = this.currentVehicle.colors.nonMetallic[0];

    this.render();
  }

  static render() {
    // Check if there is a change with the currentVehicle in order to render the changes.
    if (this.oldVehicle !== this.currentVehicle) {

      this.renderModelNav( this.currentVehicle );

      this.renderMainBillboard( this.currentVehicle );

      // Create an itterator and use it in a closure for handling gallery changes.
      let galleryItterator = 0;
      this.handleVehicleGallery( this.currentVehicle, galleryItterator );

      this.renderVehicleDescription( this.currentVehicle );

      this.handleOffersBtn( this.currentVehicle );

      // Handle interested modal appearance.
      this.handleInterestedModal( this.currentVehicle );

      // Init color buttons.
      this.initColorButtons();

      this.oldVehicle = this.currentVehicle;
    }

    // If the vehicle or the details changed render the changes.
    if (this.oldVehicle !== this.currentVehicle
        || this.oldDetails !== this.currentDetails) {
      this.renderVehicleDetails( this.currentDetails );
      this.oldDetails = this.currentDetails;
    }

    if (this.oldColor !== this.currentColor) {
      this.renderVehicleDetails( this.currentDetails );
      this.oldColor = this.currentColor;
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

    /* Fake out a hidden loader in order for smoother replacement of details */
    let hiddenLoader = document.createElement('div');
    hiddenLoader.classList.add('is-hidden');

    switch (detail) {
    case 'dimensions':
      hiddenLoader.innerHTML = this.renderDimensionsDetails( this.currentVehicle);
      break;
    case 'layouts':
      hiddenLoader.innerHTML = this.renderLayoutsDetails( this.currentVehicle );
      break;
    case 'color':
      // If the color details is just changing color let renderColorDetails to handle the rendering.
      this.currentDetails !== this.oldDetails ?
        hiddenLoader.appendChild(this.renderColorDetails( this.currentVehicle) ) :
        this.renderColorDetails( this.currentVehicle );
      break;
    case 'interior':
      hiddenLoader.innerHTML = this.renderInteriorDetails( this.currentVehicle );
      break;
    default:
      console.error(`${detail} is a wrong argument for vehicle details!`);
    }

    /* If the details page has changed then set a small amount of timeout to change the details page. */
    if (this.currentDetails !== this.oldDetails) {
      setTimeout(() => {
        vehicleDetailsContainer.innerHTML = '';
        vehicleDetailsContainer.appendChild(hiddenLoader.firstElementChild);
      }, 60);
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
    return (
      `<article class="vehicle-details__layout">
        <div class="vehicle-details__layout__short">
          <p class="layout__paragraph">Short (based on ${layouts.short.model})</p>
          <div>
            <img class="layout__image" src="${this.url.images}${layouts.short.image}" alt="${layouts.short.model} vehicle layout">
          </div>
        </div>
        <div class="vehicle-details__layout__long">
          <p class="layout__paragraph">Long (based on ${layouts.long.model})</p>
          <div>
            <img class="layout__image" src="${this.url.images}${layouts.long.image}" alt="${layouts.long.model} vehicle layout">
          </div>
          <p class="layout__paragraph">${layouts.long.desc}</p>
        </div>
      </article>`
    );
  }

  /**
   * This function will initialize the nonMetallic and metallic
   * list and their buttons in order to be appended to the vehicle
   * details color page.
   */
  static initColorButtons() {
    let { colors } = this.currentVehicle;

    // Create the non-Metallic and metallic containers.
    let nonMetallic = document.createElement('div');
    nonMetallic.classList.add('color-picker__non-metallic');

    let metallic = document.createElement('div');
    metallic.classList.add('color-picker__metallic');

    // Loop through the colors.
    for (let material in colors) {
      // Create the color list.
      let colorList = document.createElement('ul');

      colors[material].forEach( color => {
        // Create the list item.
        let li = document.createElement('li');
        li.classList.add('color-picker__list__item');

        // Create the color button.
        let btn = document.createElement('button');
        btn.classList.add('btn', 'color-picker__btn');
        btn.style.backgroundColor = color.value;
        // Add a title for assisteve technology.
        btn.title = color.name;

        btn.dataset.material = material;
        btn.dataset.color = color.value;

        // Set the current active button for color value.
        if (color === this.currentColor) {
          btn.classList.add('is-active');

          // Set the containers to active.
          if (material === 'nonMetallic')
            nonMetallic.classList.add('is-active');
          else if (material === 'metallic')
            metallic.classList.add('is-active');
        }

        // Add the button to the list item and list item to the colorList.
        li.appendChild(btn);
        colorList.appendChild(li);
      });

      // Check where to add the list to.
      if (material === 'nonMetallic') {
        nonMetallic.appendChild(colorList);
        nonMetallic.innerHTML += `
              <p class="color-picker__description">
                Non metallic
              </p>`;
      } else if (material === 'metallic') {
        metallic.appendChild(colorList);
        metallic.innerHTML += `
              <p class="color-picker__description">
                Metallic
              </p>`;
      }
    }

    this.colorPickerLists = {
      nonMetallic,
      metallic
    };
  }

  /**
   * This function handles the is-active class of the color buttons
   * and their containers. It is to be used from a loop with all buttons.
   * @param {node} btn The node button element to check.
   */
  static handleActiveColorBtn( btn ) {
    // Check whether the current button has the same color value as the current color.
    if (btn.dataset.color === this.currentColor.value) {
      // If so add the is-active class.
      btn.classList.add('is-active');
      // Check in which material category the button color is a child.
      if (btn.dataset.material === 'metallic') {
        // Add and remove the is-active class from the containers.
        this.colorPickerLists.metallic.classList.add('is-active');
        this.colorPickerLists.nonMetallic.classList.remove('is-active');
      } else {
        this.colorPickerLists.nonMetallic.classList.add('is-active');
        this.colorPickerLists.metallic.classList.remove('is-active');
      }
    } else {
      btn.classList.remove('is-active');
    }
  }

  /**
   * This function will render the color details page.
   * In case that the colorDetailContainer is not present
   * it returns a NODE object else it handles the image
   * change functionality itself.
   * @param {object} vehicle The current vehicle to be rendered.
   */
  static renderColorDetails( vehicle ) {
    /* TODO: Handle image changes with a loader and Image() object */
    let { colors } = vehicle;
    // Get the colors detail container.
    let colorDetailContainer = document.querySelector('.vehicle-details__color');

    if (colorDetailContainer === null) {
      // Create the colors details container.
      colorDetailContainer = document.createElement('article');
      colorDetailContainer.classList.add('text--center', 'vehicle-details__color');

      // Append the image container and the color picker.
      colorDetailContainer.innerHTML = `
          <div class="color__image-container">
            <img src="${this.url.images}${this.currentColor.image}" alt="${this.currentColor.name} ${vehicle.name}">
          </div>
          <div class="flex flex--justify-center color__color-picker">
          </div>
      `;

      // Append the color buttons lists to the color picker container.
      colorDetailContainer.querySelector('.color__color-picker').appendChild(this.colorPickerLists.nonMetallic);
      colorDetailContainer.querySelector('.color__color-picker').appendChild(this.colorPickerLists.metallic);

      // Store all the color buttons.
      let buttons = colorDetailContainer.querySelectorAll('.color-picker__btn');

      // Make an array out of the colors.
      let colorsArray = [ ...colors.nonMetallic, ...colors.metallic];
      buttons.forEach( btn => {
        // Check which color is selected to add is-active class.
        this.handleActiveColorBtn(btn);

        // Add onclick listener.
        btn.onclick = (e) => {
          // Get the btn clicked.
          let target = e.target;
          // If the clicked button is active then return.
          if (target.dataset.color === this.currentColor.value) return;

          // Set the current color based on the color dataset.
          this.currentColor = colorsArray.filter( color => color.value === target.dataset.color)[0];
          // Render the screen.
          this.render();
        };
      });

      // Return the color detail container. NODE element
      return colorDetailContainer;
    } else {
      // If the container already exist then just change their data.
      // Select the image container and change the image.
      this.loadImage(this.url.images + this.currentColor.image).then( url => {
        // Load the image before changing the image.
        colorDetailContainer.querySelector('.color__image-container').innerHTML = `
          <img src="${url}" alt="${this.currentColor.name} ${this.currentVehicle.name}">
        `;
      });


      // Select the buttons and handle the change.
      let buttons = colorDetailContainer.querySelectorAll('.color-picker__btn');

      // Check which button is active.
      buttons.forEach( btn => {
        this.handleActiveColorBtn(btn);
      });
    }

  }

  static generateInteriorList( interior ) {
    // Create the list container.
    let listContainer = document.createElement('ul');
    listContainer.classList.add('flex', 'flex--space-between');

    let activeTrim = interior.trim[2];

    // Loop through each interior trim to create the list items.
    let listItem = interior.trim.map( trim => (
      `
      <li class="interior-trim__list__item">
        <div class="interior-trim__checkbox__container" role="checkbox" aria-checked="${trim === activeTrim}" tabindex="0" aria-label="${trim.material} interior trim. Insert: ${trim.insert}. Bolster: ${trim.bolster}">
          <div>
            <img src="${this.url.images}${trim.image}" alt="${trim.material} interior trim">
          </div>
          <div class="flex flex--space-between">
            <div>
              <h4 class="interior-trim__description__heading">${trim.material}</h4>
              <p class="interior-trim__description__paragraph">
                Insert: ${trim.insert}
              </p>
              <p class="interior-trim__description__paragraph">
                Bolster: ${trim.bolster}
              </p>
            </div>
            <div class="interior-trim__checkbox">
              <button class="btn interior-trim__checkbox__btn" tabindex="-1">
                <i class="fas fa-check"></i>
              </button>
            </div>
          </div>
        </div>
      </li>
      `
    )).join('');

    listContainer.insertAdjacentHTML('afterbegin', listItem);

    return listContainer.outerHTML;
  }

  static renderInteriorDetails( { interior } ) {
    return (
      `
        <article class="flex flex--column vehicle-details__interior-trim">
          <div class="interior-trim__top-image" style="${this.url.images}${interior.image}"></div>
          <div role="group" aria-label="Interior trim">
            ${this.generateInteriorList(interior)}
          </div>
          <!-- Interior trim material checkboxes end -->
        </article>
        <!-- Vehicle interior trim container end -->
      `
    );
  }

  static async handleVehicleGallery( vehicle, i ) {
    let { gallery } = vehicle;

    // If the vehicle changes clear the previous timer to prevent bugs.
    if (this.oldVehicle !== vehicle) clearTimeout(this.galleryTimer);

    // Get the vehicle gallery elements.
    let vehicleGallery = document.querySelector('.vehicle-gallery');
    let leftBtn = vehicleGallery.querySelector('.vehicle-gallery__btn--left');
    let rightBtn = vehicleGallery.querySelector('.vehicle-gallery__btn--right');
    let status = vehicleGallery.querySelector('.vehicle-gallery__status');

    // Load the image.
    let imageUrl = this.url.images + gallery[i];
    imageUrl = await this.loadImage( imageUrl );

    // Display the image and the status.
    vehicleGallery.style.backgroundImage = `url(${imageUrl})`;
    status.innerHTML = `${i + 1} / ${gallery.length}`;

    // Set a timeout to change the image.
    this.galleryTimer = setTimeout( () => {
      i === gallery.length - 1 ? i = 0 : i += 1;
      this.handleVehicleGallery(vehicle, i);
    }, 5000);

    // Set click listeners on buttons to change the images.
    rightBtn.onclick = () => {
      i === gallery.length - 1 ? i = 0 : i += 1;
      clearTimeout(this.galleryTimer);
      this.handleVehicleGallery(vehicle, i);
    };
    leftBtn.onclick = () => {
      i === 0 ? i = gallery.length - 1 : i -= 1;
      clearTimeout(this.galleryTimer);
      this.handleVehicleGallery(vehicle, i);
    };
  }

  static renderVehicleDescription( vehicle ) {
    // Get the container.
    let container = document.querySelector('.vehicle-description');

    // Generate the paragraphs.
    let paragraphs = vehicle.description.map( par => `<p>${par}</p>`).join('');

    // Render the paragraphs in the container.
    container.querySelector('div').innerHTML = paragraphs;
  }

  static handleOffersBtn( vehicle ) {
    // Select all the offers button.
    let buttons = document.querySelectorAll('.btn--offers');
    // Change its content with the vehicle name.
    buttons.forEach( btn => btn.innerHTML = `View our ${vehicle.name} offers` );
    // TODO: Add the corresponding link to them.
  }

  static handleInterestedModal( vehicle ) {
    // Select the modal and change its paragraph to display the current vehicle.
    let modal = document.querySelector('.interested-modal');
    modal.querySelector('.card-container__paragraph').innerHTML = `
      Are you interested in the ${vehicle.name}? Simply fill in the form bellow and we'll be in touch.
    `;

    // Add a click event on close btn and submit btn to close the modal.
    modal.querySelector('#modal__close-btn').onclick = () => modal.classList.add('is-closed');

    modal.querySelector('.interested-modal__form__input--btn').onclick = () => {
      /* TODO: It should be added on a submit listener */
      /* It should have validators. */
      modal.classList.add('is-closed');
    };

    // Add onscroll event to display the modal when it reaches vehicle-description.
    document.onscroll = () => {
      let vehicleDesc = document.querySelector('.vehicle-description');
      if (vehicleDesc.offsetTop <= window.pageYOffset) {
        modal.classList.remove('is-closed');
        // Nullify the document onscroll event so that the modal doesnt appear again.
        document.onscroll = null;
      }
    };
  }

  // Load an image asynchronously providing the url.
  static loadImage( url ) {
    return new Promise( (resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve( url );
      img.onerror = (err) => reject(err);
    });
  }

}
