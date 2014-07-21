
var services = {
    
    self: this,
    
    // see:
    // http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
    CODE_SUCCESS: 200,
    CODE_UNAUTHORIZED: 401,
    CODE_FORBIDDEN: 403,
    CODE_NOT_FOUND: 404,
    CODE_REQUEST_ENTITY_TOO_LARGE: 413,
    //440 Login Timeout //(Microsoft) A Microsoft extension. Indicates that your session has expired.[18]
    CODE_INTERNAL_SERVER_ERROR: 500,
    CODE_SERVICE_UNAVAILABLE: 503, 
    
    
    getRequestCommonParameters: function(excludeSessionId) {
        var commonParams = 'app=' + config.APP_NAME + '&api=' + config.API_V;
        if(!(excludeSessionId || false)) {
            var sessionId = auth.getSessionId();
            //if((sessionId || '') != '') commonParams += '&session_id=' + sessionId;
            commonParams += '&session_id=' + (sessionId || '');
        }
        if(typeof(device) != 'undefined') {
            commonParams += '&uuid=' + device.uuid;
            commonParams += '&platform=' + device.platform;
        } else if(config.EMULATE_ON_BROWSER) {
            commonParams += '&uuid=browser_emulation';
        }
        if(typeof(app) != 'undefined') commonParams += '&lang=' + app.language;
        return commonParams;
    },

    
    isLoginRequired: function(httpCode) {
        return ((httpCode == services.CODE_UNAUTHORIZED) || (httpCode == services.CODE_FORBIDDEN));
    },
    
    
    registerUser: function(params, successCallback, failCallback) {
        var url = config.URL_BASE + config.URL_USER_REGISTER;
        var data = 'cognome='+encodeURIComponent(params.lastname)+'&nome='+encodeURIComponent(params.firstname)+
                   '&email='+encodeURIComponent(params.email) + '&' + services.getRequestCommonParameters(true);
        $.ajax(url, {
            type: 'POST',
            data: data,
            timeout: config.REQUEST_DEFAULT_TIMEOUT
        }).done(function(result) {
            successCallback(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            failCallback(jqXHR.responseText);
        });
    },
    
    
    /*
    getSummaryData: function(successCallback, failCallback) {
        // TODO
        var result = {
            reportingCount: '?',
            newsCount: '?',
            commentsCount: '?'
        };
        successCallback(result);
    },*/
    
    
    checkSession: function(completed) {
        if(auth.getSessionId() == '') {
            completed(false);
            return;
        }
        var url = config.URL_BASE + config.URL_USER_SESSION_CHECK;
        url += '&' + services.getRequestCommonParameters(true) + '&session_key='+auth.getSessionId();
        $.ajax(url, {
            type: 'GET',
        }).done(function(result) {
            console.log('services.checkSession: success ', result);
            completed(result == '1');
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log('services.checkSession: fail ', jqXHR);
            completed(false);
        });
    },
    
    
    
    
    
    //////////////////////////////////////////////////////
    // PROFILE RELATED FUNCTIONS
    
    getProfile: function(params, success, fail) {
        var url = config.URL_BASE + config.URL_PROFILE_LOAD;
        url += '&' + services.getRequestCommonParameters();
        $.ajax(url, {
            type:'GET',
            dataType:'json',
            timeout: config.REQUEST_DEFAULT_TIMEOUT
        }).done(function(result) {
console.log('SUCCESS', result);//return;
            var r = {
                firstname : result.anagrafica[0].nome,
                lastname : result.anagrafica[0].cognome,
                email : result.user.email,
                phone: result.anagrafica[0].telefono,
                city: {
                    id: (result.anagrafica[0].dic_comune_id || 0),
                    name: result.anagrafica[0].comune
                }
            };
            success(r);
        }).fail(function(jqXHR, textStatus, errorThrown) {
console.log('FAIL', textStatus);
            fail(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    updateProfile: function(params, success, fail) {
        var url = config.URL_BASE + config.URL_PROFILE_UPDATE;
        url += '&' + services.getRequestCommonParameters();
        data = 'cognome=' + encodeURIComponent(params.profile.lastname) +
               '&nome=' + encodeURIComponent(params.profile.firstname) +
               '&email=' + encodeURIComponent(params.profile.email) +
               '&id_comune=' + encodeURIComponent(params.profile.city.id);
//console.log(url, data);
        $.ajax(url, {
            type: 'POST',
            data: data,
            //dataType: 'json',
        }).done(function(result) {
//console.log('SUCCESS', result);//return;
            success(result);
            config.userProfileHasBeenSet(true);
        }).fail(function(jqXHR, textStatus, errorThrown) {
//console.log('FAIL', textStatus);
            fail(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    
    //////////////////////////////////////////////////////
    // QRCODE INFO RELATED FUNCTIONS
    
    
    getFollowings: function(params, success, fail) {
        var url = config.URL_BASE + config.URL_QRCODE_FOLLOWING;
        url += '&' + services.getRequestCommonParameters();
        $.ajax(url, {
            type:'GET',
            dataType: 'json'
        }).done(function(result) {
//console.log('SUCCESS', result);return;
            success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
//console.log('FAIL', textStatus);
            fail(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    
    getInfoFromQrCode: function(code, success, fail) {
        var url = config.URL_BASE + config.URL_QRCODE_GET_INFO;
        url += '&'+services.getRequestCommonParameters();
//console.log(url);
//console.log('qrcode=' + encodeURIComponent(code));
        $.ajax(url, {
            type: 'GET',
            data: 'qrcode=' + encodeURIComponent(code),
            timeout: config.REQUEST_DEFAULT_TIMEOUT,
            dataType: 'json'
        }).done(function(result) {
console.log('SUCCESS', result);//return;
            success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
console.log('FAIL', jqXHR);
            fail(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    followQrCode: function(code, follow, success, fail) {
        var url = config.URL_BASE + ((follow === true) ? config.URL_QRCODE_FOLLOW : config.URL_QRCODE_UNFOLLOW);
        url += '&'+services.getRequestCommonParameters();
        url += '&qrcode='+encodeURIComponent(code);
//console.log(url);//return;
        $.ajax(url, {
            type: 'GET',
            timeout: config.REQUEST_DEFAULT_TIMEOUT
        }).done(function(result) {
//console.log('SUCCESS', result);//return;
            //if(success) success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            //if(fail) fail(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    leaveCommentOnQrCode: function(params, successCallback, failCallback) {
        var obj = {
            commento: {
                descrizione: params.comment,
                r_qr_code_id: params.qrCodeId,
            }
        };
        var url = config.URL_BASE + config.URL_QRCODE_SEND_COMMENT;
        url += '&' + services.getRequestCommonParameters();
        $.ajax(url, {
            type: 'POST',
            data: 'obj='+JSON.stringify(obj),
            timeout: config.REQUEST_DEFAULT_TIMEOUT
        }).done(function(result) {
            successCallback(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            failCallback(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    
    
    //////////////////////////////////////////////////////
    // NEWS RELATED FUNCTIONS
    
    /***
     *  Retrieve subscribed channel of the current user
     */
    _subscribedChannels: null,  // cache results
    getSubscribedChannels: function(success, fail) {
        if(self._subscribedChannels != null) {
//console.log('FROM CACHE', self._subscribedChannels);
            success(self._subscribedChannels);
            return;
        }
        var url = config.URL_BASE + config.URL_NEWS_SUBSCRIBED_CHANNELS
        url += '&' + services.getRequestCommonParameters();
        $.ajax(url,{
            type:'GET',
            dataType:'json',
            timeout: config.REQUEST_DEFAULT_TIMEOUT
        }).done(function(result) {
//console.log('FROM SERVER', result);
            self._subscribedChannels = result;
            success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            fail(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    /***
     *  Retrieve the location names based to the latitude and longitude
     */
    getNearbyLocations: function(params, success, fail) {
        var url = config.URL_BASE + config.URL_NEWS_NEARBY_LOCATION;
        url += '&' + services.getRequestCommonParameters();
        var data = 'lat='+params.coords.latitude+'&lon='+params.coords.longitude;
        $.ajax(url,{
            type:'GET',
            data:data,
            timeout: config.REQUEST_DEFAULT_TIMEOUT,
            dataType:'json'
        }).done(function(result) {
            success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            fail(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    getLocationsByName: function(params, success, fail) {
        var url = config.URL_BASE + config.URL_NEWS_SEARCH_LOCATION;
        url += '&' + services.getRequestCommonParameters();
        var data = 'search='+params.name;
        $.ajax(url,{
            type:'GET',
            data:data,
            timeout: config.REQUEST_DEFAULT_TIMEOUT,
            dataType:'json'
        }).done(function(result) {
            success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            fail(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    /***
     *  Retrieve the available channels gived a geo location
     */
    getAvailableChannels: function(params, success, fail) {
        var url = config.URL_BASE + config.URL_NEWS_CHANNELS;
        url += '&' + services.getRequestCommonParameters();
        var data = '&id_comune=' + params.cityId +
                   '&id_provincia=' + params.provId +
                   '&id_regione=' + params.regionId;
//console.log(url, data);
        $.ajax(url,{
            type:'GET',
            data:data,
            timeout: config.REQUEST_DEFAULT_TIMEOUT,
            dataType:'json'
        }).done(function(result) {
//console.log("SUCCESS", result);
            success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
//console.log("FAIL", textStatus);
            fail(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    
    getChannelInfo: function(params, success, fail) {
        var url = config.URL_BASE + config.URL_NEWS_CHANNEL_INFO;
        url += '&' + services.getRequestCommonParameters();
        var data = 'feeds=' + params.ids.join(',');
        $.ajax(url, {
            type:'GET', 
            data: data,
            dataType:'json',
            timeout: config.REQUEST_DEFAULT_TIMEOUT
        }).done(function(result) {
//console.log("SUCCESS", result);//return;
            if(success) success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
console.log("FAIL", textStatus);
            if(fail) fail(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    subscribeToChannel: function(params, success, fail) {
        // Invalidate cache
        self._subscribedChannels = null;
        //parasm:{channelId: channelId, subscribe: subscribe});
        var url = config.URL_BASE + (params.subscribe ? config.URL_NEWS_SUBSCRIBE_CHANNEL : config.URL_NEWS_UNSUBSCRIBE_CHANNEL);
        url += '&' + services.getRequestCommonParameters();
        data = 'id_feed=' + params.channelId;
        $.ajax(url,{
            type:'GET',
            data:data,
            timeout: config.REQUEST_DEFAULT_TIMEOUT
        }).done(function(result) {
//console.log("SUCCESS", result);
            if(success) success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
//console.log("FAIL", textStatus);
            if(fail) fail(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
            
    /***
     *  Get paginated posts related to subscribed channels
     */
    getChannelContent: function(params, success, fail) {
        var url = config.URL_BASE + config.URL_NEWS_LIST;
        url += '&' + services.getRequestCommonParameters();
        var data = 'id_feed=' + params.channelId + '&f_id=' + params.firstId + '&l_id=' + params.lastId;
        if(params.onlyNew === true) data += '&new=1';
console.log(data);//return;
        $.ajax(url,{
            type:'GET',
            data:data,
            timeout: config.REQUEST_DEFAULT_TIMEOUT,
            dataType: 'json',
        }).done(function(result) {
console.log("SUCCESS", result);
/*
// Test
result.nuove = [
    {data_inserimento: "2014-06-06 14:13:44", descrizione: "Questa è una prova&nbsp;", id: "12", id_categoria: "25", oggetto: "Prova inserimento nuovi", stato: "1", sys_user_fk: "38"},
    {data_inserimento: "2014-06-06 14:13:44", descrizione: "Questa è una prova&nbsp;", id: "12", id_categoria: "25", oggetto: "Prova inserimento nuovi", stato: "1", sys_user_fk: "38"},
    {data_inserimento: "2014-06-06 14:13:44", descrizione: "Questa è una prova&nbsp;", id: "12", id_categoria: "25", oggetto: "Prova inserimento nuovi", stato: "1", sys_user_fk: "38"},
    {data_inserimento: "2014-06-06 14:13:44", descrizione: "Questa è una prova&nbsp;", id: "12", id_categoria: "25", oggetto: "Prova inserimento nuovi", stato: "1", sys_user_fk: "38"},
];*/
            success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
console.log("FAIL", textStatus);
            fail(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    
    getChannelContentDetail: function(params, success, fail) {
        var url = config.URL_BASE + config.URL_NEWS_DETAIL;
        url += '&' + services.getRequestCommonParameters();
        var data = "id_notizia=" + params.id;
        $.ajax(url,{
            type:'GET',
            data:data,
            timeout: config.REQUEST_DEFAULT_TIMEOUT,
            dataType: 'json',
        }).done(function(result) {
console.log("services.getChannelContetnDetail SUCCESS", result);
            if(Array.isArray(result) && (result.length == 1))
                success(result[0]);
            else
                success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
//console.log("FAIL", textStatus);
            fail(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    
    
    
    //////////////////////////////////////////////////////
    // "NEARBY PLACES" RELATED FUNCTIONS
    
    
    getNearbyPlaceTypes: function(success, fail) {
        var results = [
            {name: 'aeroporti', key: 'airport', icon: 'img/nearby/Aeroporto.png'},
            {name: 'autobus', key: 'bus_station', icon: 'img/nearby/Autobus.png'},
            {name: 'bancomat', key: 'atm', icon: 'img/nearby/Banca.png'},
            {name: 'bar', key: 'bar', icon: 'img/nearby/Bar.png'},
            {name: 'biblioteche', key: 'library', icon: 'img/nearby/Biblioteca.png'},
            {name: 'cinema', key: 'movie_theater', icon: 'img/nearby/Cinema.png'},
            {name: 'farmacie', key: 'pharmacy', icon: 'img/nearby/Farmacia.png'},
            {name: 'fitness', key: 'gym', icon: 'img/nearby/Centro-Sportivo.png'},
            {name: 'musei', key: 'museum', icon: 'img/nearby/Museo.png'},
            {name: 'ospedali', key: 'hospital', icon: 'img/nearby/Ospedale.png'},
            {name: 'parcheggi', key: 'parking', icon: 'img/nearby/Parcheggio.png'},
            {name: 'ristoranti', key: 'restaurant', icon: 'img/nearby/Ristorante.png'},
            {name: 'stazioni di servizio', key: 'gas_station', icon: 'img/nearby/Rifornimeto.png'},
            {name: 'uffici postali', key: 'post_office', icon: 'img/nearby/Ufficio-Postali.png'},
        ];
        success(results);
    },
    
    getNearbyPlaces: function(params, success, fail) {
        var placeCatId = params.placeCatId;
        var lat = params.coords.latitude;
        var lng = params.coords.longitude;
        var distance = params.distance;
        
        var url = config.URL_BASE + config.URL_NEARBY_PLACES;
        url += '&' + services.getRequestCommonParameters();
        //var url = config.URL_NEARBY_PLACES;
        var data = 'types='+placeCatId+'&lat='+lat+'&lng='+lng+'&distance='+distance;
console.log(data);
        $.ajax(url, {
            type:'GET', 
            data:data,
            //timeout: 8000,  // 5 secs
            dataType: 'json'
        }).done(function(result) {
console.log("NEARBYPLACES SUCCESS", result);            
            success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
console.log("NEARBYPLACES FAIL", jqXHR);
            fail(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    getNearbyPlaceInfo: function(params, success, fail) {
        // TODO
        var url = config.URL_BASE + config.URL_NEARBY_PLACE_INFO;
        url += '&' + services.getRequestCommonParameters();
        //var url = config.URL_NEARBY_PLACE_INFO;
        var data = 'id=' + params.id + '&source=' + params.source
//console.log(data);
        $.ajax(url, {
            type: 'GET',
            data: data, 
            //timeout: 8000, // 8 secs
            dataType: 'json'
        }).done(function(result) {
//console.log("NEARBYPLACEINFO SUCCESS", result);
            success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
//console.log("NEARBYPLACEINFO FAIL ", jqXHR);
            fail(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    
    
    
    //////////////////////////////////////////////////////
    // REPORTING RELATED FUNCTIONS
    _reportingCategories: null,  // cache results
    
    getReportingCategories: function(successCallbak, failCallback) {
        if(services._reportingCategories != null) {
            successCallbak(services._reportingCategories);
            return;
        }
        var url = config.URL_BASE + config.URL_REPORTING_CATEGORY_LIST + '&' + services.getRequestCommonParameters();
        $.ajax(url, {
            type: 'GET',
            timeout: config.REQUEST_DEFAULT_TIMEOUT,
            dataType: 'json'
        }).done(function(result) {
            services._reportingCategories = result;
            successCallbak(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            failCallback(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    sendReporting: function(reporting, successCallback, failCallback) {
        var url = config.URL_BASE + config.URL_REPORTING_SEND + '&' + services.getRequestCommonParameters();
        var obj = {
            segnalazione: {
                r_qr_code_id: reporting.qrCode,
                lat: reporting.latLng.lat,
                lon: reporting.latLng.lng,
                id_categoria: reporting.categoryId,
                indirizzo: reporting.road,
                comune: reporting.city,
                prov: reporting.prov,
                descrizione: reporting.description,
            }
        };
        if(reporting.photos.length > 0) {
            obj.pictures = [];
            for(var i in reporting.photos) {
                obj.pictures.push(reporting.photos[i]);
            }
        }
        $.ajax(url, {
            type: 'POST',
            //async: false,
            url: url, 
            data: 'obj=' + encodeURIComponent(JSON.stringify(obj)),
            //timeout: config.REQUEST_DEFAULT_TIMEOUT,
            dataType: 'text',
        }).done(function(result) {
            successCallback();
        }).fail(function(jqXHR, textStatus, errorThrown) {
            failCallback(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    getReportingList: function(params, successCallback, failCallback) {
        var url = config.URL_BASE + config.URL_REPORTING_LIST;
        var data = services.getRequestCommonParameters();
        $.ajax(url, {
            type: 'get',
            data:data,
            timeout: config.REQUEST_DEFAULT_TIMEOUT,
            dataType: 'json'
        }).done(function(result) {
            successCallback(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
console.log('FAIL', jqXHR, textStatus);
            failCallback(textStatus, services.isLoginRequired(jqXHR.status));
        });
    }
}