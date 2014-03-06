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
            url: 'http://www.gretacty.com/Service/index.php?s=app-user-login',
            crossDomain: true,
            type: 'POST',
            data: form.serialize(),
            success: function(data) {
                if (data == '1') {                    
                    alert('Login OK');
                    window.localStorage.setItem('username', username);
                    $.mobile.changePage("#home", {transition: "sildeup"});
                } else {
                    alert('Login Not OK');
                    $.mobile.changePage('#user-login');
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


