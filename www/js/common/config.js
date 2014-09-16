var config = {
    
    EMULATE_ON_BROWSER: true,
    
    APP_NAME: "gretacity",
    APP_VERSION: "0.9",
    API_V: "1.0",
    
    DB_FILENAME: "gretacity",       // Database file name
    DB_SCHEMA: "1.0",               // Version of database schema
    DB_NAME: "gretacity",           // Display name of the database
    DB_SIZE: 1024 * 1024 * 50,      // Size in bytes: 1024 * 1024 * 1 equal to 1MB
    
    
    //USER_KEY: 'userdata',
    SESSION_ID_KEY: 'gretacity_sessionid',
    
    
    MODE_DEBUG: 'D',
    MODE_RELEASE: 'R',
    RUNNING_MODE: 'D', //config.MODE_DEBUG,
    
    PRIVACY_URL: 'http://www.gretacity.com/privacy',
    POLICY_URL: 'http://www.gretacity.com/policy',
    INFO_URL: 'http://www.gretacity.com/info',
    
    // To speed up development / testing
    // In release mode they must be empty
    QR_CODE_BASE_URL: 'http://www.gretacity.com/code/',
    //QR_CODE_TEST: 'http://www.gretacity.com/code/4000000028',
    //QR_CODE_TEST: 'http://www.gretacity.com/code/4000000000',
    //QR_CODE_TEST: 'http://www.gretacity.com/code/4000000026',
    //QR_CODE_TEST: 'http://www.gretacity.com/code/1000000769',
    //QR_CODE_TEST: 'http://www.gooogle.com',
    QR_CODE_TEST: 'CIASOOOO',
    LOGIN_DEFAULT_USERNAME: 'mario@rossi.it',
    LOGIN_DEFAULT_PASSWORD: 'rossi',
    
    PASSWORD_MIN_LENGTH: 5,
    
    REPORTING_MAX_PHOTOS: 3,
    
    
    PUSH_REGISTRATION_MAX_DAYS: 7,
    
    
    REQUEST_DEFAULT_TIMEOUT: 5000,  // 5 secs
    
    URL_BASE: 'http://www.gretacity.com',
    
    URL_NOTIFICATION_REGISTER: '/web/index.php?mode=module&p=app_services&a=register_app',
    
    URL_USER_LOGIN: '/web/index.php?mode=module&p=login&t=login_app&s=app_login',
    URL_USER_REGISTER: '/web/index.php?mode=module&p=login&s=add_user',
    URL_USER_RECOVER_PASSWORD: '/web/index.php?mode=module&p=utenti&s=utenti&s_t=send_new_password',
    URL_USER_CHANGE_PASSWORD: '/web/index.php?mode=module&p=utenti&s=utenti&s_t=new_password_app',
    
    URL_USER_SESSION_CHECK: '/web/index.php?mode=module&p=app_services&a=check_session',
    
    URL_PROFILE_LOAD: '/web/index.php?mode=module&p=login&s=get_user',
    URL_PROFILE_UPDATE: '/web/index.php?mode=module&p=login&s=update_user',
    
    URL_NEWS_NEARBY_LOCATION: '/web/index.php?mode=module&p=app_services&a=comuni',
    // Ricerca comuni per nome
    URL_NEWS_SEARCH_LOCATION: '/web/index.php?mode=module&p=app_services&a=search_comune',
    // Elenco dei feed per zona geografica: id_comune, id_provincia, id_regione
    URL_NEWS_CHANNELS: '/web/index.php?mode=module&p=app_services&a=search_feed',
    URL_NEWS_CHANNEL_INFO: '/web/index.php?mode=module&p=app_services&a=get_feeds',
    // Elenco dei feed sottoscritti dall'utente
    URL_NEWS_SUBSCRIBED_CHANNELS: '/web/index.php?mode=module&p=app_services&a=user_feed',
    URL_NEWS_SUBSCRIBE_CHANNEL: '/web/index.php?mode=module&p=app_services&a=add_feed',
    URL_NEWS_UNSUBSCRIBE_CHANNEL: '/web/index.php?mode=module&p=app_services&a=rem_feed',
    URL_NEWS_LIST: '/web/index.php?mode=module&p=app_services&a=get_notizie',
    URL_NEWS_DETAIL: '/web/index.php?mode=module&p=app_services&a=get_notizia',
    
    URL_QRCODE_GET_INFO: '/web/index.php?p=app_services&a=get&mode=module',
    URL_QRCODE_SEND_COMMENT: '/web/index.php?mode=module&p=commenti&s=commenti&s_t=add_app',
    
    //params: qrcode
    URL_QRCODE_FOLLOW: '/web/index.php?mode=module&p=app_services&a=follow',
    URL_QRCODE_UNFOLLOW: '/web/index.php?mode=module&p=app_services&a=unfollow',
    URL_QRCODE_FOLLOWING : '/web/index.php?mode=module&p=app_services&a=get_follows',
    
    URL_REPORTING_CATEGORY_LIST: '/web/index.php?mode=module&a=categories&p=app_services',
    URL_REPORTING_SEND: '/web/index.php?mode=module&p=segnalazioni_utente&s=segnalazione_web&s_t=add_app',
    URL_REPORTING_LIST: '/web/index.php?p=segnalazioni&a=utente&mode=module',
    
    //URL_NEARBY_PLACES: 'http://bitroad.it/google/places.php',
    URL_NEARBY_PLACES: '/web/index.php?mode=module&p=app_services&a=aroundme',
    //URL_NEARBY_PLACE_INFO: 'http://bitroad.it/google/info.php',
    URL_NEARBY_PLACE_INFO: '/web/index.php?mode=module&p=app_services&a=info',
    
    // TODO
    ///web/index.php?mode=module&p=app_services&a=aroundme&types=segnalazioni&lat=&lng=distance=',
    
    NEARBY_DEFAULT_DISTANCE: 2, // In Km
    NEARBY_MAX_DISTANCE: 20,    // In Km
    
    
    GOOGLE_GCM_PROJECT_ID: '464796215250',
    
    
    GOOGLE_MAPS_API_KEY: "",
    GOOGLE_MAPS_SENSOR: "true",
    GOOGLE_MAPS_ZOOM: 18,
    GOOGLE_MAPS_TYPE_ID: 'google.maps.MapTypeId.SATELLITE',
    
    GEO_OPTS_MAXIMUM_AGE: 3000,
    GEO_OPTS_TIMEOUT: 5000,
    GEO_OPTS_HIGH_ACCURACY: true,
    // Minimum accuracy level required of the latitude
    // and longitude coordinates in meters
    GEO_OTPS_MINIMUM_ACCURACY_REQUIRED: 3,
    
    CAMERA_QUALITY: 25,
    CAMERA_CORRECT_ORIENTATION: true,
    CAMERA_TARGET_WIDTH: null, //300,
    CAMERA_TARGET_HEIGHT: null, //400,
    CAMERA_SAVE_TO_PHOTO_ALBUM: false,
    CAMERA_ALLOW_EDIT: true,
    
    
    USE_WIFI_ONLY_KEY: 'gretacity_usewifi',
    getUseWifiOnly: function() {
        var useWifi = window.localStorage.getItem(config.USE_WIFI_ONLY_KEY);
        if(typeof(useWifi) == 'string') useWifi = JSON.parse(useWifi);
        return (useWifi == null) ? false : useWifi;
    },
    setUseWifiOnly: function(wifiOnly) {
        window.localStorage.setItem(config.USE_WIFI_ONLY_KEY, wifiOnly);
    },
    
    
    
    SERVER_DATA_LAST_UPDATE_KEY: 'gretacity_serverdatalastupdate',
    getServerDataLastUpdate: function() {
        var lastUpdate = window.localStorage.getItem(config.SERVER_DATA_LAST_UPDATE_KEY);
        if(typeof(lastUpdate) == 'string') {
            lastUpdate = new Date(lastUpdate); //JSON.parse(lastUpdate);
        }
        return lastUpdate;
    },
    setServerDataLastUpdate: function(lastUpdate) {
        window.localStorage.setItem(config.SERVER_DATA_LAST_UPDATE_KEY, lastUpdate);
    },
    

    FIRST_UPDATE_NOTIFICATION_KEY: 'gretacity_firstupdatenotification',
    getFirstUpdateNotification: function() {
        return (window.localStorage.getItem(config.FIRST_UPDATE_NOTIFICATION_KEY) || false);
    },
    setFirstUpdateNotification: function(notified) {
        window.localStorage.setItem(config.FIRST_UPDATE_NOTIFICATION_KEY, !!notified);
    },
    
    
    NATIVE_BASE_URL_KEY: 'gretacity_nativebaseurl',
    getNativeBaseURL: function() {
        return (window.localStorage.getItem(config.NATIVE_BASE_URL_KEY) || '');
    },
    setNativeBaseURL: function(url) {
        window.localStorage.setItem(config.NATIVE_BASE_URL_KEY, url);
    },
    
    
    USER_PROFILE_HAS_BEEN_SET_KEY: 'gretacity_userprofilehasbeenset',
    userProfileHasBeenSet: function(val) {
        if(typeof(val) != 'undefined') {
            window.localStorage.setItem(config.USER_PROFILE_HAS_BEEN_SET_KEY, !!val);
        }
        return (window.localStorage.getItem(config.USER_PROFILE_HAS_BEEN_SET_KEY) || false);
    },
    
    USER_LAST_LOGIN_USERNAME_KEY: 'gretacity_userlastloginusername',
    userLastLoginUsername: function(val) {
        if(typeof(val) != 'undefined') {
            window.localStorage.setItem(config.USER_LAST_LOGIN_USERNAME_KEY, val);
        }
        return (window.localStorage.getItem(config.USER_LAST_LOGIN_USERNAME_KEY) || '');
    }
};


