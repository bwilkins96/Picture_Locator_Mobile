import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Photo } from '@capacitor/camera';

import { AppPicture } from '../classes/AppPicture';

@Injectable({
  providedIn: 'root'
})
export class PictureDataService {
  
  private images: AppPicture[] = [];

  constructor() { }

  getImages() {
    return this.images;
  }

  private async getCoords() {
    try {
      const position = await Geolocation.getCurrentPosition();
      return position.coords; 
    } catch {
      return false;
    }
  }

  // Get location info from long/lat with geocode API
  private async reverseGeocode(lat: number, long: number) {
    try {
      const res = await fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${long}`);
      const result = await res.json();

      return result.address;
    } catch {
      return null;
    }
  }

  async addPicture(image: Photo) {    
    const coordinates = await this.getCoords();
    
    if (image && coordinates) {
      const [lat, long] = [coordinates.latitude, coordinates.longitude];
      const location = await this.reverseGeocode(lat, long);

      const appPicture = new AppPicture(image, coordinates, location);
      this.images.push(appPicture);
    }
  }

  deletePicture(idx: number) {
    this.images.splice(idx, 1);
  } 
}
