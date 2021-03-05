let map;
let postboxes = [];
let postboxesShown = true;

function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
	}
    };
    xhr.send();
    }

function addWalks(url,walkProperties,map) {
  getJSON(url,function(err,data) {
  if (err == null) {
   data.forEach((elem) => {
     addLine(elem,walkProperties,map);
     });}})}

function addLine(url,properties,map) {
  getJSON(url,function(err,data) {
    if (err == null) {
      if ("points" in data) { points = data.points } else { points = data }
      line = new google.maps.Polyline({
        path: points,
	geodesic: true,
	strokeColor: properties.strokeColor,
	strokeOpacity: properties.strokeOpacity,
	strokeWeight: properties.strokeWeight });
      line.setMap(map) } }); }

function addShade(url,properties,map) {
  getJSON(url,function(err,data) {
    if (err == null) {
      shade = new google.maps.Polygon({
        path: data,
	geodesic: true,
	strokeColor: properties.strokeColor,
	strokeOpacity: properties.strokeOpacity,
	strokeWeight: properties.strokeWeight,
	fillColor: properties.fillColor,
	fillOpacity: properties.fillOpacity });
      shade.setMap(map) } }); }

function distance(p1,p2) { 
  dist = Math.sqrt(Math.pow((p1.lat - p2.lat),2) + Math.pow((p1.lng - p2.lng),2));
  return dist; }

function setPosition(position,dot,track,map)
{
  const pos = { lat: position.coords.latitude,
                lng: position.coords.longitude, };
  dot.setCenter(pos);
  c = map.getCenter();
  if (distance({lat: c.lat(), lng: c.lng()},pos) < 0.001) { map.setCenter(pos); }
  points = track.getPath();
  if (points.length<=0) { points.push(new google.maps.LatLng(pos.lat, pos.lng)); track.setPath(points); }
  last = points.getAt(points.length-1);
  lastPoint ={lat: last.lat(), lng: last.lng()};
  if (distance(lastPoint,pos) > 0.0002) {
      points.push(new google.maps.LatLng(pos.lat, pos.lng));
      track.setPath(points); }
}

function addTrack(dot,trackProperties,track,map) {
    if (!navigator.geolocation) { return; }
    navigator.geolocation.getCurrentPosition(
        (position) => { setPosition(position,dot,track,map) }, () => { }); 
	}

function addMarkers(url,visited,parcel,notVisited,map) {
  getJSON(url,function(err, data) {
  if (err == null) {
    data.forEach((elem) => {
      const infowindow = new google.maps.InfoWindow({content: (elem.visited?(elem.name + "</br>" + elem.date + "</br>" + elem.who):(elem.name)) });
      
      const marker = new google.maps.Marker({
                        position: {lat: elem.lat, lng: elem.lng},
                        icon: (elem.visited?visited:(elem.parcel?parcel:notVisited)) });
      marker.addListener("click",() => { infowindow.open(map,marker); });
      postboxes.push(marker);
      marker.setMap(map);}) }});}

function togglePostboxes() {
  postboxesShown = !postboxesShown; 
  document.getElementById("togglePostboxes").value = (postboxesShown?'Hide Postboxes':'Show Postboxes');
  for (let i = 0; i < postboxes.length; i++) {
    if (postboxesShown) {
    	postboxes[i].setMap(map);
    } else {
        postboxes[i].setMap(null);
    }
  }
  }


function initMap() {
    var stylesArray = 
    [
      { 
        "featureType": "poi",
        "stylers": [
          { "visibility": "off" } 
	]
      },{
        "featureType": "poi.park",
        "stylers": [
          { "visibility": "on" } 
	] 
      } 
    ];
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
    center: { lat: 55.81796, lng: -4.29264 },
    disableDefaultUI: true,
    mapTypeId: "terrain",
    styles: stylesArray
  });

  const walkProperties = {   strokeColor: "#FF0000",
                             strokeOpacity: 1.0,
                             strokeWeight: 2 };
  const trackProperties = {   strokeColor: "#0000AA",
                             strokeOpacity: 1.0,
                             strokeWeight: 2 };
  const boundaryProperties = {  strokeColor: "#00FF00",
                                strokeOpacity: 1.0,
                                strokeWeight: 4 };
  const parkProperties = {  	strokeColor: "#42b37c",
                                strokeOpacity: 0.3,
                                strokeWeight: 4,
     				fillColor: "#42b37c",
    				fillOpacity: 0.3 };
  const svgMarkerVisited = {
    path:
      "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "green",
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(10, 25) };

   const svgMarker = {
    path:
      "M10.453 14.016M12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "red",
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(10, 25) };

   const svgParcelMarker = {
    path:
      "M10.453 14.016M12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "purple",
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(10, 25) };

    const dotProperties = {
      strokeColor: "#0000FF",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#0000FF",
      fillOpacity: 0.75 }
    const dot = new google.maps.Circle({ strokeColor: dotProperties.strokeColor,
      					 strokeOpacity: dotProperties.strokeOpacity,
      				 	 strokeWeight: dotProperties.strokeWeight,
      					 fillColor: dotProperties.fillColor,
      					 fillOpacity: dotProperties.fillOpacity,
        				 map,
      					 center: { lat: 0, lng: 0 },
      					 radius: 5 });
  addShade("newlandsPark.json",parkProperties,map);
  addLine("g43.json", boundaryProperties, map);
  addWalks("routes.sh",walkProperties,map);
  addMarkers("postboxes.json", svgMarkerVisited, svgParcelMarker, svgMarker, map);
      track = new google.maps.Polyline({
        path: [] ,
	geodesic: true,
	strokeColor: "#0000AA",
	strokeOpacity: 0.5,
	strokeWeight: 8.0 });
      track.setMap(map); 
  setInterval(function() { addTrack(dot,trackProperties,track,map) },5000);
  addTrack(dot,trackProperties,track,map);
 
}
