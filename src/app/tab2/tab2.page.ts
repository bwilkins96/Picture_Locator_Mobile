import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Geolocation, Position } from '@capacitor/geolocation';

class AppPicture {
  picture: Photo;
  coords: Position['coords'];
  location: any;

  constructor(picture: Photo, coords: Position['coords']) {
    this.picture = picture;
    this.coords = coords;
    
    this.reverseGeocode().then(res => {
      this.location = res;
    });
  }

  private async reverseGeocode() {
    const [lat, long] = this.getLatLong();

    try {
      const res = await fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${long}`);
      const result = await res.json();

      return result.address;
    } catch {
      return null;
    }
  }

  getLatLong() {
    return [this.coords.latitude, this.coords.longitude];
  }

  getLocationString() {
    const loc = this.location;
    let locStr: string;

    console.log(loc);

    if (loc) {
      locStr = `${loc.road}, ${loc.county}, ${loc.state}, ${loc.postcode}, ${loc.country_code.toUpperCase()}`;
    } else if (this.coords) {
      const [lat, long] = this.getLatLong();
      locStr = `(${lat}, ${long})`;
    } else {
      locStr = 'Location information unavailable'
    }

    return locStr;
  }
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CommonModule]
})
export class Tab2Page {

  images: AppPicture[] = [];

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
      this.images.push(appPicture);
    }
  }

  deletePicture(idx: number) {
    this.images.splice(idx, 1);
  } 
}
