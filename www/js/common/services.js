
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
        var commonParams = 'app=' + config.APP_NAME + '&api=' + config.API_V + '&appv=' + config.APP_VERSION;
        if(!(excludeSessionId || false)) {
            var sessionId = auth.getSessionId();
            if((sessionId || '') != '') {
                commonParams += '&session_id=' + (sessionId || '');
            }
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
        var data = 'id_comune='+encodeURIComponent(params.city)+'&cognome='+encodeURIComponent(params.lastname)+'&nome='+encodeURIComponent(params.firstname)+
                   '&cell=' + encodeURIComponent(params.phone) + '&email='+encodeURIComponent(params.email) + '&indirizzo=' + encodeURIComponent(params.address) +
                   '&password=' + encodeURIComponent(params.password) + '&' + services.getRequestCommonParameters(true);
        $.ajax(url, {
            type: 'POST',
            data: data,
            timeout: config.REQUEST_DEFAULT_TIMEOUT
        }).done(function(result) {
            successCallback(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            failCallback(jqXHR.responseText, textStatus);
            //alert("Status: " + textStatus); alert("Error: " + errorThrown);
        });
    },
    
    
    recoverPassword: function(params, success, fail) {
        var url = config.URL_BASE + config.URL_USER_RECOVER_PASSWORD;
        var data = 'email='+encodeURIComponent(params.username) + '&' + services.getRequestCommonParameters(true);
console.log(data);
        $.ajax(url, {
            type: 'POST',
            data: data
        }).done(function(result) {
console.log('services.recoverPassword SUCCESS', result);
            if(success) success();
        }).fail(function(jqXHR, textStatus, errorThrown) {
console.log('services.recoverPassword FAIL', jqXHR);
            if(fail) fail(jqXHR.responseText);
        });
    },
    
    changePassword: function(params, success, fail) {
        var url = config.URL_BASE + config.URL_USER_CHANGE_PASSWORD;        
        var data = 'password_old='+encodeURIComponent(params.oldPassword)+'&password='+encodeURIComponent(params.newPassword)+
                   '&' + services.getRequestCommonParameters();
        $.ajax(url, {
            type: 'POST',
            data: data
        }).done(function(result) {
console.log('services.changePassword SUCCESS', result);
            if(success) success();
        }).fail(function(jqXHR, textStatus, errorThrown) {
console.log('services.changePassword FAIL', jqXHR);
            if(fail) fail(jqXHR.responseText);
        });
        
    },
    
    
    checkSession: function(completed) {
        if(auth.getSessionId() == '') {
            completed(false);
            return;
        }
        var url = config.URL_BASE + config.URL_USER_SESSION_CHECK;
        url += '&' + services.getRequestCommonParameters(true) + '&session_key='+auth.getSessionId();
        $.ajax(url, {
            type: 'GET',
            timeout: 3000
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
        //url += '&d=1';
console.log(auth.getSessionId());
//console.log(url);
        $.ajax(url, {
            type:'GET',
            dataType:'json',
            timeout: config.REQUEST_DEFAULT_TIMEOUT
        }).done(function(result) {
console.log('services.getProfile: SUCCESS', result);//return;
            var r = {
                firstname : result.anagrafica[0].nome,
                lastname : result.anagrafica[0].cognome,
                email : result.user.email,
                phone: result.anagrafica[0].telefono,
                city: {
                    id: (result.anagrafica[0].dic_comune_id || 0),
                    name: (result.anagrafica[0].comune || '').trim()
                },
                address: (result.anagrafica[0].indirizzo || '').trim(),
                id:result.anagrafica[0].sys_user_id,
                photo: result.user.logo
            };
console.log('services.getProfile: SUCCESS', r);//return;
            success(r);
        }).fail(function(jqXHR, textStatus, errorThrown) {
console.log('services.getProfile: FAIL', textStatus);
            if(fail) {
                fail(textStatus, services.isLoginRequired(jqXHR.status));
            }
        });
    },
    
    updateProfile: function(params, success, fail) {
        var url = config.URL_BASE + config.URL_PROFILE_UPDATE;
        url += '&' + services.getRequestCommonParameters();
        //url += '&d=1'
       /* data = 'cognome=' + encodeURIComponent(params.profile.lastname) +
               '&nome=' + encodeURIComponent(params.profile.firstname) +
               '&email=' + encodeURIComponent(params.profile.email) +
               '&id_comune=' + encodeURIComponent(params.profile.city.id) +
               '&indirizzo=' + encodeURIComponent(params.profile.address) +
               '&telefono=' + encodeURIComponent(params.profile.phone);       
console.log('services.updateProfile', url, data);
        $.ajax(url, {
            type: 'POST',
            data: data,
            //dataType: 'json',
        */
        var obj = {
            profilo: {
                cognome: params.profile.lastname,
                nome: params.profile.firstname,
                email: params.profile.email,
                id_comune: params.profile.city.id,
                indirizzo: params.profile.address,
                telefono: params.profile.phone
            }
        };
        if(params.profile.photos.length > 0) {
            obj.pictures = [];
            for(var i in params.profile.photos) {
                obj.pictures.push(params.profile.photos[i]);
            }
        } 
console.log('services.updateProfile', url, obj);
        $.ajax(url, {
            type: 'POST',
            url: url, 
            data: 'obj=' + encodeURIComponent(JSON.stringify(obj)),
            dataType: 'text',
        }).done(function(result) {
console.log('SUCCESS', result);//return;
            success(result);
            config.userProfileHasBeenSet(true);
        }).fail(function(jqXHR, textStatus, errorThrown) {
console.log('FAIL', textStatus, jqXHR);
            fail(jqXHR.responseText, services.isLoginRequired(jqXHR.status));
        });
    },
    
    deleteProfilePhoto: function(params, successCallback, failCallback) {
        var url = config.URL_BASE + config.URL_PROFILE_DELETE_PHOTO+'&' + services.getRequestCommonParameters();
        var data = 'id='+encodeURIComponent(params);
        console.log(url);
console.log('services.deleteProfilePhoto', data);
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
    
    deleteProfile: function (params, successCallback, failCallback){
        var url = config.URL_BASE + config.URL_PROFILE_DELETE;
        url += '&' + services.getRequestCommonParameters();
        var data = 'id='+encodeURIComponent(params);
        console.log('services.deleteProfile', data);
        $.ajax(url, {
            type : 'POST',
            data : data, 
            timeout: config.REQUEST_DEFAULT_TIMEOUT
        }).done(function(result){
            successCallback(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            failCallback(jqXHR.responseText);
        });
    },
    
    //////////////////////////////////////////////////////
    // QRCODE INFO RELATED FUNCTIONS
    
    getFollowings: function(params, success, fail) {
        var url = config.URL_BASE + config.URL_QRCODE_FOLLOWING;
        url += '&' + services.getRequestCommonParameters();
        $.ajax(url, {
            type:'GET',
            timeout: config.REQUEST_DEFAULT_TIMEOUT,
            dataType: 'json'
        }).done(function(result) {
//console.log('SUCCESS', result);return;
            success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
//console.log('FAIL', textStatus);
            fail(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    getInfoFromQrCodeSearch: function(code, success, fail) {
       
        var url = config.URL_BASE + config.URL_QRCODE_GET_INFO_SEARCH;
        
        
        url += '&'+services.getRequestCommonParameters();
        console.log(url+'&qrcode='+encodeURIComponent(code));
//console.log(url);
//console.log('qrcode=' + encodeURIComponent(code));
        $.ajax(url, {
            type: 'GET',
            data: 'qrcode=' + encodeURIComponent(code),
            timeout: config.REQUEST_DEFAULT_TIMEOUT,
            dataType: 'json'
        }).done(function(result) {
console.log('services.getInfoFromQrCode SUCCESS', result);//return;
            success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
console.log('services.getInfoFromQrCode FAIL', jqXHR);
            var loginRequired = services.isLoginRequired(jqXHR.status);
            fail(textStatus, false);
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
console.log('services.getInfoFromQrCode SUCCESS', result);//return;
            success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
console.log('services.getInfoFromQrCode FAIL', jqXHR);
            var loginRequired = services.isLoginRequired(jqXHR.status);
            fail(textStatus, false);
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
    invalidateSubscribedChannels: function() {
        self._subscribedChannels = null;
    },
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
        url += '&' + services.getRequestCommonParameters(true);
        var data = 'search='+params.name;
        $.ajax(url,{
            type:'GET',
            data:data,
            timeout: config.REQUEST_DEFAULT_TIMEOUT,
            dataType:'json'
        }).done(function(result) {
            success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            if(fail) fail(textStatus, services.isLoginRequired(jqXHR.status));
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
console.log(url);
console.log(data);
        $.ajax(url,{
            type:'GET',
            data:data,
            timeout: config.REQUEST_DEFAULT_TIMEOUT
        }).done(function(result) {
console.log("SUCCESS", result);
            if(success) success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
console.log("FAIL", textStatus);
            if(fail) fail(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
            
    /***
     *  Get paginated posts related to subscribed channels
     */
    getChannelContent: function(params, success, fail) {
        var url = config.URL_BASE + config.URL_NEWS_LIST;
        url += '&' + services.getRequestCommonParameters();
        var data = 'id_feed=' + params.channelId + 
                   '&f_id=' + (params.firstId || '')+ 
                   '&f_date=' + encodeURIComponent(params.firstDate || '') +
                   '&l_id=' + (params.lastId || '') +
                   '&l_date=' + encodeURIComponent(params.lastDate || '');
        if(params.onlyNew === true) data += '&new=1';
console.log(url);
console.log(data);//return;
        $.ajax(url,{
            type:'GET',
            data:data,
            timeout: config.REQUEST_DEFAULT_TIMEOUT,
            dataType: 'json',
        }).done(function(result) {
console.log("SUCCESS", result);
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
    
    leaveCommentNews: function(params, successCallback, failCallback) {
        var obj = {
            commento: {
                nome:params.nome,
                descrizione: params.comment,
                data:params.data,
                id_news: params.idNews,
            }
        };
        var url = config.URL_BASE + config.URL_NEWS_SEND_COMMENT;
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
    
    getCommentNews: function(code, success, fail) {
        var url = config.URL_BASE + config.URL_NEWS_GET_COMMENT;
        url += '&'+services.getRequestCommonParameters();
//console.log(url);
//console.log('qrcode=' + encodeURIComponent(code));
        $.ajax(url, {
            type: 'GET',
            data: 'result=' + encodeURIComponent(code),
            timeout: config.REQUEST_DEFAULT_TIMEOUT,
            dataType: 'json'
        }).done(function(result) {
console.log('services.getInfoFromQrCode SUCCESS', result);//return;
            success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
console.log('services.getInfoFromQrCode FAIL', jqXHR);
            var loginRequired = services.isLoginRequired(jqXHR.status);
            fail(textStatus, false);
        });
    },
    
    shareNewsPhoto: function(params, successCallback, failCallback) {
        var url = config.URL_BASE + config.URL_NEWS_SHARE+'&' + services.getRequestCommonParameters();
        var data = 'id='+encodeURIComponent(params);
        //url+= '&d=1';
        console.log(url);
//console.log('services.shareNewsPhoto', data);
        $.ajax(url, {
            type: 'POST',
            data: data,
          timeout: config.REQUEST_DEFAULT_TIMEOUT
        }).done(function(result) {
//console.log('services.shareNewsPhoto SUCCESS', result);
            successCallback(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
//console.log('services.shareNewsPhoto ERROR', result);
            failCallback(jqXHR.responseText);
        });
    },
    
    //////////////////////////////////////////////////////
    // "NEARBY PLACES" RELATED FUNCTIONS
    
    
    getNearbyPlaceTypes: function(success, fail) {
        var results = [
            {name: 'news', key: 'notizie', icon: 'img/nearby/Info.png'},
            {name: 'follow', key: 'qrcode', icon: 'img/nearby/QRCode.png'},
            {name: 'segnalazioni', key: 'segnalazioni', icon: 'img/nearby/Segnalazioni.png'},
            {name: 'suggeriti', key: 'suggeriti', icon: 'img/nearby/Suggeriti.png'},
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
            {name: 'stazioni di servizio', key: 'gas_station', icon: 'img/nearby/Rifornimento.png'},
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
        var url = config.URL_BASE + config.URL_NEARBY_PLACE_INFO;
        url += '&' + services.getRequestCommonParameters();
        var data = 'id=' + params.id + '&source=' + params.source
console.log(url + '&' + data);
        $.ajax(url, {
            type: 'GET',
            data: data, 
            //timeout: 8000, // 8 secs
            dataType: 'json'
        }).done(function(result) {
console.log("services.getNearbyPlaceInfo SUCCESS", result);
            success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
console.log("services.getNearbyPlaceInfo FAIL ", jqXHR);
            fail(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    
    //////////////////////////////////////////////////////
    // REPORTING RELATED FUNCTIONS
    _reportingCategories: null,  // cache results
    
    getReportingCategories: function(successCallback, failCallback) {
        /*if(services._reportingCategories != null) {
            successCallback(services._reportingCategories);
            return;
        }*/
        var url = config.URL_BASE + config.URL_REPORTING_CATEGORY_LIST + '&' + services.getRequestCommonParameters();
        $.ajax(url, {
            type: 'GET',
            timeout: config.REQUEST_DEFAULT_TIMEOUT,
            dataType: 'json'
        }).done(function(result) {
            //services._reportingCategories = result;
            successCallback(result);
console.log(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            failCallback(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    // SERVIZIO NUOVO PER OTTENERE SEGNALAZIONI DA SOLLECITARE
    getReportingSollecita: function(params, success, fail) {
        var url = config.URL_BASE + config.URL_REPORTING_GET_SOLLECITA;
        var obj = {
            segnalazione: {
                r_qr_code_id: reporting.qrCode,
                lat: reporting.latLng.lat,
                lon: reporting.latLng.lng,
                id_categoria: reporting.categoryId,
                indirizzo: reporting.address,
                comune: reporting.city,
                prov: reporting.prov,
            }
        };
        $.ajax(url, {
            type: 'GET',
            url: url, 
            data: 'obj=' + encodeURIComponent(JSON.stringify(obj)),
            dataType: 'text',
        }).done(function(result) {
console.log('services.getReportingSollecita, success');
            successCallback();
        }).fail(function(jqXHR, textStatus, errorThrown) {
console.log('services.getReportingSollecita fail,', jqXHR);
            failCallback(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    // SERVIZIO PER INVIARE LA SEGNALAZIONE DA SOLLECITARE
    sendReportingSollecita: function(id, success, fail) {        
console.log('Ingresso services.sendReportingSollecita');
        var url = config.URL_BASE + config.URL_REPORTING_SEND_SOLLECITA;
        var obj = {
            segnalazione: {
                id_segnalazione:id
            }
        }
        $.ajax(url, {
            type: 'POST',
            url: url, 
            data: 'obj=' + encodeURIComponent(JSON.stringify(obj)),
            dataType: 'text',
        }).done(function(result) {
console.log('services.sendReportingSollecita, success');            
            successCallback();
        }).fail(function(jqXHR, textStatus, errorThrown) {
console.log('services.sendReportingSollecita fail,', jqXHR);
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
                indirizzo: reporting.address,
                comune: reporting.city,
                prov: reporting.prov,
                descrizione: reporting.description,
                priorita: reporting.priority,
                anonima: reporting.private ? 1 : 0
            }
        };
        if(reporting.photos.length > 0) {
            obj.pictures = [];
            for(var i in reporting.photos) {
                obj.pictures.push(reporting.photos[i]);
            }
        }
//console.log('services.sendReporting', obj);
        $.ajax(url, {
            type: 'POST',
            url: url, 
            data: 'obj=' + encodeURIComponent(JSON.stringify(obj)),
            dataType: 'text',
        }).done(function(result) {
            successCallback(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
//console.log('services.sendReporting FAIL', jqXHR);
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
console.log('services.getReportingList SUCCESS', result);
            successCallback(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
console.log('services.getReportingList FAIL', jqXHR, textStatus);
            if(failCallback) failCallback(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    sendHidden: function(params, successCallback, failCallback) {
        var url = config.URL_BASE + config.URL_REPORTING_HIDDEN+'&' + services.getRequestCommonParameters();
        var data = 'recid='+encodeURIComponent(params);
console.log('services.sendHidden', data);
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
    
    sendRequestSupport: function(params, success, fail) {
        var url = config.URL_BASE + config.URL_SUPPORT;
        var data = 'message=' + encodeURIComponent(params.text) + '&' + services.getRequestCommonParameters();
        $.ajax(url, {
            type: 'get',
            data:data,
            timeout: config.REQUEST_DEFAULT_TIMEOUT
            //dataType: 'json'
        }).done(function(result) {
console.log('services.sendRequestSupport SUCCESS', result);
            success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
console.log('services.sendRequestSupport FAIL', jqXHR, textStatus);
            if(fail) fail(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    
    sendPrenotazione: function(params, success, fail) {
        var tel=$('#telefono_offerte').val();
        var reg = new RegExp('^[0-9]+$');
        if(reg.test(tel))
        {
            var url = config.URL_BASE + config.URL_PRENOTAZIONE;
            var data = '&id_prenotazione='+encodeURIComponent(params)+ '&' + services.getRequestCommonParameters(false);
            $.ajax(url, {
                type: 'POST',
                data: data,
                timeout: config.REQUEST_DEFAULT_TIMEOUT
            }).done(function(result) {
               $("#succesPrenotazione").fadeIn(500, 
               function()
                {
                    $('#telefono_offerte').val('');
                    setTimeout(
                            function()
                            {  
                                $("#prenotazioniPopup").animate({height: "0px"},500, function() {$("#succesPrenotazione").css("display","none")});
                            }
                            , 2000)
                            ;
                        });


            }).fail(function(jqXHR, textStatus, errorThrown) {

                //alert("Status: " + textStatus); alert("Error: " + errorThrown);
            });
        }
        else
        {
             $("#failPrenotazione").fadeIn(500, 
               function()
                {
                    $("#failPrenotazione").fadeIn(
                        200,
                        function()
                        { 
                            setInterval(
                                    function()
                                    {
                                        $("#failPrenotazione").fadeOut(200);
                                    },2000
                            )
                        }
                    );
                }
            );
        }    
    }
}