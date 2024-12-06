// console.log(campground)
// const camp=cp;
const SearchInput=document.querySelector("#search-input");

let campgrounds={features:camp};
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/mapbox/dark-v11",
  center: [-103.5917, 40.6699],
  zoom: 3,
});

map.on("load", () => {
  // Add a new source from our GeoJSON data and
  // set the 'cluster' option to true. GL-JS will
  // add the point_count property to your source data.
  map.addSource("campgrounds", {
    type: "geojson",
    // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
    // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
    // data: "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
    data: campgrounds,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
  });

  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "campgrounds",
    filter: ["has", "point_count"],
    paint: {
      // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
      // with three steps to implement three types of circles:
      //   * Blue, 20px circles when point count is less than 100
      //   * Yellow, 30px circles when point count is between 100 and 750
      //   * Pink, 40px circles when point count is greater than or equal to 750
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#51bbd6",
        100,
        "#f1f075",
        750,
        "#f28cb1",
      ],
      "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
    },
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "campgrounds",
    filter: ["has", "point_count"],
    layout: {
      "text-field": ["get", "point_count_abbreviated"],
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
  });

  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "campgrounds",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "yellow",
      "circle-radius": 4,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
    },
  });

  // inspect a cluster on click
  map.on("click", "clusters", (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["clusters"],
    });
    const clusterId = features[0].properties.cluster_id;
    map
      .getSource("campgrounds")
      .getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
  });

  // When a click event occurs on a feature in
  // the unclustered-point layer, open a popup at
  // the location of the feature, with
  // description HTML from its properties.
  map.on("click", "unclustered-point", (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    // console.log(e.features[0]);
    // const mag = e.features[0].properties.mag;
    // console.log(mag)
    // const tsunami = e.features[0].properties.tsunami === 1 ? "yes" : "no";
    
    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(e.features[0].properties.popUpMarkup)
      .addTo(map);
  });

  map.on("mouseenter", "clusters", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "clusters", () => {
    map.getCanvas().style.cursor = "";
  });
  map.on("mouseenter", "unclustered-point", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "unclustered-point", () => {
    map.getCanvas().style.cursor = "";
  });
});







const searchInput = document.querySelector('#search-input');
const cpu=document.querySelector('#cp');
const searchButton = document.querySelector('#search-button');




searchInput.addEventListener('input', (e) => {
  const text=e.target.value;
    let content= camp.map((c) => {
      if(c.title.toLowerCase().includes(text.toLowerCase()) || c.location.toLowerCase().includes(text.toLowerCase()) || c.description.toLowerCase().includes(text.toLowerCase())){
            return `<div class="card mb-3">
            <div class="row">
                    <div class="col-md-4">
                    ${c.image.length!==0 ? `<img class="img-fluid img-thumbnail" src="${c.image[0].HomePage}" alt="">` : `<img class="img-fluid img-thumbnail" src="https://res.cloudinary.com/dhtxywza0/image/upload/w_400,h_300/v1684793983/YelpCamp/bqlyxwcqzivezngcbwic.jpg" alt="">`}
                    </div>
                    <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${ c.title } </h5>
                        <br>
                        <h3 class="card-title">$ ${ c.price } </h3>
                        <br>
                        <p class="card-text text-muted">Location: ${ c.location } </p>
                        <a class="btn btn-primary" href="/items/${ c.id }">View</a>
                    </div>
                    </div>
                    </div>
            </div>`
        }else{
          return '';
        }
      });
    let result=camp.map((c) => {
      if(c.title.toLowerCase().includes(text.toLowerCase()) || c.location.toLowerCase().includes(text.toLowerCase()) || c.description.toLowerCase().includes(text.toLowerCase())){
            return c;
        }else return null;
      });
      let z=result.filter((c)=>{
        return c!==null;
      })
      // console.log(z);
      if (map.getLayer("cluster-count")) {
        map.removeLayer("cluster-count");
      }
      if (map.getLayer("unclustered-point")) {
        map.removeLayer("unclustered-point");
      }
      if (map.getLayer("clusters")) {
        map.removeLayer("clusters");
    }
      map.removeSource("campgrounds");
      
      campgrounds={features:z};
      map.addSource("campgrounds", {
        type: "geojson",
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        // data: "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
        data: campgrounds,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
      });
    
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "campgrounds",
        filter: ["has", "point_count"],
        paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            100,
            "#f1f075",
            750,
            "#f28cb1",
          ],
          "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
        },
      });
    
      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "campgrounds",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });
    
      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "campgrounds",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "yellow",
          "circle-radius": 4,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });




      cpu.innerHTML=content.join('');
});

searchButton.addEventListener('click', (e) => {
  searchInput.value='';
});
