mapboxgl.accessToken = 'pk.eyJ1IjoibWF5YW5rcmFnaGF2IiwiYSI6ImNrcTBzbWV5YjA3dzgybnA4MTNyOXhsZnUifQ.y5sbiHppiPXPqNZV89LHbw';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: [79.0882,21.1458],
zoom: 4
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', function () {


map.addSource('station', {
type: 'geojson',


data: station,
cluster: true,
clusterMaxZoom: 14, 
clusterRadius: 50 
});
 
map.addLayer({
id: 'clusters',
type: 'circle',
source: 'station',
filter: ['has', 'point_count'],
paint: {



'circle-color': [
    'step',
    ['get', 'point_count'],
    '#61a5c2',
    10,
    '#2c7da0',
    20,
    '#014f86'
],
    'circle-radius': [
    'step',
    ['get', 'point_count'],
    15,
    10,
    20,
    30,
    25
]
}
});
 
map.addLayer({
id: 'cluster-count',
type: 'symbol',
source: 'station',
filter: ['has', 'point_count'],
layout: {
'text-field': '{point_count_abbreviated}',
'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
'text-size': 12
}
});
 
map.addLayer({
id: 'unclustered-point',
type: 'circle',
source: 'station',
filter: ['!', ['has', 'point_count']],
paint: {
'circle-color': '#61a5c2',
'circle-radius': 6,
'circle-stroke-width': 1,
'circle-stroke-color': '#fff'
}
});
 
map.on('click', 'clusters', function (e) {
var features = map.queryRenderedFeatures(e.point, {
layers: ['clusters']
});
var clusterId = features[0].properties.cluster_id;
map.getSource('station').getClusterExpansionZoom(
clusterId,
function (err, zoom) {
if (err) return;
 
map.easeTo({
center: features[0].geometry.coordinates,
zoom: zoom
});
}
);
});
 

map.on('click', 'unclustered-point', function (e) {
const popUp = e.features[0].properties.popUpMarker
var coordinates = e.features[0].geometry.coordinates.slice();


while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
}
 

new mapboxgl.Popup()

    .setLngLat(coordinates)
 
    .setHTML(
        popUp
   )
    .addTo(map);
    });
 
map.on('mouseenter', 'clusters', function () {
map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'clusters', function () {
map.getCanvas().style.cursor = '';
});
});