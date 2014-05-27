
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
            if((sessionId || '') != '') commonParams += '&session_id=' + sessionId;
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
            reportinCount: 5,
            newsCount: 24,
            commentsCount: 18
        };
        successCallback(result);
    },
    
    
    getInfoFromQrCode: function(code, successCallback, failCallback) {
        // TODO
        var result = {
            id: 1,
            name: 'Basilica dell\'Immacolata',
            following: true,
            text: 'Una delle chiese più importanti di Catanzaro. ' +
                  'È situata nel centro storico della città, precisamente su corso Mazzini. ' +
                  'La posa della prima pietra avvenne il primo agosto 1759. ' +
                  'Nel corso della sua storia svolse il ruolo di principale cattedrale della città in due periodi diversi: ' +
                  'dal 1783 al 1833, in seguito ad un disastroso terremoto che distrusse il duomo, e nel 1943, ' +
                  'quando fu distrutto dai bombardamenti della seconda guerra mondiale.',
            comments: [
                {id: 1001, text: 'L\'ho visitata diverse volte, è molto bella'},
                {id: 3418, text: 'Una delle cose da vedere assolutamente a Catanzaro'}
            ]
        };
        successCallback(result);
    },
    
    followQrCode: function(follow) {
        // TODO
    },
    
    leaveCommentOnQrCode: function(params, successCallback, failCallback) {
        // TODO
        //params.text
        successCallback();
    },
    
    getFeedPosts: function(params, successCallback, failCallback) {
        // TODO
        var result = [
            //{}
        ];
        successCallback(result);
    },
    
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
            //var loginRequired = ((jqXHR.status == services.CODE_UNAUTHORIZED) || (jqXHR.status == services.CODE_FORBIDDEN));
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
            //var loginRequired = ((jqXHR.status == services.CODE_UNAUTHORIZED) || (jqXHR.status == services.CODE_FORBIDDEN));
            failCallback(textStatus, services.isLoginRequired(jqXHR.status));
        });
    }
}