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
        
        $('#loginButton').on('click', app.login);
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
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        
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
        $('#registerButton').addClass('ui-disabled');
        auth.login({username: username, password: password}, function(data) {
            // Successfully loggedin, move forward
            $.mobile.changePage('index.html#home');
        }, function(e) {
            helper.alert('Login non valido', function() {
                $('#username').removeClass('ui-disabled');
                $('#password').removeClass('ui-disabled');
                $('#loginButton').removeClass('ui-disabled');
                $('#registerButton').removeClass('ui-disabled');
            }, 'Login');
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
