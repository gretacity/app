var pushNotificationHelper = {

    self: this,
    pushNotification : null,
    
    register: function(successCallback, errorCallback) {
        if(window.plugins) {
            self.pushNotification = window.plugins.pushNotification;
            
            if(device.platform.toLowerCase() == 'android') {
                self.pushNotification.register(
                    successCallback, // success: result contains any message sent from the plugin call
                    errorCallback,    // error: result contains any error description text returned from the plugin call
                    {
                        'senderID': '79537853092',  // Project ID
                        'ecb': 'pushNotificationHelper.onNotificationGCM'
                    }
                );
            } else {
                /*
                pushNotification.register(
                    tokenCallback,
                    errorCallback, {
                        "badge":"true",
                        "sound":"true",
                        "alert":"true",
                        "ecb":"onNotificationAPN"
                });
                */
            }
        }
    },
    
    // Android only:
    onNotificationGCM: function(e) {
        
        // https://android.googleapis.com/gcm/send
        // ports: 5228, 5229, 5230
        // see:
        // http://developer.android.com/google/gcm/server.html
        // cd plugins/com.phonegap.plugins.PushPlugin/Example/server
        // ruby pushGCM.rb
        
        //APA91bFFZJW4vGsS_aE9ruM7ssylJDpy1G_i2ksPyXTLyg1rwiyqrHwuXy0jG_R_C6e7qOxPlSs2Fk_NVLIUgvEmQwcdTdNc1E2Zn4ETiQlE8tj9joYkPC46h4OxpkCA6ou-YKMdFGy9WMX5GCWLadsMWC_RpqP9xQ
        //helper.alert(e.event, null, 'Push Notification');
        //helper.alert(e.regid, null, 'Push Notification');
        
        switch(e.event) {
            case 'registered':
                if(e.regid.length > 0) {
                    helper.alert(e.event + '\n' + e.regid, null, 'Push Notification');
                }
                break;
            case 'message':
                var title = null;
                if(e.foreground) {
                    title = 'Inline notification';
                } else if(e.coldstart) {
                    title = 'Coldstart notification';
                } else {
                    title = 'Background notification';
                }
                var messageText = e.payload.message;
                var messageCount = e.payload.msgcnt;
                helper.alert(messageCount + '\n' + messageText, null, title);
                break;
            case 'error':
                helper.alert(e.msg, null, 'Notificaion Error');
                break;
            default:
                helper.alert('What should I do?', null, 'Unknown notification event');
                break;
        }
    }
}

/*function onNotificationGCM(e) {
    pushNotificationHelper.onNotificationGCM(e);
}*/