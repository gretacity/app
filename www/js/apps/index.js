var app = {
    self: null,
    language : '',
    initialize: function() {
        self = this;
        this.bindEvents();
        geoLocation.loadGoogleMapsScript('self.mapsScriptLoaded');
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', self.onDeviceReady, false);
        document.addEventListener('online', self.onOnline, false);
        document.addEventListener('offline', self.onOffline, false);
        
        if(config.EMULATE_ON_BROWSER) self.onDeviceReady();
        
        var loginPage = $('#loginPage');
        loginPage.on('pagebeforeshow', function() {$('#password', loginPage).val('');});
        $('#username', loginPage).val(config.LOGIN_DEFAULT_USERNAME);
        $('#password', loginPage).val(config.LOGIN_DEFAULT_PASSWORD);
        $('#loginButton', loginPage).on('click', self.login);
        var profilePage = $('#profilePage');
        profilePage.on('pagebeforeshow', self.initProfilePage);
        //$('#logoutButton', profilePage).on('click', self.logout);
        var channelSubscriptionPage = $('#channelSubscriptionPage');
        channelSubscriptionPage.on('pagebeforeshow', self.initChannelSubscriptionPageBeforeShow);
        channelSubscriptionPage.on('pageshow', self.initChannelSubscriptionPage);
        $('#city', channelSubscriptionPage).change(self.subscriptionCityChanged);
        //$('#cityNameManual', channelSubscriptionPage).on('keyup', self.cityNameManualChanged);
        $('#cityNameManual', channelSubscriptionPage).on('input', self.cityNameManualChanged);
        var newsPage = $('#newsPage');
        newsPage.on('pageinit', self.initNewsPage);
        newsPage.on('pagebeforeshow', self.beforeShowNewsPage);
        newsPage.on('pagebeforehide', self.beforeHideNewsPage);
        $('#subscribedChannels', newsPage).on('change', self.retrieveChannelContent);
        $('#moreNewsButton', newsPage).on('click', self.retrieveMoreChannelContent);
        $('#newContentReceivedButton', newsPage).on('click', self.showNewChannelContentReceived);
        var newsDetailPage = $('#newsDetailPage');
        newsDetailPage.on('pagebeforeshow', self.initNewsDetailPage);
        var registerPage = $('#registrationPage');
        $('#registerButton', registerPage).on('click', self.register);
        var homePage = $('#homePage');
        homePage.on('pageinit', self.initHome);
        $('#logoutButton', homePage).on('click', self.logout);
        var infoPage = $('#qrCodeInfoPage');
        $('#getInfoButton', infoPage).on('click', self.getInfoFromQrCode);
        var reportingListPage = $('#reportingListPage');
        reportingListPage.on('pagebeforeshow', self.loadReportingItems);
        $('#refreshReportingListButton', reportingListPage).on('click', self.loadReportingItems);
        //$('#loadMoreReportingItemsButton', reportingListPage).on('click', self.loadReportingItems);
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
        reportingLocationPage.on('pageshow', self.mapsSetup);
        $('#confirmLocationButton', reportingLocationPage).on('click', self.confirmReportingLocation);
        var nearbyPage = $('#nearbyPage');
        nearbyPage.on('pageinit', self.initNearbyPage);
        var nearbyResultsPage = $('#nearbyResultsPage');
        nearbyResultsPage.on('pagebeforeshow', self.beforeShowNearbyPage);
    },
    onOnline: function() {
        $('#loginPage #loginButton').removeClass('ui-disabled');
    },
    onOffline: function() {
        $('#loginPage #loginButton').addClass('ui-disabled');
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
                function (language) {self.language = language.value},
                function () {}
            );
        }
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        /*var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');*/
        console.log('Received Event: ' + id);
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
        $('#loginButton', page).html('Accesso in corso...').addClass('ui-disabled');
        $('#registerPageButton', page).addClass('ui-disabled');
        $.mobile.loading('show');
        auth.login({username: username, password: password}, function(result) {
            // Successfully loggedin, move forward
            $('#username').removeClass('ui-disabled');
            $('#password').removeClass('ui-disabled').val('');
            $('#loginButton').removeClass('ui-disabled');
            $('#registerPageButton').removeClass('ui-disabled');
            $.mobile.changePage('index.html#homePage');
        }, function(e) {
            $.mobile.loading('hide');
            $('#loginButton', page).html(initialVal).removeClass('ui-disabled');
            helper.alert('Login non valido', function() {
                $('#username').removeClass('ui-disabled');
                $('#password').removeClass('ui-disabled');
                $('#loginButton').removeClass('ui-disabled');
                $('#registerPageButton').removeClass('ui-disabled');
            }, 'Login');
        });
    },
    
    logout: function() {
        auth.setSessionId(null);
        $.mobile.changePage('#loginPage', {transition: 'slide', reverse: true});
    },
    
    register: function() {
        var params = {lastname: '', firstname: '', phone: '', email: ''};
        // Validation
        var hasErrors = false;
        var requiredFields = ['lastname', 'firstname', 
                              //'phone', 
                              'email'];
        for(var i in requiredFields) {
            var fieldId = requiredFields[i];
            var fieldVal = $('#' + fieldId).val().trim();
            if(fieldVal == '') {
                $('label[for="' + fieldId + '"]').addClass('fielderror');
                hasErrors = true;
            } else {
                $('label[for="' + fieldId + '"]').removeClass('fielderror');
                eval('params.'+fieldId+'="'+fieldVal+'"');
            }
        }
        if(hasErrors) {
            helper.alert('Alcuni campi non sono stati compilati', null, 'Registrazione');
            return;
        }
        /*// Specific validation for phone number
        if(!helper.isPhoneNumberValid(params.phone)) {
            $('label[for="phone"]').addClass('fielderror');
            helper.alert('Inserisci un numero di telefono valido', function() {
                $('#phone').focus();
            }, 'Registrazione');
            return;
        }*/
        // Specific validation for email
        if(!helper.isEmailValid(params.email)) {
            $('label[for="email"]').addClass('fielderror');
            helper.alert('Inserisci un indirizzo email valido', function() {
                $('#email').focus();
            }, 'Registrazione');
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
            helper.alert(e, null, 'Registrazione');
        });
    },
    
    
    
    
    
    initHome: function() {
        services.getSummaryData(function(result) {
            // Success
            $('#reportingCount').html(result.reportingCount);
            $('#newsCount').html(result.newsCount);
            $('#commentsCount').html(result.commentsCount);
        }, function(e) {
            // Error occurred
            // che famo?
        });
        
    },
    
    
    
    
    
    initProfilePage: function() {
        services.getSubscribedChannels(function(result) {
            var page = $('#profilePage');
            var html = '<li data-role="list-divider"><label>I tuoi Canali</label></li>';
            for(var i in result) {
                var channelId = result[i].id_feed;
                var channelName = result[i].nome_feed;
                html += '<li><a href="#newsPage" style="padding:0 40px 0 0;">'+
                            '<input type="checkbox" id="channel' + channelId + '" data-id="' + channelId + '" checked />'+
                            '<label for="channel' + channelId + '">' + channelName + '</label>'+
                        '</a></li>';
            }
            $('#subscribedChannels', page).html(html).listview('refresh');
            $('#subscribedChannels li input[type="checkbox"]', page).checkboxradio().on('click', function() {
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
            html += '<option value="manual">Cerca manualmente</option>';
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
            var cityId = selectedItem.attr('data-cityid');
            var provId = selectedItem.attr('data-provid');
            var regionId = selectedItem.attr('data-regid');
            self.getAvailableChannels(cityId, provId, regionId);
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
                    html += '<li><a href="javascript:self.getAvailableChannels('+row.id+',' + row.id_provincia + ', ' + row.id_regione + ')">' + row.nome.trim() + ', ' + row.sigla.trim() + '</a></li>';
                }
                $('#channelSubscriptionPage #citySuggestions').html(html).listview("refresh");
//console.dir(result);
            });
        }
    },
    getAvailableChannels: function(cityId, provId, regionId) {
//alert(cityId+', '+provId+', '+regionId);return;
        $.mobile.loading('show');
        $('#channelSubscriptionPage #availableChannelsContainer').show();
        $('#channelSubscriptionPage #availableChannelList').empty();
        services.getAvailableChannels({cityId: cityId, provId: provId, regionId: regionId}, function(result) {
            var html = '';
            if(result.length == 0) {
                html = '<label>Nessun canale disponibile</label>';
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
            var channelsElements = $('#newsPage #subscribedChannels');
            if(subscribe) {
                //var selectedValue = channelsElements.val();
                channelsElements.append('<option value="' + channelId + '" >' + channelName + '</option>');
            } else {
                $('option[value="' + channelId + '"]', channelsElements).remove();
            }
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
    
    
    
    
    
    
    
    
    NEWS_UPDATE_CONTENT: 20000, // 20000 is 20 secs
    newsEmptyBeforeShow: true,
    newsChannelId: 0,
    newsContentLastId: null,
    newsContentFirstId: null,
    newChannelContentReceived: [],
    newsContentTimeout: null,
    initNewsPage: function() {
        services.getSubscribedChannels(function(result) {
            self.newsContentLastId = null;
            self.newsContentFirstId = null;
            var page = $('#newsPage');
            $('#channelContent', page).empty();
            var html = '';
            for(var i in result) {
                html += '<option value="' + result[i].id_feed + '">' + result[i].nome_feed + '</option>';
            }
            $('#subscribedChannels', page).html(html).selectmenu('refresh'); //.trigger('change');
            app.newsChannelId = $('#subscribedChannels', page).val();
            $('#subscribedChannels', page).parents('div.ui-btn').css({width:'85%'}).parents('div.ui-select').css({'text-align': 'center'})
        }, function(e, loginRequired) {
            if(loginRequired) $.mobile.changePage('#loginPage');
        });
    },
    beforeShowNewsPage: function() {
        var onlyNew = !self.newsEmptyBeforeShow;
        if(self.newsEmptyBeforeShow === true) {
            $('#newsPage #channelContent').empty();
        } else {
            self.newsEmptyBeforeShow = true;
        }
        if(self.newsContentTimeout == null) {
            setTimeout(function() {
                self.retrieveChannelContent(onlyNew);
            }, 100); // start immediatly
        }
    },
    beforeHideNewsPage: function() {
        if(self.newsContentTimeout != null) {
            clearTimeout(self.newsContentTimeout);
            self.newsContentTimeout = null;
        }
    },
    formatChannelContentItem: function(item) {
        var rowId = parseInt(item.id);
        var dateAdded = Date.parseFromYMDHMS(item.data_inserimento);
        return '<li><a href="javascript:self.showNewsDetail(' + item.id + ')">' +
                    '<span>Inserito il ' + dateAdded.toDMY() + ' alle ' + dateAdded.toHM() + '</span>' +
                    '<p style="white-space:normal;">' + item.descrizione + '</p>' +
               '</a></li>';
        // First ID is the top of the list and has id more greater then others
        if((self.newsContentFirstId == null) || (self.newsContentFirstId < rowId)) self.newsContentFirstId = rowId;
        if((self.newsContentLastId == null) || (self.newsContentLastId > rowId)) self.newsContentLastId = rowId;
    },
    retrieveChannelContent: function(onlyNew) {
        
        onlyNew = onlyNew || false;
        
        if(!onlyNew) {
            $.mobile.loading('show');
        }
        
        if(self.newsContentTimeout != null) clearTimeout(self.newsContentTimeout);
        
        var channelId = (this == self) ? self.newsChannelId : $(this).val();
        
        if(channelId != self.newsChannelId) {
            self.newsContentFirstId = null;
            self.newsContentLastId = null;
        }
        
        var params = {
            channelId: channelId, 
            lastId: self.newsContentLastId,
            firstId: self.newsContentFirstId,
            onlyNew: onlyNew
        };
        
        services.getChannelContent(params, function(result) {            
            var html = '';
                        
            if(typeof(result.vecchie) != 'undefined') {
                if(result.vecchie.length > 0) {
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
            
            if(self.newsChannelId != params.channelId) {
                self.newsChannelId = params.channelId;
                $('#newsPage #channelContent').html(html).listview('refresh');
            } else {
                $('#newsPage #channelContent').append(html).listview('refresh');
            }
            
if(onlyNew === true) {
    console.log('Checking for news updates...');
}
            if((typeof(result.nuove) != 'undefined') && (Array.isArray(result.nuove)) && (result.nuove.length > 0)) {
                self.newChannelContentReceived = result.nuove;
if(onlyNew === true) {
    console.log('Found ' + self.newChannelContentReceived.length);
}
                $('#newContentReceivedButton').html(
                    self.newChannelContentReceived.length + (self.newChannelContentReceived.length > 1 ? ' nuove' : ' nuova')
                ).show('fast');
            }
            
            //self.newsContentTimeout = setTimeout(self.retrieveChannelContent, 2000);
            self.newsContentTimeout = setTimeout(function() {
                if($.mobile.activePage.attr('id') == 'newsPage') {
                    self.retrieveChannelContent(true);
                }
            }, self.NEWS_UPDATE_CONTENT);
            
            $.mobile.loading('hide');
        }, function(e, loginRequired) {
            $.mobile.loading('hide');
            if(loginRequired) {
                $.mobile.changePage('#loginPage');
                return;
            }
            if($.mobile.activePage.attr('id') != 'newsPage') return;
            if(onlyNew) {
                self.newsContentTimeout = setTimeout(function() {
                    self.retrieveChannelContent(true);
                }, self.NEWS_UPDATE_CONTENT);
            } else {
                helper.alert('Impossibile recuperare il contenuto', function() {
                    self.newsContentTimeout = setTimeout(function() {
                        self.retrieveChannelContent(true);
                    }, self.NEWS_UPDATE_CONTENT);
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
        $.mobile.loading('show');
        var id = self._newsDetailId;
        self._newsDetailId = null;
        services.getChannelContentDetail({id: id}, function(result) {
            var page = $('#newsDetailPage');
            var dateAdded = Date.parseFromYMDHMS(result.data_inserimento);
            $('div[data-role="header"] h1', page).html(result.oggetto);
            $('#newsDate', page).html("Inserita il " + dateAdded.toDMY() + " alle " + dateAdded.toHM());
            $('#newsText', page).html(result.descrizione);
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
    
    
    
    
    
    
    getInfoFromQrCode: function() {
        barcodeReader.acquireQrCode(function(code) {

            if(config.QR_CODE_TEST != '') code = config.QR_CODE_TEST;
            
            $.mobile.loading('show');
            services.getInfoFromQrCode(code, function(result) {
                $.mobile.loading('hide');
                if(result == null) {
                    $('#qrCodeInfoPage #qrCodeId').val('');
                    helper.alert('Non ci sono informazioni disponibili', null, 'Ottieni info');
                    return;
                }
                $('#qrCodeInfoPage #qrCodeId').val(code);
                // Format result
                var html = '<div class="ui-body ui-body-a ui-corner-all" data-form="ui-body-a" data-theme="a">' +
                           '<h3>' + result.info.nome + '</h3><p style="text-align:left;">' + result.info.descrizione + '</p></div>';
                html += '<input type="checkbox" onchange="self.followQrCode()" id="following" ' + (result.following ? ' checked' : '') + '/> <label for="following">segui</label>';
                
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
                if(result.links.length > 0) {
                    html += '<ul id="links" style="text-align:left;" data-inset="true">';
                    html += '<li data-role="list-divider">Link</li>';
                    for(var i in result.links) {
                        var l = result.links[i];
                        html += '<li><a href="#" onclick="javascript:self.openLink(\'' + l.link.replace(/'/g, "''") + '\')" target="_system">' + l.nome + '</a></li>';
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
                html += '<textarea id="comment" style="width:98%" placeholder="Lascia il tuo commento"></textarea><br /><a href="javascript:self.leaveCommentOnQrCode()" class="ui-btn">Invia</a>';
                html += '<div style="height:150px;"></div>';
                $('#qrCodeInfoPage #infoResult').html(html);
                $('#qrCodeInfoPage #infoResult #following').checkboxradio();
                $('#qrCodeInfoPage #infoResult #commentList').listview();
                $('#qrCodeInfoPage #infoResult #links').listview();
                if(hasSlider) {
                    var glide = $('.slider').glide({
                        //autoplay: false, // or 4000
                        arrowLeftText: '',
                        arrowRightText: ''
                    });
                }
            }, function(e, loginRequired) {
                $.mobile.loading('hide');
                $('#qrCodeInfoPage #qrCodeId').val('');
                if(loginRequired) {
                    $.mobile.changePage('#loginPage');
                } else {
                    helper.alert('Impossibile recuperare informazioni', null, 'Ottieni info');
                }
            });
        }, function(e) {
            $('#qrCodeInfoPage #qrCodeId').val('');
            // errorCallback
            helper.alert('Impossibile leggere il codice', null, 'Ottieni info');
        });
    },
    
    openLink: function(url) {
        var ref = window.open(url, '_system', 'location=yes');
    },
    
    followQrCode: function() {
        var follow = $('#qrCodeInfoPage #infoText #following').is(':checked');
        services.followQrCode(follow);
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
        services.getReportingList({}, function(result) {
            // Success
            var list = $('#reportingListPage #reportingList');
            var html = '';
            if(result.length == 0) {
                html += '<li data-role="list-divider">Non ci sono segnalazioni</li><li><a href="#reportingPage">segnala</a></li>';
            } else {
                for(var i in result) {
                    var row = result[i];
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
                    html += '<li><strong>' + row.descrizione_problema + '</strong></li>';
                    if(row.foto != '') 
                        html += '<li><div class="replist-photo-container"><img src="' + row.foto + '" onclick="self.reportingListPageViewPhoto(this)" /></div></li>';
                    html += '<li>';
                    
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
                    
                    if(row.descrizione_chiusura != '') 
                        html += '<div><small>' + row.descrizione_chiusura + '</small></div>';
                    
                    html +=  '<!--/a--></li>';
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
                helper.alert("Si sono verificati errori durante il caricamento", null, "Segnalazioni");
            }
        });
    },
    reportingListPageViewPhoto: function(el) {
        $('#photoPage #photo').attr('src', $(el).attr('src'));
        $.mobile.changePage('#photoPage');
    },
    
    
    
    
    
    
    
    
    
    
    initReportingPage: function() {
        var page = $('#reportingPage');
        $('#sendReportingButton', page).addClass('ui-disabled');
        services.getReportingCategories(function(result) {
            var html = '<option value="0" selected>seleziona</option>';
            for(var i in result) {
                var row = result[i];
                html += '<option value="'+row.id+'">'+row.descrizione+'</option>';
            }
            $('#reportingCategory', page).html(html);
            $('#reportingCategory', page).selectmenu('refresh');
        }, function(e, loginRequired) {
            if(loginRequired) {
                $.mobile.changePage('#loginPage');
            } else {
                helper.alert(e, null, 'Invia segnalazione');
            }
        });
        var html2 = '';
        for(var i = 0; i < config.REPORTING_MAX_PHOTOS; i++) {
            html2 += '<li><a href="#" onclick="self.viewReportingPhoto()">' +
                        '<img src="" class="report-imagelist-missing" data-pos="0" data-acquired="0" />' +
                    '</a></li>';
        }
        $('#photoList', page).html(html2);
    },
    showReportingPage: function() {
        if(self.latLng.lat > 0) return;
        var page = $('#reportingPage');
        $('#loaderIndicator', page).show();
        geoLocation.acquireGeoCoordinates(function(pos) {
            self.latLng.lat = pos.coords.latitude;
            self.latLng.lng = pos.coords.longitude;
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
            'dragend', 
            function() {
                self.latLng.lat = self.marker.getPosition().lat();
                self.latLng.lng = self.marker.getPosition().lng();
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
        $('#reportingPage #description').html(
            $('#reportingDescriptionPage textarea').val()
        );
        $.mobile.changePage('#reportingPage', {transition: 'slide', reverse: true});
    },
    
    editReportingLocation: function() {
        $('#reportingLocationPage input#city').val(
            $('#reportingPage #locationInfo span.city').html()
        );
        $('#reportingLocationPage input#prov').val(
            $('#reportingPage #locationInfo span.prov').html()
        );
        $('#reportingLocationPage textarea#route').val(
            $('#reportingPage #locationInfo span.route').html()
        );
        $.mobile.changePage('#reportingLocationPage', {transition: 'slide'});
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
        $.mobile.changePage('#reportingPage', {transition: 'slide', reverse: true});
    },
    
    
    
    
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
    viewReportingPhoto: function() {
        var imgEl = $('#reportingPage #photoList li a img[data-acquired="1"]');
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
        $.mobile.changePage('#reportingPage', {transition: 'pop', reverse: true});
    },
    
    sendReporting: function() {
        // Validate report
        var page = $('#reportingPage');
        /*var description = $('#description', reportingPage).html().trim();
        var route = $('#locationInfo span.route', reportingPage).html().trim();
        var city = $('#locationInfo span.city', reportingPage).html().trim();
        var hasPhoto = ($('#photoList li a img[data-acquired="1"]', reportingPage).length > 0);*/
        var reporting = {
            latLng: self.latLng,
            categoryId: $('#reportingCategory', reportingPage).val(),
            road: $('#locationInfo span.route', reportingPage).html().trim(),
            city: $('#locationInfo span.city', reportingPage).html().trim(),
            prov: $('#locationInfo span.prov', reportingPage).html().trim(),
            description:  $('#description', reportingPage).html().trim(),
            photos: []
        };
        $('#photoList li a img[data-acquired="1"]', reportingPage).each(function() {
            // remove 
            var src = $(this).attr('src');
            var pos = src.indexOf('base64,');
            reporting.photos.push(src.substr(pos+7));
        });
        
        //console.log(reporting);
        
        var errors = [];
        if(reporting.categoryId == '0') errors.push('- seleziona la categoria');
        if(reporting.prov == '') errors.push('- specifica la provincia');
        if((reporting.road == '') || (reporting.comune == '')) errors.push('- specifica l\'indirizzo');
        if(reporting.description == '') errors.push('- inserisci la descrizione');
        if(reporting.photos.length == 0) errors.push('- scatta almeno una foto');
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
            $('#photoList', page).html('');
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
    nearbyCurrentPos: null,
    nearbyDistance: config.NEARBY_DEFAULT_DISTANCE,
    initNearbyPage: function() {
        self.nearbyCurrentPos = null;
        var placeTypes = [
            {id: 1, catName: 'Ristoranti'},
            {id: 2, catName: 'Farmacie'}
        ];
        var html = '';
        for(var i in placeTypes) {
            var place = placeTypes[i];
            html += '<li><a href="javascript:self.showNearbyPlaces(' + place.id + ')">' + place.catName + '</a></li>';
        }
        $('#nearbyPage #placeTypeList').html(html).listview('refresh');
        geoLocation.acquireGeoCoordinates(function(result) {
            //console.log(result);
            self.nearbyCurrentPos = result;
        }, function(e) {
            console.log(e);
        });
    },
    showNearbyPlaces: function(catId) {
        if(self.nearbyCurrentPos == null) {
            helper.alert('Impossibile recuperare la posizione GPS', null, 'QUI vicino');
            return;
        }
        self.nearbyCategoryId = catId;
        $.mobile.changePage('#nearbyResultsPage', {transition: 'slide'});
    },
    beforeShowNearbyPage: function() {
        if(self.nearbyCategoryId != null) {
            self.searchNearbyPlaces(self.nearbyCategoryId);
            //self.nearbyCategoryId = null;
        }
   
// TODO Move from here
$('#nearbyResultsPage #nearbySearchSlider').on('slidestop', function() {
    self.nearbyDistance = $('#nearbyResultsPage #nearbySearchSlider').val();
    // refine search
    self.searchNearbyPlaces();
});
        
    },
    searchNearbyPlaces: function() {
        $.mobile.loading('show');
        var options = {
            coords: self.nearbyCurrentPos,
            distance: self.nearbyDistance,
            placeCatId: self.nearbyCategoryId
        };
        services.getNearbyMePlaces(options, function(result) {
console.dir(result);
            var html = '';
            for(var i in result) {
                var row = result[i];
                html += '<li><a href="#">' + row.name + '</a></li>';
            }
            $('#nearbyResultsPage #placesList').html(html).listview('refresh');
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
    }
    
    
    
    
};