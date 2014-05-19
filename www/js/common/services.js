
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
    
    
    getSummaryData: function(successCallback, failCallback) {
        // TODO
        var result = {
            reportinCount: 5,
            newsCount: 24,
            commentsCount: 18
        };
        successCallback(result);
    },
    
    getReportingList: function(params, successCallback, failCallback) {
        // TODO
        var result = [
            //{}
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
    
    sendReporting: function(reporting, successCallback, failCallback) {
        // TODO
        //$.ajax('');
        failCallback('Not yet implemented');
    }    
}