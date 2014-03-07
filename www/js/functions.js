/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function UserLogin( event ) {

    var form = $('#LoginForm');
    
    var username = $('#username', form).val();
    var password = $('#password', form).val();

    /**
     * Verifica credenziali (username e password)
     */
    if (username != '' && password != '') {
        
        /**
         * 
         */    
        var request = $.ajax({
            type: 'POST',
            url: 'http://www.gretacity.com/Service/index.php?s=app-user-login',
            data: form.serialize(),
            dataType: 'json'
         });
         
         /**
          * 
          */
         request.done(function (data) {
            
            var status = $.trim(data.status);
           
            if (status == 'success') {  
                // window.localStorage.setItem('username', username);
                $.mobile.changePage('index.html#user-registration');
            } else {
                // navigator.notification.alert('Error Login', function() {}, 'Error Login');
                 $.mobile.changePage('index.html#user-login');
            } 
        });
        
        /**
         * 
         */
        request.fail(function (data) {
            var status = $.trim(data.status);
        });
    
    } else {
        
        // navigator.notification.alert('Error Login', function() {}, 'Error Login');
    }
}


/**
 * 
 * @param {type} event
 * @returns {undefined}
 */
function AppLoad_JSON ( event ) {
    
    
    /**
     * 
     */
    $.ajax({
        url: 'http://www.gretacity.com/Service/index.php?s=app-user-data',
        success: function (data) {

            // STORE ARRAY.
            window.localStorage.setItem( 'USER_DATA', JSON.stringify(data) );
            
            // DISPLAY COUNT            
            $('#segnalazioni-count').text(data.segnalazioni_count);
            $('#notizie-count').text(data.notizie_count);
            $('#commenti-count').text(data.commenti_count);
            $('#qui-vicino-count').text(data.qui_vicino_count);
            
            
        },
        error : function () { 
            alert('Errore: aggiornamento home');
        }
    });
    
    /**
     * 
     */
    
}


/**
 * 
 * @param {type} event
 * @returns {undefined}
 */
function AppLoad_SEGNALAZIONI ( event ) {   
    
    /**
     * 
     */
    var UserData = JSON.parse(window.localStorage.getItem( 'USER_DATA' ));
    
    var obj = UserData.segnalazione;
    
    var list = $( '#segnalazioni-list' );

    var str = '<ul data-role="listview" data-inset="false">';
    
    $.each( obj, function( key, value ) {
        
        // alert( key + ": " + value.data );
        str += '<li data-role="list-divider">'+value.data+'</li>';

        str += '<li>'; 
        str += '<a href="">';
        str += '    <h2>'+value.utente+'</h2>';
        str += '    <p><strong>'+value.oggetto+'</strong></p>';
        str += '    <p>'+value.commento+'</p>';
        str += '    <p class="ui-li-aside"><strong>'+value.orario+'</strong></p>';
        str += '</a>'; 
        str += '</li>';
    
    }); 
    
    str += '</ul>';
    
    alert(str);
    
    list.html( str );

}


