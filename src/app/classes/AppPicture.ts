export interface PictureInfo {
  filePath: string,
  webPath: string
}

export interface Coordinates {
  latitude: number,
  longitude: number
} 

export class Location {
  data: any

  constructor(data: any) {
    this.data = data;
  }

  getLocationString() {
    const loc = this.data;
    return `${loc.road}, ${loc.county}, ${loc.state}, ${loc.postcode}, ${loc.country_code.toUpperCase()}`;
  }
}

export class AppPicture {
    picture: PictureInfo;
    coords: Coordinates;
    location: Location | null;
  
    constructor(picture: PictureInfo, coords: Coordinates, location: Location | null) {
      this.picture = picture;
      this.coords = coords;
      this.location = location;
    }
  
    getLocationString() {
      const loc = this.location;
      let locStr: string;
  
      if (loc) {
        locStr = loc.getLocationString();
      } else if (this.coords) {
        const [lat, long] = [this.coords.latitude, this.coords.longitude];
        locStr = `(${lat}, ${long})`;
      } else {
        locStr = 'Location information unavailable'
      }
  
      return locStr;
    }
  }