
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
    
    
    acquireGeoCoordinates: function(successCallback, errorCallback, opts) {
        var highAccuracy = config.GEO_OPTS_HIGH_ACCURACY;
        if((opts != null) && (opts.enableHighAccuracy != null)) {
            highAccuracy = opts.enableHighAccuracy;
        }
        var options = {maximumAge: config.GEO_OPTS_MAXIMUM_AGE,
                       timeout: config.GEO_OPTS_TIMEOUT, 
                       enableHighAccuracy: highAccuracy};
        
        if(config.EMULATE_ON_BROWSER) {
if(options.enableHighAccuracy === true) {
    errorCallback('Fake error message');
    return;
}
            if(successCallback) {
                var lat = 38.858364, lng = 16.549469, accuracy = 15;
                //lat = 38.810899; lng = 16.603324;
                setTimeout(function() {
                    successCallback(
                        {coords: {longitude: lng, latitude: lat, accuracy: accuracy}}
                    );
                }, 500);
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
                    errorMessage = 'Impossibile recuperare la tua posizione';
                    break;
            }
            if(errorCallback) errorCallback(errorMessage, error);
        }, options);
    },

    
    
    
    
    geocode: function(params, success) {
        geoLocation._googleGeocode(params, success);
    },
    
    _googleGeocode: function(params, success) {
        var addressParts = [];
        if(params) {
            if(params.prov) addressParts.push(params.prov);
            if(params.city) addressParts.push(params.city);
            if(params.address) addressParts.push(params.address);
        }
//console.log('geoLocation._googleGeocode pars length: ' + addressParts.length);
        if(addressParts.length == 0) success();
        var address = 'Italia, ' + addressParts.join(', ');
//console.log('geoLocation._googleGeocode searching for: ' + address);
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': address}, function(results, status) {
//console.log('geoLocation._googleGeocode status: ' + status);
            if (status == google.maps.GeocoderStatus.OK) {
//console.log('geoLocation._googleGeocode result: ', results[0]);
                if(results[0] && results[0].formatted_address) {
//console.log('geoLocation._googleGeocode address: ' + results[0].formatted_address);
                    if(results[0].formatted_address.toLowerCase().indexOf('italia') == -1) {
                        success();
                    }
                } 
                /*if(results[0].partial_match === true) {
console.log('geoLocation._googleGeocode partial match');
                    return;
                }*/
                if(results[0] && results[0].geometry && results[0].geometry.location) {
//console.log('geoLocation._googleGeocode result location: ', results[0].geometry.location);
                    success(results[0].geometry.location);
                }
            } else {
                success();
            }
        });
    },
    
    
    
    reverseGeocoding: function(params, successCallback) {
//params.lat = 38.827707; params.lng = 16.628456; // Via Caprera 144
//params.lat = 38.827512; params.lng = 16.627475; // Via Niccoloso da Recco 6
        //geoLocation._googleReverseGeocoding(params, successCallback);
        geoLocation._osmReverseGeocoding(params, successCallback);
    },
    
    
    _googleReverseGeocoding: function(params, successCallback) {
        if(google == null) return;
        var latLng = new google.maps.LatLng(params.lat, params.lng);
        var geocoder = new google.maps.Geocoder();
        var reqParams = {
            latLng: latLng,
            language: 'it'
        };
        geocoder.geocode(reqParams, function(results, status) {
            if(status == google.maps.GeocoderStatus.OK) {
                var firstResult = results[0];
                var retVal = {
                    prov: '',
                    city: '',
                    road: '',
                    streetNumber: '',
                };
console.log(firstResult);
                for(var i=0, len=firstResult.address_components.length; i<len; i++) {
                    var ac = firstResult.address_components[i];
                    if(ac.types.indexOf("administrative_area_level_3") >= 0) retVal.city = ac.long_name;
                    if(ac.types.indexOf("administrative_area_level_2") >= 0) retVal.prov = ac.short_name;
                    if((ac.types.indexOf("route") >= 0) && (ac.long_name.toLowerCase() != 'unnamed road')) retVal.road = ac.long_name;
                    if(ac.types.indexOf("street_number") >= 0) retVal.streetNumber = ac.long_name;
                }
                successCallback(retVal);
            }
        });
        successCallback();
        // https://maps.googleapis.com/maps/api/geocode/json?language=it&latlng=38.858364,16.549469&sensor=false&location_type=ROOFTOP&result_type=street_address&key=AIzaSyCP3LSUtIAVLhGhp65HQCvHd3u0Ee4HqzQ
    },
    
    
    _osmReverseGeocoding: function(params, successCallBack) {
        // http://nominatim.openstreetmap.org/reverse?lat=38.858364&lon=16.549469&format=json&addressdetails=1&zoom=18
        var url = 'http://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&zoom=18&lat=' + params.lat +'&lon=' + params.lng;
        $.get(url, function(result) {
            var retVal = {
                prov: result.address.county,
                city: result.address.city,
                road: result.address.road,
                streetNumber: '',
            };
console.log(result);
            successCallBack(retVal);
        });
    }
}