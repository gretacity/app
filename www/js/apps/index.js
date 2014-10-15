var app = {
    self: null,
    language: '',
    pushNotification: null,
    initialize: function() {
        self = this;
        this.bindEvents();
        geoLocation.loadGoogleMapsScript('self.mapsScriptLoaded');
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'pause', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', self.onDeviceReady, false);
        document.addEventListener('resume', self.onResume, false);
        document.addEventListener('online', self.onOnline, false);
        document.addEventListener('offline', self.onOffline, false);
        
        if(config.EMULATE_ON_BROWSER) self.onDeviceReady();
        if(config.EMULATE_ON_BROWSER) self.onResume();
        
        // For android devices
        document.addEventListener('backbutton', function(e) {
            /*if(barcodeReader.scanning) {
                e.preventDefault();
            } else*/
            if($.mobile.activePage.is('#homePage') || 
               $.mobile.activePage.is('#loginPage')) {
                e.preventDefault();
                navigator.app.exitApp();
            } else if($.mobile.activePage.is('#reportingListPage')) {
                e.preventDefault();
                $.mobile.changePage('#reportingHomePage', {transition: 'slide', reverse: true});
            } else {
                navigator.app.backHistory();
            }
        }, false);
        
        /*
        $('.newsPageToolbarButton').on('click', function() {
            self.showNewsChannel(self.newsChannelId);
        });*/
        
        var loginPage = $('#loginPage');
        loginPage.on('pagebeforeshow', function() {
            if(config.userLastLoginUsername() != '') {
                $('#username', loginPage).val(config.userLastLoginUsername());
            } else {
                $('#username', loginPage).val(config.LOGIN_DEFAULT_USERNAME);
            }
            $('#password', loginPage).val(config.LOGIN_DEFAULT_PASSWORD);
        });
        $('#loginButton', loginPage).on('click', self.login);
        $('#recoverPasswordButton', loginPage).on('click', self.recoverPassword);
        var changePasswordPage = $('#changePasswordPage');
        changePasswordPage.on('pagebeforeshow', self.beforeShowChangePasswordPage);
        $('#changePasswordButton', changePasswordPage).on('click', self.changePassword);
        
        var registerPage = $('#registrationPage');
        registerPage.on('pageinit', self.initRegisterPage);
        registerPage.on('pagebeforeshow', self.beforeShowRegisterPage);
        $('#registerButton', registerPage).on('click', self.register);

        var homePage = $('#homePage');
        homePage.on('pageinit', self.initHomePage);
        homePage.on('pageshow', self.showHomePage);
        
        var reportingHomePage = $('#reportingHomePage');
        reportingHomePage.on('pageinit', self.initReportingHomePage);
        reportingHomePage.on('pageshow', self.showReportingHomePage);
         
        var reporting1Page = $('#reporting1Page');
        reporting1Page.on('pageinit', self.initReporting1Page);
        reporting1Page.on('pageshow', self.showReporting1Page);
        
        var reporting2Page = $('#reporting2Page');
        reporting2Page.on('pageshow', self.showReporting2Page);
        
        var reporting4Page = $('#reporting4Page');
        reporting4Page.on('pageinit', self.initReporting4Page);
        reporting4Page.on('pageshow', self.showReporting4Page);
        
        var reporting5Page = $('#reporting5Page');
        reporting5Page.on('pageinit', self.initReporting5Page);
        
        var reporting6Page = $('#reporting6Page');
        reporting6Page.on('pageinit', self.initReporting6Page);
        
        var reportingListPage = $('#reportingListPage');
        reportingListPage.on('pageinit', self.initReportingListPage);
        reportingListPage.on('pagebeforeshow', self.beforeShowReportingListPage);
        reportingListPage.on('pageshow', self.showReportingListPage);
        
        var reportingListDetailPage = $('#reportingListDetailPage');
        reportingListDetailPage.on('pageinit', self.initReportingListDetailPage);
        
        var reportingNearbyPage = $('#reportingNearbyPage');
        reportingNearbyPage.on('pageinit', self.initReportingNearbyPage);
        reportingNearbyPage.on('pageshow', self.showReportingNearbyPage);
        
        var newsPage = $('#newsPage');
        newsPage.on('pageinit', self.initNewsPage);
        newsPage.on('pageshow', self.showNewsPage);
        var followingListPage = $('#followingListPage');
        followingListPage.on('pageinit', self.initFollowingListPage);
        followingListPage.on('pageshow', self.showFollowingListPage);
        
        $('#qrCodeInfoGalleryPage').on('pageshow', self.showQrCodeInfoGalleryPage);
        $('#qrCodeInfoPositionPage').on('pageshow', self.showQrCodeInfoPositionPage);
        $('#qrCodeInfoNewsPage').on('pagebeforeshow', self.beforeShowQrCodeInfoNewsPage);
        $('#qrCodeInfoCommentsPage').on('pagebeforeshow', self.beforeShowQrCodeInfoCommentsPage);
        $('#qrCodeInfoMultimediaPage').on('pagebeforeshow', self.beforeShowQrCodeInfoMultimediaPage);
        $('#qrCodeInfoLinksPage').on('pagebeforeshow', self.beforeShowQrCodeInfoLinksPage);

        var nearbyPage = $('#nearbyPage');
        nearbyPage.on('pageinit', self.initNearbyPage);
        nearbyPage.on('pagebeforeshow', self.beforeShowNearbyPage);
        
        var nearbyResultsPage = $('#nearbyResultsPage');
        nearbyResultsPage.on('pageinit', function() {
            $('#nearbySearchSlider', nearbyResultsPage).on('slidestop', self.searchNearbyPlaces);
        });
        nearbyResultsPage.on('pageshow', self.beforeShowNearbyResultsPage);
        
        var nearbyPlaceInfoPage = $('#nearbyPlaceInfoPage');
        nearbyPlaceInfoPage.on('pageinit', self.initNearbyPlaceInfo);
        nearbyPlaceInfoPage.on('pagebeforeshow', self.beforeShowNearbyPlaceInfo);
        nearbyPlaceInfoPage.on('pageshow', self.showNearbyPlaceInfo);
        
        var setupPage = $('#setupPage');
        setupPage.on('pageinit', function() {
            $('#setupPage #logoutButton').on('click', self.logout);
        });
        var profilePage = $('#profilePage');
        profilePage.on('pageinit', self.initProfilePage);
        profilePage.on('pagebeforeshow', self.beforeshowProfilePage);
        profilePage.on('pageshow', self.showProfilePage);

        var setupFollowingPage = $('#setupFollowingPage');
        setupFollowingPage.on('pageshow', self.showSetupFollowingPage);
        
        var setupChannelsPage = $('#setupChannelsPage');
        setupChannelsPage.on('pageshow', self.showSetupChannelsPage);
        
        var setupChannelSubscriptionPage = $('#setupChannelSubscriptionPage');
        setupChannelSubscriptionPage.on('pageinit', self.initSetupChannelSubscriptionPage);
        setupChannelSubscriptionPage.on('pagebeforeshow', self.beforeshowSetupChannelSubscriptionPage);
        setupChannelSubscriptionPage.on('pageshow', self.showSetupChannelSubscriptionPage);
        
        var supportPage = $('#supportPage');
        supportPage.on('pageshow', self.initSupportPage);
        supportPage.on('pageshow', self.showSupportPage);
        
        $('#infoPage').on('pageinit', function() {
            $('#infoPage #privacyButton').on('click', function() {
                self.openLink(config.PRIVACY_URL);
            });
            $('#infoPage #policyButton').on('click', function() {
                self.openLink(config.POLICY_URL);
            });
            $('#infoPage #infoButton').on('click', function() {
                self.openLink(config.INFO_URL);
            });
        });
                
        var infoPage = $('#qrCodeInfoPage');
        $('#getInfoButton', infoPage).on('click', self.getInfoFromQrCode);
    },
    onResume: function() {
        
        if(config.EMULATE_ON_BROWSER) return;
        
        //pushNotificationHelper.updateApplicationIconBadgeNumber();
        
        var lastRegistrationDate = pushNotificationHelper.getLastRegistrationDate();
        if((auth.getSessionId() != '') && ((lastRegistrationDate == null) || (lastRegistrationDate.getDiffInDays(new Date()) >= config.PUSH_REGISTRATION_MAX_DAYS))) {
console.log('onResume: registration to push server required');
            // Update the registration to push server
            pushNotificationHelper.register(function(res) {
                console.log('Registered device on Apple/Google Push Server', res);
                pushNotificationHelper.setLastRegistrationDate(new Date());
            }, function(e) {
                console.log('Error on registering device on Apple/Google Push Server', e);
            });
        }
    },
    onOnline: function() {
        //$('#loginPage #loginButton').removeClass('ui-disabled');
    },
    onOffline: function() {
        //$('#loginPage #loginButton').addClass('ui-disabled');
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'self.receivedEvent(...);'
    onDeviceReady: function() {
        
        self.receivedEvent('deviceready');
        if(typeof(navigator.language) == 'string') {
            self.language = navigator.language;
        } else {
            navigator.globalization.getPreferredLanguage(
                function (language) {self.language = language.value;},
                function () {}
            );
        }
        
        $(document).on("pagecontainerbeforetransition", function (event, ui) {
            /*if (ui.options.reverse == true) {*/
            if(
                    (ui.toPage.attr('id') == 'homePage') || ((ui.prevPage) && (ui.prevPage.attr('id') == 'homePage')) ||
                    (ui.toPage.attr('id') == 'setupPage') || ((ui.prevPage) && (ui.prevPage.attr('id') == 'setupPage'))
              ) {
                ui.options.transition = "none";
            }
        });

        services.checkSession(function(result) {
            console.log('onDeviceReady: session check ' + result);
            if(result) {
                services.getProfile(null, function(result) {
                    self.userProfile = result;
                });
            }
            window.location.hash = (result ? 'homePage' : 'beforeLoginPage');
            $.mobile.initializePage();
        });
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },
    
    ////////////////////////////
    // Common functions
     
    maximizeMap: function(map) {
        var mapEl = (typeof(map) == 'string') ? $(map) : map;
        var page = mapEl.closest('div[data-role="page"]');
        var pageHeight = page.outerHeight();
        var height = 0;
        height += $('div[data-role="header"]', page).outerHeight();
        height += $('div[data-role="footer"]', page).outerHeight();
        $('div[data-role="main"]', page).children(':visible').each(function() {
            var el = $(this);
            if(el.attr('id') != mapEl.attr('id')) {
                height += el.outerHeight();
            }
        });
        mapEl.height(
            pageHeight - height
        );
    },
    
    readQrCode: function() {
        barcodeReader.acquireQrCode(function(res) {
            if(res === '') {
                return;
            }
            var qrCodeData = QrCodeData.fromText(res.text);
            switch(qrCodeData.type) {
                case QrCodeData.TYPE_GRETACITY:
                    //self.currentQrCode = qrCodeData.elements.code;
                    //self.getFollowingInfo(qrCodeData.elements.code);
                    self.getFollowingInfo(qrCodeData.elements.code);
                    break;
                case QrCodeData.TYPE_URL:
                    //window.open(qrCodeData.elements.url, '_blank', 'location=no,closebuttoncaption=Indietro');
                    //break;
                case QrCodeData.TYPE_TEXT:
                case QrCodeData.TYPE_CONTACT:
                case QrCodeData.TYPE_PHONE_NUMBER:
                case QrCodeData.TYPE_SMS:
                    self.openQrCodeInfoViewer(qrCodeData);
                    break;
                default:
                    helper.alert('Codifica non supportata', null, 'Leggi QR Code');
                    break;
            }
        }, function(e) {
            $('#qrCodeInfoPage #qrCodeId').val('');
            // errorCallback
            helper.alert('Impossibile leggere il codice', null, 'Leggi QR Code');
        });
    },
    
    openQrCodeInfoViewer: function(qrCodeData) {
        var html = '';
        var infoText = '';
        switch(qrCodeData.type) {
            case QrCodeData.TYPE_URL:
                infoText = 'Trovato URL <p>Hai la possibilità di visitare il sito cliccando sul link sottostante:</p>';
                var href = 'javascript:app.openLink(\'' + qrCodeData.elements.url + '\')';
                html = '<li><a href="' + href + '" style="white-space:normal !important; word-wrap:break-word; overflow-wrap: break-word;">' + qrCodeData.elements.url + '</li>';
                //window.open(qrCodeData.elements.url, '_blank', 'location=no,closebuttoncaption=Indietro');
                break;
            case QrCodeData.TYPE_TEXT:
                infoText = 'Il QR Code ha acquisito il seguente testo:';
                html = //'<li data-role="list-divider">Testo</li>' +
                       '<li style="white-space:normal"><strong>' + qrCodeData.elements.text + '</strong></li>';
                break;
            case QrCodeData.TYPE_CONTACT:
                infoText = 'Contatto';
                html = ''; //<li data-role="list-divider">Contatto</li>';
                for(var i in qrCodeData.elements) {
                    html += '<li style="white-space:normal">' + i + ': <strong>' + qrCodeData.elements[i] + '</strong></li>';
                }
                break;
            case QrCodeData.TYPE_PHONE_NUMBER:
                infoText = 'Numero di telefono';
                html = //'<li data-role="list-divider">Numero di telefono</li>' + 
                       '<li style="white-space:normal"><strong>' + qrCodeData.elements.phoneNumber + '</strong></li>';
                break;
            case QrCodeData.TYPE_SMS:
                infoText = 'SMS';
                html = //'<li data-role="list-divider">Invia SMS</li>' +
                       '<li>al numero</li>' +
                       '<li style="white-space:normal"><strong>' + qrCodeData.elements.phoneNumber + '</strong></li>' +
                       '<li>testo del messaggio</li>' +
                       '<li style="white-space:normal"><strong>'+qrCodeData.elements.message + '</strong></li>';                
                break;
        }
        $('#qrCodeViewerPage div[data-role="main"] #info').html(infoText);
        $('#qrCodeViewerPage div[data-role="main"] #qrCodeViewer').html(html).listview().listview('refresh');
        $.mobile.changePage('#qrCodeViewerPage');
    },
        
    openLink: function(url, target, opts) {
        target = target || '_system';
        var options = '';
        if(opts != null) {
            if(typeof(opts) == 'object') {
                var items = [];
                for(var k in opts) {
                    items.push(k + '=' + opts[k]);
                }
                options = items.join(',');
            } else {
                options = opts;
            }
        }
        var ref = window.open(url, target, options);
    },

    openPhoto: function(imageUrl) {
        if(typeof(imageUrl) != "string") {
            var el = imageUrl.currentTarget ? imageUrl.currentTarget : imageUrl;
            imageUrl = $(this).css('background-image');
            if(((imageUrl || '') == '') || (imageUrl.indexOf('url(file://') == 0)) return;
            if(imageUrl.indexOf('url(') == 0) {
                imageUrl = imageUrl.substr(4);
                imageUrl = imageUrl.substr(0, imageUrl.length - 1);
            }
        }
        
        /*$('#photoPage #photo').attr('src', imageUrl);
        $.mobile.changePage('#photoPage');*/
        
        var win = window.open("ImageViewer.html", "_blank", "location=no,closebuttoncaption=Indietro,EnableViewPortScale=yes" );
        win.addEventListener( "loadstop", function() {
            win.executeScript({code: "document.getElementsByTagName('img')[0].src = '" + imageUrl + "';" });
            
        });
    },
    
    fillCityList: function(val, listEl, targetElId, customHRef) {
        services.getLocationsByName({name:val}, function(result) {
            var html = '';
            var max_rows = 20;
            var ix = 0;
            for(var i in result) {
                if(ix++ >= max_rows) {
                    html += '<li>Altri risultati omessi</li>';
                    break;
                }
                var row = result[i];
                var cityName = row.nome.trim().replace(/'/g, "\\'");
                var onclick = null;
                if(customHRef) {
                    onclick = customHRef;
                } else {
                    onclick = 'app.setCity(\'' + targetElId + '\', \'' + cityName +
                              '\', '+row.id+', \'' + listEl.attr('id') + '\')';
                }
                html += '<li><a href="#" onclick="' + onclick + '" data-regionid="' + row.id_regione + '" data-provid="' + row.id_provincia + '" data-cityid="'+row.id+'" data-cityname=\'' + cityName + '\'>' + row.nome.trim() + ', ' + row.sigla.trim() + '</a></li>';
            }
            listEl.html(html).listview("refresh");
        });
    },
    setCity: function(targetElId, name, id, listElId) {
        $('#' + targetElId, $.mobile.activePage).val(name).data('cityid',id).data('cityname', name);
        $('#' + listElId, $.mobile.activePage).empty();
    },
    
    updateBalloonsInHomePage: function() {
        var cfg = [
            {type: PushNotificationMessage.PUSH_NOTIFICATION_TYPE_CHANNEL, elementId: 'newsCount', className: 'ui-li-count-news'},
            {type: PushNotificationMessage.PUSH_NOTIFICATION_TYPE_REPORTING, elementId: 'reportingCount', className: 'ui-li-count-reporting'},
            {type: PushNotificationMessage.PUSH_NOTIFICATION_TYPE_FOLLOWING, elementId: 'followingCount', className: 'ui-li-count-following'}
        ];
        for(var i in cfg) {
            var unreadCount = pushNotificationHelper.getUnread(cfg[i].type);
            var el = $('#homePage .'+cfg[i].className); //, page);
            if(el.length == 0) continue;
            el.html(unreadCount);
            if(unreadCount > 0) {
                el.show();
            } else {
                el.hide();
            }
        }
    },
    updateBalloonsInReportingHome: function() {
        // Display a balloon in the item that contains updates
        var unreadCount = pushNotificationHelper.getUnread(PushNotificationMessage.PUSH_NOTIFICATION_TYPE_REPORTING);
        var el = $('#reportingHomePage .ui-li-count-reporting');
        if(el.length == 0) return;
        el.html(unreadCount);
        if(unreadCount > 0) {
            el.show();
        } else {
            el.hide();
        }
    },
    updateBalloonsInReporting: function() {
        // Display a balloon for each item that contains updates
        var unreadCount = pushNotificationHelper.getUnread(PushNotificationMessage.PUSH_NOTIFICATION_TYPE_REPORTING, null, true);
        $('#reportingListPage span.ui-li-count-cust').html('').hide();
        for(var i in unreadCount) {
            el = $('#reportingListPage #count_reporting_' + i).html('&nbsp;' + unreadCount[i]).show();
        }
    },
    updateBalloonsInFollowing: function() {
        var listEl = $('#followingListPage #followingList');
        $('li a span.ui-li-count', listEl).hide().html('');
        var unreadData = pushNotificationHelper.getUnread(PushNotificationMessage.PUSH_NOTIFICATION_TYPE_FOLLOWING, null, true);
        for(var i in unreadData) {
            //if(unreadData[i] == 0) continue;
            $('li a #count_' + i, listEl).html('&nbsp;' + unreadData[i]).show();
        }
    },

    updateBalloonsInNews: function(openIfUnread) {
        // Display a balloon for each feed that contains updates
        var listEl = $('#newsPage #newsChannelsPanel #channelList');
        $('li a span.ui-li-count', listEl).hide();
        var unreadData = pushNotificationHelper.getUnread(PushNotificationMessage.PUSH_NOTIFICATION_TYPE_CHANNEL, null, true);
        var hasUnread = false;
        for(var i in unreadData) {
            hasUnread = true;
            $('li a #count_' + i, listEl).html('&nbsp;' + unreadData[i]).show();
        }
        if((openIfUnread || false) && (hasUnread)) {
            setTimeout(function() {
                $('#newsPage #newsChannelsPanel').panel('open');
            }, 500);
        }
    },
    /*updateBalloonsInNewsContent: function() {
        // Don't display the balloon on top of the feed,
        // but uses the old feed update system and display 
        // a button on the top of the page to add new posts.
        self.retrieveChannelContent(true);
    },*/
    
    ////////////////////////////
    // Common functions (end)
    
    
    pageId : null,
    changePageAfterLogin: function(pageId) {
        self.pageId = pageId;
    },
    
    
    
    
    
    
    
    
    
    
    
    
    lockLoginUi: function(lock) {
        var page = $('loginPage');
        if(lock) {
            $('#username').addClass('ui-disabled');
            $('#password').addClass('ui-disabled');
            $('#loginButton', page).addClass('ui-disabled');
            $('#recoverPasswordButton', page).addClass('ui-disabled');
            $('#registerPageButton', page).addClass('ui-disabled');
        } else {
            $('#username').removeClass('ui-disabled');
            $('#password').removeClass('ui-disabled');
            $('#loginButton', page).removeClass('ui-disabled');
            $('#recoverPasswordButton', page).removeClass('ui-disabled');
            $('#registerPageButton', page).removeClass('ui-disabled');
        }
    },
    
    login: function() {
        var page = $('#loginPage');
        var usernameEl = $('#username', page);
        var username = usernameEl.val().trim();
        if(username == '') {
            $('#username', page).addClass('input-error');
            helper.alert('Inserisci il nome utente', function() {
                usernameEl.focus();
            }, 'Login');
            return;
        } else {
            $('#username', page).removeClass('input-error');
        }
        var passwordEl = $('#password', page);
        var password = passwordEl.val().trim();
        if(password == '') {
            $('#password', page).addClass('input-error');
            helper.alert('Inserisci la password', function() {
                passwordEl.focus();
            }, 'Login');
            return;
        } else {
            $('#password', page).removeClass('input-error');
        }
        if(!helper.isOnline()) {
            helper.alert('Nessuna connessione', null, 'Accesso a GretaCITY');
            return;
        }
        $('#username', page).addClass('ui-disabled');
        $('#password', page).addClass('ui-disabled');
        var initialVal = $('#loginButton', page).html();
        $('#loginButton', page).html('Accesso in corso...');
        self.lockLoginUi(true);
        $.mobile.loading('show');
        auth.login({username: username, password: password}, function(result) {
            $('#loginButton', page).html('ACCEDI');
            // Successfully loggedin, move forward
            pushNotificationHelper.register(function(res) {
                console.log('Registered device on Apple/Google Push Server', res);
                pushNotificationHelper.setLastRegistrationDate(new Date());
            }, function(e) {
                console.log('Error on registering device on Apple/Google Push Server', e);
            });
            
            // Load profile from server
            services.getProfile({}, function(result) {
                self.userProfile = result;
                $.mobile.loading('hide');
                    
                if(!config.userProfileHasBeenSet()) {        
                    // City is mandatory
                    if(self.userProfile.city.id > 0) {
                        config.userProfileHasBeenSet(true);
                        return;
                    }
                    helper.alert('Prima di procedere è necessario impostare il tuo profilo', function() {
                        $.mobile.changePage('#profilePage');
                    }, 'Profilo');
               }     
                    
            }, function(e) {
                $.mobile.loading('hide');
            });
            
            $('#password').val('');
            $('#loginButton').val('Login');
            self.lockLoginUi(false);
            config.userLastLoginUsername(username);
            $.mobile.navigate.history.stack.splice($.mobile.navigate.history.stack.length - 1);
            if(self.pageId != null) {
                $.mobile.changePage('#' + self.pageId);
                self.pageId = null;
            } else {
                $.mobile.changePage('#homePage');
            }
        }, function(e) {
            $('#loginButton', page).html('ACCEDI');
            $.mobile.loading('hide');
            $('#loginButton', page).html(initialVal).removeClass('ui-disabled');
            helper.alert(e, function() {
                $('#loginButton').val('Login');
                self.lockLoginUi(false);        
                $('#recoverPasswordPanel').show('fast');
            }, 'Login');
        });
    },
    
    logout: function() {
        auth.setSessionId('');
        self.userProfile = null;
        $.mobile.changePage('#loginPage', {transition: 'slide', reverse: true});
    },
    
    initRegisterPage: function() {
        var page = $('#registrationPage');
        $('#city', page).on('input', function(e) {
            
            var val = $(e.currentTarget).val();

            if($(this).data('cityname') != val) {
                $(this).data('cityid', '');
            }
            if(val.length >= 3) {
                self.fillCityList(val, $('#citySuggestion', page), 'city');
            } else if(val.length == 0) {
                $('#citySuggestion', page).empty();
            }
        });
    },
    beforeShowRegisterPage: function() {
        $('#registrationPage input[type="text"]').val('');
        $('#registrationPage input[type="email"]').val('');
        $('#registrationPage input[type="password"]').val('');
        $('#registrationPage input[type="tel"]').val('');
        $('#registrationPage input[type="checkbox"]').attr('checked', false).checkboxradio('refresh');
        $('#registrationPage #citySuggestion').empty();
    },
    
    register: function() {
        var page = $('#registrationPage');
        var params = {};
        // Validation
        var hasErrors = false;
        var fields = ['city', 'lastname', 'firstname', 'email', 'phone', 'address', 'password'];
        for(var i in fields) {
            var fieldId = fields[i];
            var required = null;
            var fieldVal = null;
            /*if(fieldId == 'city') {
                required = true;
                fieldVal = $('#' + fieldId, page).data('cityid') || '';
            } else {*/
                required = $('#' + fieldId + '[required]', page).length == 1;
                fieldVal = $('#' + fieldId, page).val().trim();
            //}
            if(required && (fieldVal == '')) {
                $('#' + fieldId, page).addClass('input-error');
                hasErrors = true;
            } else {
                $('#' + fieldId, page).removeClass('input-error');
            }
            eval('params.'+fieldId+'="'+fieldVal+'"');
        }

        if(hasErrors) {
            helper.alert('Compila i campi obbligatori', function() {
                $.mobile.silentScroll();
            }, 'Registrazione');
            return;
        }

        // Specific validation for city
        if(($('#city', page).data('cityid') || '') == '') {
            helper.alert('Seleziona il comune di residenza dall\'elenco', function() {
                $('#city', page).focus();
            }, 'Registrazione');
            return;
        }
        params.city = $('#city', $.mobile.activePage).data('cityid');
        
        // Specific validation for email
        if(!helper.isEmailValid(params.email)) {
            $('#email', page).addClass('input-error');
            helper.alert('Inserisci un indirizzo email valido', function() {
                $('#email', page).focus();
            }, 'Registrazione');
            return;
        }
        // Specific validation for phone number
        if((params.phone != '') && !helper.isPhoneNumberValid(params.phone)) {
            $('#phone').addClass('input-error');
            helper.alert('Inserisci un numero di telefono valido', function() {
                $('#phone', page).focus();
            }, 'Registrazione');
            return;
        }
        // Specific validation for password 
        if(params.password.length < config.PASSWORD_MIN_LENGTH) {
            $('#password').addClass('input-error');
            helper.alert('La password deve essere lunga almeno ' + config.PASSWORD_MIN_LENGTH + ' caratteri', function() {
                $('#password', page).focus();
            }, 'Registrazione');
            return;
        }
        // Specific validation for password confirm
        var passwordConfirm = $('#passwordConfirm', $.mobile.activePage).val();
        if(passwordConfirm.length == 0) {
            helper.alert('Inserisci la conferma della password', function() {
                $('#passwordConfirm', $.mobile.activePage).focus();
            }, 'Registrazione');
            return;
        } else if(passwordConfirm != params.password) {
            helper.alert('La password e la sua conferma non corrispondono', function() {
                $('#password', $.mobile.activePage).focus();
            }, 'Registrazione');
            return;
        }
        
        // Specific validation for 
        if(!$('#privacyPolicyAccepted', page).is(':checked') ||
           !$('#disclaimerPolicyAccepted', page).is(':checked')) {
            helper.alert('E\' necessario acconsentire al trattamento dei dati personali e accettare le note legali');
            return;
        }
        
        if(!helper.isOnline()) {
            helper.alert('Errore di connessione', null, 'Registrazione');
            return;
        }

        // Registration
        services.registerUser(params, function() {
            helper.alert('Operazione completata con successo.\n' +
                         'A breve riceverai una email per confermare la registrazione', function() {
                $.mobile.changePage('#loginPage', {transition: 'slide', reverse: true});
            }, 'Registrazione');
        }, function(e) {
            // error callback
            if((e||'') == '') e = 'Impossibile completare la registrazione';
            helper.alert(e, null, 'Registrazione');
        });
    },
    
    recoverPassword: function() {
        var username = $('#loginPage #username').val().trim();
        if(username == '') {
            helper.alert('Per recuperare la password devi specificare il tuo indirizzo email', function() {
                $('#loginPage #username').focus();
            }, 'Recupera password');
        } else if(!helper.isEmailValid(username)) {
            helper.alert('Indirizzo email non valido', function() {
                $('#loginPage #username').focus();
            }, 'Recupera password');
        } else {
            
            helper.confirm('Ti verrà inviata una nuova password alla tua email.', function(ix) {
                if(ix == 1) {
                    self.lockLoginUi(true);
                    services.recoverPassword({username:username}, function(r) {
                        self.lockLoginUi(false);
                        helper.alert('Ti è stata inviata una nuova password nella tua email', function() {
                            self.lockLoginUi(false);
                        }, 'Recupera password');
                    }, function(e) {
                        helper.alert(e, function() {
                            self.lockLoginUi(false);
                        }, 'Recupera password');
                    });
                }
            }, 'Recupera password', ['Procedi', 'Annulla']);
        }
    },   
   
    beforeShowChangePasswordPage: function() {
        $('input[type="password"]', $.mobile.activePage).val('');
    },
    
    changePassword: function() {
        var oldPassword = $('#oldPassword', $.mobile.activePage).val();
        var newPassword = $('#newPassword', $.mobile.activePage).val();
        var passwordConfirm = $('#passwordConfirm', $.mobile.activePage).val();

        $('input[type="password"].input-error').removeClass('input-error');
        if(oldPassword == '') {
            helper.alert('Inserisci la vecchia password', function() {
                $('#oldPassword', $.mobile.activePage).addClass('input-error').focus();
            }, 'Cambia password');
        } else if(newPassword == '') {
            helper.alert('Inserisci la nuova password', function() {
                $('#newPassword', $.mobile.activePage).addClass('input-error').focus();
            }, 'Nuova password');
        } else if(newPassword.length < config.PASSWORD_MIN_LENGTH) {
            helper.alert('La nuova password deve essere lunga almeno ' + config.PASSWORD_MIN_LENGTH + ' caratteri', function() {
                $('#newPassword', $.mobile.activePage).addClass('input-error').focus().select();
            }, 'Cambia password');
        } else if(newPassword != passwordConfirm) {
            helper.alert('La nuova password e la sua conferma non coincidono', function() {
                $('#newPassword', $.mobile.activePage).addClass('input-error').focus().select();
            }, 'Cambia password');
        } else {
            $.mobile.loading('show');
            services.changePassword({oldPassword: oldPassword, newPassword: newPassword}, function() {
                $.mobile.loading('hide');
                helper.alert('La password è stata modificata', function() {
                    $.mobile.back({reverse: 'back'});
                }, 'Cambia password');
            }, function(e) {
                $.mobile.loading('hide');
                //helper.alert('Si sono verificati errori durante la richiesta di modifica password.\nTi preghiamo di contattarci all\'indirizzo di posta elettronica supporto@gretacity.com.', null, 'Recupera password');
                helper.alert(e, null, 'Cambia password');
            });
        }
    },
    
    
    ////////////////////////////////////////
    // homePage
    initHomePage: function() {
        $('#homePage #qrCodeButton').on('click', self.readQrCode);
    },
    showHomePage: function() {
        self.reportingListData = null;
        self.updateBalloonsInHomePage();
    },
    
    ////////////////////////////////////////
    // reportingHomePage
    reporting : null,
    
    initReportingHomePage: function() {
        $('#reportingHomePage #reportByQrCodeButton').on('click', function() {
            self.emptyReportingPages();
            barcodeReader.acquireQrCode(function(res) {
                var qrCodeData = QrCodeData.fromText(res.text);
                if(qrCodeData.type != QrCodeData.TYPE_GRETACITY) {
                    helper.alert('Il QR Code letto non appartiene al sistema Gretacity', null, 'Segnalazione con QrCode');
                    return;
                }
                self.reporting.qrCode = qrCodeData.elements.code;
                $.mobile.changePage('#reporting4Page', {transition: 'slide'});
            }, function(e) {
                //
                console.log(e);
            });
        });
    },
    showReportingHomePage: function() {
        self.reportingListData = null;
        self.updateBalloonsInReportingHome();
    },
    
    
    emptyReportingPages: function() {
        self.reporting = {
            latLng: {
                lat: null,
                lng: null
            }
        };
        // Empty all reporting pages
        var page = $('#reporting1Page');
        $('#city', page).val('');
        $('#prov', page).val('');
        $('#address', page).val('');
        page = $('#reporting5Page');
        $('#description', page).val('');
        $('#prioritySet a.ui-btn-priority:not(.ui-btn-priority-notset)', page).addClass('ui-btn-priority-notset');
        page = $('#reporting6Page');
        for(var i = 0; i < config.REPORTING_MAX_PHOTOS; i++) {
            self.removeReportingPhoto(i);
        }
    },
    
    ////////////////////////////////////////
    // reporting1Page
    
    initReporting1Page: function() {
        $('#reporting1Page #prov').on('input', function() {
            if(this.value.length > 2) this.value = this.value.substr(0, 2);
            this.value = this.value.toUpperCase();
        });
        $('#reporting1Page .button-next').on('click', self.validateReporting1Page);
    },
    showReporting1Page: function(e, ui) {
        //
        if(ui.prevPage.attr('id') == 'reportingHomePage') {
            self.emptyReportingPages();
            $('#reporting1Popup').popup('open');
            geoLocation.acquireGeoCoordinates(function(pos) {
                $('#reporting1Popup').popup('close');
                self.reportingGeoCoordinatesAcquired(pos);
            }, function(e) {
                geoLocation.acquireGeoCoordinates(function(pos) {
                    self.reportingGeoCoordinatesAcquired(pos);
                }, function(e) {
                    $('#reporting1Popup').popup('close');
                    // $('#' + fieldId, $.mobile.activePage).addClass('input-error')
                    $('.info', $.mobile.activePage).html('Non è stato possibile recuperare la tua posizione e quindi è necessario inserirla manualmente.').addClass('failInfo');                
                }, {enableHighAccuracy: true});
            });
        }
    },
    reportingGeoCoordinatesAcquired: function(pos) {
        var town;
        var city;
        var village;
        var chepalle;
        
        self.reporting.latLng.lat = pos.coords.latitude;
        self.reporting.latLng.lng = pos.coords.longitude;
        geoLocation.reverseGeocoding(self.reporting.latLng, function(result) {
        console.log(result);
                
            if(result) {
                $('#address', $.mobile.activePage).val(result.road + " " + result.streetNumber);
                $('#prov', $.mobile.activePage).val(result.prov);
                if (result.village != null ){                
                    $('#city', $.mobile.activePage).val(result.village);
                }
                else if (result.town != null ){                
                    $('#city', $.mobile.activePage).val(result.town);
                }
                else
                    $('#city', $.mobile.activePage).val(result.city);
                console.log(result);
            }
            $('#reporting1Popup').popup('close');
        });
        $('.info', $.mobile.activePage).html('La tua posizione è stata acquisita avanti per confermare.').addClass('successInfo');
    },
    validateReporting1Page: function() {
        var hasErrors = false;
        var fields = ['city', 'address', 'prov'];
        for(var i in fields) {
            var fieldId = fields[i];
            var fieldVal = $('#' + fieldId, $.mobile.activePage).val().trim();
            if(fieldVal == '') {
                $('#' + fieldId, $.mobile.activePage).addClass('input-error');
                hasErrors = true;
            } else {
                $('#' + fieldId, $.mobile.activePage).removeClass('input-error');
                eval('self.reporting.'+fieldId+'="'+fieldVal.replace(/"/g, '\\"')+'"');
            }
        }
        if(hasErrors) {
            helper.alert('Alcuni campi non sono stati compilati', function() {
                $.mobile.silentScroll();
            }, 'Segnalazione manuale');
            return;
        }
        self.reporting.latLng.lat = 0;
        if((self.reporting.latLng.lat || 0) == 0) {
            $.mobile.loading('show');
            geoLocation.geocode({prov: self.reporting.prov, city: self.reporting.city, address: self.reporting.address}, function(pos) {
                if(pos) {
                    self.reporting.latLng.lat = pos.lat();
                    self.reporting.latLng.lng = pos.lng();
                }
                $.mobile.changePage('#reporting2Page', {transition: 'slide'});
            });
        } else {
            $.mobile.changePage('#reporting2Page', {transition: 'slide'});
        }
    },
    
   
    ////////////////////////////////////////
    // reporting2Page
    showReporting2Page: function(e, ui) {
        if(ui.prevPage.attr('id') == 'reporting1Page') {
            setTimeout(function() {
                self.maximizeMap('#map');
                self.reporting2MapsSetup();
            }, 200);
        }
    },
    _reporting2Map: null,
    _reporting2Marker: null,
    reporting2MapsSetup: function() {
        if(typeof(google) == 'undefined') return;
        if(self._reporting2Map != null) google.maps.event.clearListeners(self._reporting2Map);
        var lat = self.reporting.latLng.lat || 0;
        var lng = self.reporting.latLng.lng || 0;
        var mapZoom = config.GOOGLE_MAPS_ZOOM;
        if(lat == 0) {
            // Set default lat lng is set to Rome
            lat = 41.900046; lng = 12.477215;
            self.reporting.latLng.lat = lat;
            self.reporting.latLng.lng = lng;
            mapZoom = 5;
        }
        var options = {
            zoom: mapZoom,
            center: new google.maps.LatLng(lat, lng),
            mapTypeId: eval(config.GOOGLE_MAPS_TYPE_ID),
            streetViewControl: false
        };
        self._reporting2Map = new google.maps.Map($('#map', $.mobile.activePage).get(0), options);
        setTimeout(function() {
            self.reportingPage2SetMarkerOnMap();
        }, 200);
    },
    reportingPage2SetMarkerOnMap: function() {
        if(self._reporting2Map == null) return;
        
        var lat = self.reporting.latLng.lat;
        var lng = self.reporting.latLng.lng;
        var mapZoom = config.GOOGLE_MAPS_ZOOM;
        
        var markerPoint = new google.maps.LatLng(lat, lng);
        self._reporting2Marker = new google.maps.Marker({
            position: markerPoint,
            map: self._reporting2Map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            title: 'Luogo della segnalazione'
        });

        //self._reporting2Map.panTo(markerPoint);
        //self._reporting2Map.setCenter(markerPoint, config.GOOGLE_MAPS_ZOOM);
        google.maps.event.addListener(
                self._reporting2Map,
                'click',
                function(e) {
                    self._reporting2Marker.setPosition(e.latLng);
                    self.reporting.latLng.lat = self._reporting2Marker.getPosition().lat();
                    self.reporting.latLng.lng = self._reporting2Marker.getPosition().lng();
                });
        google.maps.event.addListener(
            self._reporting2Marker, 
            'dragend', 
            function() {
                self.reporting.latLng.lat = self._reporting2Marker.getPosition().lat();
                self.reporting.latLng.lng = self._reporting2Marker.getPosition().lng();
        });
    },
    
    ////////////////////////////////////////
    // reporting3Page
    
    
    ////////////////////////////////////////
    // reporting4Page
    initReporting4Page: function() {
    },
    showReporting4Page: function() {
        services.getReportingCategories(function(res) {
            var html = '';
            for(var i in res) {
                var row = res[i];
                var iconUrl = row.icon || '';
                html += '<li data-categoryid="'+row.id+'"><a href="javascript:app.selectReportingCategory('+row.id+')" style="padding-bottom:0;">' +
                        '<div style="float:left;display:block;">';
                if(iconUrl != '') {
                    html += '<img src="' + iconUrl + '" style="height:3.5em;" />';
                }
                html += '</div>' + 
                        '<span style="padding:1em 1em 0 4.5em;display:block;">' + row.nome + '</span>' +
                        '</a></li>';
            }
            $('#reporting4Page #categories').html(html).listview('refresh');
        }, function(e, loginRequired) {
            if(loginRequired) {
                $.mobile.changePage('#loginPage');
            } else {
                helper.alert(e, null, 'Invia segnalazione');
            }        
        });
    },
    selectReportingCategory: function(id) {
        self.reporting.categoryId = id;
        $.mobile.changePage('#reporting5Page', {transition: 'slide'});
    },
    
    
    ////////////////////////////////////////
    // reporting5Page
    initReporting5Page: function() {
        $('#reporting5Page #prioritySet a').addClass('ui-btn-priority-notset');
        $('#reporting5Page a.ui-btn-priority').on('click', function(e) {
            $('#reporting5Page #prioritySet a').addClass('ui-btn-priority-notset');
            $(e.target).removeClass('ui-btn-priority-notset');
            var priority = $(e.target).data('priorityid');
            self.reporting.priority = priority;
        });
        $('#reporting5Page a.button-next').on('click', self.validateReporting5Page);
    },
    validateReporting5Page: function() {
        var descriptionEl = $('#description', $.mobile.activePage);
        if(descriptionEl.val().trim() == '') {
            descriptionEl.addClass('input-error');
            helper.alert('Inserisci la descrizione', function() {
                descriptionEl.focus();
            }, 'Descrizione');
            return;
        } else {
            descriptionEl.removeClass('input-error');
            self.reporting.description = descriptionEl.val().trim();
        }
        var prioritySelected = $('#prioritySet a.ui-btn-priority.ui-btn-priority-notset', $.mobile.activePage).length < 3;
        if(!prioritySelected) {
            helper.alert('Clicca sulla gravità dl servizio', null, 'Descrizione');
            return;
        }
        //self.reporting.private = $('#private', $.mobile.activePage).is(':checked');
        self.reporting.private = false;
        $.mobile.changePage('#reporting6Page', {transition: 'slide'});
    },
    
    
    ////////////////////////////////////////
    // reporting6Page
    initReporting6Page: function() {
        $('#reporting6Page #sourceTypePopup #shotPhoto').on('click', self.getReportingPhoto);
        $('#reporting6Page #sourceTypePopup #fromGallery').on('click', self.getReportingPhoto);
        
        $('#reporting6Page a.reporting-photo-shot').on('click', function(e) {
            self.reportingCurrPhotoPos = $(e.target).closest('div.reporting-photo-item').data('photopos');
            $('#sourceTypePopup', $.mobile.activePage).popup('open');
        });
        $('#reporting6Page .reporting-photo-delete').on('click', function(e) {
            self.removeReportingPhoto(e);
        });
        $('#reporting6Page .button-next').on('click', self.sendReporting);
    },
    
    getReportingPhoto: function(e) {
        /*var remainingPhoto = $('#photoSet div a img.reporting-photo-missing', $.mobile.activePage).length;
        if(remainingPhoto == 0) {
            helper.alert('Hai raggiunto il limite massimo di foto che puoi inviare');
            return;
        }*/
        var source = $(e.currentTarget).attr('id') == 'shotPhoto' ? 
                Camera.PictureSourceType.CAMERA :
                Camera.PictureSourceType.PHOTOLIBRARY;
        console.log(source);
        camera.getPicture(function(res) {
            // Success callback
            var photo = $($('#photoSet div[data-photopos="' + self.reportingCurrPhotoPos + '"] a img.reporting-photo-missing', $.mobile.activePage)[0]);
            
            console.log(photo);
            photo.attr('src', 'data:image/jpeg;base64,' + res).removeClass('reporting-photo-missing');
            photo.parent().prev().show();
            $('#sourceTypePopup', $.mobile.activePage).popup('close');
            //$('#photoSet2 div[data-photopos="' + self.reportingCurrPhotoPos + '"] a').show();
            helper.imageCropToFit(photo);
        }, function(e) {
            //helper.alert('Si è verificato un problema', null, 'Acquisizione foto');
        }, {sourceType: source});
    },
    

    
    removeReportingPhoto: function(par) {
        var container = null;
        var pos = null;
        
        var page= $.mobile.activePage.attr('id');        
        if (page=="reporting6Page"){
            helper.confirm("Vuoi eliminare la foto?", function(ix) {
                if(ix == 1) {
                    if(par.currentTarget) {            
                        container = $(par.currentTarget).closest('div.reporting-photo-item');
                        pos = container.data('photopos');
                    } else {
                        pos = par;
                    }
                    var imageEl = $('#photoSet div.reporting-photo-item[data-photopos="'+pos+'"] a img');
                    imageEl.parent().prev().hide();
                    imageEl.css({'margin-left': '', 'margin-top': '', 'height': '', 'width': ''}).addClass('reporting-photo-missing');
                    imageEl.removeAttr('src').replaceWith(imageEl.clone());
                }
            }, 'Elimina foto', ['Procedi', 'Annulla']);
        }
    },
    
    
    
    
    sendReporting: function() {
        self.reporting.photos = [];
        $('#photoSet a img:not(.reporting-photo-missing)', $.mobile.activePage).each(function() {
            var src = $(this).attr('src');
            var pos = src.indexOf('base64,');
            if(pos != -1) 
                pos += 7;
            else 
                pos = 0;
            self.reporting.photos.push(src.substr(pos));
        });
        $.mobile.loading('show');
        services.sendReporting(self.reporting, function() {
            // Successfully sent
            self.emptyReportingPages();
            $.mobile.loading('hide');
            helper.alert('La tua segnalazione è stata inoltrata con successo', function() {
                $.mobile.changePage('#reportingListPage', {transition: 'slide', reverse: true});
            }, 'Invia segnalazione');
        }, function(e) {
            // An error occurred
            $.mobile.loading('hide');
            helper.alert('Si è verificato un errore durante l\'invio', null, 'Invia segnalazione');
        });
    },
    
    
    ////////////////////////////////////////
    // reportingListPage
    reportingListData: null,
    reportingListCurrentView: null,
    reportingListViewTypeList: 1,
    reportingListViewTypeMap: 2,
    reportingListMap: null,
    toggleReportingListView: function() {
        if(self.reportingListCurrentView == self.reportingListViewTypeMap) {
            //$('#reportingListPage #reportingListView').show();
            //$('#reportingListPage #mapView').hide();
            $.mobile.loading('show');
            setTimeout(function() {
                $('#reportingListPage #reportingListView').show();
                $('#reportingListPage #mapView').hide();
                $('#reportingListPage #changeViewType').html('VEDI SU MAPPA');
                $.mobile.loading('hide');
            }, 600);
            self.reportingListCurrentView = self.reportingListViewTypeList;
        } else {
            //$('#reportingListPage #reportingListView').hide();
            //$('#reportingListPage #mapView').show();
            $.mobile.loading('show');
            setTimeout(function() {
                $('#reportingListPage #reportingListView').hide();
                $('#reportingListPage #mapView').show();
                $('#reportingListPage #changeViewType').html('VEDI ELENCO');
                $.mobile.loading('hide');
            }, 600);
            self.reportingListCurrentView = self.reportingListViewTypeMap;
        }
    },
    
    initReportingListPage: function() {
        //self.toggleReportingListView();
        $('#reportingListPage #changeViewType').on('click', function() {
            self.toggleReportingListView();
        });
    },
    beforeShowReportingListPage: function(e, ui) {
        if(ui.prevPage.attr('id') != 'reportingListDetailPage') {
            self.reportingListCurrentView = self.reportingListViewTypeList;
            self.toggleReportingListView();
        }
    },
    showReportingListPage: function(e, ui) {
        if(ui.prevPage.attr('id') != 'reportingListDetailPage') {
            $.mobile.loading('show');
            //self.reportingListCurrentView = self.reportingListViewTypeList;
            //self.toggleReportingListView();
            services.getReportingList({}, function(result) {
                // Success
                self.reportingListData = result;
                self.reportingListRenderList();
                self.updateBalloonsInReporting();
                self.reportingListRenderMap();
                $.mobile.loading('hide');
            }, function(e, loginRequired) {
                if(loginRequired) {
                    $.mobile.changePage('#loginPage');
                    return;
                }
                $.mobile.loading('hide');
                helper.alert('Immpossibile recuperare i dati', null, 'Segnalazioni');
            });
        } else {
            self.updateBalloonsInReporting();
        }
    },
    reportingListRenderMap: function() {
        self.maximizeMap('#mapView');
        if(typeof(google) == 'undefined') return;
        if(self.reportingListMap != null) {
            google.maps.event.clearListeners(self.reportingListMap);
        }
        
        // Center map to Rome
        var lat = 41.898573; lng = 12.481066;
        var options = {
            zoom: 5, //config.GOOGLE_MAPS_ZOOM,
            center: new google.maps.LatLng(lat, lng),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false
        };
        self.reportingListMap = new google.maps.Map($('#mapView', $.mobile.activePage).get(0), options);            
        
        var bounds = new google.maps.LatLngBounds();
        for(var i in self.reportingListData) {
            var row = self.reportingListData[i];
            var marker = new google.maps.LatLng(row.latitudine, row.longitudine);
            var markerOptions = {
                position: marker,
                map: self.reportingListMap,
                animation: google.maps.Animation.DROP,
                title: row.nome_categoria,
                payload: {
                    id: row.id,
                    data_inserimento: row.data_inserimento,
                    indirizzo: row.indirizzo,
                    descrizione_problema: row.descrizione_problema,
                    stato: row.stato,
                    foto: row.foto
                }
            };
            if(row.icona != '') {
                markerOptions.icon = row.icona;
            }
            marker= new google.maps.Marker(markerOptions);
            google.maps.event.addListener(marker, 'click', function() {
                var payload = this.get('payload');
                var dateAdded = Date.parseFromYMDHMS(payload.data_inserimento).toDMYHM();
                var content = '';
                content+='<img src="img/share.png" onclick="javascript:app.SharingFb(\'' + payload.id + '\')" style="width: 7em; float:right;display: block;position:relative;z-index: 100; top: 0.5em;margin-top: -1em;"/>'+
                         '<img src="img/share_twitter_icon.png" onclick="javascript:app.SharingTwitter(\'' + payload.id + '\')" style=" display: block;position:relative;z-index: 100; right:0; top: 0.5em;margin-top: -1em;"/>';
                if (payload.foto!=''){
                    content += '<img src="" style="border-radius: .5em; margin-right:1em;width:100%;margin-bottom:1em;height:7em;background:url(\'' + payload.foto + '\') center center no-repeat;background-size: cover;display:block; z-index:1;" />';
                }else{
                    content+='<img src="" style="border-radius: .5em; margin-right:1em;width:100%;margin-bottom:1em;height:7em;background:url(\'\img/no-photo.jpg \'\)center center no-repeat;background-size: cover;display:block;" />';
                }
                content +='<div style="padding: 0 0 1em 0;overflow:hidden;">' +
                            '<div style="width:100%;text-overflow: ellipsis;overflow:hidden;">' + payload.descrizione_problema + '</div>' +
                            '<div>' + payload.indirizzo + '</div>' +
                            '<div>' + dateAdded + '</div>' +
                            '<div>' + payload.stato + '</div>' +
                        '</div>' +
                        
                        '<a href="javascript:app.reportListShowDetail(\'' + payload.id + '\')" class="ui-btn ui-btn-primary2">DETTAGLI</a>' +
                        '<a href="javascript:$(\'#reportingListPopup\').popup(\'close\')" class="ui-btn ui-btn-primary2">CHIUDI</a>';
                var popup = $('#reportingListPopup', $.mobile.activePage);
                $('div.ui-content', popup).html(content);
                popup.popup('open');
            });

            bounds.extend(marker.getPosition());
        }
        if(!bounds.isEmpty()) {
            self.reportingListMap.panToBounds(bounds);
            self.reportingListMap.fitBounds(bounds);
        } else {
            //self.reportingListMap.setZoom(5);
        }
    },
    reportingListRenderList: function() {
        var list = $('#reportingListPage #reportingList');
        var html = '';
        if(self.reportingListData.length == 0) {
            html += '<li data-role="list-divider">Non ci sono segnalazioni</li>';
        } else {
            for(var i in self.reportingListData) {
                var row = self.reportingListData[i];
                var color = '';
                switch(parseInt(row.priorita)) {
                    case 0:
                        //$('#priority', page).html('BASSA GRAVIT&Agrave;').css({'background-color': '#0F0', 'color': '#222'});
                        color= "#0F0";
                        break;
                    case 1:
                        //$('#priority', page).html('MEDIA GRAVIT&Agrave;').css({'background-color': '#FAF200', 'color': '#222'});
                        color= "#FAF200";
                        break;
                    case 2:
                        //$('#priority', page).html('ALTA GRAVIT&Agrave;').css({'background-color': '#F00', 'color': '#FFF'});
                        color="#F00";
                        break;
                }
                //console.log(row);
//TODO onclick="self.reportingListPageViewPhoto(this)"
                //var unreadCount = pushNotificationHelper.getUnread(PushNotificationMessage.PUSH_NOTIFICATION_TYPE_REPORTING, row.id);
                var dateAdded = Date.parseFromYMDHMS(row.data_inserimento).toDMYHM();    // row.data_inserimento
                 html += '<li data-icon="false">'+
                        '<a style="border-bottom: none; background:linear-gradient(135deg, '+color+' 5%,'+color+' 10%,'+color+' 10%,#FFF 20%);padding:0;" href="javascript:app.reportListShowDetail(\'' + row.id + '\')">'+
                        '<div style="padding: .2em 0 .2em 0;text-overflow: ellipsis;overflow: hidden;">' +
                        '<img src="" style="background-image:url(\'http://www.gretacity.com//Data/Upload/Segnalazioni/tipologia/round/'+row.nome_categoria+'.png\');" />' +
                        '<div style="float:left;width: 44%;text-overflow: ellipsis;overflow: hidden;">'+
                        '<div class="reporting-list-item-row reporting-list-item-descr">'+
                        '<span>Descrizione:</span> <strong>' + row.descrizione_problema + '</strong></div>' +
                        '<div class="reporting-list-item-row" style="text-overflow: ellipsis;overflow: hidden;"><span>Luogo:</span><strong>' + row.indirizzo + ' ' + row.sigla + '</strong></div>' +
                        '<div class="reporting-list-item-row"><span>Data:</span> <strong>' + dateAdded + '</strong></div>' +
                        '<div class="reporting-list-item-row reporting-list-item-status"><span>Stato:</span> <strong>' + row.stato + '</strong>' +
                        '<span id="count_reporting_' + row.id + '" class="ui-li-count-cust" style="display:none"></span></div>' +
                        '</div>';
                if(row.foto!=''){
                    html+='<img src="" style="margin-right: .1em !important;float:right!important;background-image:url(\'' + row.foto + '\');"/>';
                }else{
                    html+='<img src="" style="margin-right: .1em !important;float:right!important;background-image:url(\'\img/no-photo.jpg \'\);"/>';
                }
                html+='</div></a>'+
                        '<div>'+
                        '<img src="img/share_facebook.png" onclick="javascript:app.SharingFb(\'' + row.id + '\')" style="float:right; padding:.5em; width:45%; max-width:15em;"/>'+
                        '<img src="img/share_twitter.png" onclick="javascript:app.SharingTwitter(\'' + row.id + '\')" style=" padding:.5em; width:45%; max-width:15em;"/>'+
                        '</div>'+
                        '</li>';
                        
                        
                         //'<img src="img/share.png" onclick="javascript:app.Sharing(\'' + row.id + '\')" style="width: 7em; margin: 0 auto;display: block;"/>'+
                        //'<a href="#" onclick="javascript:app.RemoveReport(\'' + row.id + '\')"  style="color: #FFF !important;font-weight: bold !important;float: right;border: none;padding-bottom: 1.2em !important;" class="ui-btn button-important">ELIMINA</a>'+
                        //'<img src="img/PhotoDelete.png" onclick="javascript:app.RemoveReport(\'' + row.id + '\')" style="position:absolute; z-index:100; top:0; right:0;"/>'+
                        //'<img src="img/Shadow.png"  style="position:absolute; z-index:10; top:0; right:0; opacity: 0.8;width: 5em;"/>'+
                        //'<a href="#" onclick="javascript:app.Sharing(\'' + row.id + '\')" class="ui-btn ui-btn-primary2 ">Condividi su FB</a>';
                        //'<img src="img/share.png" onclick="javascript:app.Sharing(\'' + row.id + '\')" style="width: 7em; margin: 0 auto;display: block;"/>';

                /*html += '<li data-icon="false"><a href="javascript:app.reportListShowDetail(\'' + row.id + '\')"><div style="padding: 0 0 0 0;overflow:hidden;">' +
                        '<img src="" style="background-image:url(\'' + row.foto + '\');" />' +
                        '<div class="gg-list-item-row reporting-list-item-descr"><span>Descrizione:</span> <strong>' + row.descrizione_problema + '</strong></div>' +
                        '<div class="reporting-list-item-row"><span>Luogo:</span> <strong>' + row.indirizzo + ', ' + row.sigla + '</strong></div>' +
                        '<div class="reporting-list-item-row"><span>Data:</span> <strong>' + dateAdded + '</strong></div>' +
                        '<div class="reporting-list-item-row reporting-list-item-status"><span>Stato:</span> <strong>' + row.stato + '</strong>' +
                        '<span id="count_reporting_' + row.id + '" class="ui-li-count-cust" style="display:none"></span></div>' +
                        '</div></a></li>'; */
            }
        }
        list.html(html);
        list.listview('refresh');
        $.mobile.loading('hide');
        $.mobile.silentScroll();
    },
    
    
    RemoveReport: function(id){
        var row = null;
        for(var i in self.reportingListData) {
            if(self.reportingListData[i].id == id) {
                row = self.reportingListData[i];
                break;
            }
        }
        helper.confirm("Vuoi eliminare la segnalazione?", function(ix) {
            if(ix == 1) {
                services.sendHidden(row.id, function() {
                    // Successfully sent
                    $.mobile.loading('hide');
                    //helper.alert('La tua segnalazione è stata cancellata', function() {
                        $.mobile.changePage('#reportingHomePage', {transition: 'slide', reverse: true});
                    //}, 'Elimina');
                }, function(e) {
                    // An error occurred
                    $.mobile.loading('hide');
                    helper.alert('Si è verificato un errore durante la cancellazione', null, 'Elimina');
                });
            }
        }, 'Elimina segnalazione', ['Procedi', 'Annulla']);
    },
    reportListShowDetail: function(id) {
        $.mobile.loading('show');
        var row = null;
        for(var i in self.reportingListData) {
            if(self.reportingListData[i].id == id) {
                row = self.reportingListData[i];
                break;
            }
        }
        console.log(row);
        if(row) {
            pushNotificationHelper.setAsRead(PushNotificationMessage.PUSH_NOTIFICATION_TYPE_REPORTING, row.id);
            var page = $('#reportingListDetailPage');
            //$('#city', page).val(row.comune);
            //$('#prov', page).val(row.sigla);
            //$('#address', page).val(row.indirizzo);
            //$('#category', page).val(row.nome_categoria);
            //$('#description', page).val(row.descrizione_problema);
            $('#status', page).val(row.stato); 
            var color = '';
            switch(parseInt(row.priorita)) {
                case 0:
                    //$('#priority', page).html('BASSA GRAVIT&Agrave;').css({'background-color': '#0F0', 'color': '#222'});
                    color= "#0F0";
                    break;
                case 1:
                    //$('#priority', page).html('MEDIA GRAVIT&Agrave;').css({'background-color': '#FAF200', 'color': '#222'});
                    color= "#FAF200";
                    break;
                case 2:
                    //$('#priority', page).html('ALTA GRAVIT&Agrave;').css({'background-color': '#F00', 'color': '#FFF'});
                    color="#F00";
                    break;
            }
            var html_desc = '<div><img src="http://www.gretacity.com//Data/Upload/Segnalazioni/tipologia/round/'+row.nome_categoria+'.png" style="float:left;"/>'+
                        '</div> <div style="color:#00269C; padding-left:7em; margin-bottom:3em;">'+
                        '<div>'+row.descrizione_problema +'</div>'+
                        '<div>'+row.nome_categoria+'</div>'+
                        '<div>'+ row.indirizzo+'</div>'+
                        '<div>'+ row.comune+' ('+row.sigla+')</div>'+
                        //'<div style="background-color:'+color+'; height:2em; width:2em; border-radius:5em; float:right;"></div>'+
                    '</div>';
            
            $('#main', page).css('background', 'linear-gradient(135deg, '+color+' 5%,'+color+' 10%,'+color+' 10%,#FFF 20%)');
//var photoUrl = (row.foto != '' ? row.foto : 'img/camera.png');
            //$('#photot1', page).css('background-image', 'url(\'' + photoUrl + '\')');
            //$('#photot2', page).css('background-image', 'url(\'' + photoUrl + '\')');
            //$('#photot3', page).css('background-image', 'url(\'' + photoUrl + '\')');
            //console.log(row);
            var photos = $('.photo-preview', page);
            for(var i = 0; i < photos.length; i++) {
                var photoUrl = ((row.immagini[i] || '') != '' ? row.immagini[i] : 'img/camera.png');
                $(photos[i]).css('background-image', 'url(\'' + photoUrl + '\')');
            }
            $('#fieldcontent', page).html(html_desc);
            var html = '';
            for(var i in row.log) {
                html += '<li style="color: #00269C; white-space:normal;">' + row.log[i] + '</li>';
            }
            
            $('#log', page).html(html).listview().listview('refresh');
            var html_share='<img src="img/share_facebook.png" onclick="javascript:app.SharingFb(\'' + row.id + '\')" style="float:right; padding:.5em; width:45%;  max-width:15em;"/>'+
                           '<img src="img/share_twitter.png" onclick="javascript:app.SharingTwitter(\'' + row.id + '\')" style="float:left; padding:.5em; width:45%;  max-width:15em;"/>';
            html_share+='<a href="#" onclick="javascript:app.RemoveReport(\'' + row.id + '\')"  style=" width: 90%;margin-top: 1em;color: #FFF !important;font-weight: bold !important;float: right;border: none;padding-bottom: 1.2em !important;" class="ui-btn button-important">ELIMINA</a>';
            $('#myfooter', page).html(html_share);
            $.mobile.changePage('#reportingListDetailPage', {transition: 'slide'});
        }
        
        
    },
    
    
    ////////////////////////////////////////
    // reportingListDetailPage
    initReportingListDetailPage: function() {
        $('#reportingListDetailPage .photo-preview').each(function() {
            $(this).on('click', self.openPhoto);
        });
       // $('#reportingListDetailPage #social').on ('click', self.Sharing());
    },
   
    SharingFb: function(id){
        var row = null;
        for(var i in self.reportingListData) {
            if(self.reportingListData[i].id == id) {
                row = self.reportingListData[i];
                break;
            }
        }
        var url = window.open(config.URL_BASE_FACEBOOK+encodeURIComponent(config.URL_REPORTING_SHARE+id), '_blank', 'location=yes');
    },
    
    SharingTwitter: function(id){
        var row = null;
        for(var i in self.reportingListData) {
            if(self.reportingListData[i].id == id) {
                row = self.reportingListData[i];
                break;
            }
        }
        var url = window.open(config.URL_BASE_TWITTER+encodeURIComponent(config.URL_REPORTING_SHARE_TWITTER+id), '_blank', 'location=yes');
    },
    ////////////////////////////////////////
    // reportingNearbyPage
    initReportingNearbyPage: function() {
        $('#reportingNearbyPage #searchCityButton').on('click', function() {
            alert('ok');
        });
    },
    
    showReportingNearbyPage: function() {
        $.mobile.loading('show');
        geoLocation.acquireGeoCoordinates(function(pos) {
            //$('#reporting1Popup').popup('close');
            self.reportingGeoCoordinatesAcquired(pos);
        }, function(e) {
            geoLocation.acquireGeoCoordinates(function(pos) {
                $('#reporting1Popup').popup('close');
                self.reportingGeoCoordinatesAcquired(pos);
            }, function(e) {
                $('#reporting1Popup').popup('close');
                $('.info', $.mobile.activePage).html('Non è stato possibile recuperare la tua posizione e quindi è necessario inserirla manualmente.');                
            }, {enableHighAccuracy: true});
        });
    },
    
    ////////////////////////////////////////
    // newsPage
    initNewsSidePanel: function() {
        console.log('initializing side bar');
        services.getSubscribedChannels(function(result) {
            var html = '<li data-role="list-divider" style="margin:0 auto;text-align:center;display:block;height:2em;padding-top:1.5em;background:url(\'img/Header.png\') center center;background-size:cover;background-color:#08c;"><h1>Visualizza</h1></li>' +
                       '<li data-icon="plus"><a href="#setupChannelSubscriptionPage" style="color:#FFF;background-color:rgb(89, 196, 248);">Aggiungi</a></li>' +
                       '<li data-icon="false" data-channelid="0"><a href="javascript:self.loadNewsChannel(\'0\')"><span></span>Tutte</a></li>';
            for(var i in result) {
                var row = result[i];
                html += '<li data-icon="false" data-channelid="' + row.id_feed + '"><a href="javascript:app.loadNewsChannel(' + row.id_feed + ')"><span>' 
                            + row.denominazione + '</span><span id="count_' + row.id_feed + '" class="ui-li-count-cust" style="display:none;"></span><label>' + row.nome_feed
                            + '</label>'
                            //+ '<span id="count_' + row.id_feed + '" class="ui-li-count ui-li-count-cust" style="dddisplay:none;"></span>'
                            + '</a></li>';
            }
            
            $('#newsChannelsPanel #channelList').html(html).listview().listview('refresh');
            
            if($('#newsChannelsPanel #channelList li').length > 2) {
                $('#newsPage #noSubscribedChannelsNotice').hide();
            } else {
                $('#newsPage #noSubscribedChannelsNotice').show();
                $('#newsPage #noNewsNotice').hide();
            }
            
            $('#newsChannelsPanel').panel({
                beforeopen: function() {
                    $('#newsChannelsPanel ul li.panel-item-selected').removeClass('panel-item-selected');
                    //if((self.newsChannelId > 0) && ($.mobile.activePage.is('#newsPage'))) {
                    if($.mobile.activePage.is('#newsPage')) {
                        $('#newsChannelsPanel ul li[data-channelid="' + self.newsChannelId + '"]').addClass('panel-item-selected');
                    }
                }
            });
            
            self.sideBarInitialized = true;
            
            self.updateBalloonsInNews(true);
            
            console.log('side bar initialized');
        }, function(e, loginRequired) {
            if(loginRequired) {
                $.mobile.changePage('#loginPage');
                return;
            }
            console.log('error on initializing side bar');
            //helper.alert('Impossibile recuperare il contenuto', null, 'Notizie');
        });
    },
    initNewsPage: function() {
        var page = $('#newsPage');
        $('#channelsButton', page).on('click', function() {
            $('#newsChannelsPanel', page).panel('open');
        });
        $('#refreshButton', page).on('click', function() {
            self.loadNewsChannel(self.newsChannelId, true);
        });
        $('#moreNewsButton', page).on('click', function() {
            self.loadNewsChannel(self.newsChannelId, false);
        });        
        $('#commentButtonNews', page).on('click', function() {
            
        })
    },
    
    showNewsPage: function() {
        self.initNewsSidePanel();
        $('#moreNewsButton', $.mobile.activePage).hide();
        $('#channelContent', $.mobile.activePage).empty();
        setTimeout(function() {
            self.loadNewsChannel();
        }, 200);        
    },
    formatChannelContentItem: function(item) {
        //var rowId = parseInt(item.id);
        //var dateAddedTmp = Date.parseFromYMDHMS(item.data_inserimento);
        //var dateAdded dateAddedTmp.toDMY() + ' alle ' + dateAddedTmp.toHM()
        var dateAdded = item.data;
        var image = (item.foto || '');
        if(image == '') {
            image = 'img/no-photo.jpg';
        }
        var source = item.categoria || '';
        var href = (item.link == '') ? 
                'javascript:self.showNewsDetail(' + item.id + ')' : 
                'javascript:app.openLink(\'' + encodeURIComponent(item.link) + '\', \'_blank\', \'location=yes,closebuttoncaption=Indietro,enableViewportScale=yes\');';
        html =  '<li data-icon="false">' +
                    '<a href="' + href + '">' +
                        '<div style="background:url(\'' + image + '\') center center no-repeat;border-radius:1em;background-size:cover;border:solid .5em #FFF;" class="img-container"/></div>' +
                        '<div class="news-list-title">' + source + '</div>' +
                        '<h1>' + item.oggetto + '</h1>' +
                        '<div class="news-list-note" style="position: absolute; bottom:.3em;">del ' + dateAdded + '</div>' +
                    '</a>' +
                    //'<img id="comment" src="img/comment.png" onclick="app.loadComments('+item.id+')" style="position:absolute; top:5em; right:.5em; width:2em;"/>'+
                '</li>';

        return html;
    },
    loadNewsChannel: function(channelId, onlyNew) {
        $('#newsPage #newsChannelsPanel').panel('close');
        
        if(channelId) {
            pushNotificationHelper.setAsRead(PushNotificationMessage.PUSH_NOTIFICATION_TYPE_CHANNEL, channelId);
            $('#newsPage #newsChannelsPanel #channelList li a #count_' + channelId).hide().html('');
        }
        
        var channelChanged = self.newsChannelId != channelId; 
        
        self.newsChannelId = channelId;
        if(channelChanged) {
            self.newsContentLastId = null;
            self.newsContentLastDate = null;
            self.newsContentFirstId = null;
            self.newsContentFirstDate = null;
        }
    
        onlyNew = onlyNew || false;
        
        $.mobile.loading('show');
        
        var params = {
            channelId: self.newsChannelId, 
            lastId: self.newsContentLastId,
            lastDate: self.newsContentLastDate,
            firstId: self.newsContentFirstId,
            firstDate: self.newsContentFirstDate,
            onlyNew: onlyNew
        };
        
        console.log('retrieveChannelContent: getting channel content, params: ', params);
        
        $('#moreNewsButton', $.mobile.activePage).addClass('ui-disabled');
        
        $.mobile.loading('show');
        services.getChannelContent(params, function(result) {
            $('#moreNewsButton', $.mobile.activePage).removeClass('ui-disabled');
            $.mobile.loading('hide');
            $('#info', $.mobile.activePage).html('').hide();
            var html = '';
            if(typeof(result.vecchie) != 'undefined') {
                if(result.vecchie.length > 0) {
                    
                    var lastRec = result.vecchie[result.vecchie.length-1];
                    self.newsContentLastDate = lastRec.data_inserimento;
                    self.newsContentLastId = lastRec.id;
                    
                    if(self.newsContentFirstId == null) {
                        var firstRec = result.vecchie[0];
                        self.newsContentFirstDate = firstRec.data_inserimento;
                        self.newsContentFirstId = firstRec.id;
                    }
                    for(var i in result.vecchie) {
                        html += self.formatChannelContentItem(result.vecchie[i]);
                        
                    }
                }
                if(result.vecchie.length == 0) {
                    $('#moreNewsButton').addClass('ui-disabled');
                } else {
                    $('#moreNewsButton').removeClass('ui-disabled'); 
                }
            }
            
            if(channelChanged) {
                $('#newsPage #channelContent').html(html).listview('refresh');
            } else {
                $('#newsPage #channelContent').append(html).listview('refresh');
            }
            if($('#newsPage #channelContent li').length == 0) {
                $('#moreNewsButton').hide();
                $('#noNewsNotice').show();
            } else {
                $('#moreNewsButton').show();
                $('#noNewsNotice').hide();
            }

            if((typeof(result.nuove) != 'undefined') && (Array.isArray(result.nuove)) && (result.nuove.length > 0)) {
                self.newChannelContentReceived = result.nuove;

                var firstRec = result.nuove[0];
                self.newsContentFirstDate = firstRec.data_inserimento;
                self.newsContentFirstId = firstRec.id;
                
                /*$('#newContentReceivedButton').html(
                    self.newChannelContentReceived.length + (self.newChannelContentReceived.length > 1 ? ' nuove' : ' nuova')
                ).show('fast');*/
                for(var i in result.nuove) {
                    html += self.formatChannelContentItem(result.nuove[i]);

                    var lastRec = result.nuove[result.nuove.length-1];
                    self.newsContentLastDate = lastRec.data_inserimento;
                    self.newsContentLastId = lastRec.id;
                }
                $('#newsPage #channelContent').prepend(html).listview('refresh');
            }
            
            if((onlyNew == true) || (channelChanged == true)) {
                $.mobile.silentScroll();
                if($('#newsPage #channelContent li').length == 0) {
                    $('#info', $.mobile.activePage).html('Non ci sono news per l\'RSS selezionato').show();
                }
            }
            
        }, function(e, loginRequired) {
            $('#moreNewsButton', $.mobile.activePage).removeClass('ui-disabled');
            $.mobile.loading('hide');
            if(loginRequired) {
                $.mobile.changePage('#loginPage');
                return;
            }
            if($.mobile.activePage.attr('id') != 'newsPage') return;
            if(onlyNew) {
                //
            } else {
                helper.alert('Impossibile recuperare il contenuto', null, 'Canale');
            }
        });
    },
    
     //////// //////// ////////
    //////// commentsPage
        
   
    loadComments: function(newsId){
        $.mobile.loading('show');
        $.mobile.changePage('#commentPage');
        var page= $('#commentPage');
        
        $('#comment', page).val('');
        
        var currentCommentInfo=[
            {titolo:"titolo della notizia", nome:"Mario",commento:"La notizia è molto interessante, ma risulta esserlo troppo poca interessante",data:"10/10/2010", stato:"1"},
            {titolo:"titolo della notizia", nome:"Andre", commento:"fkdsja fjdsoa dsfioa fjiodsa",data:"10/10/2010", stato:"0"},
            {titolo:"titolo della notizia", nome:"Francesca",commento:"sdji onfjsdioasfio",data:"10/10/2010", stato:"1"},
        ];
        $('h3', page).html(currentCommentInfo[0].titolo);
        var html = '';
        if(currentCommentInfo && (currentCommentInfo.length > 0)) {
            for(var i in currentCommentInfo) {
                var c = currentCommentInfo[i];
                //var d = Date.parseFromYMDHMS(c.data);
                var d= new Date();
                html += '<li>';
                if((c.nome || '') != '') {
                    html += '<small  class="news-note" display:block;>Commento di ' + c.nome + '</small>';
                }
                html += '<p style="white-space:normal;">' + c.commento + '</p>';
                html += '<small class="news-note">' + d.toDMY() + ' alle ' + d.toHM() + '</small>';

                if(c.stato == 0) html += '<div class="news-note">in attesa di approvazione</div>';
                html += '</li>';
            }
        } else {
            html += '<p id="noComments" style="text-align:left;margin-top:1.5em;">Nessun commento</p>';
        }
        $.mobile.loading('hide');
        $('#newsCommentPage', page).html(html).listview().listview('refresh');
    },
    
    leaveCommentOnNews: function(id) {
        var text = $('#newsCommentPage #comment').val().trim();
	  var qr = $('#followingListDetailPage #qrCodeId').val();
        if(text == '') return;
        var params = {
            comment: text,
            newsId: qr
        };
        $.mobile.loading('show');
        services.leaveCommentOnQrCode(params, function() {
            // success
            var d = new Date();
            $('#qrCodeInfoCommentsPage #noComments').hide();
            $('#qrCodeInfoCommentsPage #qrCodeCommentsList').append('<li><p>' + text + '</p><small>' + d.toDMY() + ' alle ' + d.toHM() + '</small></li>');
            $('#qrCodeInfoCommentsPage #qrCodeCommentsList').listview('refresh');
            $('#qrCodeInfoCommentsPage #comment').val('');
            $.mobile.loading('hide');
        }, function(e) {
            $.mobile.loading('hide');
            helper.alert('Impossibile inviare il commento', null, 'Lascia il commento');
        });
    },
    
    
    ////////////////////////////////////////
    // followingListPage
    
    initFollowingListPage: function() {
        $('#followingListPage #readQrCodeButton').on('click', self.readQrCode);
        $('#followingListPage #searchFollowginButton').on('click', function() {
            helper.alert('Not implemented');
        });
    },
    
    showFollowingListPage: function() {
        $.mobile.loading('show');
                
        services.getFollowings({}, function(result) {
            $.mobile.loading('hide');
            var html = '';
            for(var i in result.follows) {
                var row = result.follows[i];
                var name = row.denominazione || '';
                var description = row.descrizione || '';
               // if(description.length > 40) description = description.substr(0, 40) + '...';
                var qrCodeId = row.r_qrcode_id || '';
                
                html += '<li data-icon="false"><a href="javascript:app.getFollowingInfo(\'' + qrCodeId.replace(/'/g, "\\'") + '\')"><img src="img/qr-code.png"/>' + name + 
                        '<span id="count_' + qrCodeId + '" class="ui-li-count-cust" style="display:none;"></span>' +
                        '<label style="overflow: hidden;text-overflow: ellipsis;">' + description +'</label></a></li>';
            }
            $('#followingListPage #followingList').html(html).listview('refresh');
            self.updateBalloonsInFollowing();
        }, function(e, loginRequired) {
            $.mobile.loading('hide');
            if(loginRequired) {
                $.mobile.changePage('#loginPage');
                return;
            }
            helper.alert('Impossibile recuperare il contenuto', null, 'Notizia');
        });
    },
    
    currentQrCode: null,
    currentQrCodeInfo: null,
    getFollowingInfo: function(code) {
        
        $('#followingListPage #followingList li a span.ui-li-count').hide();
        
        if($.mobile.activePage.attr('id') != 'followingListDetailPage') {
            $.mobile.changePage('#followingListDetailPage', {transition: 'slide'});
        }
        
        $.mobile.loading('show');
        //$('#followingListDetailPage #getInfoButton').addClass('ui-disabled');
        $('#followingListDetailPage #infoText').html('Recupero informazioni...');
        
        services.getInfoFromQrCode(code, function(result) {
            
            self.currentQrCodeInfo = result;
            
            $('#followingListDetailPage #infoText').html('');
            
            pushNotificationHelper.setAsRead(PushNotificationMessage.PUSH_NOTIFICATION_TYPE_FOLLOWING, code);
            
            //var canFollow = (result.categoria.follows == 1);

            $('#followingListDetailPage #getInfoButton').removeClass('ui-disabled');

            if(result == null) {
                $('#followingListDetailPage #qrCodeId').val('');
                helper.alert('Non ci sono informazioni disponibili', null, 'Leggi QR Code');
                return;
            }
            $('#followingListDetailPage #qrCodeId').val(code);
            // Format result
            var html = '<div>' +
                            '<h3 class="qrcode-info-title">' + result.info.nome + '</h3>' + 
                       '</div>';
            /*if(canFollow) {
                html += '<input type="checkbox" onchange="self.followQrCode()" id="following" ' + (result.info.follow == '1' ? ' checked' : '') + '/> <label for="following">segui</label>';
            }*/
            console.log(result.foto);
            if(result.foto && (result.foto.length > 0)) {
                html += '<a href="#qrCodeInfoGalleryPage"><div style="position:relative;">' +
                            '<img src="img/PhotoGallery.png" style="position:absolute;right:0;top:0;z-index:100;" />' +
                            '<img src="img/Shadow.png" style="position:absolute;right:0;top:0;z-index:99;opacity:.7;" />' +
                            '<img id="imgtest" src="" style="width:100%;height:15em;background:url(\'' + result.foto[0] + '\');background-size: cover;" />' +
                        '</div></a>';
            }
            
            html += '<p class="qrcode-info-description">' + result.info.descrizione+ '</p>';
            html = html.replace(/\r\n\r\n/g, "</p><p>").replace(/\n\n/g, "</p><p>");
            html = html.replace(/\r\n/g, "<br />").replace(/\n/g, "<br />");
            html += '<div style="margin-top:3em;" class="ui-grid-a">' +
                    '<div class="ui-block-a">';
            if(result.notizie && (result.notizie.length > 0)) {
                html += '<a href="#qrCodeInfoNewsPage" class="ui-btn ui-btn-qrcodeinfo ui-btn-news">Notizie</a>';
            } else {
                html += '<a href="#" class="ui-btn ui-btn-news ui-btn-qrcodeinfo ui-disabled">Notizie</a>';
            }
            html += '</div>' +
                    '<div class="ui-block-b">';
            if(result.censimento && (result.censimento.latitudine > 0) && (result.censimento.longitudine > 0)) {
                html += '<a href="#qrCodeInfoPositionPage" class="ui-btn ui-btn-qrcodeinfo ui-btn-position">Posizione</a>';
            } else {
                html += '<a href="#" class="ui-btn ui-btn-qrcodeinfo ui-btn-position ui-disabled">Localizzazione</a>';
            }
            html += '</div>' +
                    '</div>' +
                    '<div class="ui-grid-a">' +
                    '<div class="ui-block-a">';
            var totComments = 0;
            html += '<a href="#qrCodeInfoCommentsPage" class="ui-btn  ui-btn-qrcodeinfo ui-btn-comments">Commenti' + (totComments > 0 ? '<span class="ui-li-count">' + totComments + '</span>' : '') + '</a></div>';
            html += '<div class="ui-block-b">';
            if(result.youtube && (result.youtube.length > 0)) {
                html += '<a href="#qrCodeInfoMultimediaPage" class="ui-btn ui-btn-qrcodeinfo ui-btn-multimedia">Video</a>';
            } else {
                html += '<a href="#" class="ui-btn ui-btn-qrcodeinfo ui-btn-multimedia ui-disabled">Video</a>';
            }
            html += '</div></div>';
                        
            $('#followingListDetailPage #infoResult').html(html);
            $.mobile.loading('hide');
        }, function(e, loginRequired) {
            $.mobile.loading('hide');
            $('#followingListDetailPage #infoText').html('Nessuna informazione associata al QR Code');
            $('#followingListDetailPage #getInfoButton').removeClass('ui-disabled');
            $('#followingListDetailPage #qrCodeId').val('');
            if(loginRequired) {
                $.mobile.changePage('#loginPage');
            } else {
                //helper.alert('Nessuna informazione associata al QR code', null, 'Leggi QR Code');
            }
        });
    },
    
    
    showQrCodeInfoGalleryPage: function() {
        var result = self.currentQrCodeInfo;
/*result = {
    info: {nome: 'beppe'},
    foto: [
        'http://www.gretacity.com//Data/Upload/Qrcode/thumbs/600_800_603-3.jpg',
        'http://www.gretacity.com//Data/Upload/Qrcode/thumbs/600_800_603-3.jpg',
        'http://www.gretacity.com//Data/Upload/Qrcode/thumbs/600_800_603-3.jpg',
        'http://www.gretacity.com//Data/Upload/Qrcode/thumbs/600_800_603-3.jpg',
        'http://www.gretacity.com//Data/Upload/Qrcode/thumbs/600_800_603-3.jpg'
    ]
};*/
        $('div h3.qrcode-info-title', $.mobile.activePage).html(result.info.nome);
            
        var html = '';
        for(var i = 0; i < result.foto.length; i += 2) {
            var photo1 = result.foto[i];
            var photo2 = (i + 1) < result.foto.length ? result.foto[i+1] : null;
            html += '<div class="ui-grid-a" style="padding:0;margin:0">'+
                        '<div class="ui-block-a" onclick="app.openPhoto(\'' + photo1 + '\')" style="margin:0;padding:.4em .3em 0 0;">'+
                            '<img src="" style="background:url(\'' + photo1 + '\') no-repeat;background-size: cover;width:100%;height:10em;border-radius:.5em;" />'+
                        '</div>';
            if(photo2) {
                html += '<div class="ui-block-b" onclick="app.openPhoto(\'' + photo2 + '\')" style="margin:0;padding:.4em 0 0 .3em;">'+
                            '<img src="" style="background:url(\'' + photo2 + '\') no-repeat;background-size: cover;width:100%;height:10em;border-radius:.5em;" />'+
                        '</div>';
            }
            html += '</div>';
        }
        $('#gallery', $.mobile.activePage).html(html);
    },
    
    
    beforeShowQrCodeInfoNewsPage: function() {
        var result = self.currentQrCodeInfo;
        var page = $('#qrCodeInfoNewsPage');
        $('h3', page).html(result.info.nome);
        var html = '';
        if(result.notizie && (result.notizie.length > 0)) {
            for(var i in result.notizie) {
                var news = result.notizie[i];
                html += '<li class="qrcode-info-news">' + 
                        '<div style="white-space: normal !important; color: #00269C !important;">' + news.titolo + '</div>' +
                        '<p style="white-space:normal;">' + news.annotazione + '</p>' +
                        '<span>' + Date.parseFromYMDHMS(news.data).toDMY() + '</span>' +
                        '</li>';
            }
        }
        console.log(html);
        $('#qrCodeNewsList', page).html(html).listview('refresh');
    },
    
    showQrCodeInfoPositionPage: function() {
        setTimeout(function() {
            self.maximizeMap($('#qrCodeInfoPositionPage #qrCodeInfoPlaceMap'));
            var result = self.currentQrCodeInfo;
            var placeName = result.info.nome;
            var lat = result.censimento.latitudine, lng = result.censimento.longitudine;
            var options = {
                zoom: config.GOOGLE_MAPS_ZOOM,
                center: new google.maps.LatLng(lat, lng),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                streetViewControl: false
            };
            var map = new google.maps.Map(document.getElementById('qrCodeInfoPlaceMap'), options);
            var point = new google.maps.LatLng(lat, lng);
            
            geoLocation.acquireGeoCoordinates(function(pos) {
                
                //var startingMarkerPoint is equal to marker

                var endPoint = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

                var directionsDisplay = new google.maps.DirectionsRenderer({
                    suppressInfoWindows: true,
                    suppressMarkers: true,
                    preserveViewport: false
                });
                var directionsService = new google.maps.DirectionsService();
                directionsDisplay.setMap(map);
                directionsService.route({
                    origin: point, // startingMarkerPoint,
                    destination: endPoint,
                    optimizeWaypoints: true,
                    travelMode: google.maps.TravelMode.DRIVING
                }, function(res, status) {
                    if(status == google.maps.DirectionsStatus.OK) {
                        startingMarkerPoint = res.routes[0].legs[0].start_location;
                        endingMarkerPoint = res.routes[0].legs[0].end_location;
                        directionsDisplay.setDirections(res);
                    }                     
                    var startingMarker = new google.maps.Marker({
                        position: startingMarkerPoint,
                        map: map,
                        draggable: false,
                        animation: google.maps.Animation.DROP,
                        title: placeName
                    });
                    var infowindow = new google.maps.InfoWindow({content: '<div>' + placeName + '</div>'});
                    infowindow.open(map, startingMarker);
                    var endingMarker = new google.maps.Marker({
                        position: endingMarkerPoint,
                        map: map,
                        draggable: false,
                        animation: google.maps.Animation.DROP,
                        title: 'Tu'
                    });
                    var infowindow2 = new google.maps.InfoWindow({content: '<div>Tu</div>'});
                    infowindow2.open(map, endingMarker);
                    
                    if(status != google.maps.DirectionsStatus.OK) {
                        var bounds = new google.maps.LatLngBounds();
                        bounds.extend(startingMarker.position);
                        bounds.extend(endingMarker.position);
                        map.fitBounds(bounds);
                    }
                });
            }, function() {
                var marker = new google.maps.Marker({
                    position: point,
                    map: map,
                    draggable: false,
                    animation: google.maps.Animation.DROP,
                    title: placeName
                });
                map.panTo(point);
                var infowindow = new google.maps.InfoWindow({content: '<div>' + placeName + '</div>'});
                infowindow.open(map, marker);
            });
            
        }, 300);
    },
    
    beforeShowQrCodeInfoCommentsPage: function() {
        var result = self.currentQrCodeInfo;        
        var canLeaveComment = (result.categoria.commenti == 1);
        
        var page = $('#qrCodeInfoCommentsPage');
        $('h3', page).html(result.info.nome);
        var html = '';
        if(result.commenti && (result.commenti.length > 0)) {
            for(var i in result.commenti) {
                var c = result.commenti[i];
                var d = Date.parseFromYMDHMS(c.data_inserimento);
                html += '<li>';
                if((c.nome || '') != '') {
                    html += '<small  class="news-note" display:block;>Commento di ' + c.nome + '</small>';
                }
                html += '<p style="white-space:normal;">' + c.descrizione + '</p>';
                html += '<small class="news-note">' + d.toDMY() + ' alle ' + d.toHM() + '</small>';
                
               
                if(c.stato == 0) html += '<div class="news-note">in attesa di approvazione</div>';
                html += '</li>';
            }
        } else {
            html += '<p id="noComments" style="text-align:left;margin-top:1.5em;">Nessun commento</p>';
        }
        if(canLeaveComment) {
            $('#leaveCommentPanel', page).show();
        } else {
            $('#leaveCommentPanel', page).hide();
        }
        $('#qrCodeCommentsList', page).html(html).listview('refresh');
    },
    
    beforeShowQrCodeInfoMultimediaPage: function() {
        var result = self.currentQrCodeInfo;
        var page = $('#qrCodeInfoMultimediaPage');
        $('h3', page).html(result.info.nome);
        var html = '';
        if(result.youtube && (result.youtube.length > 0)) {
            html += '<ul id="videos" style="text-align:left;margin-top:1.5em;" data-inset="false" data-theme="b">';
            //html += '<li data-role="list-divider">Video</li>';
            for(var i in result.youtube) {
                var v = result.youtube[i];
				html +='<li>';
                //html += '<li><a href="#" onclick="javascript:self.openLink(\'' + v.media_file.replace(/'/g, "\\'") + '\')" target="_system">' + v.nome + '</a></li>';
				//html +=v.nome;
				html +=v.media_file.replace(/(?:https:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.it)\/(?:watch\?v=)?(.+)/g, '<iframe width="100%" height="10%" src="http://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>');
				html +='</li>';
			}
            html += '</ul>';
			
			/* html += '<object>'+
				'<param name="movie" value="http://www.youtube.com/v/u8D3Fxv3BG0?version=3&amp;hl=it_IT">'+
				'<param name="allowFullScreen" value="false">'+
				'<param name="allowscriptaccess" value="always">'+
				'<param name="wmode" value="opaque">'+
				'<embed src="http://www.youtube.com/v/u8D3Fxv3BG0?version=3&amp;hl=it_IT" wmode="opaque" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true">'+
			'</object>'; */
		}
        //}';
        $('#qrCodeMultimediaContent', page).html(html);
        $('#qrCodeMultimediaContent #videos', page).listview();
    },
    
    beforeShowQrCodeInfoLinksPage: function() {
        var result = self.currentQrCodeInfo;
        var page = $('#qrCodeInfoLinksPage');
        $('h3', page).html(result.info.nome);
        var html = '';
        if(result.links.length > 0) {
            for(var i in result.links) {
                var l = result.links[i];
                html += '<li><a href="#" onclick="javascript:self.openLink(\'' + l.link.replace(/'/g, "\\'") + '\')" target="_system">' + l.nome + '</a></li>';
            }
            html += '</ul>';
        }
        $('#qrCodeLinksList', page).html(html).listview('refresh');
    },  
    
    
    ////////////////////////////////////////
    // nearbyPage
    
    nearbyCategoryId: null,
    nearbyCategoryName: null,
    nearbyCurrentPos: null,
    nearbyDistance: config.NEARBY_DEFAULT_DISTANCE,
    initNearbyPage: function() {
        self.nearbyCurrentPos = null;
        services.getNearbyPlaceTypes(function(placeTypes) {
            var html = '';
            for(var i in placeTypes) {
                var place = placeTypes[i];
                var img = place.icon || '';
                html += '<li><a href="javascript:self.showNearbyPlaces(\'' + place.key + '\', \'' + place.name.replace(/'/g, "\\'") + '\')"><img src="' + img + '" style="padding:7px 0 0 5px;" />' + place.name.capitalize() + '</a></li>';
            }
            $('#nearbyPage #placeTypeList').html(html).listview('refresh');
        });        
    },
    beforeShowNearbyPage: function() {
        //$.mobile.loading('show');
        //self.setSidePanelPage('nearbyPage');
        geoLocation.acquireGeoCoordinates(function(result) {
            self.nearbyCurrentPos = result;
            //$.mobile.loading('hide');
        }, function(e) {
            console.log(e);
            //$.mobile.loading('hide');
        }, {enableHighAccuracy: true});
    },
    showNearbyPlaces: function(catId, catName) {
        if(self.nearbyCurrentPos == null) {
            helper.confirm('Impossibile recuperare la tua posizione GPS', function(choice) {
                if(choice == 1) {
                    $.mobile.loading('show');
                    geoLocation.acquireGeoCoordinates(function(result) {
                        self.nearbyCurrentPos = result;
                        $.mobile.loading('hide');
                        self.showNearbyPlaces(catId, catName);
                    }, function(e) {
                        console.log(e);
                        $.mobile.loading('hide');
                        self.showNearbyPlaces(catId, catName);
                    });
                }
            }, 'Localizzazione GPS', ['Riprova', 'Annulla']);
            return;
        } else {
            self.nearbyCategoryId = catId;
            self.nearbyCategoryName = catName;
            $.mobile.changePage('#nearbyResultsPage', {transition: 'slide'});
        }
    },
    beforeShowNearbyResultsPage: function(e, ui) {
        $('#nearbyResultsPage #nearbySearchSlider').parents('div.ui-slider').css({'padding-right': 10});
        if(self.nearbyCategoryId == null) {
            $.mobile.changePage('#nearbyPage', {transition: 'slide', reverse: true});
            return;
        }
        if(ui.prevPage.attr('id') != 'nearbyPlaceInfoPage') {
            self.searchNearbyPlaces(self.nearbyCategoryId);
        }
    },
    searchNearbyPlaces: function() {
        var page = $('#nearbyResultsPage');
        self.nearbyDistance = $('#nearbySearchSlider', page).val();
        var options = {
            coords: self.nearbyCurrentPos.coords,
            distance: self.nearbyDistance,
            placeCatId: self.nearbyCategoryId
        };        
        $('#currentPlaceType', page).html(self.nearbyCategoryName.toUpperCase());
        $('#placesList', page).html('').listview('refresh');
        $.mobile.loading('show');
        services.getNearbyPlaces(options, function(result) {
            var html = '';
            if(result.length > 0) {
                for(var i in result) {
                    var row = result[i];
                    html += '<li><a href="javascript:self.showNearbyPlace(\'' + row.id + '\', \'' + row.source + '\')">' 
                                + row.name + '<label><small>' 
                                + ((row.phoneNumber || '') != '' ? 'Tel. ' + row.phoneNumber  + '<br />' : '')
                                + row.address
                                + '</small><br /><b style="color:#FFB800">a ' + helper.distanceText(row.distance) + '</b></label></a></li>';
                }
            } else {
                html = '<li>Nessun risultato</li>';
            }
            $('#placesList', page).html(html).listview('refresh');
            $.mobile.silentScroll();
            $.mobile.loading('hide');
        }, function(e, requireLogin) {
            $.mobile.loading('hide');
            if(requireLogin) {
                $.mobile.changePage('#loginPage');
                return;
            }
            helper.alert("Si sono verificati errori", null, "QUI vicino");
        });
    },
    
    nearbyPlaceId: null,
    nearbyPlaceSource: null,
    showNearbyPlace: function(placeId, source) {
        if(typeof(google) == 'undefined') return;
        self.nearbyPlaceId = placeId;
        self.nearbyPlaceSource = source;
        $.mobile.changePage('#nearbyPlaceInfoPage');
    },
    
    
    initNearbyPlaceInfo: function() {        
    },
    
    beforeShowNearbyPlaceInfo: function() {
        if(self.nearbyPlaceId == null) {
            $.mobile.changePage('#nearbyResultsPage');
            return;
        }
    },
    
    showNearbyPlaceInfo: function() {
        $.mobile.loading('show');
        if(self.nearbyPlaceId == null) return;
        var showMap = self.nearbyCurrentPos != null;
        if(!showMap) return;
        
        setTimeout(function() {
            self.maximizeMap($('#nearbyPlaceInfoPage #nearbyPlaceMap'));
        }, 300);
        
        if(showMap) {
            var lat = self.nearbyCurrentPos.coords.latitude, lng = self.nearbyCurrentPos.coords.longitude;
            var options = {
                zoom: config.GOOGLE_MAPS_ZOOM,
                center: new google.maps.LatLng(lat, lng),
                mapTypeId: google.maps.MapTypeId.ROADMAP //eval(config.GOOGLE_MAPS_TYPE_ID)
            };
            var map = new google.maps.Map(document.getElementById('nearbyPlaceMap'), options);
            var startingMarkerPoint = new google.maps.LatLng(lat, lng);
        }
        $.mobile.loading('show');
        services.getNearbyPlaceInfo({id: self.nearbyPlaceId, source: self.nearbyPlaceSource}, function(result) {
            if(result == null) {
                $.mobile.loading('hide');
                helper.alert('Impossibile recuperare le informazioni');
                return;
            }
            if(showMap) {
                var endingMarkerPoint = new google.maps.LatLng(result.lat, result.lng);
                
                // Display route
                // see:
                // https://developers.google.com/maps/documentation/javascript/examples/directions-complex
                
                var directionsDisplay = new google.maps.DirectionsRenderer({
                    suppressInfoWindows: true,
                    suppressMarkers: true,
                    preserveViewport: false
                });
                var directionsService = new google.maps.DirectionsService();
                directionsDisplay.setMap(map);
                directionsService.route({
                    origin: startingMarkerPoint,
                    destination: endingMarkerPoint,
                    optimizeWaypoints: true,
                    travelMode: google.maps.TravelMode.DRIVING
                }, function(res, status) {
                    if(status == google.maps.DirectionsStatus.OK) {
//console.log(res.routes);
//self.tmp = res.routes;
                        //res.routes[0].legs[0].start_location.lat()
                        //res.routes[0].legs[0].start_location.lng()
                        startingMarkerPoint = res.routes[0].legs[0].start_location;
                        //res.routes[0].legs[0].end_location.lat()
                        //res.routes[0].legs[0].end_location.lng()
                        endingMarkerPoint = res.routes[0].legs[0].end_location;
                        //console.log(endingMarkerPoint, res.routes[0].legs[0].end_location);
                        directionsDisplay.setDirections(res);
                    }                     
                    var startingMarker = new google.maps.Marker({
                        position: startingMarkerPoint,
                        map: map,
                        draggable: false,
                        animation: google.maps.Animation.DROP,
                        title: 'Tu'
                    });
                    //map.panTo(startingMarkerPoint);
                    //map.setCenter(startingMarkerPoint, config.GOOGLE_MAPS_ZOOM);
                    var infowindow = new google.maps.InfoWindow({content: '<div>Tu</div>'});
                    infowindow.open(map, startingMarker);
                    var endingMarker = new google.maps.Marker({
                        position: endingMarkerPoint,
                        map: map,
                        draggable: false,
                        animation: google.maps.Animation.DROP,
                        title: result.name
                    });
                    var infowindow2 = new google.maps.InfoWindow({content: '<div>' + result.name + '</div>'});
                    infowindow2.open(map, endingMarker);
                    
                    if(status != google.maps.DirectionsStatus.OK) {
                        var bounds = new google.maps.LatLngBounds();
                        bounds.extend(startingMarker.position);
                        bounds.extend(endingMarker.position);
                        map.fitBounds(bounds);
                    }
                });
            }
            $.mobile.loading('hide');
            
        }, function(e, requireLogin) {
            $.mobile.loading('hide');
            if(requireLogin) {
                $.mobile.changePage('#loginPage');
                return;
            }
            helper.alert("Si sono verificati errori", null, "QUI vicino");
        });
    },

    ////////////////////////////////////////
    // profilePage
    
    userProfile: null,
    initProfilePage: function() {
        $('#profilePage #city').on('input', function() {
            var val = $(this).val();
            if($(this).data('cityname') != val) {
                $(this).data('cityid', '');
            }
            if(val.length >= 3) {
                self.fillCityList(val, $('#citySuggestion', $.mobile.activePage), 'city');
            }
        });
        $('#profilePage #updateProfileButton').on('click', self.updateProfile);
        $('#profilePage a.profile-photo-shot').on('click', function(e) {
            $('#sourceTypePopup', $.mobile.activePage).popup('open');
        });
        $('#profilePage .reporting-photo-delete').on('click', function(e) {
            self.removeProfilePhoto(e,self.userProfile.id);
        });
        $('#profilePage #sourceTypePopup #shotPhoto').on('click', self.getProfilePhoto);
        $('#profilePage #sourceTypePopup #fromGallery').on('click', self.getProfilePhoto);
    },
    beforeshowProfilePage: function() {
        var page = $('#profilePage');
        $('#firstname', page).val('');
        $('#lastname', page).val('');
        $('#email', page).val('');
        $('#city', page).val('')
                        .data('cityid', '')
                        .data('cityname', '');
        $('#citySuggestion',page).empty();
        $('#address', page).val('');
        $('#phone', page).val('');
    //    $('#photoProfile', page).attr('src', '');
        //$('',page)
    
    },
    showProfilePage: function() {
        /*if(self.userProfile != null) {
            self.fillProfilePage();
            return;
        }*/
        $.mobile.loading('show');
        services.getProfile(null, function(result) {
            self.userProfile = result;
            self.fillProfilePage();
            $.mobile.loading('hide');
        }, function(e, loginRequired) {
            $.mobile.loading('hide');
            if(loginRequired) {
                $.mobile.changePage('#loginPage');
                return;
            }
            helper.alert('Si è verificato un errore', null, 'Profilo')
        });
    },
    fillProfilePage: function() {
        var page = $('#profilePage');
        $('#firstname', page).val(self.userProfile.firstname);
        $('#lastname', page).val(self.userProfile.lastname);
        $('#email', page).val(self.userProfile.email);
        var cityName = (self.userProfile.city.name || '');
        $('#city', page).val(cityName)
                        .data('cityid', (self.userProfile.city.id || ''))
                        .data('cityname', cityName);
        $('#address', page).val(self.userProfile.address || '');
        $('#phone', page).val(self.userProfile.phone || '');
        
        var photoUrl = (self.userProfile.photo != '' ? self.userProfile.photo : 'img/default.jpg');
        $('#photoProfile', page).attr('src', photoUrl);
        
        var photoPh=self.userProfile.photo;
        var photoVera=photoPh.substr(photoPh.length - 11);//default.jpg
        console.log(photoVera);
        
        if (photoVera == "default.jpg"){
            $('.reporting-photo-delete', page).css('display', 'none');
        }
        //$('#photot1', page).css('background-image', 'url(\'' + photoUrl + '\')');
        /*var photos = $('.photo-preview', page);
            for(var i = 0; i < photos.length; i++) {
                var photoUrl = ((self.userProfile.immagini[i] || '') !== '' ? self.userProfile.immagini[i] : 'img/camera.png');
                $(photos[i]).css('background-image', 'url(\'' + photoUrl + '\')');
            }*/
        
    },
    updateProfile: function() {
        var page = $($.mobile.activePage);
        var profile = {};
        //svuota variabile photos nell'oggetto profile
        profile.photos = [];
        $('#photoSet a img:not(.profile-photo-missing)', $.mobile.activePage).each(function() {
            var src = $(this).attr('src');
            var pos = src.indexOf('base64,');
            if(pos != -1) 
                pos += 7;
            else 
                pos = 0;
            profile.photos.push(src.substr(pos));
        });
        // Validation
        var hasErrors = false;
        // city_id
        var fields = ['city', 'lastname', 'firstname', 'email', 'phone', 'address'];
        for(var i in fields) {
            var fieldId = fields[i];
            var required = $('#' + fieldId + '[required]', page).length == 1;
            var fieldVal = $('#' + fieldId, page).val().trim();
            if(required && (fieldVal == '')) {
                $('#' + fieldId, page).addClass('input-error');
                hasErrors = true;
            } else {
                $('#' + fieldId, page).removeClass('input-error');
            }
            eval('profile.'+fieldId+'="'+fieldVal+'"');
        }

        if(hasErrors) {
            helper.alert('Compila i campi obbligatori', function() {
                $.mobile.silentScroll();
            }, 'Profilo');
            return;
        }

        // Specific validation for city
        if(($('#city', page).data('cityid') || '') == '') {
            helper.alert('Seleziona il comune di residenza dall\'elenco', function() {
                $('#city', page).focus();
            }, 'Profilo');
            return;
        }
        profile.city = {
            id : $('#city', page).data('cityid'),
            name: $('#city', page).val()
        };
        
        // Specific validation for email
        if(!helper.isEmailValid(profile.email)) {
            $('#email', page).addClass('input-error');
            helper.alert('Inserisci un indirizzo email valido', function() {
                $('#email', page).focus();
            }, 'Registrazione');
            return;
        }
        // Specific validation for phone number
        if((profile.phone != '') && !helper.isPhoneNumberValid(profile.phone)) {
            $('#phone').addClass('input-error');
            helper.alert('Inserisci un numero di telefono valido', function() {
                $('#phone', page).focus();
            }, 'Registrazione');
            return;
        }
        $.mobile.loading('show');
        services.updateProfile({profile: profile}, function() {
            var emailChanged = (self.userProfile.email != profile.email);
            self.userProfile = profile;
            if(emailChanged) {
                helper.alert('Controlla la casella di posta per confermare il tuo nuovo indirizzo email', function() {
                    $.mobile.back({transition: 'slide', reverse: true});
                }, 'Profilo');
            } else {
                $.mobile.back({transition: 'slide', reverse: true});
            }
        }, function(e, loginRequired) {
            if(loginRequired) {
                $.mobile.changePage('#loginPage');
                return;
            }
            $.mobile.loading('hide');
            //helper.alert('Si è verificato un errore durante l\'aggiornamento', null, 'Profilo');
            helper.alert(
                (e || '') == '' ? 'Si è verificato un errore durante l\'aggiornamento' : e, 
                null, 
                'Profilo'
            );
        });
    },
    
getProfilePhoto: function(e) {
        /*var remainingPhoto = $('#photoSet div a img.reporting-photo-missing', $.mobile.activePage).length;
        if(remainingPhoto == 0) {
            helper.alert('Hai raggiunto il limite massimo di foto che puoi inviare');
            return;
        }*/
        var source = $(e.currentTarget).attr('id') == 'shotPhoto' ? 
                Camera.PictureSourceType.CAMERA :
                Camera.PictureSourceType.PHOTOLIBRARY;
//console.log(source);
        camera.getPicture(function(res) {
            // Success callback
            var photo = $($('#photoSet .profile-photo-item a img.profile-photo-missing', $.mobile.activePage)[0]);
//console.log(photo);
            photo.attr('src', 'data:image/jpeg;base64,' + res).removeClass('profile-photo-missing');
            photo.parent().prev().show();
            $('#sourceTypePopup', $.mobile.activePage).popup('close');
            helper.imageCropToFit(photo);
        }, function(e) {
            //helper.alert('Si è verificato un problema', null, 'Acquisizione foto');
        }, {sourceType: source});
    },
    removeProfilePhoto: function(par,id) {
        helper.confirm("Vuoi eliminare la foto del profilo?", function(ix) {
            if(ix == 1) {
                var imageEl = $('#photoSet div.profile-photo-item a img');
                console.log('QUIII');
                console.log(imageEl);
                imageEl.parent().prev().hide();
                imageEl.css({'margin-left': '', 'margin-top': '', 'height': '', 'width': ''}).addClass('profile-photo-missing');
                imageEl.removeAttr('src').replaceWith(imageEl.clone());

                services.deleteProfilePhoto(id, function() {
                    // Successfully sent
                    $.mobile.loading('hide');

                }, function(e) {
                    // An error occurred
                    $.mobile.loading('hide');
                    helper.alert('Si è verificato un errore durante la cancellazione', null, 'Elimina');
                });
            }
        }, 'Elimina Foto', ['Procedi', 'Annulla']);
    },
    
    ////////////////////////////////////////
    // supportPage
    
    initSupportPage: function() {
        $('#supportPage #sendRequestButton').on('click', self.sendSupportRequest);
    },

    showSupportPage: function() {
        $('#description', $.mobile.activePage).val('');
    },
    
    sendSupportRequest: function() {
        var text = $('#description', $.mobile.activePage).val().trim();
        if(text.length == 0) {
            helper.alert('Descrivici il problema', null, 'Supporto');
            return;
        }
        $.mobile.loading('show');
        services.sendRequestSupport({text: text}, function() {
            $.mobile.loading('hide');
            helper.alert('La tua richiesta di supporto è stata inviata.', function() {
                $.mobile.changePage('#setupPage', {transition: 'slide', reverse: true});
            }, 'Supporto');
        }, function(e, loginRequired) {
            if(loginRequired) {
                $.mobile.changePage('#loginPage');
                return;
            }
            $.mobile.loading('hide');
            helper.alert(e, null, 'Supporto');
        });
    },
    ////////////////////////////////////////
    // setupFollowingPage
    
    showSetupFollowingPage: function() {
        $.mobile.loading('show');
        services.getFollowings({}, function(result) {
            $.mobile.loading('hide');
            var html = '';
            for(var i in result.follows) {
                var row = result.follows[i];
                var name = row.denominazione || '';
                //var description = row.descrizione || '';
                //if(description.length > 40) description = description.substr(0, 40) + '...';
                var qrCodeId = row.r_qrcode_id || '';                
                html += '<input type="checkbox" id="following' + qrCodeId + '" data-id="' + qrCodeId + '" checked ' +
                        'onclick="services.followQrCode(\'' + qrCodeId + '\', $(this).is(\':checked\'))"' +
                        '/>'+
                        '<label for="following' + qrCodeId + '">' + name + 
                        '</label>';
            }
            $('#followingList', $.mobile.activePage).html(html).trigger('create');//.listview('refresh');
            //self.updateBalloonsInFollowing();
        }, function(e, loginRequired) {
            $.mobile.loading('hide');
            if(loginRequired) {
                $.mobile.changePage('#loginPage');
                return;
            }
            helper.alert('Impossibile recuperare il contenuto', null, 'Notizia');
        });
    },
    

    ////////////////////////////////////////
    // setupChannelsPage
    showSetupChannelsPage: function() {
        $.mobile.loading('show');
        services.getSubscribedChannels(function(result) {
            $.mobile.loading('hide');
            var html = '';
            for(var i in result) {
//console.log(result);
                var channelId = result[i].id_feed;
                var channelName = result[i].nome_feed;
                var channelOwner = result[i].denominazione;
                html += '<li style="margin:0;padding:0">'+
                            '<input type="checkbox" id="channel' + channelId + '" data-id="' + channelId + '" checked data-removable="' + result[i].remove + '" />'+
                            '<label for="channel' + channelId + '">' + channelName + 
                            '<br /><small>' + channelOwner + '</small></label>'+
                        '</li>';
                /*html += '<input type="checkbox" id="channel' + channelId + '" data-id="' + channelId + '" checked data-removable="' + result[i].remove + '" />'+
                        '<label for="channel' + channelId + '">' + channelName + 
                        '<br /><small>' + channelOwner + '</small></label>';*/
            }
//console.log(html);
            $('#subscribedChannels', $.mobile.activePage).html(html).trigger('create').listview('refresh');
            $('#subscribedChannels input[type="checkbox"]', $.mobile.activePage).checkboxradio().on('click', function(e) {
                var removable = $(this).attr('data-removable') == '1';
                if(!removable) {
                    $(this).prop('checked', true);
                    e.preventDefault();
                    return;
                }
                services.subscribeToChannel({
                    channelId: $(this).attr('data-id'), 
                    subscribe: $(this).is(':checked')
                });
            });
            
        }, function(e, loginRequired) {
            $.mobile.loading('hide');
            if(loginRequired) {
                $.mobile.changePage('#loginPage');
                return;
            }
            helper.alert('Si è verificato un errore durante il caricamento', null, 'I tuoi canali');
        });
    },
    
    ////////////////////////////////////////
    // setupChannelSubscriptionPage
    initSetupChannelSubscriptionPage: function() {
        $('#setupChannelSubscriptionPage #city').change(self.subscriptionCityChanged);
        //$('#cityNameManual', channelSubscriptionPage).on('input', self.cityNameManualChanged);
        $('#setupChannelSubscriptionPage #cityNameManual').on('input', function() {
            var val = $(this).val();
            if($(this).data('cityname') != val) {
                $(this).data('cityid', '');
            }
            if(val.length >= 3) {
                self.fillCityList(val, $('#setupChannelSubscriptionPage #citySuggestions'), 'cityNameManual', 'app.getAvailableChannels(this)');
            }
        });
    },
    beforeshowSetupChannelSubscriptionPage: function() {
        self.showManualCitySearch(false);
        $('#city', $.mobile.activePage).html('').selectmenu('refresh');
        $('#cityNameManual', $.mobile.activePage).val('');
        $('#citySuggestions', $.mobile.activePage).empty();
        $('#availableChannelsContainer', $.mobile.activePage).hide();
        $('#availableChannelList', $.mobile.activePage).html('');
        $('#info', $.mobile.activePage).html('Stiamo acquisendo la tua posizione...');
    },
    showSetupChannelSubscriptionPage: function() {
        $.mobile.loading('show');
        geoLocation.acquireGeoCoordinates(function(pos) {
            services.getNearbyLocations(pos, function(result) {
                // Successfully retrieved nearby locations from GPS coordinates
                self.setNearbyLocations(result);
            }, function(e, loginRequired) {
                // Unable to retrieve nearby locations
                if(loginRequired) {
                    $.mobile.changePage('#loginPage');
                    return;
                }
                self.setNearbyLocations(null);
            });
        }, function(e) {
            // Unable to retrieve GPS coordinates
            self.setNearbyLocations(null);
        }, {enableHighAccuracy: true});
    },
    
    setNearbyLocations: function(result) {
        var html = '';
        $.mobile.selectmenu.prototype.options.hidePlaceholderMenuItems = false;
        if(result != null) {
            $('#info', $.mobile.activePage).html('Seleziona il comune di interesse dall\'elenco');
            html += '<option data-placeholder="true">Seleziona il comune</option>';
            for(var i in result) {
                var l = result[i];
                html += '<option data-regid="' + l.id_regione + '" data-provid="' + l.id_provincia + '" data-cityid="' + l.id + '">' + l.nome + '</option>';
            }
            html += '<option value="manual"><strong>RICERCA MANUALE</strong></option>';
            $('#city', $.mobile.activePage).html(html).selectmenu('refresh');
            self.showManualCitySearch(false);
        } else {
            self.showManualCitySearch(true);
        }
        $.mobile.loading('hide');
    },
    subscriptionCityChanged: function() {
        if($(this).val() == 'manual') {
            self.showManualCitySearch(true);
        } else {
            $('#manualSelectionPanel', $.mobile.activePage).hide('fast');
            
            var selectedItem = $('#city option:selected', $.mobile.activePage);
            var cityName = selectedItem.html().trim();
            var cityId = selectedItem.attr('data-cityid');
            var provId = selectedItem.attr('data-provid');
            var regionId = selectedItem.attr('data-regid');
            
            self.getAvailableChannels(cityName, cityId, provId, regionId);
        }
    },

    showManualCitySearch: function(show) {
        if(show === true) {
            $('#info', $.mobile.activePage).html('Inserisci il nome del comune');
            $('#automaticSelectionPanel', $.mobile.activePage).hide();
            $('#manualSelectionPanel', $.mobile.activePage).show('fast', function() {
                //$('#manualSelectionPanel #cityNameManual', $.mobile.activePage).focus();
            });
            $('#availableChannelsContainer', $.mobile.activePage).hide();
        } else {
            $('#automaticSelectionPanel', $.mobile.activePage).show();
            $('#manualSelectionPanel', $.mobile.activePage).hide();
        }
    },

    getAvailableChannels: function(cityName, cityId, provId, regionId) {
        
        $.mobile.loading('show');

        if(typeof(cityName) == 'object') {
            var el = $(cityName);
            cityName = el.data('cityname');
            cityId = el.data('cityid');
            provId = el.data('provid');
            regionId = el.data('regionid');            
            self.setCity('cityNameManual', cityName, cityId, 'citySuggestions');
        }
        
        $('#availableChannelsContainer', $.mobile.activePage).show();
        $('#availableChannelsContainer li #availableChannelList', $.mobile.activePage).empty();
        services.getAvailableChannels({cityId: cityId, provId: provId, regionId: regionId}, function(result) {
            $('#availableChannelsContainer li #availableChannelList', $.mobile.activePage).show()
            var html = '';
            if(result.length == 0) {
                html = '<label style="white-space:normal;">Sei stato associato al comune di ' + cityName 
                       + '.<br />Attualmente non ci sono canali disponibili, ma ti invieremo delle notifiche quando ce ne saranno.</label>';
                $('#availableChannelList', $.mobile.activePage).html(html);
            } else {
                for(var i in result) {
                    var channelId = result[i].id;
                    var channelName = result[i].nome;
                    var channelScope = result[i].ambito || '';
                    var subscribed = result[i].sottoscritto == '1';
                    html += '<input type="checkbox" id="cchannel' + channelId + '" data-channelid="' + channelId + '" ' + 
                                'data-channelname="' + channelName + '"' + (subscribed ? ' checked' : '') + '/>' +
                            '<label for="cchannel' + channelId + '">' + channelName + 
                            '<br /><span style="font-size:.8em !important;color:#aeaece !important;">' + channelScope + '</span></label>';
                }
                $('#availableChannelsContainer li #availableChannelList', $.mobile.activePage).html(html);
                $('#availableChannelsContainer li #availableChannelList input[type="checkbox"]', $.mobile.activePage).checkboxradio().checkboxradio('refresh').on('click', self.subscribeToChannel);
                $('#availableChannelsContainer li #availableChannelList', $.mobile.activePage).children('label:not(".ui-btn")').remove();
            }
            $.mobile.silentScroll($('#availableChannelsContainer', $.mobile.activePage).offset().top);
            $.mobile.loading('hide');
        }, function(e) {
            $.mobile.loading('hide');
        });
    },
    
    subscribeToChannel: function() {
        $.mobile.loading('show');
        var channelId = $(this).attr('data-channelid');
        //var channelName = $(this).attr('data-channelname');
        var subscribe = $(this).is(':checked');
        services.subscribeToChannel({channelId: channelId, subscribe: subscribe}, function() {
            $.mobile.loading('hide');
        }, function(e, loginRequired) {
            if(subscribe) {
                // Remove the check mark
                Attr('checked').checkboxradio("refresh");
            } else {
                // Reset the check mark
                $(this).prop('checked', true).checkboxradio("refresh");
            }
            $.mobile.loading('hide');
        });
    },

    
    _followQrCode: function() {
        var follow = $('#qrCodeInfoPage #infoResult #following').is(':checked');
        services.followQrCode(self.currentQrCode, follow);
    },
 
// TODO Move up
    leaveCommentOnQrCode: function() {
        var text = $('#qrCodeInfoCommentsPage #comment').val().trim();
	  var qr = $('#followingListDetailPage #qrCodeId').val();
        if(text == '') return;
        var params = {
            comment: text,
            qrCodeId: qr
        };
        $.mobile.loading('show');
        services.leaveCommentOnQrCode(params, function() {
            // success
            var d = new Date();
            $('#qrCodeInfoCommentsPage #noComments').hide();
            $('#qrCodeInfoCommentsPage #qrCodeCommentsList').append('<li><p>' + text + '</p><small>' + d.toDMY() + ' alle ' + d.toHM() + '</small></li>');
            $('#qrCodeInfoCommentsPage #qrCodeCommentsList').listview('refresh');
            $('#qrCodeInfoCommentsPage #comment').val('');
            $.mobile.loading('hide');
        }, function(e) {
            $.mobile.loading('hide');
            helper.alert('Impossibile inviare il commento', null, 'Lascia il commento');
        });
    },
    
    
    
    
    _currentPhotoScale: 1,
    _scaleStep: .2,
    _minScale: 1,
    _maxScale: 3,
    reportingListPageZoomInPhoto: function(el) {
        self._currentPhotoScale += self._scaleStep;
        if(self._currentPhotoScale > self._maxScale) self._currentPhotoScale = self._maxScale;
        $('#photoPage #photo').css('transform', 'scale(' + self._currentPhotoScale + ')');
    },
    reportingListPageZoomOutPhoto: function(el) {
        self._currentPhotoScale -= self._scaleStep;
        if(self._currentPhotoScale < self._minScale) self._currentPhotoScale = self._minScale;
        $('#photoPage #photo').css('transform', 'scale(' + self._currentPhotoScale + ')');
    },
    
    


    
    mapsScriptLoaded: function() {
    },
    
     
};