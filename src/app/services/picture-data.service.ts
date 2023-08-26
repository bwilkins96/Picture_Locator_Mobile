import { Injectable } from '@angular/core';
import { Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

import { GeolocationService } from './geolocation.service';
import { AppPicture, PictureInfo, Location } from '../classes/AppPicture';

@Injectable({
  providedIn: 'root'
})
export class PictureDataService {
  
  private images: AppPicture[] = [];
  private IMAGE_STORAGE: string = 'images';

  constructor( private geoService: GeolocationService) { }

  getImages() {
    return this.images;
  }

  private saveImages() {
    Preferences.set({
      key: this.IMAGE_STORAGE,
      value: JSON.stringify(this.images)
    });
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
      let location = image.location;
      
      if (image.location) {
        location = new Location(image.location.data);
      }

      this.images[i] = new AppPicture(image.picture, image.coords, location);
    }
  }

  async addPicture(image: Photo) {    
    const coordinates = await this.geoService.getCoords();
    const picInfo: PictureInfo = await this.savePicture(image);
    
    if (picInfo && coordinates) {
      const [lat, long] = [coordinates.latitude, coordinates.longitude];
      const location = await this.geoService.reverseGeocode(lat, long);

      const appPicture = new AppPicture(picInfo, coordinates, location);
      this.images.unshift(appPicture);

      this.saveImages();
    }
  }

  deletePicture(idx: number) {
    this.images.splice(idx, 1);
    this.saveImages();
  } 

  // Save picture to local memory
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
      webPath: photo.webPath!
    };
  }

  // Get picture data as base64 data
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
}
