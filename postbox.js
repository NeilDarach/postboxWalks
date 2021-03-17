class Postbox {
  constructor(hash,map) {
    this.lat = hash["lat"];
    this.lng = hash["lng"];
    this.name = hash["name"];
    this.isParcel = hash["parcel"];
    this.isVisited = hash["visited"];
    this.recipient = hash["who"];
    this.date = hash["date"];
    this.map = map;
    this.constructor.createSvg();
    this.marker = new google.maps.Marker({ position: { lat: this.lat, lng: this.lng },
                                           icon: this.icon() });
    this.marker.addListener("click",()=>{ this.showInfo(); });
    this.marker.setMap(map);
  }

  icon() {
    if (this.isVisited) { return this.constructor.svgMarkerVisited; }
    if (this.isParcel)  { return this.constructor.svgMarkerParcel; }
    return this.constructor.svgMarkerUnvisited;
    }

  showInfo() {
    var info;
    info = this.constructor.getInfoWindow();
    info.setContent(this.infoString());
    info.open(this.map,this.marker);
  }

  infoString() {
    if (this.isVisited) {
      return (this.name + "</br>" + this.date + "</br>" + this.recipient);
    } else {
      return this.name;
    }
  }

  show() {
    this.marker.setMap(this.map);
  }

  hide() {
    this.marker.setMap(null);
  }

  static infoWindow = null;
  static getInfoWindow() {
    if (this.infoWindow == null) {
      this.infoWindow =   new google.maps.InfoWindow() ;
    }
    return this.infoWindow;
  }

  static svgMarkerVisited;
  static svgMarkerUnvisited;
  static svgMarkerParcel;

  static createSvg() {
    if (this.svgMarkerVisited != null) { return null; }
    this.svgMarkerVisited = {
      path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      fillColor: "green",
      fillOpacity: 0.6,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(10, 25) };
  
    this.svgMarkerUnvisited = {
      path:
      "M10.453 14.016M12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      fillColor: "red",
      fillOpacity: 0.6,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(10, 25) };

    this.svgMarkerParcel = {
      path:
      "M10.453 14.016M12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      fillColor: "purple",
      fillOpacity: 0.6,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(10, 25) };
  }

}
