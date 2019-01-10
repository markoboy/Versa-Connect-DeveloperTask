/* eslint-disable no-console */
/**
 * @file ./src/js/controller.js
 * This file will controll how the data will be controlled
 * with the view and the model.
 */

// The server's API. TODO: Change with github repo page url.
const url = '.';

/**
 * Get the vehicle data from the json file.
 * This should be served from an external API but we will fake it for
 * this example.
 * @returns {promise} The API response.
 */
const getData = () => {
  return fetch(`${url}/data/vehicles.json`)
    .then( res => {
      // Check if the response was successful.
      if (!res.ok) {
        throw Error(res.statusText);
      }
      // Return the data.
      return res.json();
    })
    .catch( err => {
      console.error('Error occured when fetching vehicles data', err);
      return err;
    });
};

class Controller {

  // Initialize the page.
  static async init() {
    this.vehicles = await getData();

    // Set the currentVehicle the first item of the array.
    this.currentVehicle = this.vehicles[0];

    View.init();
  }

  static getUrl() {
    return {
      main: url,
      images: url + '/images/'
    };
  }

  // Return all the vehicles fetched from the server.
  static getVehicles() {
    return this.vehicles;
  }

  // Return the vehicle based on the ID asked.
  static getVehicle( id ) {
    return this.vehicles.filter( vehicle => vehicle.id === id )[0];
  }

  static setCurrentVehicle( id ) {
    // No error handlers have been created.
    this.currentVehicle = this.vehicles.filter( vehicle => vehicle.id === id )[0];
  }

  static getCurrentVehicle() {
    return this.currentVehicle;
  }

}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the page as fast as the dom loads.
  Controller.init();
});