// Set the EMULATE_ON_BROWSER property
config.EMULATE_ON_BROWSER = (typeof(cordova) == 'undefined');
if(config.EMULATE_ON_BROWSER) {
    // If cordova is not found, this object must be defined anyway
    PositionError = {PERMISSION_DENIED: 1,
                     POSITION_UNAVAILABLE: 2,
                     TIMEOUT: 3};
    Camera = {
        PictureSourceType : {
            PHOTOLIBRARY : 0,
            CAMERA : 1
        }
    };
    
    /*window.requestFileSystem = window.webkitRequestFileSystem;
    LocalFileSystem = {};
    LocalFileSystem.PERSISTENT = window.PERSISTENT;
    LocalFileSystem.TEMPORARY = window.TEMPORARY;*/
}
//config.EMULATE_ON_BROWSER = true;


if(config.RUNNING_MODE == config.MODE_DEBUG) {
    //config.QR_CODE_TEST = '1000000065';
    //config.LOGIN_DEFAULT_USERNAME = 'marcellinara';
    //config.LOGIN_DEFAULT_PASSWORD = 'marcellinara';
}






// Extends Date class
Date.prototype.toYMD = function() {
    var year, month, day;
    year = String(this.getFullYear());
    month = String(this.getMonth() + 1);
    if(month.length == 1) {
        month = "0" + month;
    }
    day = String(this.getDate());
    if(day.length == 1) {
        day = "0" + day;
    }
    return year + "-" + month + "-" + day;
}
Date.prototype.toYMDHMS = function() {
    var hh, mm, ss;
    hh = String(this.getHours());
    if(hh.length == 1) hh = "0" + hh;
    mm = String(this.getMinutes());
    if(mm.length == 1) mm = "0" + mm;
    ss = String(this.getSeconds());
    if(ss.length == 1) ss = "0" + ss;
    return this.toYMD() + " " + hh + ":" + mm + ":" + ss;
}
Date.prototype.toDMY = function() {
    var year, month, day;
    year = String(this.getFullYear());
    month = String(this.getMonth() + 1);
    if(month.length == 1) {
        month = "0" + month;
    }
    day = String(this.getDate());
    if(day.length == 1) {
        day = "0" + day;
    }
    return day + "/" + month + "/" + year;
}
Date.prototype.toHM = function() {
    var hh, mm;
    hh = String(this.getHours());
    if(hh.length == 1) hh = "0" + hh;
    mm = String(this.getMinutes());
    if(mm.length == 1) mm = "0" + mm;
    return hh + ":" + mm;
}

Date.prototype.toDMYHMS = function() {
    var hh, mm, ss;
    hh = String(this.getHours());
    if(hh.length == 1) hh = "0" + hh;
    mm = String(this.getMinutes());
    if(mm.length == 1) mm = "0" + mm;
    ss = String(this.getSeconds());
    if(ss.length == 1) ss = "0" + ss;
    return this.toDMY() + " " + hh + ":" + mm + ":" + ss;
}
Date.parseFromYMDHMS = function(dateText) {
    if(((dateText || '') == '') || (dateText == '0000-00-00 00:00:00')) return null;
    var parts = dateText.split(' ');
    var dateParts = parts[0].split('-');
    var timeParts = parts[1].split(':');
    return new Date(parseInt(dateParts[0]), parseInt(dateParts[1])-1, parseInt(dateParts[2]), 
                    parseInt(timeParts[0]), parseInt(timeParts[1]), parseInt(timeParts[2]), 0);
}



Date.prototype.getDiffInDays = function(dt) {
    var t1 = this.getTime();
    var t2 = dt.getTime();
    return parseInt(Math.abs(t2-t1)/(24*3600*1000));
}



String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

