let map;
let routes = {};
let routeKey = "merged";
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

function showRoutes(key)
 {
 routeKey=key;
 Object.keys(routes).forEach(function (hashkey) { 
   routes[hashkey].forEach(function(line) {
     line[1].setMap((hashkey==key)?map:null);
     });
 });
 }

function addWalks(url,key,walkProperties,map,menu) {
  routes[key] = [];
  var ctr = 0;
  getJSON(url,function(err,data) {
  if (err == null) {
   data.forEach((elem) => {
     ctr = ctr + 1;
     addLine(elem,key,(key==routeKey),walkProperties,map,menu,(ctr==data.length));
     });
   }});
  }

function addLine(url,key,show,properties,map,menu,isLast) {
  getJSON(url,function(err,data) {
    if (err == null) {
      if ("walk" in data) 
        { var points = data.walk.points; 
          var name = data.walk.date;
        } else { 
          var points = data; 
          var name = null;
        }
      line = new google.maps.Polyline({
        path: points,
	geodesic: true,
	strokeColor: (isLast?properties.lastStrokeColor:properties.strokeColor),
	strokeOpacity: properties.strokeOpacity,
	strokeWeight: properties.strokeWeight });
      if (key in routes) { 
        if (menu != null) { 
           var subm = data.walk.date.substr(0,7);
           menu.addMenuItem(name,()=>{ toggleTrack(name) },menu.addSubMenu(subm,subm)); 
        }
        routes[key].push([name,line]); 
        }
      if (show==true) { 
line.setMap(map); 
}
	 } }); }

function showTracks() {
  for(i=0;i<routes[routeKey].length;i++) {
     routes[routeKey][i][1].setMap(map);
  } 
}

function hideTracks() {
  for(i=0;i<routes[routeKey].length;i++) {
     routes[routeKey][i][1].setMap(null);
  } }

function toggleTrack(name) {
  for(i=0;i<routes[routeKey].length;i++) {
       if (routes[routeKey][i][0]==name) {
             routes[routeKey][i][1].setMap((routes[routeKey][i][1].getMap() == null)?map:null);
    }
  }
}
    
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
      shade.setMap(map); } }); }

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
        (position) => { setPosition(position,dot,track,map); }, () => { }); 
	}

function setCenter() {
    if (!navigator.geolocation) { return; }
    navigator.geolocation.getCurrentPosition(
      (position) => { const pos = { lat: position.coords.latitude,
                lng: position.coords.longitude, };
		map.setCenter(pos); });}


function addMarkers(url,map) {
  getJSON(url,function(err, data) {
  if (err == null) {
    data.forEach((elem) => {
      postboxes.push(new Postbox(elem,map)); 
      }); }});}

function showPostboxes(show) {
  for (let i = 0; i < postboxes.length; i++) {
    if (show) {
    	postboxes[i].show();
    } else {
        postboxes[i].hide();
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

  // Create the DIV to hold the controls and call the controls 
  // constructor passing in this DIV.
  const trackMenu = new MenuControl("tracks");
  trackMenu.addDropdown("Tracks");
  trackMenu.addCheckbox("Show Postboxes",true,showPostboxes);
  trackMenu.addRadio("tracks","Raw",false, () => { showRoutes("raw"); });
  trackMenu.addRadio("tracks","Simplified",false, () => { showRoutes("simplified"); });
  trackMenu.addRadio("tracks","Merged",true, () => { showRoutes("merged"); });
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(trackMenu.div);

  const walksMenu = new MenuControl("walks");
  walksMenu.addDropdown("Walks");
  walksMenu.addMenuItem("All", ()=>{ showTracks() });
  walksMenu.addMenuItem("None", ()=>{ hideTracks() });
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(walksMenu.div);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(button("Center",setCenter));


  const walkProperties = {   strokeColor: "#FF0000",
  			     lastStrokeColor: "#FF00FF",
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
  // Postcode polygons from https://github.com/missinglink/uk-postcode-polygons
  addLine("g43.json", "postcode", true, boundaryProperties, map, null, false);
  addWalks("routes.sh?style=merged","merged",walkProperties,map,walksMenu);
  addWalks("routes.sh?style=raw","raw",walkProperties,map,null);
  addWalks("routes.sh?style=simplified","simplified",walkProperties,map,null);
  addMarkers("postboxes.json", map);
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

function button(text,action) {

    var div = document.createElement("div");
    div.classList.add("menuDropdown");
    div.innerHTML = text;
    div.addEventListener("click",action)
    return div;
    }
