export default class Stop {
  public id: string;
  public tag: string;
  public title: string;
  public lat: string;
  public lon: string;

  constructor(
    id: string = '', 
    tag: string = '', 
    title: string = '', 
    lat: string = '', 
    lon: string = ''
  ) {
    this.id = id;
    this.tag = tag;
    this.title = title;
    this.lat = lat;
    this.lon = lon;
  }
}
