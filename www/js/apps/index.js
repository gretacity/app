var app = {
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        
        var loginPage = $('#loginPage');
        $('#username', loginPage).val(config.LOGIN_DEFAULT_USERNAME);
        $('#password', loginPage).val(config.LOGIN_DEFAULT_PASSWORD);
        $('#loginButton', loginPage).on('click', app.login);
        var registerPage = $('#registrationPage');
        $('#registerButton', registerPage).on('click', app.register);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        /*
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        */
        console.log('Received Event: ' + id);
    },
    
    login: function() {
        var username = $('#username').val();
        if(username == '') {
            $('#username').focus();
            helper.alert('Inserisci il nome utente', null, 'Login');
            return;
        }
        var password = $('#password').val();
        if(password == '') {
            $('#password').focus();
            helper.alert('Inserisci la password', null, 'Login');
            return;
        }
        $('#username').addClass('ui-disabled');
        $('#password').addClass('ui-disabled');
        $('#loginButton').addClass('ui-disabled');
        $('#registerPageButton').addClass('ui-disabled');
        $.mobile.loading('show');
        auth.login({username: username, password: password}, function(data) {
            // Successfully loggedin, move forward
            $.mobile.changePage('index.html#home');
        }, function(e) {
            $.mobile.loading('hide');
            helper.alert('Login non valido', function() {
                $('#username').removeClass('ui-disabled');
                $('#password').removeClass('ui-disabled');
                $('#loginButton').removeClass('ui-disabled');
                $('#registerPageButton').removeClass('ui-disabled');
            }, 'Login');
        });
    },
    
    register: function() {
        var params = {lastname: '', firstname: '', phone: '', email: ''};
        // Validation
        var hasErrors = false;
        var requiredFields = ['lastname', 'firstname', 'phone', 'email'];
        for(var i in requiredFields) {
            var fieldId = requiredFields[i];
            var fieldVal = $('#' + fieldId).val().trim();
            if(fieldVal == '') {
                $('label[for="' + fieldId + '"]').addClass('fielderror');
                hasErrors = true;
            } else {
                $('label[for="' + fieldId + '"]').removeClass('fielderror');
                eval('params.'+fieldId+'="'+fieldVal+'"');
            }
        }
        if(hasErrors) {
            helper.alert('Alcuni campi non sono stati compilati', null, 'Registrazione');
            return;
        }
        // Specific validation for phone number
        if(!helper.isPhoneNumberValid(params.phone)) {
            $('label[for="phone"]').addClass('fielderror');
            helper.alert('Inserisci un numero di telefono valido', function() {
                $('#phone').focus();
            }, 'Registrazione');
            return;
        }
        // Specific validation for email
        if(!helper.isEmailValid(params.email)) {
            $('label[for="email"]').addClass('fielderror');
            helper.alert('Inserisci un indirizzo email valido', function() {
                $('#email').focus();
            }, 'Registrazione');
            return;
        }
        // Registration
        services.registerUser(params, function() {
            // success callback
        }, function(e) {
            // error callback
            helper.alert(e, null, 'Registrazione');
        });
    }
};

/*
$(function(){
    $( '#LoginForm' ).bind( 'submit', UserLogin );
    // $( document ).bind( "pagebeforeload", AppLoadJSON );
    // $( '#home' ).bind( 'pagebeforeload', AppLoadJSON );
    $( '#home' ).on( 'pageinit', AppLoad_JSON );
    $( '#segnalazioni' ).on( 'pageinit', AppLoad_SEGNALAZIONI );
});*/
