import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

import { GeolocationService } from '../services/geolocation.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CommonModule],
})
export class Tab3Page {
  locationInfo: any = null;

  constructor(
    private geoService: GeolocationService, 
    private loadingService: LoadingService) {}

  async getCurrentLocation() {
    await this.loadingService.present();
    const coords = await this.geoService.getCoords();

    if (coords) {
      const loc = await this.geoService.reverseGeocode(coords.latitude, coords.longitude);
      
      this.locationInfo = {
        locationStr: `${loc.road}, ${loc.county}, ${loc.state}, ${loc.postcode}, ${loc.country_code.toUpperCase()}`,
        latStr: `Latitude: ${coords.latitude},`,
        longStr: `Longitude: ${coords.longitude}`
      };
    }

    await this.loadingService.dismiss();
  }
}
