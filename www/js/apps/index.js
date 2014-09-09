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
        
        var reportingHomePage = $('#reportingHomePage');
        reportingHomePage.on('pageinit', self.initReportingHomePage);
        
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
        var newsPage = $('#newsPage');
        newsPage.on('pageinit', self.initNewsPage);
        newsPage.on('pageshow', self.beforeShowNewsPage);
        newsPage.on('pagebeforehide', self.beforeHideNewsPage);
        $('#subscribedChannels', newsPage).on('change', self.retrieveChannelContent);
        $('#refreshNewsButton', newsPage).on('click', function() {
            $.mobile.loading('show');
            self.retrieveChannelContent(true);
        });
        $('#moreNewsButton', newsPage).on('click', self.retrieveMoreChannelContent);
        $('#newContentReceivedButton', newsPage).on('click', self.showNewChannelContentReceived);
        var newsDetailPage = $('#newsDetailPage');
        newsDetailPage.on('pagebeforeshow', self.initNewsDetailPage);
        
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
        
        /*var reportingMethodPage = $('#reportingMethodPage');
        reportingMethodPage.on('pageinit', self.initReportingMethodPage);
        reportingMethodPage.on('pagebeforeshow', self.beforeShowReportingMethodPage);*/
        
        var reportingPage = $('#reportingPage');
        reportingPage.on('pageinit', self.initReportingPage);
        reportingPage.on('pageshow', self.showReportingPage);
        $('#editDesciptionButton', reportingPage).on('click', self.editReportingDescription);
        $('#reportingDescriptionPage #confirmDescriptionButton').on('click', self.confirmReportingDescription);
        $('#editLocationButton', reportingPage).on('click', self.editReportingLocation);
        $('#acquirePhotoButton', reportingPage).on('click', self.acquireReportingPhoto);
        $('#reportingPhotoPage #removePhotoButton').on('click', self.removeReportingPhoto);
        $('#sendReportingButton', reportingPage).on('click', self.sendReporting);
        var reportingLocationPage = $('#reportingLocationPage');
        reportingLocationPage.on('pageinit', self.initReportingLocationPage);
        $('#confirmLocationButton', reportingLocationPage).on('click', self.confirmReportingLocation);
        var reportingMapPage = $('#reportingMapPage');
        reportingMapPage.on('pageshow', self.showReportingMapPage);
        $('#confirmPositionButton', reportingMapPage).on('click', self.confirmReportingMap);
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
    
    
    
    
    reporting : null,
    
    
    ////////////////////////////////////////
    // reportingHomePage
    
    initReportingHomePage: function() {
        $('#reportingHomePage #reportByQrCodeButton').on('click', function() {
            barcodeReader.acquireQrCode(function(res) {
                self.emptyReportingPages();
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
    
    
    ////////////////////////////////////////
    // reporting2Page
    showReporting2Page: function(e, ui) {
        if(ui.prevPage.attr('id') == 'reporting1Page') {
            setTimeout(function() {
                var pageHeight = $.mobile.activePage.outerHeight();
                var headerHeight = $('div[data-role="header"]', $.mobile.activePage).outerHeight();
                var footerHeight = $('div[data-role="footer"]', $.mobile.activePage).outerHeight();
                var infoHeight = $('p.text-primary', $.mobile.activePage).outerHeight();
                $('#map', $.mobile.activePage).height(
                        pageHeight - headerHeight - footerHeight - infoHeight
                );
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
        $.mobile.changePage('#reporting6Page', {transition: 'slide'});
    },
    
    
    ////////////////////////////////////////
    // reporting6Page
    initReporting6Page: function() {
        
        /*var imageData = "/9j/4AAQSkZJRgABAQEAlgCWAAD/4QB0RXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAACWAAAAAQAAAJYAAAABAAKgAgAEAAAAAQAAATagAwAEAAAAAQAAATAAAAAA/+ICQElDQ19QUk9GSUxFAAEBAAACMEFEQkUCEAAAbW50clJHQiBYWVogB9AACAALABMAMwA7YWNzcEFQUEwAAAAAbm9uZQAAAAAAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y1BREJFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKY3BydAAAAPwAAAAyZGVzYwAAATAAAABrd3RwdAAAAZwAAAAUYmtwdAAAAbAAAAAUclRSQwAAAcQAAAAOZ1RSQwAAAdQAAAAOYlRSQwAAAeQAAAAOclhZWgAAAfQAAAAUZ1hZWgAAAggAAAAUYlhZWgAAAhwAAAAUdGV4dAAAAABDb3B5cmlnaHQgMjAwMCBBZG9iZSBTeXN0ZW1zIEluY29ycG9yYXRlZAAAAGRlc2MAAAAAAAAAEUFkb2JlIFJHQiAoMTk5OCkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAADzUQABAAAAARbMWFlaIAAAAAAAAAAAAAAAAAAAAABjdXJ2AAAAAAAAAAECMwAAY3VydgAAAAAAAAABAjMAAGN1cnYAAAAAAAAAAQIzAABYWVogAAAAAAAAnBgAAE+lAAAE/FhZWiAAAAAAAAA0jQAAoCwAAA+VWFlaIAAAAAAAACYxAAAQLwAAvpz/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAEAAQADASIAAhEBAxEB/8QAHAABAAMAAwEBAAAAAAAAAAAAAAEGBwIEBQMJ/8QARBAAAQMDAgMFBQUECQIHAAAAAQACAwQFEQYhEjFBBxNRYXEigZGhsRQyQsHRI1Ji4RUXJDNyg5KTshY0NkNVgtLw8f/EABwBAAICAwEBAAAAAAAAAAAAAAAGBQcDBAgBAv/EADwRAAEDAwEFBQYEBQMFAAAAAAEAAgMEBREGBxIhMUETUWGBoSJxkbHB0RQjMkIVFlKC4TNi8FOSorLx/9oADAMBAAIRAxEAPwD9U0REIRERCERFGUIUooynEEIUooymUIUoiIQiIoyhCFV+7a1slmqHUk8ksszCOJkTM8OR4nA92cr0b7cW2q1VNcecUZLdubjy+axOSSSaR0sri57yXOJPMqtNoGtZtM9nTUQBlfx48cD3eKl7Xbm1pL5P0havRa907WvEbql9O48u+bwj47hWFkjJAJInhzXbgtOQVgqsOldQ3iiuFHboatxppZmRGJ4y0NJ6eHPolnTm1aaedtNdIwd4gBzRjiTjiD0W5V2NrGb8J5dCtcHJSobyUq8UuIijiCZCEKUUZRCFKIiEIiIhCIiIQiIiEIiIhCIiIQi69ZV01BA+qq5mxRM+89x2HRfc8tl42rqR1bp2uhjblwj4wPEtOfyWlcZ5KWklnhGXNaSB3kDK+4mh72tdyJXmzdo2n42kxmolcOTRHjPv5LyZe1J5cO5tAADt+Obct9w5qh5BHiOilc2VW07UNQRuPazwDR9cpvjstIzmCfNajZ+0K03KeOlnhlpZZDwguILM+GenwVqGM7YKwPnzWuaJvLrxZozPP3lRATHKTzJ6H4YVj7PtdVF+mdQXHHaAZaQMZ7wR39eHTKiLrbGUrRLFy6+CsSIitlQiKPHZSoK8KFS+0yt7q109EHDNRNxEY6N3+uFmyuvahJIbhRx8Z4BC4hvTOeapS5Z2kVbqrUMzXcmANHuxn5kp0s8YZSNI68UXq6Wp31OoaCOMgETNkOfBu5+QXlK0dnVJ9o1CJzypoXP952H1KgNMUn42800He9vocrarZOzp3u8Fqo5KVA5KV2MkFdO5XGC1UM1wqs93C3idwjJVYb2nWYnD6Gtb/wC1p/NdntCuEVJYH0r95KsiNg9DklZWqb17rm4WC5No7e5uA0FwIzxOfphT9rtsVVCZJQea1mm7QNNT4D6t8JPSSIjHv5L2KO72yv8A+zroJs8g14J+Cw5dm2OqGXGmfRu4ZxKwRnzyoO17Wri6ZkVXC14JAy3IPE+fFbE9iiDS6NxGO9bmDnkFyXBmeAcQGcb4XNX+DnilhERF6hEREIRERCEREQhEREIRcHta5pa7cHYhc0XhaHDBQsa1VY5LFdZIAD3EpMkDsfhJ3HqCvGWva0sX9N2lwia41FPmSEAj2jjkfX64WRuaWuLXAgg4IPQ+C5V19ps6fujjGPypPab4d48vknW11n4qEB36hwP3XFWXQV3/AKNvbYJHgQ1g7txJ2Dt+H9FWlIJaQ5pwQcgjolqzXKSz10VbFzYQfLqPMLdqIW1ETo3dVvYPmuS8TSd4F7tEVS5wM0f7OUeDh+vNe15LsSgrYrjTR1cJy14BHmkCWN0Tyx3MKVClcSN1uL4WW9o8j3ahEbnEtZA3hHhnKqquvafTxR3GjqGt9uaJwcfHhIx9SqUuSNcxPh1DVNecnez5EAj0TzbCDSMx3Ir72XU+XV9V/gj+p/NUNad2aUxisck5aR38ziPQbBS2zGlNRqGN3RgcfTA9SsN5fu0hHeQFbhyUqOW6gnALiOQXUBOBkpMWZ9pVwZU3WGijP/axni/xOx+Q+ap6719qvtt5rariDhJM4ggdAcD6LorjzVFwN1u9RVHq4ge4cAn6ii7CnYzw+aKy6Btf2++snezMVI3vSenFyaPqfcq2tV0DaTbrKJ5Yyyard3js88fhU3s8s38XvcZcMsj9o+XL1WtdqjsKYjq7grMOS5LiD18lyXVISUiIiEIiIhCIiIQoyEJAUHkvE1Nqel05BG58ZmmlyI4w7GccyfJadfX09sp3VVW7dY3mV9xRumeGMGSV7mQmeqyeXtB1I+d8sc8UbHcoxGCG+/mvXtHaWWNbDeaZzuFu80WMk+Jb09ySKPadYaqfsXPLPFwwFJSWaqY3exn3FaDlMjkupQXW33OISUNVHKMZw1249RzC7QPgn6GeOpYJIXBzT1HEKLc0sOHDBRwysx7QbC+huP8ASdPA1lNUABxbgYk3zt5jf3LTuRXSvNrp7xQS0NSxpDxlpI+67oR6Ja1hp9uo7Y+l/ePaafEfQrboKo0kwkHLkViCLvXizV1jqzS10eDzY8fdePEFdSGGaoeIqeJ8rzyaxpcfgFyjPQVNNOaWVhDwcYxxynlsrHs32nh3q19m9xNPeX0Lnu4KqMkN6cbf5ZC08EEqh6H0fU0lQLvdYnxPZtBEeY2xxHHlyCvbR4rpvZxSVtFY2R1rS05JaDzDT3jpxyky7SRy1JdEc9/vXJR1UqCnwqNVJ7TaEzUNLXMjc50Eha5zRkNY4dfeAs4W9OjZI0se0OadiCMrxnaN02+q+1utcXHz4RngPnw5wqk1ls5qL/cPx9JI1pcAHA56cMjHgpy33ZtLF2UjTw5LJqKhqrjUspKKEySvOAB08z4BbTZrfHarZT2+MgiFgaT4nmT7zlfWKlpoBiCCOMAY9loC+wB6pg0boiLShfK6TfkfgZxjA7h581q3C4ursNxgBSTsvN1DWtoLNWVbvwROwM4ySMAeq9E5znCqXaTNLHY2xMYSyWdoe7o0DcfNMGpK11utNRVN5tYce/GAtSkj7WdjO8rMPLOUU+9d2Gx3iphbUQ2upfFIcNc2M7/y8+S5Bp6WorHEQMLz4An5BPzpGRgF5x719NO2l15u9PRcLjG53FKR0YNz+XxW0saGsDWDAAwMKs6L0sLJSmrrWD7dKMO3zwN/d/P3q0DkumNnWm5LDbTJUtxLIcnvA6A/VJ12qxVTYYfZHBN1KIrCUWiIiEIiIhCIiIQuJWP6zqaip1HWNqHEiJ3dsHLDMbfmtgxkZK8TUelaDUMQMhMNQwYZM0bgeB8QkfXmn6vUVs/D0bsOad7HR2BjGVIWyqZSTb8g4EY9yx5Nl7d80jdrJIS+F08HMTRNy30I6LxPquYq+2VdrlMFXGWOHf8AfqnOKaOdu9GchfSnqZ6SZtRSzvikachzHYKuVk7SKqAx094gErMgGduzgPEjr7lSU28Fv2bUlysMm/RSkDqOYPvCx1FHDVDEg+63KgulBdIftFBVRzR8stPI+B8F2uawy33GttlQ2qoah0UjeoOx8iOq13S96df7RHXSRBknE6OQDlxDnjyXQmjNeQ6nJpZWbkzRnA4ggdR9kqXC2OohvtOWr05qeGojMU8TJGOGC1zQQQuNPRUlGwspaaKFvgxgaPkvshT4YInP7QtG9344qM3jjCjh81JOOS866X+1Whua+sjjcRkMzlxHkAqfce05zmllrt5ac7PmPTocD81A3fVlosYxVzDe/pHE/AfVbNPQz1PGNvD0WgcSgva0EvIA81i9fqS+XItNVcZSGnLWsPAAfdhdKWsq5nF81VM9zuZdITn5qvanbFSNcRBTOcOhLgPTB+almWCQ/qeB5Lapbzaaf++uVMw/xShdc6q043Z17ox/mhYvgeARQ0m2KsJ/Lpm48Sfos4sDOryto/6q02Tte6P/AHQvo3UFjk3ZdqUjylCxNF8t2xV/7qZnxP3Xv8vx/wBZWy1OrdOUhDZbrCSejDxH34XVq9S6QulJJR1dzgdFKOFzXEjZZIpytaba3cZssdTxlp4YOTn1X22wxN4h5ytJt2mdC1kw+xTx1ZYRlgqC7f0VwjY1oDWDDQMDA6LB2PfG9skb3Me37rmnBB8irhpjXtXSSx0V4kM0DiR3zjl7PXxCnNI7QLQyX8NPTNpy8/qYPZPdnqFq19qnxvteXgd60oNwp5BcI3iRge1wcDuCOSnPTKuwODhkFL3JSXY3Xm1eprFQnhqbpTtcObQ/J+AVE17frm+6y2qOq4KWIN9mN2OLIz7RHnthVD0VPaj2qfw2rfR0MO8WHBc48MjuA+6nqOy9swSSOxnuWsSdoemmbNqZX/4YXfmF8j2laeHJtUf8r+ayxEnSbWL645aGDy/ypEWKmxzK1L+svT37lV/tj9V7Np1Fa70wuoKlrntHE6M7PaPMLFF6VgvFRZLnFWwDiA9mRmccTTzH0UjZtq1xdWsZcQ0xE4OBgjx5rDUWOIRkxE7wW1jkpXGN3HG14/EAVyXQTXBwDh1StyRRgeClF6hQQCMEZXg3fR1ju2XSUohlJz3kI4T7+hXvqPctKut1JcYzFVxh7fEZWSOV8J3ozgrNLn2a3KGTitdRHURY+688Lx+R+SrFZarlbyRW0U0IG2XNON/Nblg8iuEkTJW8MkbXDwIyFW912UWusJfRuMRPTm34Hj6qWgvk8fCQb3zWC8xtutU7OYnx6ca4n+8me8emw/JetPpmwVEpnntFK955kxhdyOKkt9NwxsjggiBOB7LWjmfRGj9AT6YuLq6eZrm7pAxkcyOJzw6IuF1bWxCJrSDlcpqiKmidNPK1kbBlznHAA81R9SdoZikdR2EseQQXVJw5p23DR8N14usNV1F4qZKGmkDaGN2Bw/8Am4/EfLwCrKWtZ7S53yPoLO7daOBeOZ793uHjzW5b7O0AS1HHw+6+lRPNUzPqJ5DJJIS5zncyVwT1Vx0roM3SFlxurnxwvOWQt2L2+JPMBVhZ7LX6kq+wpRvP5kk8vElTVTUxUbN5/AdP8KnNBkcGMBc4nAaNyV3orBe52udFaqpwbz/ZlbBQWW2W2JkFHRRxtZyOMn4ndd3Ctqi2Os3M1lSc9zR9T9lAy39xP5bPisGkikieY5WOY5pwWuGCFwW11enLJXzuqay2QSyuxl7m5Jwvj/0fpr/0an/0qMl2P3ASHsqhm70yDnHjgLO2/wAWBvMOVjSLYKjROmp4+7/ouOPfOYyWn4hdB/Zrp9/3TVMz+7L+oWhUbJb1Gfynsd5kfMLI2+05HEELLkVzunZnX07e8tlWyoAz7DxwO8sHkfkqnV0NZQSdzW0skL/3Xtwku7aauljdithIHfzHxHBSMFZBU/6bvJfBSoRQK2leOz3UhilbYqt2WSEmBxcSQcfd9NjhXS/Vc1BZq2tpyBJDC57SRkZA6hYxT1E1JPHVU7+GWJwcw+BC2SknpNS2Rsjo3GCsjLXNOxwdiF0Ds5v891tc1qe/81gO4T3EYHHwKVbvStgmbMB7J5rGHvc97nuOXOJcT4krirRV9nuoI6uSKkibNC13sSOkDeIeY8fFTD2cahk++aaP1kJ+gVUP0df3yub+GeTk5OPXJ5qcFwpQ0e2FVkV2p+y64OePtVzgYzr3bXE/PC7kXZZAJGmW7SOYD7QbEASPDOdlvwbOdRzjPYbvvIH1WN13pG/uz5FZ6vRsNqmvF0p6ONruB0gMjwNmtG5Wi03Z1pyBoEkM05BzmSU7+RAwFYKWipqKIQUlPHDGOTWDATdZNk1WJ2S3KRoa0g7reJOOmeGFH1N9ZulsIOe8r7MaGsDRyAwuSIr7aA0ABLKIo38EXqFKIiEIiKEIQ+qovaJqJ8DRYqVxD5WB07gR9w59n3q43Ksit9FNWzY4IWF53546LFLhXz3Otmrqhxc+Zxdz5DoFV20/UbrXQChp3Ykl5+DRz+PJTNmpBPL2jxwb811kRe9pDT39P3LgmL2U8A43uDeZyMNz8fgufLZbZ7tWMo6YZc84/wApqmmbBGZH8gvW0Ro6K4xNu9yHFDxfsoSNn46ny8AtHY0NGAAB0RkbY2hjQA0DAA2C5LrPTenKXTdG2mpx7X7ndXH/AJyCRqurfVyF7/JSiImFaqIiIQiIiELic5yvnJBFMMSxMeMY9oZ2X2UEZXy5jXjDhkIyRxCpmo9AUdVC6ossbKedu/dg4Y/9D6bLNiC0lrhgg4IW9n0WTa7tUVsvjnQANjq298Gjoc+1891Re1DSdNRwtu1CwM44eBwHHkQPQpkstc97+wkOe5Vxap2dVjJ9PMgB9qnkcxw8icj6rK1eOy6oLauupS72XRskA8wcH8kqbMq40eoI4zykDm+mfot+9R9pSk92FooUriMgZXJdQBJiIiL1CIiIQiIiEKFHF03VL13qurtb22m3O4JZY+OSUc2gnAA8zjmqM2/Xxn3bvWD/ADSq2v8AtKt9irXUPZukc39WMYB7uKl6W0S1MYkyADyW3ZTI8Vig1JqAcr3W/wC6VzbqnUbeV6qve/KiW7Ybaf1U7/8Ax+6zmwTf1D1W0HkhWY2TtDutPNFBdCyogc4NdIRwvaPHbY4WmBwcAQcgjKfNO6ooNTQuloict5gjBGeSi6ujko3bsnVUztMuLobfTW5hP9pkL34/db0+JHzWbq0dosxl1GYyciGFjQPDOT+aq6502g3B1wv8+9yYdwf2/wCcpstUQipW+PFFr2i7YLbYaYHBfOO/cR/FuPlhZHFG6aVkLecjg0epOAt2p4WwQRQxgBrGtaAOgAwnDY/QNkq6iscOLAAPPOfktC/SkMZGOv0X2REV/JYRERCEREQhEREIRERCFB5ZWfdqMDeOgqgPa9uMny2K0A+qoHajO0uoKUO9occhHlsEj7Rez/lyo3/DHvyMKRtOfxbMf84KhK69l8LnXCtqMeyyFrc+ZP8AJUpaH2XRPbTV0xGGPka0HzA3+qo3ZzB2+ooM/t3j8AUy3d27SO8cfNXoealcRsFyXVSSUREQhEREIRERCFkOvBKNT1JlBALWFmf3eHp81X1rmq9KR6ijikjmENRDsHkZBaeYKqr+zK7g+xX0p9Q4Lm/Veg71JdZ56WIyMeS4EEdeh9ybaG50zYGsecEKmorwzsvrC0F90iDuoEZO6+EvZleGyERVdM5n4S7IJS6/QOoo2hxpjx7iCfhlbYutITjfVOWz6XmdUWCgmeckwNB9235Kn2/syrDUNNzq4mwN3cIslzvLfl6q/UdJBQ00dJTMDIom8LWjoFZ+zLTN0s001TXM3GuGADzJznOO77qGvNZBUtayM5IWV6+/8U1X+CP/AIhV5WbtDiLNSyPwf2kLHfLH5KsqotXNLL7Vg/8AUd6nKnqA5pYz4Bd2yMEl4oWHkaiP/ktvHTdYPTzyUs8dTFjjhcHtzyyDkLd43cTGu8QCrX2OTMNPVQj9Qc0+RBH0Kgr+0h7HdMFc0RFdKX0REQhEREIRERCEREQhcSVkOt7h9v1FUlkgfHBiFhByNufzz8FpepLsyz2aorObw3hjGcZcdgFjD3Oe90j3FznEucSeZ8VSm128NbDFamHiTvO9w4D4nj5JhsNPlzpz04BcVr2iLeaHT1MHtAfMO+dt+9y+SzCxWt14utPbxykdl5zghg+9j3LbGMbHG2NgAa0YHotPZDaHOlmujxwA3Wn38T6YWS/TjDYB7yuWylccpnxV7ZS0uSLjlMhGULkigKV6hEREIUY6JhSi8whRhMKUXqFBz0KjhXJEYQqV2lWl1RQw3SJrc0pIkOcewfrg4+JWbLeaiGKoidFMxr2PGHNcMghYvfbRUWS5SUM7Nsl0bgfvMJ2K5+2r6fNPVNu8Q9l/B3gQOB8x8k0WOq3mGndzHJectP0BqEXCiFrqCBPSNAb/ABRjYHfr0WYLu2e6VFnuMVwpeHjjOCHDIIOxz7kk6M1E/TtzZMf9N3svHgevvHNSNxpBVwlo5jiFuGfJSvhTVMVVCyeF7XseA4FpyvsDldZxyNlaHsOQUjkEHBUoiLIvEREQhEREIUE4XF0gY0ueQABkk8lxmmigaZJpGsYOZccBZjqrWtVdJZqC3y93Qn2CQPakHU56A/RLOptU0emaftag5cf0tHMn6DvK26OikrH7rOXUrhrbVDb1UNoqF5NJA7OcY7x4yCfMeCq/LdPfhd6yWqS9XOG3Ru4O8JLnfutAyf0965erq2u1Tc+1f7UshwAOnQAeATnFHHQwbo5Dir72dWMUlvddZmHvanZgPSMcj7+fwVxzj3r501PHSU8dNE3DImhjR5Bc3bNOCurbFao7HbY6OMfpHHxPU/FJFTOamV0h6rMdX6wr6ytlt1DI+mggeWOcx2HyEHxHIeS8ODUN9pncUN3qgf4pC4fA5XWuDzJX1Mh5umeT/qK665avOoLlV3GWodM7O8cYJGADwwAnWmpIWQhu6OStMHaNqCKMMkFPKR+JzMH5LvM7UKwNaJLXE4jHEQ8jPiqQi2qfXWoaf9FS4+/B+a+H2ykfzYFp9H2l2WYtbVQVFOXHGS3iaPPI/RerBrHTdQ5rGXaEOcQAHHhyfesbUplpNrV5hAbMxj/HBB9Dj0Wm+xQOPskhboLlbzs2upyfASt/VffiCwPAH4R8FYtP6uu9FcqcVVfNPTOeGPZI4uABOMj0TZadrkNVO2GtgLA4gAg5Az1OQPqtGexPjaXRuzha4iIrkUAiIiEIihMjxQhCq3rHTDb9SCSnDGVcAyx5B9pvVqsZIO2UI81H3O2093pX0dS3LHDj9x4rJDM+B4kYeIWCOa5jix4IcDgg88qFo+stFy3GZ12tQb3/AAkzRk/fwNi3zWdyRSwvMc0T43t2LXtII9QVyhqXTNXpurdDOCWE+y7HAj39/gnijrY6xgc3n1C79q1BdrK4/YKosaTl0bhlhPjhXG19p1O5rY7tRPidgZki9pp93MfNZ4iy2XWV4seGU0p3B+08R/jyXlRbqepOXt49/VbXRais1wj7ymuMLhnBBcGkH0K9Frw8BzdwdwR1WBkA8wD7l61r1Re7QOGjrXGPqyQcbfny9ysu17X2lwZcoMDqWfY/dQ01hI4xO+K2YeqklZzSdqFawBtZbIZPF0by0/A5+q7w7UaLG9qqQfAPbj6p3p9omnahu9+I3feCPoo59qq2HG5n4K8EldO5XSltVJJV1czWMjbk+J8gPFUOp7T7g5r20ttgjOfZc95dgeY2396qtyu1wu83f3GpdK4fdHINHgANhyUBe9q1spoS225kkPLgQ0ePHifIea2qeyTvd+d7I9V6Wp9VVWo5WNLDDTR/di4s5d4nxXh58VG5XYoaCrudUyjooTLK/OGjbl4noqGq6yuv9YZpSZJXn/4AEzxxxUke63g0LjS0lTXVDKSkhdLLIcNa0ZJ/l5lavpHTLNP0bhM5slTNh0jgNm/wg88JpPS8FgpA+VrX1kozK/HL+EeX1Vg68lf+gtCMsjG3CtGZyOA6Mz9e/uStc7makmKP9PzTCh3LC5KCFaBAIUMso1RpG4UFylkt9HPPSyZka5jS7gJO7T71W5GPiPDKwsPg4YPzW9YHMhfGeipKppZU0sUrTseJgP1VQXnZNTVs76ijmLC4k7pGQM93I4U9TX18bQyRucdcrCUWuzaF0xO8yOtgaT0jkc0fAHC6Fb2aWWf2qOaemJxsDxt+e/zSZU7Jr3C0ujcx/gCQT8QB6qQZfaZ3AghZii0P+q2m6Xeb/aH6r5ydlrcHuru7PTii29+Cox2zTUjRkwA/3N+6zfxijP7vQqgLv2O3VF2ulPR02MueC53RoG5J+Ct0fZY4/wB7eSP8MGfqVdLbbobbSQ0sbWkwxtYXhgBdgYyVOac2X3GepEl0HZxtIPMEu48uB4e9a1XeomsxBxJ8sLuoiLopKiKD6plQXDmV4SOqFBLeeVRtWa77kzWuzOImY4NfUtwQ3xDfE9M+q+OstayCSWz2h5ZwEsmmHPPVrf1VEVI682hmMuttofx4h7x8m/U/BMVrtW9iaccOgVjtWu75QVPeVdQ+siOzo3kA+4gbFafb6+nuNHFWU0rXxyt4gQcj0WGeSsWirvc6S8U9BSSOdBUSjvYsZGOrvLbqoPQuvKujq20Fe50jJCAOpaSce8jvWzc7Wx8faxANIWtZ2yCvDvmkLVfJDUVDHx1HCGiVjsHGeo6r3GjYbKcK/q6301zhNPWRh7D0IyleOV8Lt5hwVmdf2aXSAF1BVRVAHJrvYdy+Cq9VbbhRSd1V0U8Th0dGf/xbpgKCxp2cAR4KtbrsmtdX7VG90R/7h8Ccj4qYgvs8fCQb3osEII57Y8VC3Coslpq395U22mkfjHE6ME4Xlz6B0zPIZPsJjyOUcjmgegzslGq2QXGM5pp2uHjkH6rfjv8AEf1tI9VkaLUndm2nzyfVD0k/kuDuzGwnlVVo9Ht/+Ki3bKdQDluH+7/CzC+UvXPwWYItMd2YWY/drqwermn8l3Ld2f6eoSHywOq3jrOcj4DZfVPspv0kgbLuNHfvZ9AF4++UwGW5JWf2DTFxv8oMLO7pwRxzOG2M7hviVqdksVFYqUUlI0nfic927nnxJXeihigYIYY2xsbsGtGAPcuedlcOldEUOmWB49uYji4j0HcPVQFdcZaw45N7vuuSKMplOyj1KIiEIiIhCIiIQiIiEIiIhCKD6KVxccIQoJwN8BUHW2smua+z2mY5BxNMw4xjm1p+pX07QNTzU7hZbdOWPI/tLm8wDjDQfPfKz70VIbQ9ePic+z248eT3fNo+p8kxWm2BwFRNy6BSSSck5J5nxUIiowkk5KZk5brSez3T9RQRS3OupwyScBsQd94M5k+WfyVU0fYXXu6NEsbjSwEOmcDgZ5tb71rjGgNDWjYbADorn2WaW7Z/8aqRwacMHeep8uQ8fcl291u6Pw7OvNcxyUqByUq+0soijPmvE1Fqqi062MVDJJZZd2RsAzgdSTyC066vprbA6pq3hjBzJX3HG+ZwYwZK9xFSIe1C3PeBNbqmNvVwLXfLKs1rvluvMJnoKlrw04LTs4HzBUbbdUWi7v7Ojna53dnB+B4rNNRzwDMjSAvRRcQSfBclPLWRERCF4GqNWUenmCItM1VI3McQ5erj0Co8naJqJ4cGvp2Z5ER8vmu/2mW+pFwhuTYnGAxCNzwNmuBPP1B+SpPqudNd6tvlLd5KSKQxsb+kN4ZB6kprtlBTSU4kc3JK0HT/AGjd7KylvUTWcRDWzRjbJ6uGdh5hXmGWOZgkie1zXDIIOQVguwXtWDVdzsDw2F/fU+fahedj6H8PuW3pXajNTEU16Je3o/8AcPf3j196+K6ytf7dNwPd9lsiLy7HqC336n76ily5mBIw7OYSOS9PKvelq4K6Js9O4OaeRHFLL2OjcWuGCpRRlStlfKIiIQiIiEIiIhCLi7HiuS4nmvChYrqR3Hf7g453qH815q1LVui4byJLhRZZXADmfZkxyB8D5rNq63V1tmdT11LJC9px7Q2PoeRXKWstM3Cz18s87SY3uJDgOHE549x8E7W6tiqImsacEDGF1l96KjmuFXFRU7eKWZwY0fmvkyN8r2xxsc57jhrWjJJ8MLTdE6TfZ2G4XAN+1StHCzAPdD18fFamktMz6lrmxNaeyBy93QDu956LJX1raOMuz7XQL2NO2Cl0/RfZYHOe554pZHc3O/L0XrYxyRvopXV9HRw0EDaanbusaMAJHke6Rxe45JREUFbS+VHqsn7QZhLqWZrTkRxRs9+CT9VrBPy5rEr7VOrbzW1LvxzuA9AcD5AKptrtWIrTFTdXv+QP3U3Ymb05f3BdBfWlqqiiqY6qlkMcsRyxw6FfJFzzHK+B4kjJBHIjmE2EBwwVqehtS1d9hqIa8tdPA4EOa3Acw8vfkH5K1qhdlvc93X4z3vFHxbfhwcfmr6ustDVlRXWGCeqfvPIOT14Ejj4pGuUbYqp7WDARERNq0V1Llb6W50slHWRCSKTYtP1WNXm01NluEtFUg+yfYeW4D2+IW3leJqbTkOoqMROkMU0JLonjkD1BHgq+17pEajpO2px+ezl/uH9JPy8VKWyvNHJh36TzWOouzcKCqtlXJQ1kfBLGcEcwfAjyXWXMU8ElNIYpmkOHAjqnJrmvAc08CvvRV1VbqmOrpJTHJE4OBB29/iFrOmtT0uoacuZ+zqIwO9iJ5eY8QsfVx7N7bUTXKS6NlLIqcGNzcf3hcOWfAbFWJs1vlwo7oygg9uOQ+03u/wBw7seqibxTRSQmV/Ajl9lpY33XJccLkumQk9ERF6hEREIRERCEUFSiEKMYC6lxtVDdac01fTsmjJ4sHIwfHZdxFimgjqGGKZoc08wRkHyXrXFpy08V41u0lY7VUfa6Oia2UDDXOJdw+meS9gDClFipKGmoGdlSxhje4AAei+nyPlOXnJ8VClEW0vhERQeSEL4V0xpqOoqA3Jiic8eeASsMlldNK+Z4HFI4uOPEnK268SRxWqskldhrYH5/0lYcFQ+2OU9rSx54YcceY4pl0+32Xu9yIiKlQmMK/dlY3uR84h/yWgKhdlY/Z3F3i6MfJyvq6r2dN3dNU393/sUkXU5q3+XyCIiJ3UcoIymFKLzCF0rjaKC6wugraaOVpBAJaMtz1B6FZ7qDs9qrXAau2zPq4mfeYW/tGjx25rT1DhkYSxqDSNs1FGfxLMPxwcOBH381uUtdNSH2Dw7uiyXTujbjeJo5aqGSnojkukds446AHffxWpUVBTW+lZSUcLYooxhrWj/7uvtjHIYXIclj0xpCg0xEW043nnm48z4DuC9rK6StPt8B3JjxKlETYtJEREIRERCEREQhEREIRERCEREQhEREIRQVKgoQvC1sCdMV4AJ/ZjkM9Qsf64W9va1zSx4BadiCqdeuzigqiZrTJ9kkcclh3j9w5hVJtG0bX36VlbQYcWtwW8jzzkKctFwipQY5eAJ5rNUVwb2Z3okcVZSAZ33dy+Cj+rO99KukPvd+iqP+RdQ8/wAK70+6nv4nSf1r1ey0f2Svd4yMHyV6Ve0fp2fTtFLFUzskkmk4zwZwABgDdWFdIaNoZ7bY6elqW7r2g5HdkkpRuErZql72ciiIiZ1poiIhCIiIQowEUohCIiIQiIiEIiIhCIiIQv/Z";
        var el = $('#item1_1_1');
        el.attr('src', 'data:image/jpeg;base64,' + imageData);
        helper.imageCropToFit(el);
        return;
        */
        
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
            
            helper.imageCropToFit(photo);
        }, function(e) {
            helper.alert('Si è verificato un problema', null, 'Acquisizione foto');
        }, {sourceType: source});
    },
    removeReportingPhoto: function(par) {
        var container = null;
        if(par.target) {
            container = $(par.target).closest('div.reporting-photo-item');
        } else {
            container = $('#reporting6Page #photoSet div.reporting-photo-item[data-photopos="' + par + '"]');
        }
        $('a img', container).attr('src', '').css({'margin-left': '', 'margin-top': '', 'height': '', 'width': ''}).addClass('reporting-photo-missing');
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
        return;
        services.sendReporting(self.reporting, function() {
            /// Successfully sent
            /*$('#sendReportingButton', page).html(initialValue).removeClass('ui-disabled');
            $.mobile.loading('hide');
            reporting = null;
            self.latLng.lat = 0;
            self.latLng.lng = 0;
            $('#description', page).html('');
            self.removeAllReportingPhoto();
            helper.alert('La tua segnalazione è stata inoltrata con successo', function() {
                $.mobile.changePage('#reportingListPage', {transition: 'slide', reverse: true});
            }, 'Invia segnalazione');*/
        }, function(e) {
            // An error occurred
            /*$('#sendReportingButton', page).html(initialValue).removeClass('ui-disabled');
            $.mobile.loading('hide');
            helper.alert(e, null, 'Invia segnalazione');*/
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
    
    
    
    
    
    initSidePanel: function() {
        console.log('initializing side bar');
        services.getSubscribedChannels(function(result) {
            var html = '<li data-role="list-divider" style="background-color:rgb(89, 196, 248)">Canali notizie</li>' +
                       '<li data-channelid="0"><a href="javascript:self.showNewsChannel(\'0\')"><span></span>Tutte</a></li>';
            for(var i in result) {
                var row = result[i];
                html += '<li data-channelid="' + row.id_feed + '"><a href="javascript:self.showNewsChannel(' + row.id_feed + ')"><span>' 
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

    
    showNewsChannel: function(channelId) {
        $('#newsChannelsPanel').panel('close');
                
        //if(self.newsChannelId != channelId) {
            self.newsChannelId = channelId;
            self.newsContentLastId = null;
            self.newsContentLastDate = null;
            self.newsContentFirstId = null;
            self.newsContentFirstDate = null;
        /*} else {
            self.newsEmptyBeforeShow = false;
        }*/
        if($.mobile.activePage.attr('id') != 'newsPage') {
            $.mobile.changePage('#newsPage', {transition: 'slide', reverse: true});
        } else {
            self.beforeShowNewsPage();
            //$('#newsChannelsPanel').panel('close');
        }
    },
    
    
    //NEWS_UPDATE_CONTENT: 20000, // 20000 is 20 secs
    newsEmptyBeforeShow: true,
    newsChannelId: 0,
    newsContentLastId: null, newsContentLastDate: null,
    newsContentFirstId: null, newsContentFirstDate: null,
    newChannelContentReceived: [],
    //newsContentTimeout: null,
    sideBarInitialized: false,
    
    initNewsPage: function() {
        if(!self.sideBarInitialized) {
            self.initSidePanel();
        }        
        var page = $('#newsPage');
        $('#channelContent', page).empty();
    },
    beforeShowNewsPage: function() {

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
    beforeHideNewsPage: function() {
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
    retrieveChannelContent: function(onlyNew) {
        
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
            });

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
    
    
    
    
    
    loadReportingItems: function() {
        $.mobile.loading('show');
        pushNotificationHelper.setAllAsRead(PushNotificationMessage.PUSH_NOTIFICATION_TYPE_REPORTING);
        self.updateBalloonsInNavbar();
        services.getReportingList({}, function(result) {
            // Success
            var list = $('#reportingListPage #reportingList');
            var html = '';
            if(result.length == 0) {
                html += '<li data-role="list-divider">Non ci sono segnalazioni</li><li><a href="#reportingMethodPage">Nuova segnalazione</a></li>';
            } else {
                for(var i in result) {
                    var row = result[i];
                    
                    //html += '<li data-role="list-divider">' + row.nome_categoria + '</li>';
                    if(row.indirizzo && row.indirizzo.length > 0) {
                        html += '<li><b>' + row.indirizzo + '</b></li>';
                    }
                    //html += '<li style="white-space:normal;"><strong>' + row.descrizione_problema + '</strong></li>';
                    html += '<li>' + row.nome_categoria + '</li>';
                    if(row.foto != '') 
                        html += '<li><div class="replist-photo-container"><img src="' + row.foto + '" onclick="self.reportingListPageViewPhoto(this)" /></div></li>';
                    html += '<li>';                   
                    for(var j in row.log) {
                        html += '<div style="white-space:normal;"><small>' + row.log[j] + '</small></div>';
                    }
                    if(row.descrizione_chiusura != '') 
                        html += '<div style="white-space:normal;"><small>' + row.descrizione_chiusura + '</small></div>';
                    html +=  '</li>';
                    // separator
                    html += '<li style="padding:0;margin:0;height:.5em;background-color:#59C4F8;"></li>';
                }
            }
            list.html(html);
            list.listview('refresh');
            $.mobile.loading('hide');
            $.mobile.silentScroll();
        }, function(e, loginRequired) {
            if(loginRequired) {
                $.mobile.changePage('#loginPage');
            } else {
                $.mobile.loading('hide');
                helper.alert("Impossibile recuperare il contenuto", null, "Segnalazioni");
            }
        });
    },
    reportingListPageViewPhoto: function(el) {
        $('#photoPage #photo').attr('src', $(el).attr('src'));
        $.mobile.changePage('#photoPage');
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
    
    
    
    
    
    
    
    
    /*
    initReportingMethodPage: function() {
        var page = $('#reportingMethodPage');
        $('#positionFromQrCodeButton', page).on('click', function() {
            barcodeReader.acquireQrCode(function(res) {
                var qrCodeData = QrCodeData.fromText(res.text);
                if(qrCodeData.type != QrCodeData.TYPE_GRETACITY) {
                    helper.alert('Il QR code inquadrato non fa parte del sistema GretaCITY', null, 'Leggi QR Code');
                    return;
                }
                self.reportingQrCode = qrCodeData.elements.code;
                self.reportingUpdateLatLng = true;
                self.reportingLocalizationMode = self.REPORTING_LOCALIZATION_MODE_QRCODE;
                $.mobile.changePage('#reportingPage', {transition: 'slide'});
            });
        });
        $('#manualPositionButton', page).on('click', function() {
            self.reportingQrCode = null;
            self.reportingUpdateLatLng = true;
            self.reportingLocalizationMode = self.REPORTING_LOCALIZATION_MODE_MANUAL;
            $.mobile.changePage('#reportingPage', {transition: 'slide'});
        });
    },
    
    beforeShowReportingMethodPage: function() {
        if(((self.userProfile.city.id || 0) == 0) ||
           ((self.userProfile.address || '') == '')) {
            helper.alert('Prima di procedere con la segnalazione è necessario completare il profilo con il tuo comune e indirizzo di residenza', function() {
                $.mobile.changePage('#profilePage');
            }, 'Profilo incompleto');
        }
    },*/
    
    
    
    
    
    
    
    reportingQrCode : null,
    reportingLocalizationMode: null,
    REPORTING_LOCALIZATION_MODE_QRCODE: 1,
    REPORTING_LOCALIZATION_MODE_MANUAL: 2,
    reportingUpdateLatLng: false,
    initReportingPage: function() {
        var page = $('#reportingPage');
        
        $('#shootPhotoButton').on('click', self.acquireReportingPhoto);
        $('#galleryPhotoButton').on('click', self.acquireReportingPhoto);
        
        $('#sendReportingButton', page).addClass('ui-disabled');
        services.getReportingCategories(function(result) {
            var html = '<option value="0" selected>Seleziona categoria</option>';
            for(var i in result) {
                var row = result[i];
                html += '<option value="'+row.id+'">'+row.nome+'</option>';
            }
            $('#reportingCategory', page).html(html);
            $('#reportingCategory', page).selectmenu('refresh');
            
            var priorityTexts = ['Bassa', 'Media', 'Alta'];
            html = '';
            for(var i in priorityTexts) {
                html += '<option value="' + i + '">' + priorityTexts[i] + '</option>';
            }
            $('#priority', page).html(html).trigger('change');
        }, function(e, loginRequired) {
            if(loginRequired) {
                $.mobile.changePage('#loginPage');
            } else {
                helper.alert(e, null, 'Invia segnalazione');
            }
        });
        var html2 = '';
        for(var i = 0; i < config.REPORTING_MAX_PHOTOS; i++) {
            html2 += '<li><a href="#" onclick="self.viewReportingPhoto('+i+')">' +
                        '<img src="" class="report-imagelist-missing" data-pos="'+i+'" data-acquired="0" />' +
                    '</a></li>';
        }
        $('#photoList', page).html(html2);
    },
    showReportingPage: function(e, d) {
        var page = $('#reportingPage');
        var positioningPopup = $('#reportingPositionPopup', page);
        
        if(self.reportingLocalizationMode == self.REPORTING_LOCALIZATION_MODE_QRCODE) {
            // Use QR-code to set position
            $('#qrCode', page).html(self.reportingQrCode);
            $('#qrCodeHeader', page).show();
            $('#qrCodeRow', page).show();
            $('#locationHeader', page).hide();
            $('#locationRow', page).hide();
        } else {
            //self.REPORTING_LOCALIZATION_MODE_MANUAL
            $('#qrCodeHeader', page).hide();
            $('#qrCodeRow', page).hide();
            $('#locationHeader', page).show();
            $('#locationRow', page).show();
        }
        
        if((d.prevPage.attr('id') != 'reportingMethodPage') || (self.reportingLocalizationMode == self.REPORTING_LOCALIZATION_MODE_QRCODE)) {
            return;
        }
        
        $('#reportingPositionPopupContent', positioningPopup).html('Acquisizione della tua posizione GPS in corso...');
        positioningPopup.show();
        $('#loaderIndicator', page).show();
        $('html, body').css({
            'overflow': 'hidden',
            'height': '100%'
        });
        
        geoLocation.acquireGeoCoordinates(function(pos) {
            self.reportingGeoCoordinatesAcquired(pos);
            
        }, function(e) {
            geoLocation.acquireGeoCoordinates(function(pos) {
                self.reportingGeoCoordinatesAcquired(pos);
            }, function(e) {
                $('#loaderIndicator', page).hide();
                $('#reportingPositionPopupContent', positioningPopup).html(
                    'Non è stato possibile recuperare la tua posizione e quindi è necessario inserirla manualmente.<br />' +
                    '<a href="javascript:app.editReportingLocation()" class="ui-btn ui-btn-icon-right ui-icon-check" style="border:0;padding:.2em;">Procedi</a>'
                );
                $('a', positioningPopup).button();
                $('#sendReportingButton', page).removeClass('ui-disabled');
            }, {enableHighAccuracy: false});
        });
    },
    mapsScriptLoaded: function() {
    },
    
    
    
    
    latLng: {lat: 0, lng: 0},
    map: null,
    marker: null,
    mapsSetup: function() {
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
    mapsSetMarker: function() {
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
    
    
    
    
    
    
    editReportingDescription: function() {
        $('#reportingDescriptionPage textarea').val(
            $('#reportingPage #description').html()
        );
        $.mobile.changePage('#reportingDescriptionPage', {transition: 'slide'});
    },
    
    confirmReportingDescription: function() {
        var description = $('#reportingDescriptionPage textarea').val().trim();
        $('#reportingPage #description').html(
            description
        );
        if(description.length > 0) {
            $('#reportingPage #desciptionMissing').hide();
        } else {
            $('#reportingPage #desciptionMissing').show();
        }
        
        self.reportingUpdateLatLng = false;
        $.mobile.back();
    },
    
    initReportingLocationPage: function() {
        var page = $('#reportingLocationPage');
        $('input#city', page).on('input', self.reportingLocationChanged);
        $('input#prov', page).on('input', self.reportingLocationChanged);
        $('input#prov', page).parent('.ui-input-text').css('width', '3em')
        $('input#prov', page).on('blur', function() {
            this.value = this.value.toUpperCase();
        });
        $('textarea#route', page).on('input', self.reportingLocationChanged);
    },
    editReportingLocation: function() {
        $('html, body').css({
            'overflow': 'auto',
            'height': 'auto'
        });
        $('#reportingPositionPopup', page).hide();
        var page = $('#reportingLocationPage');
        $('input#city', page).val(
            $('#reportingPage #locationInfo span.city').html()
        );
        $('input#prov', page).val(
            $('#reportingPage #locationInfo span.prov').html()
        );
        $('textarea#route', page).val(
            $('#reportingPage #locationInfo span.route').html()
        );
        $.mobile.changePage('#reportingLocationPage', {transition: 'slide'});
    },
    reportingLocationChanged: function() {
        var page = $('#reportingLocationPage');
        var params = {
            'city': $('input#city', page).val(),
            'prov': $('input#prov', page).val(),
            'address': $('textarea#route', page).val()
        };
        geoLocation.geocode(params, function(latLng) {
            self.latLng.lat = latLng.lat();
            self.latLng.lng = latLng.lng();
        });
    },
    confirmReportingLocation: function() {
        $.mobile.changePage('#reportingMapPage', {transition: 'slide'});
    },
    
    
    showReportingMapPage: function() {
        self.mapsSetup();
        setTimeout(function() {
            $('#reportingMapPage #map').height($.mobile.activePage.height());
        }, 200);
    },
    
    
    confirmReportingMap: function() {
        $('#reportingPage #locationInfo span.city').html(
            $('#reportingLocationPage input#city').val()
        );
        $('#reportingPage #locationInfo span.prov').html(
            $('#reportingLocationPage input#prov').val()
        );
        $('#reportingPage #locationInfo span.route').html(
            $('#reportingLocationPage textarea#route').val()
        );
        self.reportingUpdateLatLng = false;
        //$.mobile.back();
        $.mobile.changePage('#reportingPage', {transition: 'slide', reverse: true});
    },
    
    
    acquireReportingPhoto: function(e) {        
        if($('#photoList li a img[data-acquired="0"]').first().length == 0) {
            helper.alert('Hai raggiunto il limite massimo', null, 'Scatta foto');
            return;
        }
        var sourceType = (this.attributes['id'].value == 'shootPhotoButton') ?
                                            Camera.PictureSourceType.CAMERA :
                                            Camera.PictureSourceType.PHOTOLIBRARY;        

        //$('#reportingPage #acquirePhotoButton label').html('Acquisizione foto...');
        //$('#reportingPage #acquirePhotoButton').addClass('ui-disabled');
        
        $('#reportingPage #acquirePhotoPopup').popup('close');
        
        camera.getPicture(function(imageData) {
            var imgEl = $('#photoList li a img[data-acquired="0"]').first();
            if(imgEl.length == 1) {
                imgEl.attr('src', 'data:image/jpeg;base64,' + imageData).attr('data-acquired', '1');
                imgEl.removeClass('report-imagelist-missing').addClass('report-imagelist-done');
            }
            //$('#reportingPage #acquirePhotoButton label').html('Scatta');
            //$('#reportingPage #acquirePhotoButton').removeClass('ui-disabled');
        }, function(e) {
            //helper.alert(e, null, 'Impossibile scattare la foto');
            //$('#reportingPage #acquirePhotoButton label').html('Scatta');
            //$('#reportingPage #acquirePhotoButton').removeClass('ui-disabled');
        }, {sourceType: sourceType});
    },
    viewReportingPhoto: function(pos) {
        var imgEl = $('#reportingPage #photoList li a img[data-acquired="1"][data-pos="' + pos + '"]');
        if(imgEl.length == 0) return;
        $('#reportingPhotoPage img').attr('src', imgEl.attr('src')).attr('data-pos', imgEl.attr('data-pos'));
        var width = $('#reportingPhotoPage').width();
        $('#reportingPhotoPage img').css({'max-width' : width, 'height' : 'auto'});
        $.mobile.changePage('#reportingPhotoPage', {transition: 'pop'});
    },
    _old_removeReportingPhoto: function() {
        var imgEl = $('#reportingPhotoPage img');
        imgEl.attr('src', '');
        var pos = imgEl.attr('data-pos');
        $('#reportingPage #photoList li a img[data-pos='+pos+']').attr('src', '').removeClass('report-imagelist-done').addClass('report-imagelist-missing').attr('data-acquired', '0');
        self.reportingUpdateLatLng = false;
        $.mobile.changePage('#reportingPage', {transition: 'pop', reverse: true});
    },
    removeAllReportingPhoto: function() {
        $('#reportingPage #photoList li a img').attr('src', '').removeClass('report-imagelist-done').addClass('report-imagelist-missing').attr('data-acquired', '0');
    },
    
    _old_sendReporting: function() {
        // Validate report
        var page = $('#reportingPage');
        var reporting = {
            qrCode: $('#qrCode', page).html(),
            latLng: self.latLng,
            categoryId: $('#reportingCategory', reportingPage).val(),
            road: $('#locationInfo span.route', reportingPage).html().trim(),
            city: $('#locationInfo span.city', reportingPage).html().trim(),
            prov: $('#locationInfo span.prov', reportingPage).html().trim(),
            description:  $('#description', reportingPage).html().trim(),
            //priority: self.reportingPriority,
            priority: $('#priority', page).val(),
            private: $('#private', page).is(':checked'),
            photos: []
        };

        $('#photoList li a img[data-acquired="1"]', reportingPage).each(function() {
            // remove 
            var src = $(this).attr('src');
            var pos = src.indexOf('base64,');
            reporting.photos.push(src.substr(pos+7));
        });
        
        var errors = [];
        if(reporting.categoryId == '0') errors.push('- seleziona la categoria');
        if(self.reportingLocalizationMode == self.REPORTING_LOCALIZATION_MODE_MANUAL) {
            if(reporting.prov == '') errors.push('- specifica la provincia');
            if((reporting.road == '') || (reporting.comune == '')) errors.push('- specifica l\'indirizzo');
        }
        if(reporting.description == '') errors.push('- descrivi il problema');
        if(errors.length > 0) {
            helper.alert(errors.join('\n', null, 'Invia segnalazione'));
            return;
        }

        var initialValue = $('#sendReportingButton', page).html();
        $('#sendReportingButton', page).html('Invio...').addClass('ui-disabled');
        $.mobile.loading('show');
        
        services.sendReporting(reporting, function() {
            // Successfully sent
            $('#sendReportingButton', page).html(initialValue).removeClass('ui-disabled');
            $.mobile.loading('hide');
            reporting = null;
            self.latLng.lat = 0;
            self.latLng.lng = 0;
            $('#description', page).html('');
            self.removeAllReportingPhoto();
            helper.alert('La tua segnalazione è stata inoltrata con successo', function() {
                $.mobile.changePage('#reportingListPage', {transition: 'slide', reverse: true});
            }, 'Invia segnalazione');
        }, function(e) {
            // An error occurred
            $('#sendReportingButton', page).html(initialValue).removeClass('ui-disabled');
            $.mobile.loading('hide');
            helper.alert(e, null, 'Invia segnalazione');
        });
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