import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

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
    
    console.log(image);
    console.log(coordinates);
  }
}
