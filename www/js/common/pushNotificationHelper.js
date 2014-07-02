var pushNotificationHelper = {

    
    testPushNotification: function() {
        
        
        self.pushNotification.setApplicationIconBadgeNumber(function() {
            console.log('success handler');
        }, function() {
            console.log('errorHandler');
        }, "3");
return;
        
        
        var pnm = PushNotificationMessage.fromGCM({
            foreground: true,
            coldstart: false,
            payload: {
                type: PushNotificationMessage.PUSH_NOTIFICATION_TYPE_NEWCHANNEL_AVAILABLE,
                title: 'titolo del messaggio', 
                message: 'testo del messaggio',
                data: [
                    
                    /*/ Complex notification data
                    {id: 12, tot: 3},       // group 12 has 3 new items
                    {id: 2, tot: 1},        // group 2 has 1 new item
                    {id: 23, tot: 8},       // group 23 has 8 new items
                    {id: 13, tot: 19}*/
                    
                    // qrcode: PushNotificationMessage.PUSH_NOTIFICATION_TYPE_FOLLOWING
                    //{id: config.QR_CODE_TEST, tot: 2}
                    
                    // news: PushNotificationMessage.PUSH_NOTIFICATION_TYPE_CHANNEL
                    //{id: '25', tot: 2}
                    
                    // reporting: PushNotificationMessage.PUSH_NOTIFICATION_TYPE_REPORTING
                    //{id: '172', tot: 1}
                    
                    // new channel available: PushNotificationMessage.PUSH_NOTIFICATION_TYPE_NEWCHANNEL_AVAILABLE
                    {id: '4', tot: 1}
                ]
            }
        })
        .dispatchNotification();
    },
    
    

    
    
    
    
    self: this,
    pushNotification : null,
    
    register: function(successCallback, errorCallback) {
        if(window.plugins) {
            self.pushNotification = window.plugins.pushNotification;
console.log('pushNotificationHelper: Registering device ' + device.platform);            
            if(device.platform.toLowerCase() == 'android') {
                self.pushNotification.register(
                    successCallback,  // success: result contains any message sent from the plugin call
                    errorCallback,    // error: result contains any error description text returned from the plugin call
                    {
                        'senderID': config.GOOGLE_GCM_PROJECT_ID,  // Project ID
                        'ecb': 'pushNotificationHelper.onNotificationGCM'
                    }
                );
            } else {
                self.pushNotification.register(
                    self.tokenCallback,
                    errorCallback, {
                        "badge":"true",
                        "sound":"true",
                        "alert":"true",
                        "ecb":"onNotificationAPN"
                });
            }
        }
    },
    
    // iOS only
    tokenCallback: function(result) {
        self.registerToPushServer(result);
    },
    
    // iOS only
    onNotificationAPN: function(e) {
        // TODO
    },
    
    
    // Android only
    onNotificationGCM: function(e) {
        switch(e.event) {
            case 'registered':
console.log('pushNotificationService: received notification from GCM, regid is ' + e.regid);
                if(e.regid.length > 0) {
                    // Send a notification to our server
                    self.registerToPushServer(e.regid);
                }
                break;
            case 'message':
                var pnm = PushNotificationMessage.fromGCM(e);
                pnm.dispatchNotification();
                break;
            case 'error':
                //helper.alert(e.msg, null, 'Notificaion Error');
                break;
            default:
                //helper.alert('What should I do?', null, 'Unknown notification event');
                break;
        }
    },
    
    
    registerToPushServer: function(devicePushId) {
console.log('pushNotificationService: received notification from Apple server');
        var url = config.URL_BASE + config.URL_NOTIFICATION_REGISTER;
        url += '&' + services.getRequestCommonParameters();
        var params = 'key='+encodeURIComponent(devicePushId)+'&platform='+device.platform;
        $.ajax(url, {
            type: 'POST',
            data: params
        }).done(function(result) {
//helper.alert('regid='+e.regid, null, 'SUCCESS');
        }).fail(function(jqXHR, textStatus, errorThrown) {
//helper.alert('regid='+e.regid+'\n'+textStatus, null, 'FAIL');
        });
    },
    
    
    
    /***
     *  typeId: NEWS, COMMENT, REPORTING --> PushNotificationMessage.{PUSH_NOTIFICATION_TYPE_CHANNEL | PUSH_NOTIFICATION_TYPE_FOLLOWING | PUSH_NOTIFICATION_TYPE_REPORTING}
     *  groupId: CHANNEL_ID, QR_CODE_ID, REPORTING_ID
     *
     *      feeds:
     *          feed_id         tot_unread
     *      news:
     *          qr_code_id      tot_unread
     *      reporting:
     *          reporting_id    tot_unread
     */
    addUnread: function(typeId, groupId, totUnread) {
        var unreadData = JSON.parse(window.localStorage.getItem('gretacity_unreaddata')) || {};
        if(unreadData[typeId] == null) {
            unreadData[typeId] = {};
        }
        if(unreadData[typeId][groupId] == null) {
            unreadData[typeId][groupId] = totUnread;
        } else {
            unreadData[typeId][groupId] += totUnread;
        }
        window.localStorage.setItem('gretacity_unreaddata', JSON.stringify(unreadData));
    },
    
    
    getUnreadIds: function(typeId) {
        var unreadData = JSON.parse(window.localStorage.getItem('gretacity_unreaddata')) || {};
        var ids = [];
        if(typeId in unreadData) {
            for(var i in unreadData[typeId]) {
                ids.push(i);
            }
        }
        return ids;
    },
    
    getUnread: function(typeId, groupId, grouped) {
        var unreadData = JSON.parse(window.localStorage.getItem('gretacity_unreaddata')) || {};
        if(unreadData[typeId] == null) {
            return 0;
        }
        if(groupId != null) {
            return unreadData[typeId][groupId] == null ? 0 : unreadData[typeId][groupId];
        }
        grouped |= false;
        if(grouped) {
            return unreadData[typeId];
        } 
        
        var tot = 0;
        for(var i in unreadData[typeId]) {
            tot += unreadData[typeId][i];
        }
        return tot;
    },
    
    setAsRead: function(typeId, groupId) {
        var unreadData = JSON.parse(window.localStorage.getItem('gretacity_unreaddata')) || {};
        if((unreadData[typeId] == null) || (unreadData[typeId][groupId]) == null) {
            return;
        }
        delete unreadData[typeId][groupId];
        window.localStorage.setItem('gretacity_unreaddata', JSON.stringify(unreadData));
    },
    
    setAllAsRead: function(typeId) {
        if(typeId == null) {
            window.localStorage.setItem('gretacity_unreaddata', null);
        } else {
            var unreadData = JSON.parse(window.localStorage.getItem('gretacity_unreaddata')) || {};
            delete unreadData[typeId];
            window.localStorage.setItem('gretacity_unreaddata', JSON.stringify(unreadData));
        }
    }
}


