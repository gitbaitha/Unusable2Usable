// console.log(camp.geometry.coordinates);
const myObj = (camp);
mapboxgl.accessToken =
  "pk.eyJ1IjoiY3ByYWthc2gxIiwiYSI6ImNsZzZpNXBpMjBkZzkzaHFyMm83OGQyN3YifQ.5BnzbS1hsEGKg95hwpbQ7Q";
const map = new mapboxgl.Map({
  container: "map", // container ID
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: myObj.geometry.coordinates, // starting position [lng, lat]
  zoom: 3, // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(myObj.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:25})
            .setHTML(
                `<h3>${myObj.title}</h3><p>${myObj.location}</p>`
            )
    )
    .addTo(map)

