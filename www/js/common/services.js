
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
    
    
    getRequestCommonParameters: function() {
        var commonParams = 'app=' + config.APP_NAME + '&api=' + config.API_V;
        if(typeof(device) != 'undefined') commonParams += '&uuid=' + device.uuid;
        if(typeof(app) != 'undefined') commonParams += '&lang=' + app.language;
        return commonParams;
    },

    
    
    registerUser: function(params, successCallback, failCallack) {
        // TODO
        var data = 'lastname='+params.lastname+'&firstname='+params.firstname+'&phone='+params.phone+'email='+params.email;
        failCallack('Not implemented');
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
    
    
    getReportingList: function(params, successCallback, failCallback) {
        // TODO
        var result = [
            {data: '01/05/2014', 'orario': '10:30', utente: 'user1', oggetto: 'segnalazione 1', commento: 'questo è un commento 1'},
            {data: '01/05/2014', 'orario': '10:40', utente: 'user1', oggetto: 'segnalazione 2', commento: 'questo è un commento 2'},
            {data: '01/05/2014', 'orario': '10:50', utente: 'user1', oggetto: 'segnalazione 3', commento: 'questo è un commento 3'},
            {data: '01/05/2014', 'orario': '11:30', utente: 'user1', oggetto: 'segnalazione 4', commento: 'questo è un commento 4'},
            {data: '01/05/2014', 'orario': '12:30', utente: 'user1', oggetto: 'segnalazione 5', commento: 'questo è un commento 5'}
        ];
        successCallback(result);
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
    
    
    getReportingCategories: function(successCallbak, errorCallback) {
        var url = config.URL_REPORTING_CATEGORY_LIST + '&' + services.getRequestCommonParameters();
        $.getJSON(url, function(data) {
//console.log(data);
            successCallbak(data);
        });
    },
    
    sendReporting: function(reporting, successCallback, failCallback) {
        var url = config.URL_REPORTING_SEND + '&' + services.getRequestCommonParameters();
        var obj = {
            segnalazione: {
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
            //obj.pictures = [];
            //obj.pictures.push(...);
        }
        $.ajax(url, {
            type: 'POST',
            async: false,
            url: url, 
            data: 'obj=' + encodeURIComponent(JSON.stringify(obj)),
            dataType: 'text',
        }).done(function(result) {
//console.log('SUCCESS', result);
            successCallback();
        }).fail(function(jqXHR, textStatus, errorThrown) {
console.log('FAIL', textStatus);
            failCallback(textStatus);
        });
    }
}