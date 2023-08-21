import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Geolocation, Position } from '@capacitor/geolocation';

class AppPicture {
  picture: Photo;
  coords: Position['coords'];

  constructor(picture: Photo, coords: Position['coords']) {
    this.picture = picture;
    this.coords = coords;
  }
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent]
})
export class Tab2Page {

  constructor() {}

  async getPicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });
      
      return image;
    } catch {
      return false;
    }
  }

  async getCoords() {
    try {
      const position = await Geolocation.getCurrentPosition();
      return position.coords; 
    } catch {
      return false;
    }
  }

  async addPicture() {
    const image = await this.getPicture();    
    const coordinates = await this.getCoords();
    
    if (image && coordinates) {
      const appPicture = new AppPicture(image, coordinates);
      console.log(appPicture);
    }
  }
}
