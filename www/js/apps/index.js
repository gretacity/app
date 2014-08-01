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
            if($.mobile.activePage.is('#newsPage')) {
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
            $('#username', loginPage).val(config.userLastLoginUsername());
            $('#password', loginPage).val('');
        });
        $('#username', loginPage).val(config.LOGIN_DEFAULT_USERNAME);
        $('#password', loginPage).val(config.LOGIN_DEFAULT_PASSWORD);
        $('#loginButton', loginPage).on('click', self.login);
        var profilePage = $('#profilePage');
        profilePage.on('pageshow', self.showProfilePage);
        $('#logoutButton', profilePage).on('click', self.logout);
        var profileNamePage = $('#profileNamePage');
        profileNamePage.on('pageinit', self.intiProfileNamePage);
        profileNamePage.on('pageshow', self.showProfileNamePage);
        var profileCityPage = $('#profileCityPage');
        profileCityPage.on('pageinit', self.initProfileCityPage);
        profileCityPage.on('pageshow', self.showProfileCityPage);
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
        var newsChannelsPage = $('#newsChannelsPage');
        newsChannelsPage.on('pagebeforeshow', self.beforeShowNewsChannelsPage);
        var newsPage = $('#newsPage');
        newsPage.on('pageinit', self.initNewsPage);
        newsPage.on('pagebeforeshow', self.beforeShowNewsPage);
        newsPage.on('pagebeforehide', self.beforeHideNewsPage);
        $('#subscribedChannels', newsPage).on('change', self.retrieveChannelContent);
        $('#moreNewsButton', newsPage).on('click', self.retrieveMoreChannelContent);
        $('#newContentReceivedButton', newsPage).on('click', self.showNewChannelContentReceived);
        var newsDetailPage = $('#newsDetailPage');
        newsDetailPage.on('pagebeforeshow', self.initNewsDetailPage);
        
        var followingListPage = $('#followingListPage');
        followingListPage.on('pageinit', self.initFollowingListPage);
        followingListPage.on('pageshow', self.showFollowingListPage);
        $('#getInfoButton', followingListPage).on('click', self.getInfoFromQrCode);
        
        var registerPage = $('#registrationPage');
        $('#registerButton', registerPage).on('click', self.register);
        //var homePage = $('#homePage');
        //homePage.on('pageinit', self.initHome);
        //homePage.on('pagebeforeshow', self.showHome);
        var infoPage = $('#qrCodeInfoPage');
        $('#getInfoButton', infoPage).on('click', self.getInfoFromQrCode);
        var reportingListPage = $('#reportingListPage');
        reportingListPage.on('pagebeforeshow', self.loadReportingItems);
        $('#refreshReportingListButton', reportingListPage).on('click', self.loadReportingItems);
        //$('#loadMoreReportingItemsButton', reportingListPage).on('click', self.loadReportingItems);
        var reportingMethodPage = $('#reportingMethodPage');
        reportingMethodPage.on('pageinit', self.initReportingMethodPage);
        reportingMethodPage.on('pagebeforeshow', self.beforeShowReportingMethodPage);
        var reportingPage = $('#reportingPage');
        reportingPage.on('pageinit', self.initReportingPage);
        reportingPage.on('pagebeforeshow', self.showReportingPage);
        $('#editDesciptionButton', reportingPage).on('click', self.editReportingDescription);
        $('#reportingDescriptionPage #confirmDescriptionButton').on('click', self.confirmReportingDescription);
        $('#editLocationButton', reportingPage).on('click', self.editReportingLocation);
        $('#acquirePhotoButton', reportingPage).on('click', self.acquireReportingPhoto);
        $('#reportingPhotoPage #removePhotoButton').on('click', self.removeReportingPhoto);
        $('#sendReportingButton', reportingPage).on('click', self.sendReporting);
        var reportingLocationPage = $('#reportingLocationPage');
        reportingLocationPage.on('pageinit', self.initReportingLocationPage);
        reportingLocationPage.on('pageshow', self.mapsSetup);
        $('#confirmLocationButton', reportingLocationPage).on('click', self.confirmReportingLocation);
        var nearbyPage = $('#nearbyPage');
        nearbyPage.on('pageinit', self.initNearbyPage);
        nearbyPage.on('pagebeforeshow', self.beforeShowNearbyPage);
        var nearbyResultsPage = $('#nearbyResultsPage');
        nearbyResultsPage.on('pageinit', function() {
            $('#nearbySearchSlider', nearbyResultsPage).on('slidestop', self.searchNearbyPlaces);
        });
        nearbyResultsPage.on('pagebeforeshow', self.beforeShowNearbyResultsPage);        
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
            console.log('onDeviceReady: session check ' + result);
            window.location.hash = (result ? 'newsPage' : 'loginPage');
            $.mobile.initializePage();
        });
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },
    
    pageId : null,
    changePageAfterLogin: function(pageId) {
        self.pageId = pageId;
    },
    
    login: function() {
        var page = $('#loginPage');
        var usernameEl = $('#username', page);
        var username = usernameEl.val().trim();
        if(username == '') {
            $('label[for="username"]', page).addClass('fielderror');
            helper.alert('Inserisci il nome utente', function() {
                usernameEl.focus();
            }, 'Login');
            return;
        } else {
            $('label[for="username"]', page).removeClass('fielderror');
        }
        var passwordEl = $('#password', page);
        var password = passwordEl.val().trim();
        if(password == '') {
            $('label[for="password"]', page).addClass('fielderror');
            helper.alert('Inserisci la password', function() {
                passwordEl.focus();
            }, 'Login');
            return;
        } else {
            $('label[for="password"]', page).removeClass('fielderror');
        }
        if(!helper.isOnline()) {
            helper.alert('Nessuna connessione', null, 'Accesso a GretaCITY');
            return;
        }
        $('#username', page).addClass('ui-disabled');
        $('#password', page).addClass('ui-disabled');
        var initialVal = $('#loginButton', page).html();
        //$('#loginButton', page).html('Accesso in corso...').addClass('ui-disabled');
        $('#loginButton', page).val('Accesso in corso...').addClass('ui-disabled').button('refresh');
        $('#registerPageButton', page).addClass('ui-disabled');
        $.mobile.loading('show');
        auth.login({username: username, password: password}, function(result) {
//console.log(result);
            // Successfully loggedin, move forward
            pushNotificationHelper.register(function(res) {
                console.log('Registered device on Apple/Google Push Server', res);
                pushNotificationHelper.setLastRegistrationDate(new Date());
            }, function(e) {
                console.log('Error on registering device on Apple/Google Push Server', e);
            });
            
            if(!config.userProfileHasBeenSet()) {
                //$.mobile.loading('show');
                // Load profile from server
                services.getProfile({}, function(result) {
                    self.userProfile = result;
                    $.mobile.loading('hide');
                    // City is mandatory
                    if(self.userProfile.city.id > 0) {
                        config.userProfileHasBeenSet(true);
                        return;
                    }
                    helper.alert('Prima di procedere è necessario impostare il tuo profilo', function() {
                        $.mobile.changePage('#profilePage');
                    }, 'Profilo');
                }, function(e) {
                    $.mobile.loading('hide');
                });
            }
            
            
            $('#username').removeClass('ui-disabled');
            $('#password').removeClass('ui-disabled').val('');
            //$('#loginButton').removeClass('ui-disabled');
            $('#loginButton').val('Login').removeClass('ui-disabled').button('refresh');
            $('#registerPageButton').removeClass('ui-disabled');
            config.userLastLoginUsername(username);
            if(self.pageId != null) {
                //delete $.mobile.navigate.history.stack[$.mobile.navigate.history.stack.length - 1];
                $.mobile.navigate.history.stack.splice($.mobile.navigate.history.stack.length - 1);
                $.mobile.changePage('#' + self.pageId); //, {reverse: false, changeHash: false});
                self.pageId = null;
            }
            else {
                //$.mobile.changePage('index.html#homePage');
                //$.mobile.changePage('#homePage');
                //$.mobile.changePage('#newsChannelsPage');
                //console.log($.mobile.navigate.history.stack);
                //delete $.mobile.navigate.history.stack[$.mobile.navigate.history.stack.length - 1];
                $.mobile.navigate.history.stack.splice($.mobile.navigate.history.stack.length - 1);
                //console.log($.mobile.navigate.history.stack);
                $.mobile.changePage('#newsPage'); //, {reverse: false, changeHash: false});
            }
        }, function(e) {
            $.mobile.loading('hide');
            $('#loginButton', page).html(initialVal).removeClass('ui-disabled');
            helper.alert(e, function() {
                $('#username').removeClass('ui-disabled');
                $('#password').removeClass('ui-disabled');
                //$('#loginButton').removeClass('ui-disabled');
                $('#loginButton').val('Login').removeClass('ui-disabled').button('refresh');
                $('#registerPageButton').removeClass('ui-disabled');
            }, 'Login');
        });
    },
    
    logout: function() {
        auth.setSessionId(null);
        self.userProfile = null;
        $.mobile.changePage('#loginPage', {transition: 'slide', reverse: true});
    },
    
    register: function() {
        var page = $('#registrationPage');
        var params = {lastname: '', firstname: '', phone: '', email: ''};
        // Validation
        var hasErrors = false;
        var requiredFields = ['lastname', 'firstname', 
                              'phone', 
                              'email'];
        for(var i in requiredFields) {
            var fieldId = requiredFields[i];
            var fieldVal = $('#' + fieldId, page).val().trim();
            if(fieldVal == '') {
                $('label[for="' + fieldId + '"]', page).addClass('fielderror');
                hasErrors = true;
            } else {
                $('label[for="' + fieldId + '"]', page).removeClass('fielderror');
                eval('params.'+fieldId+'="'+fieldVal+'"');
            }
        }
        if(hasErrors) {
            helper.alert('Alcuni campi non sono stati compilati', null, 'Registrazione');
            return;
        }
        // Specific validation for phone number
        if(!helper.isPhoneNumberValid(params.phone)) {
            $('label[for="phone"]').addClass('fielderror');
            helper.alert('Inserisci un numero di telefono valido', function() {
                $('#phone', page).focus();
            }, 'Registrazione');
            return;
        }
        // Specific validation for email
        if(!helper.isEmailValid(params.email)) {
            $('label[for="email"]', page).addClass('fielderror');
            helper.alert('Inserisci un indirizzo email valido', function() {
                $('#email', page).focus();
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
    
    
    
    
    
    //initHome: function() {
    //    $('#logoutButton', homePage).on('click', self.logout);
        /*services.getSummaryData(function(result) {
            // Success
            $('#reportingCount').html(result.reportingCount);
            $('#newsCount').html(result.newsCount);
            $('#commentsCount').html(result.commentsCount);
        }, function(e) {
            // Error occurred
        });*/
    //},
    /*showHome: function() {
        if(!config.userProfileHasBeenSet()) {        
            $.mobile.loading('show');
            // Load profile from server
            services.getProfile({}, function(result) {
                self.userProfile = result;
                $.mobile.loading('hide');
                // City is mandatory
                if(self.userProfile.city.id == 0) {
                    helper.alert('Prima di procedere è necessario impostare il tuo profilo', function() {
                        $.mobile.changePage('#profilePage');
                    }, 'Profilo');
                }
            }, function(e) {
                $.mobile.loading('hide');
            });
            
        } else {
            self.updateBalloonsInHome();
        }
    },*/
    
        

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
        // TODO
        // Display a balloon for each item that contains updates
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
        $('#cityName', page).val('');
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
    
    
    
    
    initSidePanel: function() {
        console.log('initializing side bar');
        services.getSubscribedChannels(function(result) {
            var html = '<li data-role="list-divider" style="background-color:rgb(89, 196, 248)">Canali notizie</li>' +
                       '<li data-channelid="0"><a href="javascript:self.showNewsChannel(\'0\')"><span></span>Tutte</a></li>';
            if(result.length > 0) {
                //$('#newsPage #noSubscribedChannelsNotice').hide();
                for(var i in result) {
                    var row = result[i];
                    html += '<li data-channelid="' + row.id_feed + '"><a href="javascript:self.showNewsChannel(' + row.id_feed + ')"><span>' 
                                + row.denominazione + '</span><label>' + row.nome_feed
                                + '</label>'
                                + '<span id="count_' + row.id_feed + '" class="ui-li-count ui-li-count-cust" style="display:none;"></span>'
                                + '</a></li>';
                }
            } else {
                //$('#newsPage #noSubscribedChannelsNotice').show();segui
            }
            
            $('#newsChannelsPanel #channelList').html(html).listview().listview('refresh');
            
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
            helper.alert('Impossibile recuperare il contenuto', null, 'Notizie');
        });
    },

    /*
    setSidePanelPage: function(pageId) {
        // Setup newsChannelsPanel
        var panel = $('#newsChannelsPanel');
        if(panel.parent().attr('id') != pageId) { //$.mobile.activePage.attr('id')) {
            panel.prependTo('#'+pageId);
        }
    },*/
    
    
    
    
    /*beforeShowNewsChannelsPage: function() {
        
        if(!config.userProfileHasBeenSet()) {
            $.mobile.loading('show');
            // Load profile from server
            services.getProfile({}, function(result) {
                self.userProfile = result;
                $.mobile.loading('hide');
                // City is mandatory
                if(self.userProfile.city.id > 0) {
                    config.userProfileHasBeenSet(true);
                    return;
                }
                helper.alert('Prima di procedere è necessario impostare il tuo profilo', function() {
                    $.mobile.changePage('#profilePage');
                }, 'Profilo');
            }, function(e) {
                $.mobile.loading('hide');
            });
        }
        
        services.getSubscribedChannels(function(result) {
            var html = '';
            for(var i in result) {
                var row = result[i];
                html += '<li><a href="javascript:self.showNewsChannel(' + row.id_feed + ')"><span>' 
                            + row.denominazione + '</span><label>' + row.nome_feed
                            + '</label>'
                            + '<span id="count_' + row.id_feed + '" class="ui-li-count ui-li-count-cust"></span>'
                            + '</a></li>';
            }
            $('#newsChannelsPage #channelList').html(html).listview('refresh');
            //html = '<li><a>Tutte</a></li>' + html;
            $('#newsChannelsPanel #channelList').html(html).listview('refresh');
            self.updateBalloonsInNews();
        }, function(e, loginRequired) {
            if(loginRequired) {
                $.mobile.changePage('#loginPage');
                return;
            }
            helper.alert('Impossibile recuperare il contenuto', null, 'Notizie');
        });
    },*/
    
    showNewsChannel: function(channelId) {
        $('#newsChannelsPanel').panel('close');
        if(self.newsChannelId != channelId) {
            self.newsChannelId = channelId;
            self.newsContentLastId = null;
            self.newsContentLastDate = null;
            self.newsContentFirstId = null;
            self.newsContentFirstDate = null;
        } else {
            self.newsEmptyBeforeShow = false;
        }
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
        /*$('#unsubscribeChannelButton', page).on('click', function() {
            helper.confirm('Rimuovere la sottoscrizione al canale?', function(buttonIndex) {
                if(buttonIndex == 1) {
                    $('#unsubscribeChannelButton', page).addClass('ui-disabled');
                    services.subscribeToChannel({subscribe: false, channelId: self.newsChannelId}, function(result) {
                        helper.alert('La sottoscrizione al canale è stata rimossa', null, 'Rimuovi sottoscrizione');
                    }, function(e) {
                        $('#unsubscribeChannelButton', page).removeClass('ui-disabled');
                    });
                }
            }, 'Notizie', ['Rimuovi', 'No']);
        });*/
        $('#channelContent', page).empty();
    },
    beforeShowNewsPage: function() {

        console.log('beforeShowNewsPage: setting side panel');
        
        // Setup newsChannelsPanel
        //self.setSidePanelPage('newsPage');
        //$('#newsChannelsPanel ul li a.ui-btn-active').removeClass('ui-btn-active');
        //$('#newsChannelsPanel ul li[data-channelid="' + self.newsChannelId + '"] a').addClass('ui-btn-active');
        
        var onlyNew = !self.newsEmptyBeforeShow;
        if(self.newsEmptyBeforeShow === true) {
            $('#newsPage #channelContent').empty();
        } else {
            self.newsEmptyBeforeShow = true;
        }
        
        console.log('beforeShowNewsPage: onlyNew is ' + onlyNew);
        
        /*if(self.newsContentTimeout == null) {
            setTimeout(function() {
                self.retrieveChannelContent(onlyNew);
            }, 100); // start immediatly
        }*/
        self.retrieveChannelContent(onlyNew);
        pushNotificationHelper.setAsRead(PushNotificationMessage.PUSH_NOTIFICATION_TYPE_CHANNEL, self.newsChannelId);
        self.updateBalloonsInNews();
        
        /*if(self.newsChannelId > 0) {
            $('#newsPage #unsubscribeChannelButton').removeClass('ui-disabled').show();
        } else {
            $('#newsPage #unsubscribeChannelButton').hide();
        }*/
    },
    beforeHideNewsPage: function() {
        /*if(self.newsContentTimeout != null) {
            clearTimeout(self.newsContentTimeout);
            self.newsContentTimeout = null;
        }*/
    },
    formatChannelContentItem: function(item) {
        var rowId = parseInt(item.id);
        var dateAdded = Date.parseFromYMDHMS(item.data_inserimento);
        var image = (item.foto || '');
        
        var href = (item.link == '') ? 
                'javascript:self.showNewsDetail(' + item.id + ')' : 
                'javascript:app.openLink(\'' + item.link + '\', \'_blank\', \'location=yes,closebuttoncaption=Indietro,enableViewportScale=yes\');';
        html  = '<li data-icon="false"><a href="' + href + '" style="background-color:#FFF;white-space:normal;">';
        if(image != '') {
            html += '<div class="news-list-image adjust-image" style="background-image:url(\'' + image + '\');"></div>';
        }

        html += '<div>' + item.oggetto + '</div>' +
                //'<p style="white-space:normal;">' + item.descrizione + '</p>' +
                '<p class="news-list-note">Inserita il ' + dateAdded.toDMY() + ' alle ' + dateAdded.toHM() + '</p>' +
                '</a></li>';
        
        // First ID is the top of the list and has id more greater then others
        //if((self.newsContentFirstId == null) || (self.newsContentFirstId < rowId)) self.newsContentFirstId = rowId;
        //if((self.newsContentLastId == null) || (self.newsContentLastId > rowId)) self.newsContentLastId = rowId;
//var dateText = item.data_inserimento;
//console.log(dateText + ' ' + rowId);
        /*
        
        
        if((self.newsContentFirstDate == null) || (self.newsContentFirstDate < dateText)) {
            self.newsContentFirstDate = dateText;
            self.newsContentFirstId = rowId;
        }
        if((self.newsContentLastDate == null) || (self.newsContentLastDate > dateText)) {
            self.newsContentLastDate = dateText;
            self.newsContentLastId = rowId;
        }*/
        
        
        return html;
    },
    retrieveChannelContent: function(onlyNew) {
        
        onlyNew = onlyNew || false;
//console.log('Retreiving news... ', onlyNew);
        
        if(!onlyNew) {
            $.mobile.loading('show');
        }
        
        //if(self.newsContentTimeout != null) clearTimeout(self.newsContentTimeout);
        
        /*var channelId = (this == self) ? self.newsChannelId : $(this).val();
        if(channelId != self.newsChannelId) {
            self.newsContentFirstId = null;
            self.newsContentLastId = null;
        }*/
        
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
                    //return false;
                });
            });

            
//if(onlyNew === true) console.log('Checking for news updates...');

            if((typeof(result.nuove) != 'undefined') && (Array.isArray(result.nuove)) && (result.nuove.length > 0)) {
                self.newChannelContentReceived = result.nuove;

//if(onlyNew === true) console.log('Found ' + self.newChannelContentReceived.length);

                var firstRec = result.nuove[0];
                self.newsContentFirstDate = firstRec.data_inserimento;
                self.newsContentFirstId = firstRec.id;
                
                $('#newContentReceivedButton').html(
                    self.newChannelContentReceived.length + (self.newChannelContentReceived.length > 1 ? ' nuove' : ' nuova')
                ).show('fast');
            }
            
            
            //self.newsContentTimeout = setTimeout(self.retrieveChannelContent, 2000);
            /*self.newsContentTimeout = setTimeout(function() {
                if($.mobile.activePage.attr('id') == 'newsPage') {
                    self.retrieveChannelContent(true);
                }
            }, self.NEWS_UPDATE_CONTENT);*/
            
            $.mobile.loading('hide');
        }, function(e, loginRequired) {
            $.mobile.loading('hide');
            if(loginRequired) {
                $.mobile.changePage('#loginPage');
                return;
            }
            if($.mobile.activePage.attr('id') != 'newsPage') return;
            if(onlyNew) {
                /*self.newsContentTimeout = setTimeout(function() {
                    self.retrieveChannelContent(true);
                }, self.NEWS_UPDATE_CONTENT);*/
            } else {
                helper.alert('Impossibile recuperare il contenuto', function() {
                    /*self.newsContentTimeout = setTimeout(function() {
                        self.retrieveChannelContent(true);
                    }, self.NEWS_UPDATE_CONTENT);*/
                }, 'Canale');
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
//return;
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
        
        // Setup newsChannelsPanel
        /*var panel = $('#newsChannelsPanel');
        if(panel.parent().attr('id') != $.mobile.activePage.attr('id')) {
            panel.prependTo('#followingListPage');
        }*/
        //self.setSidePanelPage('followingListPage');
        
        services.getFollowings({}, function(result) {
            $.mobile.loading('hide');
            /*if(result.follows.length > 0) 
                $('#followingListPage #startMessage').hide();
            else
                $('#followingListPage #startMessage').show();*/
            //var html = '<li data-role="listdivider"><a href="">Leggi da QR Code</a></li>';
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
            
            $('#qrCodeInfoPage #infoText').html('');
            
            pushNotificationHelper.setAsRead(PushNotificationMessage.PUSH_NOTIFICATION_TYPE_FOLLOWING, code);
            self.updateBalloonsInNavbar();
            
            var canLeaveComment = (result.categoria.commenti == 1);
            var canFollow = (result.categoria.follows == 1);

            $('#qrCodeInfoPage #getInfoButton').removeClass('ui-disabled');

            if(result == null) {
                $('#qrCodeInfoPage #qrCodeId').val('');
                helper.alert('Non ci sono informazioni disponibili', null, 'Leggi QR Code');
                return;
            }
            $('#qrCodeInfoPage #qrCodeId').val(code);
            // Format result
            var html = '<div class="ui-body ui-body-a ui-corner-all" data-form="ui-body-a" data-theme="a">' +
                       '<h3>' + result.info.nome + '</h3><p style="text-align:left;">' + result.info.descrizione + '</p></div>';
            /*if(canFollow) {
                html += '<input type="checkbox" onchange="self.followQrCode()" id="following" ' + (result.info.follow == '1' ? ' checked' : '') + '/> <label for="following">segui</label>';
            }*/
            
            // Extra Info related to the current QR-code
            if((result.info.info_extra != null) && Array.isArray(result.info.info_extra) && (result.info.info_extra.length > 0)) {
                html += '<div style="text-align:left;">';
                for(var i in result.info.info_extra) {
                    html += '<p style="color:#FFF;background-color:rgb(89, 196, 248);text-shadow:none;border:solid 1px #0088cc;padding:1.3em;margin: 0.2em 0;">' +
                            result.info.info_extra[i] +
                            '</p>';
                }
                html += '</div>';
            }
            
            var hasSlider = false;
            if(result.foto.length > 0) {
                var hasSlider = true;
                html += '<div class="slider"><ul class="slides">';
                for(var i in result.foto) {
                    html += '<li class="slide">' +
                                '<img src="' + result.foto[i] + '" />' +
                            '</li>';
                }
                html += '</ul></div>';
                //$('div.slider').height($('div.slider ul li img').height());
                //$('div.slider').width($('div.slider ul li img').width());
            }
            
            if(result.youtube.length > 0) {
                html += '<ul id="videos" style="text-align:left;" data-inset="true">';
                html += '<li data-role="list-divider">Video</li>';
                for(var i in result.youtube) {
                    var v = result.youtube[i];
                    html += '<li><a href="#" onclick="javascript:self.openLink(\'' + v.media_file.replace(/'/g, "\\'") + '\')" target="_system">' + v.nome + '</a></li>';
                }
                html += '</ul>';
            }
            
            if(result.links.length > 0) {
                html += '<ul id="links" style="text-align:left;" data-inset="true">';
                html += '<li data-role="list-divider">Link</li>';
                for(var i in result.links) {
                    var l = result.links[i];
                    html += '<li><a href="#" onclick="javascript:self.openLink(\'' + l.link.replace(/'/g, "\\'") + '\')" target="_system">' + l.nome + '</a></li>';
                }
                html += '</ul>';
            }
            html += '<ul id="commentList" style="text-align:left;" data-inset="true">';
            if(result.commenti.length > 0) {
                html += '<li data-role="list-divider">Commenti</li>';
                for(var i in result.commenti) {
                    var c = result.commenti[i];
                    var d = Date.parseFromYMDHMS(c.data_inserimento);
                    html += '<li><p>' + c.descrizione + '</p>';
                    html += '<small>' + d.toDMY() + ' alle ' + d.toHM() + '</small>';
                    if(c.stato == 0) html += '<div><small><i>commento in attesa di approvazione</i></small></div>';
                    html += '</li>';
                }
            }
            html += '</ul>';
            if(result.commenti.length == 0) {
                html += '<p id="noComments" style="text-align:left;">Nessun commento</p>';
            }
            if(canLeaveComment) {
                html += '<textarea id="comment" style="width:98%" placeholder="Lascia il tuo commento"></textarea><br /><a href="javascript:self.leaveCommentOnQrCode()" class="ui-btn">Invia</a>';
            }
            html += '<div style="height:150px;"></div>';
            $('#qrCodeInfoPage #infoResult').html(html);
            $('#qrCodeInfoPage #infoResult #following').checkboxradio();
            $('#qrCodeInfoPage #infoResult #commentList').listview();
            $('#qrCodeInfoPage #infoResult #links').listview();
            $('#qrCodeInfoPage #infoResult #videos').listview();
            if(hasSlider) {
                var glide = $('.slider').glide({
                    //autoplay: false, // or 4000
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
    
    
    getInfoFromQrCode: function() {
        barcodeReader.acquireQrCode(function(res) {
            if(res === '') return;
            /*if(res.text.toLowerCase().indexOf(config.QR_CODE_BASE_URL) == 0) {
                var pos = res.text.lastIndexOf('/');
                var code = (pos != -1) ? res.text.substr(pos + 1) : res.text;
                self.currentQrCodeInfo = code;
                self.getFollowingInfo(code);
            }*/
            /* else if(res.text.toLowerCase().indexOf('http://') == 0) {
                window.open(res.text, '_blank', 'location=no,closebuttoncaption=Indietro');
            } else {
                $('#qrCodeInfoPage #qrCodeId').val('');
                helper.alert('Impossibile leggere il codice', null, 'Leggi QR Code');    
            }*/
            //else {
                var qrCodeData = QrCodeData.fromText(res.text);
                switch(qrCodeData.type) {
                    case QrCodeData.TYPE_GRETACITY:
                        self.currentQrCodeInfo = qrCodeData.elements.code;
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
            //}
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
        services.followQrCode(self.currentQrCodeInfo, follow);
    },
    
    leaveCommentOnQrCode: function() {
        var text = $('#qrCodeInfoPage #comment').val().trim();
        if(text == '') return;
        var params = {
            comment: text,
            qrCodeId: $('#qrCodeInfoPage #qrCodeId').val()
        };
        $.mobile.loading('show');
        services.leaveCommentOnQrCode(params, function() {
            // success
            var d = new Date();
            $('#qrCodeInfoPage #infoResult #noComments').hide();
            $('#qrCodeInfoPage #infoResult #commentList').append('<li><p>' + text + '</p><small>' + d.toDMY() + ' alle ' + d.toHM() + '</small></li>');
            $('#qrCodeInfoPage #infoResult #commentList').listview('refresh');
            $('#qrCodeInfoPage #comment').val('');
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
console.log(row);
                    /*[{
                        "id":"95",
                        "descrizione_problema":"asdadasdsa",
                        "descrizione_chiusura":"",
                        "foto":"http:\/\/www.gretacity.com\/test\/Data\/Upload\/Segnalazioni\/thumbs\/600_800_95.jpg",
                        "stato":"0",
                        "r_qr_code_id":"0",
                        "r_qr_categoria_id":"2",
                        "data_inserimento":"2014-05-23 05:05:32",
                        "data_lavorazione":"0000-00-00 00:00:00",
                        "data_chiusura":"0000-00-00 00:00:00",
                        "mittente_id":"38",
                        "latitudine":"38.858364","longitudine":"16.549469",
                        "foto_chiusura":"",
                        "data_accettazione":"0000-00-00 00:00:00",
                        "data_fine_lavorazione":"0000-00-00 00:00:00",
                        "note_notifica":"",
                        "note_chiusura":"",
                        "id_ente":"0",
                        "ente":"Nessun ente associato",
                        "nome_categoria":"Beni"
                    }]*/
/***
0:  da notificare all'ente          data_inserimento
1:  notificata all'ente             data_accettazione
2:  in lavorazione                  data_lavorazione
3:  in lavorazione                      "
4:  terminata                       data_fine_lavorazione
5:  chiusa                          data_chiusura
*/

/*
row.data_accettazione = '2014-05-07 12:00:00';
row.data_lavorazione = '2014-05-07 12:00:00';
row.data_fine_lavorazione = '2014-05-07 12:00:00';
row.data_chiusura = '2014-05-07 12:00:00';
row.descrizione_chiusura = 'Descrizione Descrizione Descrizione Descrizione';
*/
                    
                    
                    
                    html += '<li data-role="list-divider">' + row.nome_categoria + '</li>';
                    if(row.indirizzo && row.indirizzo.length > 0) {
                        html += '<li>' + row.indirizzo + '</li>';
                    }
                    html += '<li><strong>' + row.descrizione_problema + '</strong></li>';
                    if(row.foto != '') 
                        html += '<li><div class="replist-photo-container"><img src="' + row.foto + '" onclick="self.reportingListPageViewPhoto(this)" /></div></li>';
                    html += '<li>';
                    
                    /*
                    var insertDate = Date.parseFromYMDHMS(row.data_inserimento);
                    var acceptanceDate = Date.parseFromYMDHMS(row.data_accettazione);
                    var processingDate = Date.parseFromYMDHMS(row.data_lavorazione);
                    var completionDate = Date.parseFromYMDHMS(row.data_fine_lavorazione);
                    var closingDate = Date.parseFromYMDHMS(row.data_chiusura);
                    
                    if(insertDate != null) 
                        html += '<div><small>Inviata il ' + insertDate.toDMY() + ' alle ' + insertDate.toHM() + '</small></div>';
                    if(acceptanceDate != null) {
                        html += '<div><small>Notificata il ' + acceptanceDate.toDMY();
                        if(row.id_ente > 0) html += ' a ' + row.ente;
                        html += '</small></div>';
                    }
                    
                    if(closingDate != null) 
                        html += '<div><small>Chiusa il ' + closingDate.toDMY() + '</small></div>';
                    else if(completionDate != null) 
                        html += '<div><small>Terminata il ' + completionDate.toDMY() + '</small></div>';
                    else if(processingDate != null) 
                        html += '<div><small>In lavorazione dal ' + processingDate.toDMY() + '</small></div>';
                    */
                    
                    for(var j in row.log) {
                        html += '<div><small>' + row.log[j] + '</small></div>';
                    }
                    
                    if(row.descrizione_chiusura != '') 
                        html += '<div><small>' + row.descrizione_chiusura + '</small></div>';
                    
                    html +=  '</li>';
                }
            }
            list.html(html);
            list.listview('refresh');
            //$('#test').collapsible();
            /*$('div.replist-photo-container img', list).each(function(i, item) {
                //helper.imageCropToFit(item);
            });*/
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
        //self.setSidePanelPage('reportingMethodPage');
    },
    
    
    
    
    
    
    
    reportingQrCode : null,
    reportingLocalizationMode: null,
    REPORTING_LOCALIZATION_MODE_QRCODE: 1,
    REPORTING_LOCALIZATION_MODE_MANUAL: 2,
    reportingUpdateLatLng: false,
    initReportingPage: function() {
        var page = $('#reportingPage');
        $('#sendReportingButton', page).addClass('ui-disabled');
        services.getReportingCategories(function(result) {
            var html = '<option value="0" selected>Seleziona categoria</option>';
            for(var i in result) {
                var row = result[i];
                html += '<option value="'+row.id+'">'+row.nome+'</option>';
            }
            $('#reportingCategory', page).html(html);
            $('#reportingCategory', page).selectmenu('refresh');
            
            var priorityTexts = ['Nessuna', 'Bassa', 'Media', 'Alta'];
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
    showReportingPage: function() {
        var page = $('#reportingPage');
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
        if((self.latLng.lat > 0) && (!self.reportingUpdateLatLng)) return;
        $('#loaderIndicator', page).show();
        geoLocation.acquireGeoCoordinates(function(pos) {
            self.latLng.lat = pos.coords.latitude;
            self.latLng.lng = pos.coords.longitude;
            if((self.reportingLocalizationMode == self.REPORTING_LOCALIZATION_MODE_MANUAL) || self.reportingUpdateLatLng) {
                geoLocation.reverseGeocoding({lat: pos.coords.latitude, lng: pos.coords.longitude}, function(result) {
console.log(result);
                    var routeEl = $('#locationInfo span.route', page);
                    var cityEl =  $('#locationInfo span.city', page);
                    var provEl =  $('#locationInfo span.prov', page);
                    // Don't override data
                    if((routeEl.html() != '') || (cityEl.html() != '') || (provEl.html() != '')) return;
                    routeEl.html(result.road + " " + result.streetNumber);
                    cityEl.html(result.city);
                    provEl.html(result.prov);
                });
            }
            $('#loaderIndicator', page).hide();
            $('#sendReportingButton', page).removeClass('ui-disabled');
        }, function(e) {
            // If the device is unable to retrieve current geo coordinates,
            // set the default position to Rome and the map zoom to 
            //self.latLng = {lat: 0, lng: 0};
            //self.mapZoom = 5;
            $('#loaderIndicator', page).hide();
            $('#sendReportingButton', page).removeClass('ui-disabled');
            helper.alert(e, null, "Localizzazione GPS");
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
            mapTypeId: eval(config.GOOGLE_MAPS_TYPE_ID)
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

        //var infowindow = new google.maps.InfoWindow({content: '<div>Trascina il segnaposto nella posizione corretta<br />per consentirci di individuare con precisione<br />il punto della tua segnalazione.</div>'});
        //infowindow.open(self.map, self.marker);
    },
    
    
    
    
    
    
    editReportingDescription: function() {
        $('#reportingDescriptionPage textarea').val(
            $('#reportingPage #description').html()
        );
        $.mobile.changePage('#reportingDescriptionPage', {transition: 'slide'});
    },
    
    confirmReportingDescription: function() {
        $('#reportingPage #description').html(
            $('#reportingDescriptionPage textarea').val()
        );
        self.reportingUpdateLatLng = false;
        //$.mobile.changePage('#reportingPage', {transition: 'slide', reverse: true});
        $.mobile.back();
    },
    
    initReportingLocationPage: function() {
        var page = $('#reportingLocationPage');
        $('input#city', page).on('input', self.reportingLocationChanged);
        $('input#prov', page).on('input', self.reportingLocationChanged);
        $('textarea#route', page).on('input', self.reportingLocationChanged);
    },
    editReportingLocation: function() {
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
        console.log('reportingLocationChanged');
        var page = $('#reportingLocationPage');
        var params = {
            'city': $('input#city', page).val(),
            'prov': $('input#prov', page).val(),
            'address': $('textarea#route', page).val()
        };
        geoLocation.geocode(params, function(latLng) {
            self.map.setCenter(latLng);
            self.marker.position = latLng;
            self.map.setZoom(15);
        });
    },
    confirmReportingLocation: function() {
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
        //$.mobile.changePage('#reportingPage', {transition: 'slide', reverse: true});
        $.mobile.back();
    },
    
    
    /*
    reportingPriority: 0,
    setPriority: function(priority) {
        var priorityTexts = ['Nessuna priorità', 'Bassa priorità', 'Media priorità', 'Alta priorità'];
        var page = $('#reportingPage');
        $('#prioritySet a:not(.ui-nodisc-icon)', page).addClass('ui-nodisc-icon');
        $('#prioritySet a:nth-child('+(priority+1)+')', page).removeClass('ui-nodisc-icon');
        $('#priorityText', page).html(priorityTexts[priority]);
        self.reportingPriority = priority;
    },*/
    
    
    
    acquireReportingPhoto: function() {
        if($('#photoList li a img[data-acquired="0"]').first().length == 0) {
            helper.alert('Hai raggiunto il limite massimo', null, 'Scatta foto');
            return;
        }
        $('#reportingPage #acquirePhotoButton label').html('Acquisizione foto...');
        $('#reportingPage #acquirePhotoButton').addClass('ui-disabled');
        camera.getPicture(function(imageData) {
            var imgEl = $('#photoList li a img[data-acquired="0"]').first();
            if(imgEl.length == 1) {
                imgEl.attr('src', 'data:image/jpeg;base64,' + imageData).attr('data-acquired', '1');
                imgEl.removeClass('report-imagelist-missing').addClass('report-imagelist-done');
            }
            $('#reportingPage #acquirePhotoButton label').html('Scatta');
            $('#reportingPage #acquirePhotoButton').removeClass('ui-disabled');
        }, function(e) {
            //helper.alert(e, null, 'Impossibile scattare la foto');
            $('#reportingPage #acquirePhotoButton label').html('Scatta');
            $('#reportingPage #acquirePhotoButton').removeClass('ui-disabled');
        });
    },
    viewReportingPhoto: function(pos) {
        var imgEl = $('#reportingPage #photoList li a img[data-acquired="1"][data-pos="' + pos + '"]');
        if(imgEl.length == 0) return;
        $('#reportingPhotoPage img').attr('src', imgEl.attr('src')).attr('data-pos', imgEl.attr('data-pos'));
        var width = $('#reportingPhotoPage').width();
        $('#reportingPhotoPage img').css({'max-width' : width, 'height' : 'auto'});
        $.mobile.changePage('#reportingPhotoPage', {transition: 'pop'});
    },
    removeReportingPhoto: function() {
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
    
    sendReporting: function() {
//helper.alert(self.latLng.lat + ', ' + self.latLng.lng);return;
        // Validate report
        var page = $('#reportingPage');
        /*var description = $('#description', reportingPage).html().trim();
        var route = $('#locationInfo span.route', reportingPage).html().trim();
        var city = $('#locationInfo span.city', reportingPage).html().trim();
        var hasPhoto = ($('#photoList li a img[data-acquired="1"]', reportingPage).length > 0);*/
        var reporting = {
            qrCode: $('#qrCode', page).html(),
            latLng: self.latLng,
            categoryId: $('#reportingCategory', reportingPage).val(),
            road: $('#locationInfo span.route', reportingPage).html().trim(),
            city: $('#locationInfo span.city', reportingPage).html().trim(),
            prov: $('#locationInfo span.prov', reportingPage).html().trim(),
            description:  $('#description', reportingPage).html().trim(),
            //priority: self.reportingPriority,
            priority: $('#reportingPage #priority').val(),
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
        if(reporting.photos.length == 0) errors.push('- scatta almeno una foto');
        if(errors.length > 0) {
            helper.alert(errors.join('\n', null, 'Invia segnalazione'));
            return;
        }
//console.log(reporting);return;
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
        });
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
//console.dir(result);
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
        /*setTimeout(function() {
            $('#nearbyPlaceInfoPage #nearbyPlaceMap').height($.mobile.activePage.height()+'px');
        }, 100);*/
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
            /*var startingMarker = new google.maps.Marker({
                position: startingMarkerPoint,
                map: map,
                draggable: false,
                animation: google.maps.Animation.DROP,
                title: 'Tu'
            });
            map.panTo(startingMarkerPoint);
            map.setCenter(startingMarkerPoint, config.GOOGLE_MAPS_ZOOM);
            var infowindow = new google.maps.InfoWindow({content: '<div>Tu</div>'});
            infowindow.open(map, startingMarker);*/
        }
        $.mobile.loading('show');
        services.getNearbyPlaceInfo({id: self.nearbyPlaceId, source: self.nearbyPlaceSource}, function(result) {
            if(showMap) {
                var endingMarkerPoint = new google.maps.LatLng(result.lat, result.lng);
                /*var endingMarker = new google.maps.Marker({
                    position: endingMarkerPoint,
                    map: map,
                    draggable: false,
                    animation: google.maps.Animation.DROP,
                    title: result.name
                });
                var infowindow2 = new google.maps.InfoWindow({content: '<div>' + result.name + '</div>'});
                infowindow2.open(map, endingMarker);*/
                /*var bounds = new google.maps.LatLngBounds();
                bounds.extend(startingMarker.position);
                bounds.extend(endingMarker.position);
                map.fitBounds(bounds);*/
                
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