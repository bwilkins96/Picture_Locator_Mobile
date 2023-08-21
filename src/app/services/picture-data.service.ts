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

  async getCoords() {
    try {
      const position = await Geolocation.getCurrentPosition();
      return position.coords; 
    } catch {
      return false;
    }
  }

  async addPicture(image: Photo) {    
    const coordinates = await this.getCoords();
    
    if (image && coordinates) {
      const appPicture = new AppPicture(image, coordinates);
      this.images.push(appPicture);
    }
  }

  deletePicture(idx: number) {
    this.images.splice(idx, 1);
  } 

  getImages() {
    return this.images;
  }
}
