
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
    
    
    
    registerUser: function(params, successCallback, failCallack) {
        // TODO
        var data = 'lastname='+params.lastname+'&firstname='+params.firstname+'&phone='+params.phone+'email='+params.email;
        failCallack('Not implemented');
    },
    
    downloadDataFromServer: function(key, successCallback, failCallback) {

        /*

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
return;* /
            if(failCallback) failCallback(key, loginRequired, textStatus, jqXHR.status);
        });*/
    }
    
}