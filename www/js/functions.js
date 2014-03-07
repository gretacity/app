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
            type: "POST",
            url: "http://www.gretacity.com/Service/index.php?s=app-user-login",
            data: form.serialize(),
            dataType: "json"
         });
         
         /**
          * 
          */
         request.done(function (data) {
            
            var status = $.trim(data.status);
            // alert(status);
           
            if (status == 'success') {  
                // window.localStorage.setItem('username', username);
                $.mobile.changePage('index.html#user-registration');
            } else {
                $.mobile.changePage('index.html#user-login');
                // navigator.notification.alert('Error Login', function() {}, 'Error Login');
            } 
        });
        
        /**
         * 
         */
        request.fail(function (data) {
            var status = $.trim(data.status);
            alert('Error...'+status);
        });
    
    } else {
        
        alert('UserLogin Error...');
        // navigator.notification.alert('Error Login', function() {}, 'Error Login');

    }
}


