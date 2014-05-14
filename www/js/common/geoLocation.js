
var geoLocation = {
    
    
    loadGoogleMapsScript: function(callbackName) {
        /*
        var googleMapsRef = document.createElement('script');
        googleMapsRef.setAttribute("type", "text/javascript");
        googleMapsRef.setAttribute("src", "https://maps.googleapis.com/maps/api/js?key="+config.GOOGLE_MAPS_API_KEY+"&sensor="+config.GOOGLE_MAPS_SENSOR);
        alert('loaded\n' + googleMapsRef.getAttribute("src"));
         */
        var url = "https://maps.googleapis.com/maps/api/js?";
        if(callbackName != "")
            url += "callback=" + callbackName + "&";
        url += "key="+config.GOOGLE_MAPS_API_KEY+"&sensor="+config.GOOGLE_MAPS_SENSOR;
        
        $.getScript(url, function( data, textStatus, jqxhr ) {
            //console.log(data ); // Data returned
            //console.log(textStatus ); // Success
            //console.log(jqxhr.status ); // 200
            console.log("Google Maps scripts was loaded" );
        });
    },    
    
    
    acquireGeoCoordinates: function(successCallback, errorCallback) {
        
        var options = {maximumAge: config.GEO_OPTS_MAXIMUM_AGE,
                       timeout: config.GEO_OPTS_TIMEOUT, 
                       enableHighAccuracy: config.GEO_OPTS_HIGH_ACCURACY};
        
        
        if(config.EMULATE_ON_BROWSER) {
            //errorCallback('errorino');return;
            if(successCallback) {
                var lat = 38.858364, lng = 16.549469, accuracy = 15;
                successCallback(
                    {coords: {longitude: lng, latitude: lat, accuracy: accuracy}}
                );
            }
            return;
        }
        
        navigator.geolocation.getCurrentPosition(function(position) {  
            // success
            if(successCallback) successCallback(position);
        }, function (error) {
            // error
            // Impossibile recuperare le coordinate geografiche.                                                    
            var errorMessage = '';
            switch(error.code) {
                // Returned when the user does not allow your application to 
                // retrieve position information.
                // This is dependent on the platform.
                case PositionError.PERMISSION_DENIED:
                    errorMessage = 'Permesso negato';
                    break;
                    
                // Returned when the device was unable to retrieve a position.
                // In general this means the device has no network connectivity
                // and/or cannot get a satellite fix.
                case PositionError.POSITION_UNAVAILABLE:
                    errorMessage = 'Posizione non disponibile';
                    break;
                    
                // Returned when the device was unable to retrieve a position
                // within the time specified in the geolocationOptions' timeout
                // property.
                case PositionError.TIMEOUT:
                    errorMessage = 'Impossibile recuperare la posizione';
                    break;
            }
            if(errorCallback) errorCallback(errorMessage, error);
        }, options);
    },

    
    
}