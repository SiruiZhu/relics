var _map         = null,
        _centerLat   = 35.5,
        _centerLng   = 105,

        _dataFile    = require('./data/architecture_point_completed.geojson'),
        _accessToken = "pk.eyJ1Ijoiemh1c2lydWkiLCJhIjoiczRLMGhEMCJ9.37GHQC_3mSKufR5ERmXsLw",
        _mapStyle    = "mapbox://styles/zhusirui/cjote0r366qqd2spcea8df8td";

    mapboxgl.accessToken = _accessToken;
    _map = new mapboxgl.Map ({
                               container: "map",
                               style: _mapStyle,
                               center: [_centerLng, _centerLat],
                               zoom: 3.3
    });

    function init ()
    {
      _map.addSource ("markers-source", {
                                         type: "geojson",
                                         data: _dataFile
      });

      _map.addLayer (
      {
        "id": "markers",
        "type": "circle",
        "source": "markers-source",
        "paint": {
                  "circle-color":
                  {
                    property: "classification_en",
                    type: "categorical",
                    stops: [
                        ['Ancient architecture', "#66c2a5"], 
                        ['Ancient ruins', "#fc8d62"], 
                        ['Historical buildings of modern times', "#8da0cb"], 
                        ['Ancient tomb', "#e78ac3"], 
                        ['Cave temple and stone carving', "#a6d854"], 
                        ['others', "#ffd92f"] 
                    ]
                    },
                   "circle-radius": 3.5,
                   "circle-stroke-width": 0.5
                 }
         });

// change the click to hover    
var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });


     _map.on('mouseenter', 'markers', function(e) {
        _map.getCanvas().style.cursor = "default";

        var coordinates = e.features[0].geometry.coordinates.slice();
        var feature = e.features[0]
        
        var detail = e.features[0].properties
        // console.log('Detail is', detail)
           title = e.features[0].properties.name_en
        // console.log('Title is', title)
           era = e.features[0].properties.era_en
           address = e.features[0].properties.province_en
           type = e.features[0].properties.classification_en

        var layout = "<div class='g-popup-line-1'>" + title + "</div>" + 
                     "<div class='g-popup-divider'></div>" +
                     "<div class='g-popup-line-1-address'>" + 'Province: ' + address + "</div>" + 
                      "<div class='g-popup-line-1-address'>" + 'Type: ' + type + "</div>" + 
                      "<div class='g-popup-line-1-address'>" + 'Era: ' + era + "</div>" + 
                      "</div></div>"
        //               "<div class='g-popup-line-2' style='width: 50%;'>RESIDENTS PER:</div>" + 
        //               "<div class='g-popup-line-2' style='width: 25%; text-align: right;'>AIDE</div>" + 
        //               "<div class='g-popup-line-2' style='width: 25%; text-align: right;'>NURSE</div>" +
        //               "<div class='g-popup-divider'></div>" +
        //               "<div class='.g-popup-line-container'><div class='g-popup-line-3' style='width: 50%;'>Best days</div>" + 
        //               "<div class='g-popup-line-3' style='width: 25%; text-align: right; font-weight: 700;'>" + bestDayAide + "</div>" + 
        //               "<div class='g-popup-line-3' style='width: 25%; text-align: right; font-weight: 700;'>" + bestDayNurse + "</div></div>" +
        //               "<div class='.g-popup-line-container'><div class='g-popup-line-3' style='width: 50%;'>Worst days</div>" + 
        //               "<div class='g-popup-line-3' style='width: 25%; text-align: right; font-weight: 700;'>" + worstDayAide + "</div>" + 
        //               "<div class='g-popup-line-3' style='width: 25%; text-align: right; font-weight: 700;'>" + worstDayNurse + "</div></div>";




        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        // .setLngLat(_map.unproject(e.point))
        // console.log(feature)
        popup.setLngLat(coordinates)
          // .setHTML("<h4>Relics Information</h4>" + 
          //                     "<table>" + "<tr>" + 
          //                     "<th>Relics Classification" + "</th>" + "<th>Relics Era" + "</th>" + "<th>Relics Detail" + "</th>" + "</tr>" + "<tr>" + 
          //                     "<td>" + feature.properties.classification_en + "</td>" + "<td>" + feature.properties.era_en + "</td>" + "<td>" + feature.properties.add_detail + "</td>" + "</tr>" + 
          //                     "</table>"
          //                    )
          .setHTML(layout)
          .addTo(_map);

            // _map.getSource("highlight").setData({ "type":"circle",
            //                                       "coordinates": coordinates
            //                                       });
            // _map.setLayoutProperty("highlight", "visibility", "visible");
      });

      _map.on('mouseout', 'markers', function() {
        _map.getCanvas().style.cursor = '';
        popup.remove();
    });
    }

    _map.once ("style.load", function (e)
    {
      init ();
      _map.addControl (new mapboxgl.NavigationControl ());


    var layers = ['Architecture before 1912', 'Ruins', 'Architecture after 1912',
                 'Tomb', 'Cave temple and carving','Others'];
    var colors = ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f"];

    for (i = 0; i < layers.length; i++) {
      var layer = layers[i];
      var color = colors[i];
      var item = document.createElement('div');
      var key = document.createElement('span');
      key.className = 'legend-key';
      key.style.backgroundColor = color;
      var value = document.createElement('span');
      value.innerHTML = layer;
      item.appendChild(key);
      item.appendChild(value);
      legend.appendChild(item);
    }


    });