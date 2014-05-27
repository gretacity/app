var app = {
    language : '',
    initialize: function() {
        this.bindEvents();
        geoLocation.loadGoogleMapsScript('app.mapsScriptLoaded');
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('online', this.onOnline, false);
        document.addEventListener('offline', this.onOffline, false);
        
        if(config.EMULATE_ON_BROWSER) app.onDeviceReady();
        
        var loginPage = $('#loginPage');
        $('#username', loginPage).val(config.LOGIN_DEFAULT_USERNAME);
        $('#password', loginPage).val(config.LOGIN_DEFAULT_PASSWORD);
        $('#loginButton', loginPage).on('click', app.login);
        var registerPage = $('#registrationPage');
        $('#registerButton', registerPage).on('click', app.register);
        var homePage = $('#homePage');
        homePage.on('pageinit', app.initHome);
        var infoPage = $('#qrCodeInfoPage');
        $('#getInfoButton', infoPage).on('click', app.getInfoFromQrCode);
        var reportingListPage = $('#reportingListPage');
        reportingListPage.on('pagebeforeshow', app.loadReportingItems);
        $('#refreshReportingListButton', reportingListPage).on('click', app.loadReportingItems);
        //$('#loadMoreReportingItemsButton', reportingListPage).on('click', app.loadReportingItems);
        var reportingPage = $('#reportingPage');
        reportingPage.on('pageinit', app.initReportingPage);
        reportingPage.on('pagebeforeshow', app.showReportingPage);
        $('#editDesciptionButton', reportingPage).on('click', app.editReportingDescription);
        $('#reportingDescriptionPage #confirmDescriptionButton').on('click', app.confirmReportingDescription);
        $('#editLocationButton', reportingPage).on('click', app.editReportingLocation);
        $('#acquirePhotoButton', reportingPage).on('click', app.acquireReportingPhoto);
        $('#reportingPhotoPage #removePhotoButton').on('click', app.removeReportingPhoto);
        $('#sendReportingButton', reportingPage).on('click', app.sendReporting);
        var reportingLocationPage = $('#reportingLocationPage');
        reportingLocationPage.on('pageshow', app.mapsSetup);
        $('#confirmLocationButton', reportingLocationPage).on('click', app.confirmReportingLocation);
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
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        if(typeof(navigator.language) == 'string') {
            app.language = navigator.language;
        } else {
            navigator.globalization.getPreferredLanguage(
                function (language) {app.language = language.value},
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
        auth.login({username: username, password: password}, function(data) {
            // Successfully loggedin, move forward
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
            $('#reportingCount').html(result.reportinCount);
            $('#newsCount').html(result.newsCount);
            $('#commentsCount').html(result.commentsCount);
        }, function(e) {
            // Error occurred
            // che famo?
        });
        
    },
    
    
    
    
    getInfoFromQrCode: function() {
        barcodeReader.acquireQrCode(function(code) {
            //successCallback
            services.getInfoFromQrCode(code, function(result) {
                //successCallback
                if(result == null) {
                    helper.alert('Non ci sono informazioni disponibili', null, 'Ottieni info');
                    return;
                }
                // Format result
                var html = '<div class="ui-body ui-body-a ui-corner-all" data-form="ui-body-a" data-theme="a">' +
                           '<h3>' + result.name + '</h3><p style="text-align:left;">' + result.text + '</p></div>';
                html += '<input type="checkbox" onchange="app.followQrCode()" id="following" ' + (result.following ? ' checked' : '') + '/> <label for="following">segui</label>';
                //html += '<h4>Commenti</h4>';
                if(result.comments.length == 0) {
                    html += '<p style="text-align:left;">Non ci sono commenti</p>';
                } else {
                    html += '<ul id="commentList" style="text-align:left;" data-inset="true">';
                    html += '<li data-role="list-divider">Commenti</li>';
                    for(var i in result.comments) {
                        var c = result.comments[i];
                        html += '<li><p>' + c.text + 
                                '</p><small>27/02/2104, user1</small>'
                                '</li>';
                    }
                    html += '</ul>';
                }
                html += '<textarea id="comment" style="width:98%" placeholder="Lascia il tuo commento"></textarea><br /><a href="javascript:app.leaveCommentOnQrCode()" class="ui-btn">Invia</a>';
                html += '<div style="height:150px;"></div>';
                $('#qrCodeInfoPage #infoResult').html(html);
                $('#qrCodeInfoPage #infoResult #following').checkboxradio();
                $('#qrCodeInfoPage #infoResult #commentList').listview();
            }, function(e) {
                // errorCallback
                helper.alert('Impossibile recuperare informazioni', null, 'Ottieni info');
            });
        }, function(e) {
            // errorCallback
            helper.alert('Impossibile leggere il codice', null, 'Ottieni info');
        });
    },
    
    followQrCode: function() {
        var follow = $('#qrCodeInfoPage #infoText #following').is(':checked');
        services.followQrCode(follow);
    },
    
    leaveCommentOnQrCode: function() {
        var text = $('#qrCodeInfoPage #comment').val().trim();
        if(text == '') return;
        services.leaveCommentOnQrCode({text: text}, function() {
            // success
            $('#qrCodeInfoPage #infoResult #commentList').append('<li><p>' + text + '</p><small>adesso, tu</small></li>');
            $('#qrCodeInfoPage #infoResult #commentList').listview('refresh');
            $('#qrCodeInfoPage #comment').val('');
        }, function(e) {
            // error
            helper.alert('Impossibile inviare il commento', null, 'Lascia il commento');
        });
    },
    
    
    
    
    
    loadReportingItems: function() {
        $.mobile.loading('show');
        services.getReportingList({}, function(result) {
            // Success
            var list = $('#reportingListPage #reportingList');
            var html = '';
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
                    "nome_categoria":"Beni"
                }]*/
                html += '<li data-role="list-divider">' + row.nome_categoria + '</li>';
                html += '<li><!--a href=""-->';
                //html +=  '<h2>' + row.nome_categoria + '</h2>';
                html +=  '<p><strong>' + row.descrizione_problema + '</strong></p>';
                //html +=  '<p>' + row.commento + '</p>';
                //html +=  '<p class="ui-li-aside"><strong>' + row.orario + '</strong></p>';
                if(row.foto != '') html += '<div><img src="' + row.foto + '" style="width:100%" /></div>';
                var insertDate = Date.parseFromYMDHMS(row.data_inserimento);
                if(insertDate != null) html += '<small>inserita il ' + insertDate.toDMYHMS() + '</small>';
                var acceptanceDate = Date.parseFromYMDHMS(row.data_accettazione);
                if(acceptanceDate != null) html += '<small>accettata il ' + acceptanceDate.toDMY() + '</small>';
                var processingDate = Date.parseFromYMDHMS(row.data_lavorazione);
                if(processingDate != null) html += '<small>in lavorazione dal ' + processingDate.toDMY() + '</small>';
                var completionDate = Date.parseFromYMDHMS(row.data_fine_lavorazione);
                if(completionDate != null) html += '<small>completata il ' + completionDate.toDMY() + '</small>';
                var closingDate = Date.parseFromYMDHMS(row.data_chiusura);
                if(closingDate != null) html += '<small>chiusa il ' + completionDate.toDMY() + '</small>';
                if(row.descrizione_chiusura != '') html += '<br />' + row.descrizione_chiusura;
                html +=  '<!--/a--></li>';
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
                helper.alert("Si sono verificati errori durante il caricamento", null, "Segnalazioni");
            }
        });
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
            html2 += '<li><a href="#" onclick="app.viewReportingPhoto()">' +
                        '<img src="" class="report-imagelist-missing" data-pos="0" data-acquired="0" />' +
                    '</a></li>';
        }
        $('#photoList', page).html(html2);
    },
    showReportingPage: function() {
        if(app.latLng.lat > 0) return;
        var page = $('#reportingPage');
        $('#loaderIndicator', page).show();
        geoLocation.acquireGeoCoordinates(function(pos) {
            app.latLng.lat = pos.coords.latitude;
            app.latLng.lng = pos.coords.longitude;
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
            //app.latLng = {lat: 0, lng: 0};
            //app.mapZoom = 5;
            $('#loaderIndicator', page).hide();
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
        if(app.map != null) google.maps.event.clearListeners(app.map);
        var lat = app.latLng.lat;
        var lng = app.latLng.lng;
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
        app.map = new google.maps.Map(document.getElementById('map'), options);
        app.mapsSetMarker();
    },
    mapsSetMarker: function() {
        if(app.map == null) return;
//console.log("Setting map position to " + app.latLng.lat + " " + app.latLng.lng);
        var lat = app.latLng.lat;
        var lng = app.latLng.lng;
        var mapZoom = config.GOOGLE_MAPS_ZOOM;
        if(lat == 0) {
            // Set default lat lng is set to Rome
            lat = 41.900046; lng = 12.477215;
            mapZoom = 5;
        }
        
        var markerPoint = new google.maps.LatLng(lat, lng);
        app.marker = new google.maps.Marker({
            position: markerPoint,
            map: app.map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            title: 'Luogo della segnalazione'
        });
        app.map.panTo(markerPoint);
        app.map.setCenter(markerPoint, config.GOOGLE_MAPS_ZOOM);
        google.maps.event.addListener(
            app.marker, 
            'dragend', 
            function() {
                app.latLng.lat = app.marker.getPosition().lat();
                app.latLng.lng = app.marker.getPosition().lng();
        });
        var infowindow = new google.maps.InfoWindow({content: '<div>Trascina il segnaposto nella posizione corretta<br />per consentirci di individuare con precisione<br />il punto della tua segnalazione.</div>'});
        infowindow.open(app.map, app.marker);
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
        camera.getPicture(function(imageData) {
            var imgEl = $('#photoList li a img[data-acquired="0"]').first();
            if(imgEl.length == 1) {
                imgEl.attr('src', 'data:image/jpeg;base64,' + imageData).attr('data-acquired', '1');
                imgEl.removeClass('report-imagelist-missing').addClass('report-imagelist-done');
            }
        }, function(e) {
            //helper.alert(e, null, 'Impossibile scattare la foto');
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
            latLng: app.latLng,
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
        
        services.sendReporting(reporting, function() {
            // Successfully sent
            $('#sendReportingButton', page).html(initialValue).removeClass('ui-disabled');
            reporting = null;
            app.latLng.lat = 0;
            app.latLng.lng = 0;
            $('#description', page).html('');
            $('#photoList', page).html('');
            helper.alert('La tua segnalazione è stata inoltrata con successo', function() {
                $.mobile.changePage('#reportingListPage', {transition: 'slide', reverse: true});
            }, 'Invia segnalazione');
        }, function(e) {
            // An error occurred
            $('#sendReportingButton', page).html(initialValue).removeClass('ui-disabled');
            helper.alert(e, null, 'Invia segnalazione');
        });
    }
};

/*
$(function(){
    $( '#LoginForm' ).bind( 'submit', UserLogin );
    // $( document ).bind( "pagebeforeload", AppLoadJSON );
    // $( '#home' ).bind( 'pagebeforeload', AppLoadJSON );
    $( '#home' ).on( 'pageinit', AppLoad_JSON );
    $( '#segnalazioni' ).on( 'pageinit', AppLoad_SEGNALAZIONI );
});*/
