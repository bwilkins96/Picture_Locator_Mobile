import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Coordinates, Location } from '../classes/AppPicture';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor() { }

  async getCoords() {
    try {
      const position = await Geolocation.getCurrentPosition();
      const coords: Coordinates = { 
        'latitude': position.coords.latitude,
        'longitude': position.coords.longitude
      }; 

      return coords;
    } catch {
      return false;
    }
  }

  // Get location info from long/lat with geocode API
  async reverseGeocode(lat: number, long: number) {
    try {
      const res = await fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${long}`);
      const result = await res.json();

      return new Location(result.address);
    } catch {
      return null;
    }
  }

}
