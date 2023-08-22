import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Photo } from '@capacitor/camera';

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

import { AppPicture } from '../classes/AppPicture';

@Injectable({
  providedIn: 'root'
})
export class PictureDataService {
  
  private images: AppPicture[] = [];
  private IMAGE_STORAGE: string = 'images';

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

  private saveImages() {
    Preferences.set({
      key: this.IMAGE_STORAGE,
      value: JSON.stringify(this.images)
    });
  }

  async addPicture(image: Photo) {    
    const coordinates = await this.getCoords();
    const pic = await this.savePicture(image);
    
    if (image && coordinates) {
      const [lat, long] = [coordinates.latitude, coordinates.longitude];
      const location = await this.reverseGeocode(lat, long);

      const appPicture = new AppPicture(pic, coordinates, location);
      this.images.unshift(appPicture);

      this.saveImages();
    }
  }

  deletePicture(idx: number) {
    this.images.splice(idx, 1);
    this.saveImages();
  } 

  private async savePicture(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);

    const fileName = Date.now() + '.jpg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data 
    });

    return {
      filePath: fileName,
      webPath: photo.webPath
    };
  }

  private async readAsBase64(photo: Photo) {
    const res = await fetch(photo.webPath!);
    const blob = await res.blob();
    const base64Data = await this.convertBlobToBase64(blob);

    return base64Data as string;
  }

  private convertBlobToBase64(blob: Blob) {
    const base64Promise = new Promise((resolve, reject) => {
      
      const reader = new FileReader();
      reader.onerror = reject;

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.readAsDataURL(blob);
    });

    return base64Promise;
  }

  async loadSavedImages() {
    const { value } = await Preferences.get({ key: this.IMAGE_STORAGE });
    this.images = (value ? JSON.parse(value): []) as AppPicture[];
    this.restoreLoadedImages();

    for (let image of this.images) {
      const readFile = await Filesystem.readFile({
        path: image.picture.filePath,
        directory: Directory.Data
      });

      image.picture.webPath = `data:image/jpeg;base64,${readFile.data}`;
    }
  }

  // Restore information loaded from memory as instances of AppPicture class
  private restoreLoadedImages() {
    for(let i = 0; i < this.images.length; i++) {
      const image = this.images[i];

      this.images[i] = new AppPicture(image.picture, image.coords, image.location);
    }
  }
}
