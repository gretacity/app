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
            } else {
                navigator.app.backHistory();
            }
        }, false);
        
        $('.newsPageToolbarButton').on('click', function() {
            self.showNewsChannel(self.newsChannelId);
        });
        
        var loginPage = $('#loginPage');
        loginPage.on('pagebeforeshow', function() {
            if(config.userLastLoginUsername() != '') {
                $('#username', loginPage).val(config.userLastLoginUsername());
            } else {
                $('#username', loginPage).val(config.LOGIN_DEFAULT_USERNAME);
                $('#password', loginPage).val(config.LOGIN_DEFAULT_PASSWORD);
            }           
        });
        $('#loginButton', loginPage).on('click', self.login);
        $('#recoverPasswordButton', loginPage).on('click', self.recoverPassword);
        var changePasswordPage = $('#changePasswordPage');
        changePasswordPage.on('pagebeforeshow', self.beforeShowChangePasswordPage);
        $('#changePasswordButton', changePasswordPage).on('click', self.changePassword);
        
        var homePage = $('#homePage');
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
        
        
        var reportingNearbyPage = $('#reportingNearbyPage');
        reportingNearbyPage.on('pageinit', self.initReportingNearbyPage);
        reportingNearbyPage.on('pageshow', self.showReportingNearbyPage);
        
        
        var newsPage = $('#newsPage');
        newsPage.on('pageinit', self.initNewsPage);
        newsPage.on('pageshow', self.showNewsPage);
       // newsPage.on('pagebeforehide', self.beforeHideNewsPage);
        //$('#subscribedChannels', newsPage).on('change', self.retrieveChannelContent);
        //$('#refreshNewsButton', newsPage).on('click', function() {
        //    $.mobile.loading('show');
        //    self.retrieveChannelContent(true);
        //});
        //$('#moreNewsButton', newsPage).on('click', self.retrieveMoreChannelContent);
        //$('#newContentReceivedButton', newsPage).on('click', self.showNewChannelContentReceived);
        //var newsDetailPage = $('#newsDetailPage');
        //newsDetailPage.on('pagebeforeshow', self.initNewsDetailPage);

        
        
        
        
        
        
        
        
        
        
        
        
        var profilePage = $('#profilePage');
        profilePage.on('pageshow', self.showProfilePage);
        $('#logoutButton', profilePage).on('click', self.logout);
        var profileNamePage = $('#profileNamePage');
        profileNamePage.on('pageinit', self.intiProfileNamePage);
        profileNamePage.on('pageshow', self.showProfileNamePage);
        var profileCityPage = $('#profileCityPage');
        profileCityPage.on('pageinit', self.initProfileCityPage);
        profileCityPage.on('pageshow', self.showProfileCityPage);
        var profileAddressPage = $('#profileAddressPage');
        profileAddressPage.on('pagebeforeshow', self.showProfileAddressPage);
        $('#saveProfileAddressButton', profileAddressPage).on('click', self.updateProfileAddress);
        var profileChannelsPage = $('#profileChannelsPage');
        profileChannelsPage.on('pageinit', self.initProfileChannelPage);
        profileChannelsPage.on('pagebeforeshow', self.showProfileChannelsPage);
        profileChannelsPage.on('pagebeforehide', self.beforeHideProfileChannelsPage);
        var channelSubscriptionPage = $('#channelSubscriptionPage');
        channelSubscriptionPage.on('pagebeforeshow', self.initChannelSubscriptionPageBeforeShow);
        channelSubscriptionPage.on('pageshow', self.initChannelSubscriptionPage);
        $('#city', channelSubscriptionPage).change(self.subscriptionCityChanged);
        //$('#cityNameManual', channelSubscriptionPage).on('keyup', self.cityNameManualChanged);
        $('#cityNameManual', channelSubscriptionPage).on('input', self.cityNameManualChanged);
        $('#profileFollowingPage').on('pagebeforeshow', self.beforeShowProfileFollowingPage);
        var newsChannelsPage = $('#newsChannelsPage');
        newsChannelsPage.on('pagebeforeshow', self.beforeShowNewsChannelsPage);
        
        var followingListPage = $('#followingListPage');
        followingListPage.on('pageinit', self.initFollowingListPage);
        followingListPage.on('pageshow', self.showFollowingListPage);
        $('#getInfoButton', followingListPage).on('click', self.getInfoFromQrCode);
        $('#qrCodeInfoPositionPage').on('pageshow', self.showQrCodeInfoPositionPage);
        $('#qrCodeInfoNewsPage').on('pagebeforeshow', self.beforeShowQrCodeInfoNewsPage);
        $('#qrCodeInfoCommentsPage').on('pagebeforeshow', self.beforeShowQrCodeInfoCommentsPage);
        $('#qrCodeInfoMultimediaPage').on('pagebeforeshow', self.beforeShowQrCodeInfoMultimediaPage);
        $('#qrCodeInfoLinksPage').on('pagebeforeshow', self.beforeShowQrCodeInfoLinksPage);
        var registerPage = $('#registrationPage');
        registerPage.on('pageinit', self.initRegisterPage);
        $('#registerButton', registerPage).on('click', self.register);
        var infoPage = $('#qrCodeInfoPage');
        $('#getInfoButton', infoPage).on('click', self.getInfoFromQrCode);
        var reportingListPage = $('#reportingListPage');
        reportingListPage.on('pageshow', self.loadReportingItems);
        $('#refreshReportingListButton', reportingListPage).on('click', self.loadReportingItems);
        //$('#loadMoreReportingItemsButton', reportingListPage).on('click', self.loadReportingItems);
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
        
        self.updateBalloonsInNavbar();        
    },
    onResume: function() {
        
        if(config.EMULATE_ON_BROWSER) return;
        
        // TODO
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
        //$('[data-role="header"],[data-role="footer"]').fixedtoolbar({ tapToggle:false });
        services.checkSession(function(result) {
// TODO TODO TODO
return;
            console.log('onDeviceReady: session check ' + result);
            if(result) {
                services.getProfile(null, function(result) {
                    self.userProfile = result;
                });
            }
            window.location.hash = (result ? 'newsPage' : 'loginPage');
            $.mobile.initializePage();
        });
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },
    
    ////////////////////////////
    // Common functions
    fillCityList: function(val, listEl, targetElId) {
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
                html += '<li><a href="javascript:self.setCity(\'' + targetElId + '\', \'' + row.nome.trim().replace(/'/g, "\\'") 
                        + '\', '+row.id+', \'' + listEl.attr('id') + '\')">' + row.nome.trim() + ', ' + row.sigla.trim() + '</a></li>';
            }
            listEl.html(html).listview("refresh");
        });
    },
    setCity: function(targetElId, name, id, listElId) {
        $('#' + targetElId, $.mobile.activePage).val(name).data('cityid',id).data('cityname', name);
        $('#' + listElId, $.mobile.activePage).empty();
    },
    
    updateBalloonsInNavbar: function() {
        var cfg = [
            //{type: PushNotificationMessage.PUSH_NOTIFICATION_TYPE_CHANNEL, elementId: 'newsCount', className: 'ui-li-count-news'},
            {type: PushNotificationMessage.PUSH_NOTIFICATION_TYPE_REPORTING, elementId: 'reportingCount', className: 'ui-li-count-reporting'},
            {type: PushNotificationMessage.PUSH_NOTIFICATION_TYPE_FOLLOWING, elementId: 'followingCount', className: 'ui-li-count-following'}
        ];
        for(var i in cfg) {
            var unreadCount = pushNotificationHelper.getUnread(cfg[i].type);
            //var el = $('#'+cfg[i].elementId, $.mobile.activePage); //, page);
            
            if(cfg[i].type == PushNotificationMessage.PUSH_NOTIFICATION_TYPE_REPORTING) {
                if(unreadCount > 0) {
                    $('#reportingMethodPage #reportingCount').html(unreadCount).show();
                } else {
                    $('#reportingMethodPage #reportingCount').html(unreadCount).hide();
                }
            }
            
            var el = $('.'+cfg[i].className); //, page);
            if(el.length == 0) continue;
            el.html(unreadCount);
            if(unreadCount > 0) {
                el.show();
            } else {
                el.hide();
            }
        }
    },
    updateBalloonsInNews: function(openSideBar) {
        // Display a balloon for each feed that contains updates
        var listEl = $('#newsChannelsPanel #channelList');
        $('li a span.ui-li-count', listEl).hide();
        var unreadData = pushNotificationHelper.getUnread(PushNotificationMessage.PUSH_NOTIFICATION_TYPE_CHANNEL, null, true);
        for(var i in unreadData) {
            if(unreadData[i] == 0) continue;
            $('li a #count_' + i, listEl).html(unreadData[i]).show();
        }
        if(openSideBar || false) {
            $('#newsChannelsPage').panel('open');
        }
    },
    updateBalloonsInNewsContent: function() {
        // Don't display the balloon on top of the feed,
        // but uses the old feed update system and display 
        // a button on the top of the page to add new posts.
        self.retrieveChannelContent(true);
    },
    updateBalloonsInReporting: function() {
        // Display a balloon for each item that contains updates
        // TODO
    },
    updateBalloonsInFollowing: function() {
        var listEl = $('#followingListPage #followingList');
        $('li a span.ui-li-count', listEl).hide();
        var unreadData = pushNotificationHelper.getUnread(PushNotificationMessage.PUSH_NOTIFICATION_TYPE_FOLLOWING, null, true);
        for(var i in unreadData) {
            if(unreadData[i] == 0) continue;
            $('li a #count_' + i, listEl).html(unreadData[i]).show();
        }
    },
    
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
            if(self.pageId != null) {
                $.mobile.navigate.history.stack.splice($.mobile.navigate.history.stack.length - 1);
                $.mobile.changePage('#' + self.pageId);
                self.pageId = null;
            } else {
                $.mobile.navigate.history.stack.splice($.mobile.navigate.history.stack.length - 1);
                $.mobile.changePage('#homePage');
            }
        }, function(e) {
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
        $('#city', page).on('input', function() {
            var val = $(this).val();
            if($(this).data('cityname') != val) {
                $(this).data('cityid', '');
            }
            if(val.length >= 4) {
                self.fillCityList(val, $('#citySuggestion', page), 'city');
            }
        });
    },
    
    register: function() {
        var page = $('#registrationPage');
        var params = {};
        // Validation
        var hasErrors = false;
        var fields = ['city', 'lastname', 'firstname', 'email', 'phone', 'address'];
        for(var i in fields) {
            var fieldId = fields[i];
            var required = null;
            var fieldVal = null;
            if(fieldId == 'city') {
                required = true;
                fieldVal = $('#' + fieldId, page).data('cityid') || '';
            } else {
                required = $('#' + fieldId + '[required]', page).length == 1;
                fieldVal = $('#' + fieldId, page).val().trim();
            }
            if(required && (fieldVal == '')) {
                $('#' + fieldId, page).addClass('input-error');
                hasErrors = true;
            } else {
                $('#' + fieldId, page).removeClass('input-error');
            }
            eval('params.'+fieldId+'="'+fieldVal+'"');
        }

        if(hasErrors) {
            helper.alert('Alcuni campi non sono stati compilati', function() {
                $.mobile.silentScroll();
            }, 'Registrazione');
            return;
        }

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
            helper.alert('La registrazione è stata completata con successo.\n' +
                         'A breve riceverai nella tua casella di posta la password per accedere al sistema', function() {
                $.mobile.changePage('index.html', {transition: 'slide', reverse: true});
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
                        helper.alert('Si sono verificati errori durante la richiesta di una nuova password.\nTi preghiamo di contattarci all\'indirizzo di posta elettronica supporto@gretacity.com.', function() {
                            self.lockLoginUi(false);
                        }, 'Recupera password');
                    });
                }
            }, 'Recupera password', ['Procedi', 'Annulla']);
        }
    },   
   
    beforeShowChangePasswordPage: function() {
        //$('#oldPassword').val('');
        $('#newPassword').val('');
        $('#passwordConfirm').val('');
    },
    
    changePassword: function() {
        //var oldPassword = $('#oldPassword').val();
        var newPassword = $('#newPassword').val();
        var passwordConfirm = $('#passwordConfirm').val();

        /*if(oldPassword == '') {
            helper.alert('Inserisci la vecchia password', function() {
                $('#oldPassword').focus();
            }, 'Cambia password');
        } else */
        if(newPassword == '') {
            helper.alert('Inserisci la nuova password', function() {
                $('#newPassword').focus();
            }, 'Nuova password');
        } else if(newPassword != passwordConfirm) {
            helper.alert('La nuova password e la sua conferma non coincidono', function() {
                $('#newPassword').focus().select();
            }, 'Cambia password');
        } else if(newPassword.length < config.PASSWORD_MIN_LENGTH) {
            helper.alert('La nuova password deve essere lunga almeno ' + config.PASSWORD_MIN_LENGTH + ' caratteri', function() {
                $('#newPassword').focus().select();
            }, 'Cambia password');
        } else {
            $.mobile.loading('show');
            services.changePassword({/*oldPassword: oldPassword,*/ newPassword: newPassword}, function() {
                $.mobile.loading('hide');
                helper.alert('La password è stata modificata', null, 'Recupera password');
            }, function() {
                $.mobile.loading('hide');
                helper.alert('Si sono verificati errori durante la richiesta di modifica password.\nTi preghiamo di contattarci all\'indirizzo di posta elettronica supporto@gretacity.com.', null, 'Recupera password');
            });
        }
    },
    
    
    ////////////////////////////////////////
    // homePage
    showHomePage: function() {
        self.reportingListData = null;
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
                    helper.alert('Il QrCode letto non è valido', null, 'Segnalazione con QrCode');
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
                    $('#reporting1Popup').popup('close');
                    self.reportingGeoCoordinatesAcquired(pos);
                }, function(e) {
                    $('#reporting1Popup').popup('close');
                    $('.info', $.mobile.activePage).html('Non è stato possibile recuperare la tua posizione e quindi è necessario inserirla manualmente.');                
                }, {enableHighAccuracy: false});
            });
        }
    },
    reportingGeoCoordinatesAcquired: function(pos) {
        self.reporting.latLng.lat = pos.coords.latitude;
        self.reporting.latLng.lng = pos.coords.longitude;
        geoLocation.reverseGeocoding(self.reporting.latLng, function(result) {
            $('#address', $.mobile.activePage).val(result.road + " " + result.streetNumber);
            $('#city', $.mobile.activePage).val(result.city);
            $('#prov', $.mobile.activePage).val(result.prov);
        });
        $('.info', $.mobile.activePage).html(
            'La tua posizione è stata acquisita avanti per confermare.'
        );
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
                console.log(pos);
                self.reporting.latLng.lat = pos.lat();
                self.reporting.latLng.lng = pos.lng();
                console.log(self.reporting);
                $.mobile.changePage('#reporting2Page', {transition: 'slide'});
            });
        } else {
            $.mobile.changePage('#reporting2Page', {transition: 'slide'});
        }
    },
    
    
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
        self.reportingPage2SetMarkerOnMap();
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

        self._reporting2Map.panTo(markerPoint);
        self._reporting2Map.setCenter(markerPoint, config.GOOGLE_MAPS_ZOOM);
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
        services.getReportingCategories(function(res) {
            var html = '';
            for(var i in res) {
                var row = res[i];
                html += '<li data-categoryid="'+row.id+'"><a href="javascript:app.selectReportingCategory('+row.id+')">'+row.nome+'</a></li>';
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
    showReporting4Page: function() {
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
        self.reporting.private = $('#private', $.mobile.activePage).is(':checked');
        $.mobile.changePage('#reporting6Page', {transition: 'slide'});
    },
    
    
    ////////////////////////////////////////
    // reporting6Page
    initReporting6Page: function() {
        $('#reporting6Page #shotPhoto').on('click', self.getReportingPhoto);
        $('#reporting6Page #fromGallery').on('click', self.getReportingPhoto);
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
        var remainingPhoto = $('#photoSet div a img.reporting-photo-missing', $.mobile.activePage).length;
        if(remainingPhoto == 0) {
            helper.alert('Hai raggiunto il limite massimo di foto che puoi inviare');
            return;
        }
        var source = $(e.target).attr('id') == 'shotPhoto' ? 
                Camera.PictureSourceType.CAMERA :
                Camera.PictureSourceType.PHOTOLIBRARY;
        camera.getPicture(function(res) {
            // Success callback
            var photo = $($('#photoSet div[data-photopos="' + self.reportingCurrPhotoPos + '"] a img.reporting-photo-missing', $.mobile.activePage)[0]);
            photo.attr('src', 'data:image/jpeg;base64,' + res).removeClass('reporting-photo-missing');
            photo.parent().next().show();
            $('#sourceTypePopup', $.mobile.activePage).popup('close');
            $('#photoSet2 div[data-photopos="' + self.reportingCurrPhotoPos + '"] a').show();
            helper.imageCropToFit(photo);
        }, function(e) {
            //helper.alert('Si è verificato un problema', null, 'Acquisizione foto');
        }, {sourceType: source});
    },
    removeReportingPhoto: function(par) {
        var container = null;
        var pos = null;
        if(par.target) {
            container = $(par.target).closest('div.reporting-photo-item');
            pos = container.data('photopos');
        } else {
            pos = par;
        }
        $('#photoSet div.reporting-photo-item[data-photopos="'+pos+'"] a img').attr('src', '').css({'margin-left': '', 'margin-top': '', 'height': '', 'width': ''}).addClass('reporting-photo-missing');
        $('a.reporting-photo-delete', container).hide();
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
        console.log(self.reporting);
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
    reportingListViewTypeList: 0,
    reportingListViewTypeMap: 1,
    reportingListMap: null,
    toggleReportingListView: function() {
        if(self.reportingListCurrentView == self.reportingListViewTypeMap) {
            $('#reportingListPage #reportingListView').show();
            $('#reportingListPage #mapView').hide();
            $('#reportingListPage #changeViewType').html('VEDI SU MAPPA');
            self.reportingListCurrentView = self.reportingListViewTypeList;
        } else {
            $('#reportingListPage #reportingListView').hide();
            $('#reportingListPage #mapView').show();
            $('#reportingListPage #changeViewType').html('VEDI ELENCO');
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
                self.reportingListRenderMap();
                $.mobile.loading('hide');
            });
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
            streetViewControl: true
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
                var content = '<img src="" style="margin-right:1em;width:100%;margin-bottom:1em;height:7em;background:url(\'' + payload.foto + '\') center center no-repeat;background-size: cover;display:block;" />' +
                        '<div style="padding: 0 0 0 0;overflow:hidden;">' +
                        '<div>data e ora: <strong>' + payload.data_inserimento + '</strong></div>' +
                        '<div>luogo: <strong>' + payload.indirizzo + '</strong></div>' +
                        '<div style="width:100%;text-overflow: ellipsis;overflow:hidden;">descrizione: <strong>' + payload.descrizione_problema + '</strong></div>' +
                        '<div>stato: <strong>' + payload.stato + '</strong></div>' +
                        '</div>' +
                        '<a href="javascript:app.reportListShowDetail(\'' + payload.id + '\')" class="ui-btn">DETTAGLI</a>' +
                        '<a href="javascript:$(\'#reportingListPopup\').popup(\'close\')" class="ui-btn">CHIUDI</a>';
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
                //console.log(row);
//TODO onclick="self.reportingListPageViewPhoto(this)"
                html += '<li data-icon="false"><a href="javascript:app.reportListShowDetail(\'' + row.id + '\')"><div style="padding: 0 0 0 0;overflow:hidden;">' +
                        '<img src="" style="margin-right:1em;width:5em;height:5em;background:url(\'' + row.foto + '\') center center no-repeat;background-size: cover;display:block;float:left;" />' +
                        '<div>data e ora: <strong>' + row.data_inserimento + '</strong></div>' +
                        '<div>luogo: <strong>' + row.indirizzo + '</strong></div>' +
                        '<div style="width:70%;text-overflow: ellipsis;overflow:hidden;">descrizione: <strong>' + row.descrizione_problema + '</strong></div>' +
                        '<div>stato: <strong>' + row.stato + '</strong></div>' +
                        '</div></a></li>';
            }
        }
        list.html(html);
        list.listview('refresh');
        $.mobile.loading('hide');
        $.mobile.silentScroll();
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
        if(row) {
            var page = $('#reportingListDetailPage');
            $('#city', page).val(row.comune);
            $('#prov', page).val(row.sigla);
            $('#address', page).val(row.indirizzo);
            $('#category', page).val(row.nome_categoria);
            $('#description', page).val(row.descrizione_problema);
            $('#status', page).val(row.stato);
            switch(parseInt(row.priorita)) {
                case 0:
                    $('#priority', page).html('BASSA GRAVIT&Agrave;').css({'background-color': '#0F0', 'color': '#222'});
                    break;
                case 1:
                    $('#priority', page).html('MEDIA GRAVIT&Agrave;').css({'background-color': '#FAF200', 'color': '#222'});
                    break;
                case 2:
                    $('#priority', page).html('ALTA GRAVIT&Agrave;').css({'background-color': '#F00', 'color': '#FFF'});
                    break;
            }
            var photoUrl = (row.foto != '' ? row.foto : 'img/camera.png');
            $('#photot1', page).css('background-image', 'url(\'' + photoUrl + '\')');
            //$('#photot2', page);
            //$('#photot3', page);
            var html = '';
            for(var i in row.log) {
                html += '<li style="white-space:normal;">' + row.log[i] + '</li>';
            }
            $('#log', page).html(html).listview().listview('refresh');
            $.mobile.changePage('#reportingListDetailPage', {transition: 'slide'});
        }
    },
    
    
    ////////////////////////////////////////
    // reportingListDetailPage
    
    
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
            }, {enableHighAccuracy: false});
        });
    },
    
    ////////////////////////////////////////
    // newsPage
    initNewsSidePanel: function() {
        console.log('initializing side bar');
        services.getSubscribedChannels(function(result) {
            var html = '<li data-role="list-divider" style="background-color:rgb(89, 196, 248)">Canali notizie</li>' +
                       '<li data-channelid="0"><a href="javascript:self.showNewsChannel(\'0\')"><span></span>Tutte</a></li>';
            for(var i in result) {
                var row = result[i];
                html += '<li data-channelid="' + row.id_feed + '"><a href="javascript:app.loadNewsChannel(' + row.id_feed + ')"><span>' 
                            + row.denominazione + '</span><label>' + row.nome_feed
                            + '</label>'
                            + '<span id="count_' + row.id_feed + '" class="ui-li-count ui-li-count-cust" style="display:none;"></span>'
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
            //$('#newsChannelsPanel').panel();
            self.updateBalloonsInNews();
            
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
        $('#newsPage #channelsButton').on('click', function() {
            $('#newsPage #newsChannelsPanel').panel('open');
        });
        $('#newsPage #refreshButton').on('click', function() {alert('refresh');});
    },
    showNewsPage: function() {

        self.initNewsSidePanel();

        self.loadNewsChannel();
        
        /*var onlyNew = !self.newsEmptyBeforeShow;
        if(self.newsEmptyBeforeShow === true) {
            $('#newsPage #channelContent').empty();
        } else {
            self.newsEmptyBeforeShow = true;
        }
        
        console.log('beforeShowNewsPage: onlyNew is ' + onlyNew);
        
        $.mobile.loading('show');
        self.retrieveChannelContent(onlyNew);
        pushNotificationHelper.setAsRead(PushNotificationMessage.PUSH_NOTIFICATION_TYPE_CHANNEL, self.newsChannelId);
        self.updateBalloonsInNews();*/
    },
    formatChannelContentItem: function(item) {
        var rowId = parseInt(item.id);
        //var dateAddedTmp = Date.parseFromYMDHMS(item.data_inserimento);
        //var dateAdded dateAddedTmp.toDMY() + ' alle ' + dateAddedTmp.toHM()
        var dateAdded = item.data;
        var image = (item.foto || '');

        var href = (item.link == '') ? 
                'javascript:self.showNewsDetail(' + item.id + ')' : 
                'javascript:app.openLink(\'' + encodeURIComponent(item.link) + '\', \'_blank\', \'location=yes,closebuttoncaption=Indietro,enableViewportScale=yes\');';
        html  = '<li data-icon="false"><a href="' + href + '" style="background-color:#FFF;white-space:normal;">';
        if(image != '') {
            html += '<div class="news-list-image adjust-image" style="background-image:url(\'' + image + '\');"></div>';
        }

        html += '<div>' + item.oggetto + '</div>' +
                //'<p style="white-space:normal;">' + item.descrizione + '</p>' +
                '<p class="news-list-note">Inserita il ' + dateAdded + '</p>' +
                '</a></li>';

        return html;
    },
    loadNewsChannel: function(channelId, onlyNew) {
        $('#newsPage #newsChannelsPanel').panel('close');
        
        self.newsChannelId = channelId;
        self.newsContentLastId = null;
        self.newsContentLastDate = null;
        self.newsContentFirstId = null;
        self.newsContentFirstDate = null;
        
        onlyNew = onlyNew || false;
        
        if(!onlyNew) {
            $.mobile.loading('show');
        }
        
        var params = {
            channelId: self.newsChannelId, 
            lastId: self.newsContentLastId,
            lastDate: self.newsContentLastDate,
            firstId: self.newsContentFirstId,
            firstDate: self.newsContentFirstDate,
            onlyNew: onlyNew
        };
        
        console.log('retrieveChannelContent: getting channel content, params: ', params);
        
        services.getChannelContent(params, function(result) {
            
            var html = '';
            if(typeof(result.vecchie) != 'undefined') {
                if(result.vecchie.length > 0) {
                    for(var i in result.vecchie) {
                        html += self.formatChannelContentItem(result.vecchie[i]);
                        
                        var lastRec = result.vecchie[result.vecchie.length-1];
                        self.newsContentLastDate = lastRec.data_inserimento;
                        self.newsContentLastId = lastRec.id;
                        
                        if(self.newsContentFirstDate == null) {
                            var firstRec = result.vecchie[0];
                            self.newsContentFirstDate = firstRec.data_inserimento;
                            self.newsContentFirstId = firstRec.id;
                        }
                    }
                }
                if(result.vecchie.length == 0) {
                    $('#moreNewsButton').addClass('ui-disabled');
                } else {
                    $('#moreNewsButton').removeClass('ui-disabled'); 
                }
            }
            
            if(self.newsChannelId != params.channelId) {
                self.newsChannelId = params.channelId;
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
            
            
            // Adjust image size
            /*
            $(function() {
                $('#newsPage #channelContent li a div.news-list-image.adjust-image').each(function() {
                    var div = $(this);
                    div.removeClass('adjust-image');
                    var imageUrl = div.css('background-image').match(/^url\("?(.+?)"?\)$/);
                    if(imageUrl[1]) {
                        var img = new Image();
                        $(img).load(function() {
                            //console.log(img.width + 'x' + img.height);
                            if(img.width > img.height) {
                                div.css('background-size: auto 100% !important');
                            } else {
                                div.css('background-size: 100% auto !important');
                            }
                        });
                        img.src = imageUrl[1];
                    }
                });
            });*/

            if((typeof(result.nuove) != 'undefined') && (Array.isArray(result.nuove)) && (result.nuove.length > 0)) {
                self.newChannelContentReceived = result.nuove;

                var firstRec = result.nuove[0];
                self.newsContentFirstDate = firstRec.data_inserimento;
                self.newsContentFirstId = firstRec.id;
                
                $('#newContentReceivedButton').html(
                    self.newChannelContentReceived.length + (self.newChannelContentReceived.length > 1 ? ' nuove' : ' nuova')
                ).show('fast');
            }
                        
            $.mobile.loading('hide');
        }, function(e, loginRequired) {
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
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    userProfile: null,
    showProfilePage: function() {
        if(self.userProfile != null) {
            self.fillProfilePage();
            return;
        }
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
            helper.alert(e, null, 'An Error Occurred')
        });
    },
    fillProfilePage: function() {
        var page = $('#profilePage');
        $('#profileFirstname', page).html(self.userProfile.firstname);
        $('#profileLastname', page).html(self.userProfile.lastname);
        $('#profileEmail', page).html(self.userProfile.email);
        $('#profileCity', page).html((self.userProfile.city.name || '') == '' ? 
                                     'Comune non specificato' : 
                                     self.userProfile.city.name);
        $('#profileAddress', page).html(self.userProfile.address || '');
    },
    
    
    
    intiProfileNamePage: function() {
        $('#profileNamePage #saveProfileNameButton').on('click', self.updateProfileName);
    },
    showProfileNamePage: function() {
        if(self.userProfile == null) {
            $.mobile.changePage('#profilePage');
            return;
        }
        // Get last name, first name and email address from user profile
        var page = $('#profileNamePage');
        $('#firstname', page).val(self.userProfile.firstname);
        $('#lastname', page).val(self.userProfile.lastname);
        $('#email', page).val(self.userProfile.email);
    },
    updateProfileName: function() {
        var page = $('#profileNamePage');
        // Validate data
        var firstname = $('#firstname', page).val().trim();
        var lastname = $('#lastname', page).val().trim();
        var email = $('#email', page).val().trim();
        var errors = [];
        if(firstname == '') errors.push('il nome');
        if(lastname == '') errors.push('il cognome');
        if(email == '') errors.push('l\'email');
        if(errors.length > 0) {
            var message = 'Inserisci ' + errors.join(', ');
            helper.alert(message, null, 'Aggiorna profilo');
            return;
        }
        if(!helper.isEmailValid(email)) {
            helper.alert('L\'email inserita non è corretta', function() {
                $('#email', page).focus();
            }, 'Aggiorna profilo');
            return;
        }
        // Update user profile
        self.userProfile.firstname = firstname;
        self.userProfile.lastname = lastname;
        self.userProfile.email = email;
        services.updateProfile({profile: self.userProfile}, function() {
            // and navigate back
            $.mobile.back();
            //$.mobile.changePage('#profilePage');
        }, function(e, loginRequired) {
            if(loginRequired) {
                $.mobile.changePage('#loginPage');
                return;
            }
            helper.alert('Si è verificato un errore durante il salvataggio', null, 'Il tuo profilo');
        });
    },
    
    initProfileCityPage: function() {
        $('#profileCityPage #cityName').on('input', self.profileCityNameChanged);
    },
    showProfileCityPage: function() {
        if(self.userProfile == null) {
            $.mobile.changePage('#profilePage');
            return;
        }
        var page = $('#profileCityPage');
        $('#cityName', page).val(
            (self.userProfile ? (self.userProfile.city.name || '').trim() : '')
        );
        $('#citySuggestions', page).empty();
    },
    
    
    profileCityNameChanged: function() {
        var val = $(this).val();
        if(val.length >= 4) {
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
                    html += '<li><a href="javascript:self.setProfileCity(\'' + row.nome.trim().replace(/'/g, "\\'") + '\', '+row.id+')">' + row.nome.trim() + ', ' + row.sigla.trim() + '</a></li>';
                }
                $('#profileCityPage #citySuggestions').html(html).listview("refresh");
            });
        }
    },
    setProfileCity: function(cityName, cityId) {
        self.userProfile.city.id = cityId;
        self.userProfile.city.name = cityName;
        services.updateProfile({profile: self.userProfile}, function() {
            services.invalidateSubscribedChannels();
            self.initSidePanel();
            // and navigate back
            $.mobile.back();
        }, function(e, loginRequired) {
            if(loginRequired) {
                $.mobile.changePage('#loginPage');
                return;
            }
            helper.alert('Si è verificato un errore durante il salvataggio', null, 'Il tuo profilo');
        });
    },
    
    
    showProfileAddressPage: function() {
        if(self.userProfile == null) {
            $.mobile.changePage('#profilePage');
            return;
        }
        var page = $('#profileAddressPage');
        $('#address', page).val(
            (self.userProfile ? (self.userProfile.address || '').trim() : '')
        );
    },
    
    
    updateProfileAddress: function() {
        var page = $('#profileAddressPage');
        self.userProfile.address = $('#address', page).val().trim();
        services.updateProfile({profile: self.userProfile}, function() {
            // and navigate back
            $.mobile.back();
        }, function(e, loginRequired) {
            if(loginRequired) {
                $.mobile.changePage('#loginPage');
                return;
            }
            helper.alert('Si è verificato un errore durante il salvataggio', null, 'Il tuo profilo');
        });
    },
    
    
    initProfileChannelsPage: function() {
    },
    
    
    showProfileChannelsPage: function() {
        services.getSubscribedChannels(function(result) {
            var page = $('#profileChannelsPage');
            var html = '';
            for(var i in result) {
                var channelId = result[i].id_feed;
                var channelName = result[i].nome_feed;
                var channelOwner = result[i].denominazione;
                /*html += '<li style="margin:0;padding:0">'+
                            '<input type="checkbox" id="channel' + channelId + '" data-id="' + channelId + '" checked data-removable="' + result[i].remove + '" />'+
                            '<label for="channel' + channelId + '">' + channelName + 
                            '<br /><small>' + channelOwner + '</small></label>'+
                        '</li>';*/
                html += '<input type="checkbox" id="channel' + channelId + '" data-id="' + channelId + '" checked data-removable="' + result[i].remove + '" />'+
                        '<label for="channel' + channelId + '">' + channelName + 
                        '<br /><small>' + channelOwner + '</small></label>';
            }
            $('#subscribedChannels', page).html(html).trigger('create');//.listview('refresh');
            $('#subscribedChannels input[type="checkbox"]', page).checkboxradio().on('click', function(e) {
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
            if(loginRequired) {
                $.mobile.changePage('#loginPage');
                return;
            }
            helper.alert('Si è verificato un errore durante il caricamento', null, 'I tuoi canali');
        });
    },
    
    beforeHideProfileChannelsPage: function(e, data) {
        if(data.nextPage.attr('id') == 'profilePage') {
            self.initSidePanel();
        }
    },
    
    
    initChannelSubscriptionPageBeforeShow: function() {
        //$('#channelSubscriptionPage #city').parents('div.ui-select').addClass('ui-screen-hidden');
        $('#automaticSelectionPanel').hide();
        $('#manualSelectionPanel').hide();    
    },
    initChannelSubscriptionPage: function() {
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
        });
    },
    setNearbyLocations: function(result) {
        var page = $('#channelSubscriptionPage');
        var html = '';
        if(result != null) {
            html += '<optgroup label="seleziona">';
            for(var i in result) {
                var l = result[i];
                html += '<option data-regid="' + l.id_regione + '" data-provid="' + l.id_provincia + '" data-cityid="' + l.id + '">' + l.nome + '</option>';
            }
            html += '<option value="manual">RICERCA AVANZATA</option>';
            html += '</optgroup>';
            $('#city', page).html(html);
            //$('#city', page).parents('div.ui-select').removeClass('ui-screen-hidden');
            //$('#city', page).selectmenu('refresh');
            
            self.showManualCitySearch(false);
            
        } else {
            //$('#city', page).parents('div.ui-select').addClass('ui-screen-hidden');
            self.showManualCitySearch(true);
        }
        $.mobile.loading('hide');
    },
    subscriptionCityChanged: function() {
        var page = $('#channelSubscriptionPage');
        if($(this).val() == 'manual') {
            self.showManualCitySearch(true);
        } else {
            $('#manualSelectionPanel', page).hide('fast');
            //self.getAvailableChannels($(this).val());
            var selectedItem = $('#channelSubscriptionPage #city option:selected');
            var cityName = selectedItem.html().trim();
            var cityId = selectedItem.attr('data-cityid');
            var provId = selectedItem.attr('data-provid');
            var regionId = selectedItem.attr('data-regid');
            self.getAvailableChannels(cityName, cityId, provId, regionId);
        }
    },
    showManualCitySearch: function(show) {
        var page = $('#channelSubscriptionPage');
        if(show === true) {
            $('#automaticSelectionPanel').hide();
            $('#manualSelectionPanel', page).show('fast', function() {
                $('#manualSelectionPanel #cityNameManual', page).focus();
            });
        } else {
            $('#automaticSelectionPanel').show();
            $('#manualSelectionPanel', page).hide();
        }
    },
    cityNameManualChanged: function() {
        var val = $(this).val();
        if(val.length >= 4) {
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
                    html += '<li><a href="javascript:self.getAvailableChannels(\'' + row.nome.trim().replace(/'/g, "\\'") + '\', '+row.id+',' + row.id_provincia + ', ' + row.id_regione + ')">' + row.nome.trim() + ', ' + row.sigla.trim() + '</a></li>';
                }
                $('#channelSubscriptionPage #citySuggestions').html(html).listview("refresh");
//console.dir(result);
            });
        }
    },
    getAvailableChannels: function(cityName, cityId, provId, regionId) {
        $.mobile.loading('show');
        $('#channelSubscriptionPage #availableChannelsContainer').show();
        $('#channelSubscriptionPage #availableChannelList').empty();
        services.getAvailableChannels({cityId: cityId, provId: provId, regionId: regionId}, function(result) {
            var html = '';
            if(result.length == 0) {
                html = '<label style="white-space:normal;">Sei stato associato al comune di ' + cityName 
                       + '.<br />Attualmente non ci sono canali disponibili, ma ti invieremo delle notifiche quando ce ne saranno.</label>';
                $('#channelSubscriptionPage #availableChannelList').html(html);
            } else {
                for(var i in result) {
                    var channelId = result[i].id;
                    var channelName = result[i].nome;
                    var subscribed = result[i].sottoscritto == '1';
                    html += '<input type="checkbox" id="channel' + channelId + '" data-channelid="' + channelId + '" ' + 
                            'data-channelname="' + channelName + '"' + (subscribed ? ' checked' : '') + '/>' +
                            '<label for="channel' + channelId + '">' + channelName + '</label>';
                }
                $('#channelSubscriptionPage #availableChannelList').html(html);
                $('#channelSubscriptionPage #availableChannelList input[type="checkbox"]').checkboxradio().on('click', self.subscribeToChannel);
            }
            $.mobile.silentScroll($('#channelSubscriptionPage #availableChannelsContainer').offset().top);
            $.mobile.loading('hide');
        }, function(e) {
            $.mobile.loading('hide');
        });
    },
    subscribeToChannel: function() {
        $.mobile.loading('show');
        var channelId = $(this).attr('data-channelid');
        var channelName = $(this).attr('data-channelname');
        var subscribe = $(this).is(':checked');
        services.subscribeToChannel({channelId: channelId, subscribe: subscribe}, function() {
            // Update the subscribedChannels element in newsPage
            /*
            var channelsElements = $('#newsPage #subscribedChannels');
            if(subscribe) {
                //var selectedValue = channelsElements.val();
                channelsElements.append('<option value="' + channelId + '" >' + channelName + '</option>');
            } else {
                $('option[value="' + channelId + '"]', channelsElements).remove();
            }*/
            $.mobile.loading('hide');
        }, function(e, loginRequired) {
            if(subscribe) {
                // Remove the check mark
                $(this).removeAttr('checked').checkboxradio("refresh");
            } else {
                // Reset the check mark
                $(this).prop('checked', true).checkboxradio("refresh");
            }
            $.mobile.loading('hide');
        });
    },
    
    beforeShowProfileFollowingPage: function() {
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
            $('#profileFollowingPage #followingList').html(html).trigger('create');//.listview('refresh');
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
    
    
    //NEWS_UPDATE_CONTENT: 20000, // 20000 is 20 secs
    newsEmptyBeforeShow: true,
    newsChannelId: 0,
    newsContentLastId: null, newsContentLastDate: null,
    newsContentFirstId: null, newsContentFirstDate: null,
    newChannelContentReceived: [],
    //newsContentTimeout: null,
    sideBarInitialized: false,
    
    _initNewsPage: function() {
        if(!self.sideBarInitialized) {
            self.initSidePanel();
        }        
        var page = $('#newsPage');
        $('#channelContent', page).empty();
    },
    _beforeShowNewsPage: function() {

        var onlyNew = !self.newsEmptyBeforeShow;
        if(self.newsEmptyBeforeShow === true) {
            $('#newsPage #channelContent').empty();
        } else {
            self.newsEmptyBeforeShow = true;
        }
        
        console.log('beforeShowNewsPage: onlyNew is ' + onlyNew);
        
        $.mobile.loading('show');
        self.retrieveChannelContent(onlyNew);
        pushNotificationHelper.setAsRead(PushNotificationMessage.PUSH_NOTIFICATION_TYPE_CHANNEL, self.newsChannelId);
        self.updateBalloonsInNews();        
    },
    _beforeHideNewsPage: function() {
    },
    
    retrieveMoreChannelContent: function() {
        self.retrieveChannelContent(false);
    },
    showNewChannelContentReceived: function() {
        $('#newContentReceivedButton').hide();
        // Insert new rows in the top
        var html = '';
        for(var i in self.newChannelContentReceived) {
            html += self.formatChannelContentItem(self.newChannelContentReceived[i]);
        }
        var channelContent = $('#newsPage #channelContent');
        if($('li:first-child', channelContent).length == 1)
            $('li:first-child', channelContent).before(html);
        else
            channelContent.append(html);
        channelContent.listview('refresh');
        self.newChannelContentReceived = null;
        // Scroll to top
        $.mobile.silentScroll(0);
    },
    
    
    
    _newsDetailId: null,
    showNewsDetail: function(id) {
        self._newsDetailId = id;
        self.newsEmptyBeforeShow = false;
        $.mobile.changePage('#newsDetailPage', {transition: 'slide'});
    },
    initNewsDetailPage: function() {
        if(self._newsDetailId == null) {
            $.mobile.changePage('#newsChannelsPage');
            return;
        }
        $.mobile.loading('show');
        var id = self._newsDetailId;
        self._newsDetailId = null;
        services.getChannelContentDetail({id: id}, function(result) {
            var page = $('#newsDetailPage');
            var dateAdded = Date.parseFromYMDHMS(result.data_inserimento);
            
            var imgurl = (result.foto || '');
            if(imgurl != '') {
                $('#newsImage', page).css('background-image', 'url(\'' + imgurl + '\')').show();
            } else {
                $('#newsImage', page).css('background-image', '').hide();
            }
            $('#newsTitle', page).html(result.oggetto);
            $('#newsDate', page).html("Inserita il " + dateAdded.toDMY() + " alle " + dateAdded.toHM());
            var text = $('<span class="temp">'+result.descrizione+'</span>');
            $('a', text).each(function() {
                var href = $(this).attr('href');
                $(this).attr('href', '#')
                       .attr('onclick', 'javascript:window.open(\'' + href + '\', \'_blank\', \'location=no,closebuttoncaption=Indietro,enableViewportScale=yes\');');
            });
            $('#newsText', page).html(
                text.html()
            );
            $.mobile.loading('hide');
        }, function(e, loginRequired) {
            $.mobile.loading('hide');
            if(loginRequired) {
                $.mobile.changePage('#loginPage');
                return;
            }
            helper.alert('Impossibile recuperare il contenuto', null, 'Notizia');
        });
    },
    
    
    showNewsChannelAvailable: function() {
        var newsChannelAvailableIds = pushNotificationHelper.getUnreadIds(PushNotificationMessage.PUSH_NOTIFICATION_TYPE_NEWCHANNEL_AVAILABLE);
        if(newsChannelAvailableIds.length == 0) return;
        var page = $('#channelInfoPage');
        $('div[data-role="main"] p', page).html('Ci sono nuovi canali disponibili ai quali potresti essere interessato');
        $.mobile.changePage('#channelInfoPage', {transition : 'slideup'});
console.log(newsChannelAvailableIds);
        $.mobile.loading('show');
        services.getChannelInfo({ids: newsChannelAvailableIds}, function(result) {
            var html = '';
            for(var i in result) {
                var row = result[i];
                html += '<div data-channelid="' + row.id + '" style="border-top:solid #0088CC 0.1em;margin-top:1em;padding-top:0.5em;">' +
                            //'<label>Amministrazione Comunale di ...</label>' +
                            '<strong>' + row.nome + '</strong>' +
                            '<a href="javascript:self.subscribeToNewsChannelAvailable('+row.id+')" class="ui-btn" style="background-color:#0088CC;color:#FFF;text-shadow: none;">Sottoscrivi</a>' +
                        '</div>';
            }
            $('#channelInfoContainer', page).html(html);
            $.mobile.loading('hide');
        }, function(e, loginRequired) {
            $.mobile.loading('hide');
            if(loginRequired) {
                $.mobile.changePage('#loginPage');
                return;
            }
            helper.alert('Impossibile recuperare il contenuto', null, 'Canali disponibili');
        });
    },
    subscribeToNewsChannelAvailable: function(id) {
        var page = $('#channelInfoPage');
        var subscribeButton = $('#channelInfoContainer div[data-channelid="' + id + '"] a', page);
        subscribeButton.html('Sottoscrizione...').addClass('ui-disabled');
        
        services.subscribeToChannel({
            channelId: id, 
            subscribe: true
        }, function() {
            // Once subscribed change text to "Sottoscritto" and add class ui-disabled
            subscribeButton.html('Sottoscritto');
        }, function(e, loginRequired) {
            // An error occurred
            subscribeButton.html('Sottoscrivi').removeClass('ui-disabled');
            if(loginRequired) {
                $.mobile.changePage('#loginPage');
                return;
            }
            helper.alert('Impossibile completare l\'operazione', null, 'Sottoscrizione canale');
        });
    },


    // 
    initFollowingListPage: function() {
        $('#followingListPage #readQrCodeButton').on('click', self.getInfoFromQrCode);
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
                if(description.length > 40) description = description.substr(0, 40) + '...';
                var qrCodeId = row.r_qrcode_id || '';
                
                html += '<li><a href="javascript:self.getFollowingInfo(\'' + qrCodeId.replace(/'/g, "\\'") + '\')">' + name + 
                        '<span id="count_' + qrCodeId + '" class="ui-li-count ui-li-count-cust"></span>' +
                        '<label>' + description +'</label></a></li>';
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
        
        if($.mobile.activePage.attr('id') != 'qrCodeInfoPage') {
            $.mobile.changePage('#qrCodeInfoPage', {transition: 'slide'});
        }
        
        $.mobile.loading('show');
        //$('#qrCodeInfoPage #getInfoButton').addClass('ui-disabled');
        $('#qrCodeInfoPage #infoText').html('Recupero informazioni...');
        
        services.getInfoFromQrCode(code, function(result) {
            
            self.currentQrCodeInfo = result;
            
            $('#qrCodeInfoPage #infoText').html('');
            
            pushNotificationHelper.setAsRead(PushNotificationMessage.PUSH_NOTIFICATION_TYPE_FOLLOWING, code);
            self.updateBalloonsInNavbar();
            
            //var canLeaveComment = (result.categoria.commenti == 1);
            var canFollow = (result.categoria.follows == 1);

            $('#qrCodeInfoPage #getInfoButton').removeClass('ui-disabled');

            if(result == null) {
                $('#qrCodeInfoPage #qrCodeId').val('');
                helper.alert('Non ci sono informazioni disponibili', null, 'Leggi QR Code');
                return;
            }
            $('#qrCodeInfoPage #qrCodeId').val(code);
            // Format result
            //var html = '<div class="ui-body ui-body-a ui-corner-all" data-form="ui-body-a" data-theme="a">' +
            var html = '<div>' +
                       '<h3 class="qrcode-info-title">' + result.info.nome + '</h3>' + 
                       '<p class="qrcode-info-description">' + result.info.descrizione.replace(/\n/g, '<br />') + '</p>' +
                       '</div>';
            /*if(canFollow) {
                html += '<input type="checkbox" onchange="self.followQrCode()" id="following" ' + (result.info.follow == '1' ? ' checked' : '') + '/> <label for="following">segui</label>';
            }*/
            
            var hasGallery = false;
            if(result.foto && (result.foto.length > 0)) {
                hasGallery = true;
                html += '<div class="slider"><ul class="slides">';
                for(var i in result.foto) {
                    html += '<li class="slide">' +
                                '<img src="' + result.foto[i] + '" />' +
                            '</li>';
                }
                html += '</ul></div>';            
            }
            
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
                //html += '<a href="#qrCodeInfoMultimediaPage" class="ui-btn ui-btn-style1">Video <span class="ui-li-count">' + result.youtube.length + '</span></a>';
                html += '<a href="#qrCodeInfoMultimediaPage" class="ui-btn ui-btn-qrcodeinfo ui-btn-multimedia">Video</a>';
            } else {
                html += '<a href="#" class="ui-btn ui-btn-qrcodeinfo ui-btn-multimedia ui-disabled">Video</a>';
            }
            html += '</div></div>';
            
            
            $('#qrCodeInfoPage #infoResult').html(html);
            if(hasGallery) {
                var glide = $('.slider').glide({
                    autoplay: false, // or 4000
                    arrowLeftText: '',
                    arrowRightText: ''
                });         
            }
            $.mobile.loading('hide');
        }, function(e, loginRequired) {
            $.mobile.loading('hide');
            $('#qrCodeInfoPage #infoText').html('Nessuna informazione associata al QR Code');
            $('#qrCodeInfoPage #getInfoButton').removeClass('ui-disabled');
            $('#qrCodeInfoPage #qrCodeId').val('');
            if(loginRequired) {
                $.mobile.changePage('#loginPage');
            } else {
                //helper.alert('Nessuna informazione associata al QR code', null, 'Leggi QR Code');
            }
        });

        
    },
    
    
    showQrCodeInfoPositionPage: function() {
        $('#qrCodeInfoPositionPage #qrCodeInfoPlaceMap').css({
            position: 'absolute', 
            top: '3.5em', //$('div[data-role="header"]', $.mobile.activePage).height(),
            bottom: 0,
            left: 0,
            right: 0
        });
        var result = self.currentQrCodeInfo;
        var placeName = result.info.nome;
        var lat = result.censimento.latitudine, lng = result.censimento.longitudine;
        var options = {
            zoom: config.GOOGLE_MAPS_ZOOM,
            center: new google.maps.LatLng(lat, lng),
            mapTypeId: google.maps.MapTypeId.ROADMAP //eval(config.GOOGLE_MAPS_TYPE_ID)
        };
        var map = new google.maps.Map(document.getElementById('qrCodeInfoPlaceMap'), options);
        var point = new google.maps.LatLng(lat, lng);
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
                        '<div>' + news.titolo + '</div>' +
                        '<p>' + news.annotazione + '</p>' +
                        '<span>' + Date.parseFromYMDHMS(news.data).toDMY() + '</span>' +
                        '</li>';
            }
        }
        $('#qrCodeNewsList', page).html(html).listview('refresh');
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
                        html += '<li><p>' + c.descrizione + '</p>';
                        html += '<small class="news-note">' + d.toDMY() + ' alle ' + d.toHM() + '</small>';
                        if(c.stato == 0) html += '<div class="news-note">in attesa di approvazione</div>';
                        html += '</li>';
            }
        } else {
            html += '<p id="noComments" style="text-align:left;margin-top:1.5em;">Nessun commento</p>';
        }
        if(canLeaveComment) {
            $('#leaveCommentPanel').show();
        } else {
            $('#leaveCommentPanel').hide();
        }
        $('#qrCodeCommentsList', page).html(html).listview('refresh');
    },
    
    beforeShowQrCodeInfoMultimediaPage: function() {
        var result = self.currentQrCodeInfo;
        var page = $('#qrCodeInfoMultimediaPage');
        $('h3', page).html(result.info.nome);
        var html = '';
        
        
        //var hasGallery = false;
        //if(result.foto && (result.foto.length > 0)) {
            
            /*** old gallery implementation
            html += '<div class="slider"><ul class="slides">';
            for(var i in result.foto) {
                html += '<li class="slide">' +
                            '<img src="' + result.foto[i] + '" />' +
                        '</li>';
            }
            html += '</ul></div>';
            var glide = $('.slider').glide({
                //autoplay: false, // or 4000
                arrowLeftText: '',
                arrowRightText: ''
            });
            */
            
            /*** new gallery implementation
            html += '<div id="gallery" style="margin:0 -1em">' + 
                    '<div class="gallery-images" style="height:20em;text-align:center;">';
            for(var i in result.foto) {
                html += '<img src="' + result.foto[i] + '" class="gallery-image" style="width:auto;height:100%;';
                if(i > 0) {
                    html += 'display:none;';
                }
                html += '" />';
            }
            html += '</div>' +
                    '<div class="gallery-indicator">n of n</div>' +
                    '</div>'; */
            
            //var hasGallery = true;
        //}

        if(result.youtube && (result.youtube.length > 0)) {
            html += '<ul id="videos" style="text-align:left;margin-top:1.5em;" data-inset="false">';
            //html += '<li data-role="list-divider">Video</li>';
            for(var i in result.youtube) {
                var v = result.youtube[i];
                html += '<li><a href="#" onclick="javascript:self.openLink(\'' + v.media_file.replace(/'/g, "\\'") + '\')" target="_system">' + v.nome + '</a></li>';
            }
            html += '</ul>';
        }
        $('#qrCodeMultimediaContent', page).html(html);
        $('#qrCodeMultimediaContent #videos', page).listview();
        
        //if(hasGallery) {
            /*** new gallery implementation
            var currentImageIndex = 0;
            var totImages = result.foto.length;
            var gallery = $('#gallery');
            $('div.gallery-indicator', gallery).html((currentImageIndex+1) + ' di ' + totImages);
            $('.gallery-image', gallery).on('click', function() {
                currentImageIndex++;
                if(currentImageIndex >= totImages) currentImageIndex = 0;
                $('div.gallery-images img:visible', gallery).hide();
                $('div.gallery-images img:nth-child(' + (currentImageIndex+1) + ')', gallery).show();
                $('div.gallery-indicator', gallery).html((currentImageIndex+1) + ' di ' + totImages);
            });*/
            /*.on('swipeleft', function(e) {
                currentImageIndex++;
                if(currentImageIndex >= totImages) currentImageIndex = 0;
                $('div.gallery-images img:visible', gallery).hide();
                $('div.gallery-images img:nth-child(' + (currentImageIndex+1) + ')', gallery).show();
                $('div.gallery-indicator', gallery).html((currentImageIndex+1) + ' di ' + totImages);
            }).on('swiperight', function(e) {
                currentImageIndex--;
                if(currentImageIndex < 0) currentImageIndex = totImages - 1;
                $('div.gallery-images img:visible', gallery).hide();
                $('div.gallery-images img:nth-child(' + (currentImageIndex+1) +')', gallery).show();
                $('div.gallery-indicator', gallery).html((currentImageIndex+1) + ' di ' + totImages);
            });*/
            
            /*
            var glide = $('.slider').glide({
                //autoplay: false, // or 4000
                arrowLeftText: '',
                arrowRightText: ''
            });*/
        //}
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
    
    
    getInfoFromQrCode: function() {
        barcodeReader.acquireQrCode(function(res) {
            if(res === '') return;
            var qrCodeData = QrCodeData.fromText(res.text);
            switch(qrCodeData.type) {
                case QrCodeData.TYPE_GRETACITY:
                    self.currentQrCode = qrCodeData.elements.code;
                    self.getFollowingInfo(qrCodeData.elements.code);
                    break;
                case QrCodeData.TYPE_URL:
                    window.open(qrCodeData.elements.url, '_blank', 'location=no,closebuttoncaption=Indietro');
                    break;
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
    
    openQrCodeInfoViewer: function(qrCodeData) {
        var html = '';
        switch(qrCodeData.type) {
            case QrCodeData.TYPE_TEXT:
                html = '<li data-role="list-divider">Testo</li>' +
                       '<li style="white-space:normal"><strong>' + qrCodeData.elements.text + '</strong></li>';
                break;
            case QrCodeData.TYPE_CONTACT:
                html = '<li data-role="list-divider">Contatto</li>';
                for(var i in qrCodeData.elements) {
                    html += '<li style="white-space:normal">' + i + ': <strong>' + qrCodeData.elements[i] + '</strong></li>';
                }
                break;
            case QrCodeData.TYPE_PHONE_NUMBER:
                html = '<li data-role="list-divider">Numero di telefono</li>' + 
                       '<li style="white-space:normal"><strong>' + qrCodeData.elements.phoneNumber + '</strong></li>';
                break;
            case QrCodeData.TYPE_SMS:
                html = '<li data-role="list-divider">Invia SMS</li>' +
                       '<li>al numero</li>' +
                       '<li style="white-space:normal"><strong>' + qrCodeData.elements.phoneNumber + '</strong></li>' +
                       '<li>testo del messaggio</li>' +
                       '<li style="white-space:normal"><strong>'+qrCodeData.elements.message + '</strong></li>';                
                break;
        }
        $('#qrCodeViewerPage div[data-role="main"] #qrCodeViewer').html(html).listview().listview('refresh');
        $.mobile.changePage('#qrCodeViewerPage');
    },
    
    
    followQrCode: function() {
        var follow = $('#qrCodeInfoPage #infoResult #following').is(':checked');
        services.followQrCode(self.currentQrCode, follow);
    },
    
    leaveCommentOnQrCode: function() {
        var text = $('#qrCodeInfoCommentsPage #comment').val().trim();
        if(text == '') return;
        var params = {
            comment: text,
            qrCodeId: $('#qrCodeInfoPage #qrCodeId').val()
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
    
    
    
    
    latLng: {lat: 0, lng: 0},
    map: null,
    marker: null,
    __mapsSetup: function() {
        if(typeof(google) == 'undefined') return;
        if(self.map != null) google.maps.event.clearListeners(self.map);
        var lat = self.latLng.lat;
        var lng = self.latLng.lng;
        var mapZoom = config.GOOGLE_MAPS_ZOOM;
        if(lat == 0) {
            // Set default lat lng is set to Rome
            lat = 41.900046; lng = 12.477215;
            mapZoom = 5;
        }
        var options = {
            zoom: mapZoom,
            center: new google.maps.LatLng(lat, lng),
            mapTypeId: eval(config.GOOGLE_MAPS_TYPE_ID),
            streetViewControl: false
        };
        self.map = new google.maps.Map(document.getElementById('map'), options);
        self.mapsSetMarker();
    },
    __mapsSetMarker: function() {
        if(self.map == null) return;
//console.log("Setting map position to " + self.latLng.lat + " " + self.latLng.lng);
        var lat = self.latLng.lat;
        var lng = self.latLng.lng;
        var mapZoom = config.GOOGLE_MAPS_ZOOM;
        if(lat == 0) {
            // Set default lat lng is set to Rome
            lat = 41.900046; lng = 12.477215;
            mapZoom = 5;
        }
        
        var markerPoint = new google.maps.LatLng(lat, lng);
        self.marker = new google.maps.Marker({
            position: markerPoint,
            map: self.map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            title: 'Luogo della segnalazione'
        });
        self.map.panTo(markerPoint);
        self.map.setCenter(markerPoint, config.GOOGLE_MAPS_ZOOM);
        google.maps.event.addListener(
            self.marker, 
            'click', 
            function() {
                if(document.activeElement) {
                    $(document.activeElement).blur();
                }
        });
        google.maps.event.addListener(
            self.marker, 
            'dragend', 
            function() {
                if(document.activeElement) {
                    $(document.activeElement).blur();
                }
                self.latLng.lat = self.marker.getPosition().lat();
                self.latLng.lng = self.marker.getPosition().lng();
        });
        google.maps.event.addListener(
            self.marker, 
            'dragstart', 
            function() {
                if(document.activeElement) {
                    $(document.activeElement).blur();
                }
        });

        var infowindow = new google.maps.InfoWindow({content: '<div>Trascina il segnaposto nella posizione corretta<br />per consentirci di individuare con precisione<br />il punto della tua segnalazione.</div>'});
        infowindow.open(self.map, self.marker);
    },
    
    
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
        }, {enableHighAccuracy: false});
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
    beforeShowNearbyResultsPage: function() {
        $('#nearbyResultsPage #nearbySearchSlider').parents('div.ui-slider').css({'padding-right': 10});
        if(self.nearbyCategoryId == null) {
            $.mobile.changePage('#nearbyPage', {transition: 'slide', reverse: true});
            return;
        }
        self.searchNearbyPlaces(self.nearbyCategoryId);
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
                                + (row.phoneNumber != null ? 'Tel. ' + row.phoneNumber : '') + '<br />'
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
        $('#nearbyPlaceInfoPage #nearbyPlaceMap').css({
            position: 'absolute', 
            top: '3.5em', //$('div[data-role="header"]', $.mobile.activePage).height(),
            bottom: 0,
            left: 0,
            right: 0
        });
    },
    
    showNearbyPlaceInfo: function() {
        $.mobile.loading('show');
        if(self.nearbyPlaceId == null) return;
        var showMap = self.nearbyCurrentPos != null;
        if(!showMap) return;
        
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
                        console.log(res.routes);
                        self.tmp = res.routes;
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
    }
};