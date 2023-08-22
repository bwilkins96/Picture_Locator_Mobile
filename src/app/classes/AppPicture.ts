import { Position } from '@capacitor/geolocation';
import { Photo } from '@capacitor/camera';

export class AppPicture {
    picture: any;
    coords: Position['coords'];
    location: any;
  
    constructor(picture: any, coords: Position['coords'], location: any) {
      this.picture = picture;
      this.coords = coords;
      this.location = location;
    }
  
    getLatLong() {
      return [this.coords.latitude, this.coords.longitude];
    }
  
    getLocationString() {
      const loc = this.location;
      let locStr: string;
  
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