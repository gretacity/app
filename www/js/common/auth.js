var auth = {
    
    lastLoginDate: null,
    sessionId: null,
    
    setSessionId: function(sessId) {
        if(sessId == '')
            window.localStorage.removeItem(config.SESSION_ID_KEY);
        else
            window.localStorage.setItem(config.SESSION_ID_KEY, sessId);
    },
    getSessionId: function() {
        return (window.localStorage.getItem(config.SESSION_ID_KEY) || '');
    },

    isSessionValid: function() {
        var sessionId = auth.getSessionId();
        if(sessionId == '') return false;
        var checkSessionValidityUrl = '';
        /*$.ajax({
            type:'get',
            async: false,
            url: checkSessionValidityUrl,
            data: 'session_id=' + sessionId,
            dataType: 'text',
            crossDomain: true
        }).done(function(data, textStatus, jqXHR) {
            return ???;
        }).fail(function() {
            // TODO
        });
        */
        return true;
    },
        
    ////////////////////////////////////////////////////////////
    // params {username: "", password : ""}
    login: function(params, successCallback, failCallback) {
        
        /*if((params == null) || (params.username == null) || (params.password == null)) {
            // Do nothing... or notify to the failCallback event handler?
            return;
        }*/
        var loginUrl = config.URL_BASE + config.URL_USER_LOGIN ;
        var data = 'username=' + encodeURIComponent(params.username) + '&password=' + encodeURIComponent(params.password) +
                   '&' + services.getRequestCommonParameters(true);
//console.log('auth.login DATA ', data);
        $.ajax({
            type : "GET",
            cache: false,
            url : loginUrl,
            timeout: config.REQUEST_DEFAULT_TIMEOUT,
            data: data,
            dataType: "json"
        }).done(function(result) {
//console.log('auth.login SUCCESS', result);
            if(result != '') {
                auth.setSessionId(result.session.id);
                auth.lastLoginTime = new Date();
		if(successCallback) successCallback(result);
            } else {
		if(failCallback) failCallback("Login errato");
            }
	}).fail(function(jqXHR, textStatus, errorThrown) {
//console.log(jqXHR);
            //auth.tmp = jqXHR;
            /*var errorMessage = (jqXHR.statusText.substr(0, 12).toLowerCase() == 'networkerror') ? 
                                                                                    'Errore di connessione' : 
                                                                                    'Login non valido';*/
            var errorMessage = helper.isOnline ? 'Login non valido' : 'Errore di connessione';
            auth.setSessionId('');
            if(failCallback) failCallback(errorMessage);
        });
    },
    
    logout: function() {
        auth.setSessionId('');
    }
}