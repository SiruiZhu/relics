parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"HK/x":[function(require,module,exports) {
module.exports="/architecture_point_completed.1b80faaf.geojson";
},{}],"8hoJ":[function(require,module,exports) {
var e=null,a=35.5,r=105,t=require("./data/architecture_point_completed.geojson"),s="pk.eyJ1Ijoiemh1c2lydWkiLCJhIjoiczRLMGhEMCJ9.37GHQC_3mSKufR5ERmXsLw",o="mapbox://styles/zhusirui/cjote0r366qqd2spcea8df8td";function n(){e.addSource("markers-source",{type:"geojson",data:t}),e.addLayer({id:"markers",type:"circle",source:"markers-source",paint:{"circle-color":{property:"classification_en",type:"categorical",stops:[["Ancient architecture","#66c2a5"],["Ancient ruins","#fc8d62"],["Historical buildings of modern times","#8da0cb"],["Ancient tomb","#e78ac3"],["Cave temple and stone carving","#a6d854"],["others","#ffd92f"]]},"circle-radius":3.5,"circle-stroke-width":.5}});var a=new mapboxgl.Popup({closeButton:!1,closeOnClick:!1});e.on("mouseenter","markers",function(r){e.getCanvas().style.cursor="default";var t=r.features[0].geometry.coordinates.slice();r.features[0],r.features[0].properties;title=r.features[0].properties.name_en,era=r.features[0].properties.era_en,address=r.features[0].properties.province_en,type=r.features[0].properties.classification_en;for(var s="<div class='g-popup-line-1'>"+title+"</div><div class='g-popup-divider'></div><div class='g-popup-line-1-address'>Province: "+address+"</div><div class='g-popup-line-1-address'>Type: "+type+"</div><div class='g-popup-line-1-address'>Era: "+era+"</div></div></div>";Math.abs(r.lngLat.lng-t[0])>180;)t[0]+=r.lngLat.lng>t[0]?360:-360;a.setLngLat(t).setHTML(s).addTo(e)}),e.on("mouseout","markers",function(){e.getCanvas().style.cursor="",a.remove()})}mapboxgl.accessToken=s,(e=new mapboxgl.Map({container:"map",style:o,center:[r,a],zoom:3.3})).once("style.load",function(a){n(),e.addControl(new mapboxgl.NavigationControl);var r=["Architecture before 1912","Ruins","Architecture after 1912","Tomb","Cave temple and carving","Others"],t=["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f"];for(i=0;i<r.length;i++){var s=r[i],o=t[i],c=document.createElement("div"),d=document.createElement("span");d.className="legend-key",d.style.backgroundColor=o;var l=document.createElement("span");l.innerHTML=s,c.appendChild(d),c.appendChild(l),legend.appendChild(c)}});
},{"./data/architecture_point_completed.geojson":"HK/x"}]},{},["8hoJ"], null)
//# sourceMappingURL=/interactive_map.e29daa87.map