import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

import { PictureDataService } from '../services/picture-data.service';
import { CameraService } from '../services/camera.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CommonModule]
})
export class Tab2Page {

  constructor(private dataService: PictureDataService, private cameraService: CameraService) {}

  async addPicture() {
    const image = await this.cameraService.getPicture();    
   
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
