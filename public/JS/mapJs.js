

  mapboxgl.accessToken = mapToken;
  const  map = new mapboxgl.Map({
  container: 'map2', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: night.geometry.coordinates, // starting position [lng, lat]
  zoom: 8// starting zoom
 })

 map.addControl(new mapboxgl.NavigationControl());

 new mapboxgl.Marker()
 .setLngLat(night.geometry.coordinates)
 .setPopup(
   new mapboxgl.Popup({offset: 25 })
   .setHTML(
     `<h3> ${night.title} </h3><p> ${night.location}</p`
   )
 )
 .addTo(map)