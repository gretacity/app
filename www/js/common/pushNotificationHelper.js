var pushNotificationHelper = {

    self: this,
    pushNotification : null,
    
    testPushNotification: function() {
        var pnm = PushNotificationMessage.fromGCM({
            payload: {
                type: '1', 
                title: 'title', 
                message: 'message'}
        });
        pnm.dispatchNotification();
    },
    
    
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
                    //helper.alert(e.event + '\n' + e.regid, null, 'Push Notification');
                    // TODO Send a notification to our server
                    var url = config.URL_BASE + config.URL_NOTIFICATION_REGISTER;
                    url += services.getRequestCommonParameters();
                    var params = 'regid='+encodeURIComponent(e.regid)+'&platform='+device.platform;
                    /*$.ajax(url, {
                        type: 'POST',
                        data: params,
                        dataType: 'json'
                    }).done(function(result) {
                        //success();
                    }).fail(function(jqXHR, textStatus, errorThrown) {
                        //fail(textStatus, services.isLoginRequired(jqXHR.status));
                    });*/
                }
                break;
            case 'message':
                var pnm = PushNotificationMessage.fromGCM(e);                
                pnm.dispatchNotification();
//self.pushNotification.setApplicationIconBadgeNumber("2");
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


function PushNotificationMessage() {

    this.PUSH_NOTIFICATION_TYPE_CHANNEL = "1";
    this.PUSH_NOTIFICATION_TYPE_COMMENT = "2";
    this.PUSH_NOTIFICATION_TYPE_REPORTING = "3";

    this._notificationType = null;
    this._messageTitle = null;
    this._messageText = null;

    this.setNotificationType = function(notificationType) {
        this._notificationType = notificationType;
        return this;
    }
    this.setMessageTitle = function(title) {
        this._messageTitle = title;
        return this;
    }
    this.setMessageText = function(text) {
        this._messageText = text;
        return this;
    }
    
    this.dispatchNotification = function() {        
        switch(this._notificationType) {
            case this.PUSH_NOTIFICATION_TYPE_CHANNEL:
                helper.alert('Nuovo messaggio per il feed...');
                break;
            case this.PUSH_NOTIFICATION_TYPE_COMMENT:
                helper.alert('Nuovo commento per il qr-code...');
                break;
            case this.PUSH_NOTIFICATION_TYPE_REPORTING:
                helper.alert('Nuovo messaggio per la segnalazione...');
                break;
            default:
                helper.alert('Tipo messaggio non definito *' + this._notificationType + '*');
                break;
        }
    }
}

PushNotificationMessage.fromGCM = function(e) {

    var pnm = new PushNotificationMessage();
    
    /*var title = null;
    if(e.foreground) {
        title = 'Inline notification';
    } else if(e.coldstart) {
        title = 'Coldstart notification';
    } else {
        title = 'Background notification';
    }
    var messageText = e.payload.message;
    var messageCount = e.payload.msgcnt;
    var messageTest = e.payload.msgtest;
    helper.alert(messageCount + '\n' + messageTest, null, title);*/

    pnm.setNotificationType(e.payload.type)
       .setMessageTitle(e.payload.title)
       .setMessageText(e.payload.message);

    return pnm;
}

PushNotificationMessage.fromAPN = function(e) {
    // TODO
}

