
var services = {
    
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
        if(typeof(device) != 'undefined') commonParams += '&uuid=' + device.uuid;
        if(typeof(device) == 'undefined' && config.EMULATE_ON_BROWSER) commonParams += '&uuid=browser_emulation';
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
            data: data
        }).done(function(result) {
            successCallback(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            failCallback(jqXHR.responseText);
        });
    },
    
    
    getSummaryData: function(successCallback, failCallback) {
        // TODO
        var result = {
            reportingCount: '?',
            newsCount: '?',
            commentsCount: '?'
        };
        successCallback(result);
    },
    
    
    
    //////////////////////////////////////////////////////
    // QRCODE INFO RELATED FUNCTIONS
    
    getInfoFromQrCode: function(code, successCallback, failCallback) {
        var url = config.URL_BASE + config.URL_QRCODE_GET_INFO;
        url += '&'+services.getRequestCommonParameters();
        $.ajax(url, {
            type: 'GET',
            data: 'qrcode=' + encodeURIComponent(code),
            dataType: 'json'
        }).done(function(result) {
//console.log('SUCCESS', result);//return;
            successCallback(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
//console.log('FAIL', textStatus);
            failCallback(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    followQrCode: function(follow) {
        // TODO
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
//console.log(url, obj);
        $.ajax(url, {
            type: 'POST',
            data: 'obj='+JSON.stringify(obj)
        }).done(function(result) {
//console.log('SUCCESS', result);
            successCallback(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
//console.log('FAIL', textStatus);
            failCallback(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    
    
    //////////////////////////////////////////////////////
    // NEWS RELATED FUNCTIONS
    
    /***
     *  Retrieve subscribed channel of the current user
     */
    getSubscribedChannels: function(success, fail) {
        var url = config.URL_BASE + config.URL_NEWS_SUBSCRIBED_CHANNELS
        url += '&' + services.getRequestCommonParameters();
        $.ajax(url,{
            type:'GET',
            dataType:'json'
        }).done(function(result) {
//console.log("SUCCESS", result);
            success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
//console.log("FAIL", jqXHR);
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
            dataType:'json'
        }).done(function(result) {
//console.log("SUCCESS", result);
            success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
//console.log("FAIL", textStatus);
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
            dataType:'json'
        }).done(function(result) {
//console.log("SUCCESS", result);
            success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
//console.log("FAIL", textStatus);
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
            dataType:'json'
        }).done(function(result) {
//console.log("SUCCESS", result);
            success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
//console.log("FAIL", textStatus);
            fail(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    subscribeToChannel: function(params, success, fail) {
        //parasm:{channelId: channelId, subscribe: subscribe});
        var url = config.URL_BASE + (params.subscribe ? config.URL_NEWS_SUBSCRIBE_CHANNEL : config.URL_NEWS_UNSUBSCRIBE_CHANNEL);
        url += '&' + services.getRequestCommonParameters();
        data = 'id_feed=' + params.channelId;
        $.ajax(url,{
            type:'GET',
            data:data
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
//console.log(data);return;
        $.ajax(url,{
            type:'GET',
            data:data,
            dataType: 'json',
        }).done(function(result) {
//console.log("SUCCESS", result);
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
//console.log("FAIL", textStatus);
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
            dataType: 'json',
        }).done(function(result) {
//console.log("SUCCESS", result);
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
    
    getNearbyMePlaces: function(params, success, fail) {
        var placeCatId = params.placeCatId;
        var lat = params.coords.latitude;
        var lng = params.coords.longitude;
        var distance = params.distance;
        
        var url = config.URL_BASE + config.URL_NEARBY_PLACES;
        url += '&' + services.getRequestCommonParameters();
        var data = 'id_categoria='+placeCatId+'&lat='+lat+'&lon='+lng+'&distanza='+distance;
        // TODO
        //$.ajax(url, {type:'GET', data:data, dataType: 'json'});
        var result = null;
        switch(placeCatId) {
            case 1:     // restaurants
                result = [
                    {id: 1001, name: 'Ristorante uno', lat: 1, lng: 1, address: {road: 'Via... n...', city: 'Catanzaro'}},
                    {id: 1001, name: 'Ristorante due', lat: 1, lng: 1, address: {road: 'Via... n...', city: 'Catanzaro'}},
                    {id: 1001, name: 'Ristorante tre', lat: 1, lng: 1, address: {road: 'Via... n...', city: 'Catanzaro'}},
                    {id: 1001, name: 'Ristorante quattro', lat: 1, lng: 1, address: {road: 'Via... n...', city: 'Catanzaro'}},
                    {id: 1001, name: 'Ristorante cinque', lat: 1, lng: 1, address: {road: 'Via... n...', city: 'Catanzaro'}},
                    {id: 1001, name: 'Ristorante uno', lat: 1, lng: 1, address: {road: 'Via... n...', city: 'Catanzaro'}},
                    {id: 1001, name: 'Ristorante due', lat: 1, lng: 1, address: {road: 'Via... n...', city: 'Catanzaro'}},
                    {id: 1001, name: 'Ristorante tre', lat: 1, lng: 1, address: {road: 'Via... n...', city: 'Catanzaro'}},
                    {id: 1001, name: 'Ristorante quattro', lat: 1, lng: 1, address: {road: 'Via... n...', city: 'Catanzaro'}},
                    {id: 1001, name: 'Ristorante cinque', lat: 1, lng: 1, address: {road: 'Via... n...', city: 'Catanzaro'}},
                    {id: 1001, name: 'Ristorante uno', lat: 1, lng: 1, address: {road: 'Via... n...', city: 'Catanzaro'}},
                    {id: 1001, name: 'Ristorante due', lat: 1, lng: 1, address: {road: 'Via... n...', city: 'Catanzaro'}},
                    {id: 1001, name: 'Ristorante tre', lat: 1, lng: 1, address: {road: 'Via... n...', city: 'Catanzaro'}},
                    {id: 1001, name: 'Ristorante quattro', lat: 1, lng: 1, address: {road: 'Via... n...', city: 'Catanzaro'}},
                    {id: 1001, name: 'Ristorante cinque', lat: 1, lng: 1, address: {road: 'Via... n...', city: 'Catanzaro'}},
                    {id: 1001, name: 'Ristorante uno', lat: 1, lng: 1, address: {road: 'Via... n...', city: 'Catanzaro'}},
                    {id: 1001, name: 'Ristorante due', lat: 1, lng: 1, address: {road: 'Via... n...', city: 'Catanzaro'}},
                    {id: 1001, name: 'Ristorante tre', lat: 1, lng: 1, address: {road: 'Via... n...', city: 'Catanzaro'}},
                    {id: 1001, name: 'Ristorante quattro', lat: 1, lng: 1, address: {road: 'Via... n...', city: 'Catanzaro'}},
                    {id: 1001, name: 'Ristorante cinque', lat: 1, lng: 1, address: {road: 'Via... n...', city: 'Catanzaro'}}
                ];
                break;
            case 2:     // drugstores
                result = [
                    {id: 1001, name: 'Farmacia uno', lat: 1, lng: 1, address: {road: 'Via... n...', city: 'Catanzaro'}},
                ];
                break;
        }
        success(result);
    },
    
    
    
    
    //////////////////////////////////////////////////////
    // REPORTING RELATED FUNCTIONS
    
    getReportingCategories: function(successCallbak, failCallback) {
        var url = config.URL_BASE + config.URL_REPORTING_CATEGORY_LIST + '&' + services.getRequestCommonParameters();
        $.ajax(url, {
            type: 'GET',
            dataType: 'json'
        }).done(function(result) {
            successCallbak(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            //var loginRequired = ((jqXHR.status == services.CODE_UNAUTHORIZED) || (jqXHR.status == services.CODE_FORBIDDEN));
            failCallback(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
    
    sendReporting: function(reporting, successCallback, failCallback) {
        var url = config.URL_BASE + config.URL_REPORTING_SEND + '&' + services.getRequestCommonParameters();
        var obj = {
            segnalazione: {
                r_qr_code_id: '',
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
            dataType: 'json'
        }).done(function(result) {
            successCallback(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            failCallback(textStatus, services.isLoginRequired(jqXHR.status));
        });
    }
}