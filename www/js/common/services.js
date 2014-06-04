
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
//console.log("FAIL", textStatus);
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
    
    subscribeToChannel: function(params) {
        //parasm:{channelId: channelId, subscribe: subscribe});
        var url = config.URL_BASE + (params.subscribe ? config.URL_NEWS_SUBSCRIBE_CHANNEL : config.URL_NEWS_UNSUBSCRIBE_CHANNEL);
        url += '&' + services.getRequestCommonParameters();
        data = 'id_feed=' + params.channelId;
        $.ajax(url,{
            type:'GET',
            data:data
        }).done(function(result) {
//console.log("SUCCESS", result);
            //success(result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
//console.log("FAIL", textStatus);
            //fail(textStatus, services.isLoginRequired(jqXHR.status));
        });
    },
            
    /***
     *  Get paginated posts related to subscribed channels
     */
    getChannelPosts: function(params, successCallback, failCallback) {
        /*
        var result = [
            {
                title: 'title 1',
                text: 'text of title 1 text of title 1 text of title 1 text of title 1 text of title 1',
                owner: 'Comune di Provincia',
                date: '2014-05-13 09:57:00',
                categories: ['category 1', 'category 2', 'category 3']
            },
            {
                title: 'title 2',
                text: 'text of title 2 text of title 2 text of title 2 text of title 2 text of title 2',
                owner: 'Comune di Provincia',
                date: '2014-05-13 12:31:00',
                categories: ['category 1', 'category 3']
            },
            {
                title: 'title 3',
                text: 'text of title 3 text of title 3 text of title 3 text of title 3 text of title 3',
                owner: 'Comune di Provincia',
                date: '2014-05-13 14:15:00',
                categories: ['category 12', 'category 21', 'category 23']
            },
            {
                title: 'title 4',
                text: 'text of title 4 text of title 4 text of title 4 text of title 4 text of title 4',
                owner: 'Comune di Provincia',
                date: '2014-05-13 18:21:00',
                categories: ['category 18', 'category 12', 'category 39']
            },
            {
                title: 'title 5',
                text: 'text of title 5 text of title 5 text of title 5 text of title 5 text of title 5',
                owner: 'Comune di Provincia',
                date: '2014-05-13 19:59:00',
                categories: ['category 1', 'category 2', 'category 3']
            },
            {
                title: 'title 6',
                text: 'text of title 6 text of title 6 text of title 6 text of title 6 text of title 6',
                owner: 'Comune di Provincia',
                date: '2014-05-14 08:52:00',
                categories: ['category 1', 'category 2', 'category 3']
            },
            {
                title: 'title 7',
                text: 'text of title 7 text of title 7 text of title 7 text of title 7 text of title 7',
                owner: 'Comune di Provincia',
                date: '2014-05-14 09:50:00',
                categories: ['category 19', 'category 29', 'category 63']
            }
        ];
        successCallback(result);*/
        successCallback([]);
    },
    
    
    
    
    //////////////////////////////////////////////////////
    // "CLOSE TO ME" RELATED FUNCTIONS
    
    getCloseToMeInfo: function(params, successCallback, failCallback) {
        // TODO
        var result = [
            //{}
        ];
        successCallback(result);
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