import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

import { PictureDataService } from '../services/picture-data.service';
import { CameraService } from '../services/camera.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CommonModule]
})
export class Tab2Page {
  initialLoad: boolean = false;

  constructor(
    private dataService: PictureDataService, 
    private cameraService: CameraService, 
    private loadingService: LoadingService) {}

  async ngOnInit() {
    await this.dataService.loadSavedImages();
    this.initialLoad = true;
  }

  loadImages() {
    if (this.initialLoad) {
      return this.dataService.getImages();
    }

    return [];
  }

  async addPicture() {
    const image = await this.cameraService.getPicture();    
   
    if (image) {
      await this.loadingService.present()
      await this.dataService.addPicture(image);
      await this.loadingService.dismiss();
    }
  }

  deletePicture(idx: number) {
    this.dataService.deletePicture(idx);
  }
}
