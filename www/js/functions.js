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
        
        $.ajax({
            type: 'POST',
            url: './app-user-login.html',
            data: {u: username, p: password},
            dataType: "html",
            success: function(data) {
                if (data == '1') {                    
                    window.localStorage.setItem('username', username);
                    $.mobile.changePage('index.html#home');
                } else {
                    
                    alert('Login Not OK');
                    
                    $.mobile.changePage('index.html#user-login');
                    // navigator.notification.alert('Error Login', function() {}, 'Error Login');
                }
            },
            error: function() {
                alert('Error occured');
            }
        });
    
    } else {
        
        alert('UserLogin Error...');
        // navigator.notification.alert('Error Login', function() {}, 'Error Login');

    }
}


