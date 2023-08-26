import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

import { GeolocationService } from '../services/geolocation.service';
import { LoadingService } from '../services/loading.service';

interface locationInfo {
  locationStr: string,
  latStr: string,
  longStr: string
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CommonModule],
})
export class Tab3Page {
  locationInfo: locationInfo | null = null;

  constructor(
    private geoService: GeolocationService, 
    private loadingService: LoadingService) {}

  async getCurrentLocation() {
    await this.loadingService.present();
    const coords = await this.geoService.getCoords();

    if (coords) {
      const loc = await this.geoService.reverseGeocode(coords);
      
      this.locationInfo = {
        locationStr: 'Precise location unavailable',
        latStr: `Latitude: ${coords.latitude},`,
        longStr: `Longitude: ${coords.longitude}`
      };

      if (loc) {
        this.locationInfo.locationStr = loc.getLocationString();
      }
    }

    await this.loadingService.dismiss();
  }
}
