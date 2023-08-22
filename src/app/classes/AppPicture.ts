export interface Coordinates {
  latitude: number,
  longitude: number
} 

export interface PictureInfo {
  filePath: string,
  webPath: string
}

export class AppPicture {
    picture: PictureInfo;
    coords: Coordinates;
    location: any;
  
    constructor(picture: PictureInfo, coords: Coordinates, location: any) {
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