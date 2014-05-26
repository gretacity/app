var config = {
    
    EMULATE_ON_BROWSER: true,
    
    APP_NAME: "gretacity",
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
    
    
    // To speed up development / testing
    // In release mode they must be empty
    QR_CODE_TEST: '',
    LOGIN_DEFAULT_USERNAME: '',
    LOGIN_DEFAULT_PASSWORD: '',
    
    
    REPORTING_MAX_PHOTOS: 1,
    
    
    URL_BASE: 'http://www.gretacity.com/test',
    
    URL_USER_LOGIN: '/web/index.php?mode=module&p=login&t=login_app&s=app_login',
    URL_USER_REGISTER: '/web/index.php?mode=module&p=login&s=add_user',
    
    URL_REPORTING_CATEGORY_LIST: '/web/index.php?mode=module&a=categories&p=app_services',
    URL_REPORTING_SEND: '/web/index.php?p=segnalazioni_utente&mode=module&p=segnalazioni_utente&s=segnalazione_web&s_t=add_app',
    URL_REPORTING_LIST: '/web/index.php?p=segnalazioni&a=utente&mode=module',
    
    GOOGLE_MAPS_API_KEY: "AIzaSyCP3LSUtIAVLhGhp65HQCvHd3u0Ee4HqzQ",
    GOOGLE_MAPS_SENSOR: "true",
    GOOGLE_MAPS_ZOOM: 19,
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
    CAMERA_ALLOW_EDIT: false,
    
    
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
    }
    
};


// Set the EMULATE_ON_BROWSER property
config.EMULATE_ON_BROWSER = (typeof(cordova) == 'undefined');
if(config.EMULATE_ON_BROWSER) {
    // If cordova is not found, this object must be defined anyway
    PositionError = {PERMISSION_DENIED: 1,
                     POSITION_UNAVAILABLE: 2,
                     TIMEOUT: 3};
    
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
    if(dateText == '0000-00-00 00:00:00') return null;
    var parts = dateText.split(' ');
    var dateParts = parts[0].split('-');
    var timeParts = parts[1].split(':');
    return new Date(dateParts[0], parseInt(dateParts[1])-1, 
                    dateParts[2], timeParts[0], timeParts[1], timeParts[2]);
}

