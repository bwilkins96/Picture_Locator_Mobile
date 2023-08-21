import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PictureDataService } from '../services/picture-data.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CommonModule]
})
export class Tab2Page {

  constructor(private dataService: PictureDataService) {}

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

  async addPicture() {
    const image = await this.getPicture();    
   
    if (image) {
      this.dataService.addPicture(image);
    }
  }

  deletePicture(idx: number) {
    this.dataService.deletePicture(idx);
  }
  
  loadImages() {
    return this.dataService.getImages();
  }
}
