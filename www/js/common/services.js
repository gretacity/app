
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
    
    
    
    /*
    secureRequest: function(params, successCallback, errorCallback) {
        
        if((typeof(params.authToken) == "undefined") || (params.authToken == "")) {
            params.authToken = auth.authToken;
        }
        
        $.ajax(params)
            .done(function(data) {
                    if(successCallback) successCallback(data);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                //alert('done ko ' + jqXHR.status + " " + errorThrown);return;
                if(jqXHR.status == services.CODE_UNAUTHORIZED) {
                    // A login is requested
                    var loginPage = $('#loginPage');
                    if(loginPage.length == 0) {
                        $('body,html').append('<div data-role="page" id="loginPage"></div>');
                        loginPage = $('#loginPage');
                        page.injector.injectPage('#loginPage', 'login');
                    }
                    $.mobile.changePage('#loginPage');
                }
                
                if(failCallback) failCallback(jqXHR.status);
            });
        
        
    },*/
    
    
    downloadDataFromServer: function(key, successCallback, failCallback) {

        var url = '';
        switch(key) {
            case data.DATA_FILMS:       // Pellicole
                url = config.URL_BASE + config.URL_DATA_FILMS;
                break;
            case data.DATA_ROADSIGN:    // Segnali
                url = config.URL_BASE + config.URL_DATA_ROADSIGN;
                break;
            case data.DATA_SHAPES:      // Forme
                url = config.URL_BASE + config.URL_DATA_SHAPES;
                break;
            case data.DATA_SIZES:       // Formato
                url = config.URL_BASE + config.URL_DATA_SIZES;
                break;
            case data.DATA_SUPPORTS:// Supporti
                url = config.URL_BASE + config.URL_DATA_SUPPORTS;
                break;
        }

        // Set session id
        url += '&session_id=' + auth.getSessionId();
        if(typeof(device) != 'undefined') url += '&uuid=' + device.uuid;
        
        $.ajax({
            type : "GET",
            async: true,
            url : url,
            //timeout: 2000,
            //data: params,
            dataType: "json",
            crossDomain: true,
        }).done(function(result) {
            if(successCallback) successCallback(key, result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            // Login required
            var loginRequired = ((jqXHR.status == services.CODE_UNAUTHORIZED) || (jqXHR.status == services.CODE_FORBIDDEN));
/*console.log(jqXHR);
console.log(textStatus);
console.log(loginRequired);
return;*/
            if(failCallback) failCallback(key, loginRequired, textStatus, jqXHR.status);
        });
    },
    
    
    uploadEntity: function(itemId, successCallback, failCallback) {
        
        // Get item from database
        data.fetch({id: itemId}, function(result1) {
            
            if(result1.rows.length == 0) {
                if(failCallback) failCallback("Impossibile trovare l'elemento con ID " + itemId);
                return;
            }
            
            // Successfully retrieved item
            var handler = null;
            var url = null;
            switch(result1.rows.item(0).entity_type) {
                case CensusTypes.cityAsset:
                    handler = data.cityAsset;
                    url = config.URL_BASE + config.URL_SYNC_CITYASSET;
                    break;
                case CensusTypes.roadSign:
                    handler = data.roadSign;
                    url = config.URL_BASE + config.URL_SYNC_ROADSIGN;
                    break;
                default:
                    failCallback('Entity type not allowed');
                    return;
            }
            url += '&session_id=' + auth.getSessionId();
            if(typeof(device) != 'undefined') url += '&uuid=' + device.uuid;

            var item = handler.deserialize(result1.rows.item(0));
            
            // Retrieve related pictures
            data.fetchPictures(itemId, function(result2) {
                
                // Successfully retrieved pictures
                var len = result2.rows.length;
                for(var i = 0; i < len; i++) {
                    var key = result2.rows.item(i).picture_key;
                    var base64encoded = result2.rows.item(i).data;
                    item.pictures[key] = base64encoded;
                }
                
                var preparedItem = handler.mapForService(item);
//console.log(preparedItem);
                // Call sync web method on server
                $.ajax({
                    type : "POST",
                    async: false,
                    url : url,
                    timeout: 2000,
                    /*data : {
                        obj : preparedItem,
                    },*/
                    data: "obj=" + encodeURIComponent(JSON.stringify(preparedItem)),
                    dataType: "text",
                    crossDomain: true,
                }).done(function(result) {
//console.log(result);return;
                    if(successCallback) successCallback(itemId, result);
                }).fail(function(jqXHR, textStatus, errorThrown) {
//console.log(jqXHR);
//console.log(textStatus);return;
                    console.error(textStatus);
                    // Login required
                    var loginRequired = ((jqXHR.status == services.CODE_UNAUTHORIZED) || (jqXHR.status == services.CODE_FORBIDDEN));
                    if(failCallback) failCallback(itemId, loginRequired, textStatus, jqXHR.status);
                });
                
            });
        });
    }
    
    
}