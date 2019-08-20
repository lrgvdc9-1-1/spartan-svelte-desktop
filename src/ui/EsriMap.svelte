<script>
    
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';

    //Import Props
    export let center;
    export let pictureURLMarker;

    const dispatch = createEventDispatcher();
    let map;
    let mapElement; //The element to create the map...

    //Lazy Load the esri Library if needed...
    let urlEsriJSAPI = "https://js.arcgis.com/3.28/";
    
    //Any other MapServices As needed...
    let mapflex = "https://gis.lrgvdc911.org/arcgis/rest/services/Dynamic/MapFlex/MapServer";


    
    

     //Lets load the esri Javascript..
       var loadScriptAsync = (uri) =>{
           var script = getScript();
           var loaded = isLoaded(); 
           return new Promise((resolve, reject) => {
               if(script && loaded) {
                   resolve();
               }else {
                    const script = document.createElement('script');
                    script.src = uri;
                    script.async = true;
                    script.setAttribute("data-esri-loader", 'loading');
                    script.onload  = () => {
                        setTimeout(() => {
                            resolve(script);
                        }, 150);
                        
                    }
                    document.body.appendChild(script); // Append it to the 
               }
               
           });
       }

    function getScript(){
        return document.querySelector('script[data-esri-loader]');
    }

    function isLoaded() {
        const globalRequire = window['require'];
       
        // .on() ensures that it's Dojo's AMD loader
        return globalRequire;
    }
    
    //When component is mound then load the esri library...
   onMount(async () => {
        console.log("AM STARTING");
        if(getScript() && isLoaded()) {
            loadMap()
        }else{ //Async Load the Esri Library cuz we need it..
             loadScriptAsync(urlEsriJSAPI).then(() => {
               if(isLoaded()) {
                   loadMap();
               }
               
            });
        }
    });

    //Once the component is destroy need to destroy any map instance if available..

    onDestroy(() => { //Destroy the instance of the map...
        if(map) { //If instance then destroy the map..
            map.destroy();
        }
    })

    async function loadMap() {
        

       await require(["esri/map","esri/layers/ArcGISDynamicMapServiceLayer","esri/geometry/Circle", "esri/symbols/PictureMarkerSymbol"], function(Map,ArcGISDynamicMapServiceLayer,Circle, PictureMarkerSymbol) {
            
            //Lets Make Sure we have a center needed...
            if (!center[0] && !center[1]) {
                console.log("ERROR");
                
                dispatch("MapError");
                return;
            }else {
                center[0] = (typeof center[0] === 'string' || center[0] instanceof String) ? parseFloat(center[0]) : center[0];
                center[1] = typeof center[1] === 'string' || center[1] instanceof String ? parseFloat(center[1]) : center[1];
            }

                map =  new Map(mapElement, {
                center: center,
                slider: false
                });
                map.addLayer(new ArcGISDynamicMapServiceLayer(mapflex));
                map.on("load", (event) => {
                    if(pictureURLMarker){
                        var point = new esri.geometry.Point(center[0], center[1]);
                        var symbol = new PictureMarkerSymbol(pictureURLMarker, 51, 51)
                        map.graphics.add(new esri.Graphic(point, symbol));

                        //Zoom To Extent
                        var circleGeometry = new Circle(point,{
                            "radius": 1000
                        });
                        map.setExtent(circleGeometry.getExtent());
                    }
                })
        }); 
    }
</script>

<div bind:this={mapElement}>

</div>