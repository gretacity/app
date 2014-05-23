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
        reportingListPage.on('pageinit', app.initReportingList);
        $('#loadMoreReportingItemsButton', reportingListPage).on('click', app.loadReportingItems);
        var reportingPage = $('#reportingPage');
        reportingPage.on('pageinit', app.initRepotingPage);
        $('#editDesciptionButton', reportingPage).on('click', app.editReportingDescription);
        $('#reportingDescriptionPage #confirmDescriptionButton').on('click', app.confirmReportingDescription);
        $('#editLocationButton', reportingPage).on('click', app.editReportingLocation);
        var reportingLocationPage = $('#reportingLocationPage');
        reportingLocationPage.on('pageshow', app.mapsSetup);
        $('#confirmLocationButton', reportingLocationPage).on('click', app.confirmReportingLocation);
        $('#acquirePhotoButton', reportingPage).on('click', app.acquirePhoto);
        $('#photoList li a', reportingPage).on('click', app.viewPhoto);
        $('#reportingPhotoPage #removePhotoButton').on('click', app.removePhoto);
        $('#sendReportingButton', reportingPage).on('click', app.sendReporting);
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
        var username = $('#username').val();
        if(username == '') {
            $('#username').focus();
            helper.alert('Inserisci il nome utente', null, 'Login');
            return;
        }
        var password = $('#password').val();
        if(password == '') {
            $('#password').focus();
            helper.alert('Inserisci la password', null, 'Login');
            return;
        }
        if(!helper.isOnline()) {
            helper.alert('Nessuna connessione', null, 'Accesso a GretaCITY');
            return;
        }
        $('#username').addClass('ui-disabled');
        $('#password').addClass('ui-disabled');
        $('#loginButton').addClass('ui-disabled');
        $('#registerPageButton').addClass('ui-disabled');
        $.mobile.loading('show');
        auth.login({username: username, password: password}, function(data) {
            // Successfully loggedin, move forward
            $.mobile.changePage('index.html#homePage');
        }, function(e) {
            $.mobile.loading('hide');
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
        var requiredFields = ['lastname', 'firstname', 'phone', 'email'];
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
        // Specific validation for phone number
        if(!helper.isPhoneNumberValid(params.phone)) {
            $('label[for="phone"]').addClass('fielderror');
            helper.alert('Inserisci un numero di telefono valido', function() {
                $('#phone').focus();
            }, 'Registrazione');
            return;
        }
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
            // success callback
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
    
    
    
    
    
    initReportingList: function() {
        app.loadReportingItems();
    },
    
    
    loadReportingItems: function() {
        $.mobile.loading('show');
        services.getReportingList({}, function(result) {
            // Success
            var list = $('#reportingListPage #reportingList');
            var html = '';
            for(var i in result) {
                var row = result[i];
                html += '<li data-role="list-divider">' + row.data + '</li>';
                html += '<li><a href="">';
                html +=  '<h2>' + row.utente + '</h2>';
                html +=  '<p><strong>' + row.oggetto + '</strong></p>';
                html +=  '<p>' + row.commento + '</p>';
                html +=  '<p class="ui-li-aside"><strong>' + row.orario + '</strong></p>';
                html +=  '</a></li>';    
            } 
            list.append(html); 
            list.listview('refresh');
            $.mobile.loading('hide');
        }, function(e) {
            $.mobile.loading('hide');
            helper.alert("Si sono verificati errori", null, "Segnalazioni");
        });
    },
    
    
    
    
    initRepotingPage: function() {
        services.getReportingCategories(function(result) {
            var html = '<option value="0" selected>seleziona</option>';
            for(var i in result) {
                var row = result[i];
                html += '<option value="'+row.id+'">'+row.descrizione+'</option>';
            }
            $('#reportingPage #reportingCategory').html(html);
            $('#reportingPage #reportingCategory').selectmenu('refresh');
        });
        geoLocation.acquireGeoCoordinates(function(pos) {
            app.latLng.lat = pos.coords.latitude;
            app.latLng.lng = pos.coords.longitude;
            geoLocation.reverseGeocoding({lat: pos.coords.latitude, lng: pos.coords.longitude}, function(result) {
console.log(result);
                var routeEl = $('#locationInfo span.route');
                var cityEl =  $('#locationInfo span.city');
                var provEl =  $('#locationInfo span.prov');
                // Don't override data
                if((routeEl.html() != '') || (cityEl.html() != '') || (provEl.html() != '')) return;
                routeEl.html(result.road + " " + result.streetNumber);
                cityEl.html(result.city);
                provEl.html(result.prov);
            });
        }, function(e) {
            helper.alert(e, null, "Localizzazione GPS");
        });
    },
    mapsScriptLoaded: function() {
    },
    
    // Default lat lng is set to Rome
    latLng: {lat: 41.900046, lng: 12.477215},
    map: null,
    marker: null,
    mapsSetup: function() {
        if(typeof(google) == 'undefined') return;
        if(app.map != null) google.maps.event.clearListeners(app.map);
        var options = {
            zoom: config.GOOGLE_MAPS_ZOOM,
            center: new google.maps.LatLng(app.latLng.lat, app.latLng.lng),
            mapTypeId: eval(config.GOOGLE_MAPS_TYPE_ID)
        };
        app.map = new google.maps.Map(document.getElementById('map'), options);
        app.mapsSetMarker();
    },
    mapsSetMarker: function() {
        if(app.map == null) return;
//console.log("Setting map position to " + app.latLng.lat + " " + app.latLng.lng);
        var markerPoint = new google.maps.LatLng(app.latLng.lat, app.latLng.lng);
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
    
    
    
    
    acquirePhoto: function() {
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
            helper.alert(e, null, 'Impossibile scattare la foto');
        });
    },
    viewPhoto: function() {
        var imgEl = $('img[data-acquired="1"]', this);
        if(imgEl.length == 0) return;
        $('#reportingPhotoPage img').attr('src', imgEl.attr('src')).attr('data-pos', imgEl.attr('data-pos'));
        var width = $('#reportingPhotoPage').width();
        $('#reportingPhotoPage img').css({'max-width' : width, 'height' : 'auto'});
        $.mobile.changePage('#reportingPhotoPage', {transition: 'pop'});
    },
    removePhoto: function() {
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
            reporting.photos.push($(this).attr('src'));
        });
        
        console.log(reporting);
        
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
        
        services.sendReporting(reporting, function() {
            // Successfully sent
            helper.alert('La tua segnalazione è stata inoltrata con successo', function() {
                $.mobile.changePage('#reportingListPage', {transition: 'slide', reverse: true});
            }, 'Invia segnalazione');
        }, function(e) {
            // An error occurred
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