function PushNotificationMessage() {

    
    /*e.foreground) {
        title = 'Inline notification';
    } else if(e.coldstart) {
        title = 'Coldstart notification';
    } else {
        title = 'Background notification';
      */
    
    this._appState = null;
    this._notificationType = null;
    this._messageTitle = null;
    this._messageText = null;
    this._data = null;

    this.setAppState = function(state) {
        this._appState = state;
        return this;
    }
    this.setNotificationType = function(notificationType) {
        this._notificationType = parseInt(notificationType);
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
    
    this.setData = function(d) {
        this._data = d;
        return this;
    }
    
    this.dispatchNotification = function() {
        // Update unread data
        typeId = this._notificationType;
        for(var i in this._data) {
            var row = this._data[i];
            var groupId = row.id;
            var totUnread = parseInt(row.tot);
//console.log('type ' + typeId + ', group ' + groupId + ', unread ' + totUnread);
            pushNotificationHelper.addUnread(
                typeId, 
                groupId, 
                totUnread
            );
        }        
        
        // Android app can be in inline, background or coldstart mode
        if(this._appState != PushNotificationMessage.APP_STATE_INLINE) {
            // App is in BACKGROUND state:
            // show the related page
            var pageId = '';
            switch(typeId) {
                case PushNotificationMessage.PUSH_NOTIFICATION_TYPE_FOLLOWING:
                    pageId = 'followingListPage';
                    break;
                case PushNotificationMessage.PUSH_NOTIFICATION_TYPE_CHANNEL:
                    pageId = 'newsChannelsPage';
                    break;
                case PushNotificationMessage.PUSH_NOTIFICATION_TYPE_REPORTING:
                    pageId = 'reportingListPage';
                    break;
                case PushNotificationMessage.PUSH_NOTIFICATION_TYPE_NEWCHANNEL_AVAILABLE:
                    pageId = 'channelInfoPage';
                    break;
                default:
                    console.error('Undefined push message type *' + typeId + '*');
                break;                    
            }
            if((pageId != '') && (pageId != $.mobile.activePage.attr('id'))) {
                if(this._appState == PushNotificationMessage.APP_STATE_BACKGROUND) {
                    $.mobile.changePage('#' + pageId);
                } else { // PushNotificationMessage.APP_STATE_COLDSTART
                    app.changePageAfterLogin(pageId);
                }
            }
        } else {
            // App is in ACTIVE state:
            if(typeId == PushNotificationMessage.PUSH_NOTIFICATION_TYPE_NEWCHANNEL_AVAILABLE) {
                app.showNewsChannelAvailable();
            } else {
                switch($.mobile.activePage.attr('id')) {
                    case 'homePage':
                        app.updateBalloonsInHome();
                        break;
                    case 'followingListPage':
                        app.updateBalloonsInFollowing();
                        break;
                    case 'newsChannelsPage':
                        app.updateBalloonsInNews();
                        break;
                    case 'newsPage':
                        if(pushNotificationHelper.getUnread(PushNotificationMessage.PUSH_NOTIFICATION_TYPE_CHANNEL, app.newsChannelId) > 0) {
                            app.updateBalloonsInNewsContent();
                        } else {
                            app.updateBalloonsInNews();
                        }
                        break;
                    case 'reportingListPage':
                        app.updateBalloonsInReporting();
                        break;
                    //default:
                        // Let's play a sound?
                        //break;
                }
            }
        }        
    }
}

PushNotificationMessage.APP_STATE_INLINE = 1;
PushNotificationMessage.APP_STATE_BACKGROUND = 2;
PushNotificationMessage.APP_STATE_COLDSTART = 3;
    
PushNotificationMessage.PUSH_NOTIFICATION_TYPE_FOLLOWING = 1;
PushNotificationMessage.PUSH_NOTIFICATION_TYPE_REPORTING = 2;
PushNotificationMessage.PUSH_NOTIFICATION_TYPE_CHANNEL = 3;
PushNotificationMessage.PUSH_NOTIFICATION_TYPE_NEWCHANNEL_AVAILABLE = 4;

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

    var appState = null;
    if(e.foreground == true) {
        appState = PushNotificationMessage.APP_STATE_INLINE;
    } else if(e.coldstart == true) {
        appState = PushNotificationMessage.APP_STATE_COLDSTART;
    } else {
        appState = PushNotificationMessage.APP_STATE_BACKGROUND;
    } 

    pnm.setNotificationType(e.payload.type)
       .setAppState(appState)
       .setMessageTitle(e.payload.title)
       .setMessageText(e.payload.message)
       .setData(e.payload.data);
//alert('payload : ' + JSON.stringify(e.payload));
//console.log(pnm);
    return pnm;
}

PushNotificationMessage.fromAPN = function(e) {
    // TODO
}