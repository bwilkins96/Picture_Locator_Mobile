import { Position } from '@capacitor/geolocation';
import { Photo } from '@capacitor/camera';

export class AppPicture {
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