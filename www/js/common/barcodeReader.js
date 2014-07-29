var barcodeReader = {
    
    scanning: false,
    
    acquireQrCode: function(successCallback, errorCallback) {
        
        barcodeReader.scanning = true;
        
        if(config.EMULATE_ON_BROWSER) {
            //helper.alert('This feature is not available on browser');
            successCallback({text: config.QR_CODE_TEST});
            setTimeout(function() {
                barcodeReader.scanning = false;
            }, 300);
            return;
        }
        
        cordova.plugins.barcodeScanner.scan(
			function (result) {
                if(!result.cancelled && (result.format == 'QR_CODE')) {                    
                    if(successCallback) successCallback(result);
                }/* else {
                    if(successCallback) successCallback('');
                }*/
                setTimeout(function() {
                    barcodeReader.scanning = false;
                }, 300);
			}, 
			function (error) {
				//helper.alert("Errore durante la scansione: " + error);
                if(errorCallback) errorCallback(error);
                
                setTimeout(function() {
                    barcodeReader.scanning = false;
                }, 300);
			}
		);
    }   
}

function QrCodeData() {
    this.type = 0;
    this.elements = {};
}

QrCodeData.prototype.toString = function() {
    var text = '';
    for(var i in this.elements) {
        text += i + ': ' + this.elements[i] + '\n';
    }
    return text;
}


QrCodeData.TYPE_TEXT = 1;
QrCodeData.TYPE_URL = 2;
QrCodeData.TYPE_CONTACT = 3;
QrCodeData.TYPE_PHONE_NUMBER = 4;
QrCodeData.TYPE_SMS = 5;
QrCodeData.TYPE_GRETACITY = 6;

QrCodeData.fromText = function(text) {
    var qrCodeData = new QrCodeData();
    
    if(text.indexOf(config.QR_CODE_BASE_URL) === 0) {
        qrCodeData.type = QrCodeData.TYPE_GRETACITY;
        var pos = text.lastIndexOf('/');
        var code = (pos != -1) ? text.substr(pos + 1) : text;
        qrCodeData.elements.code = code;
    } else if(text.indexOf('BEGIN:VCARD') === 0) {
        qrCodeData.type = QrCodeData.TYPE_CONTACT;
        var keysV21 = [
            //['N', 'Nome'],
            ['FN', 'Nome'],
            ['ORG', 'Organizzazione'],
            ['TEL;CELL', 'Telefono cellulare'],
            ['TEL;WORK;VOICE', 'Telefono ufficio'],
            ['TEL;HOME;VOICE', 'Telefono casa'],
            ['TEL', 'Telefono'],
            ['EMAIL;HOME;INTERNET', 'email personale'],
            ['EMAIL;WORK;INTERNET', 'email lavoro'],
            ['EMAIL;PREF;INTERNET', 'email']
        ];
        var keysV30 = [
            ['N', 'Nome'],
            ['FN', 'Nome'],
            ['ORG', 'Organizzazione'],
            ['TEL;TYPE=WORK,VOICE', 'Telefono ufficio'],
            ['TEL;TYPE=HOME,VOICE', 'Telefono casa'],
            ['TEL;TYPE=CELL', 'Telefono cellulare'],
            ['TEL;TYPE=FAX', 'Fax'],
            ['TEL', 'Telefono'],
            ['EMAIL', 'email'],
            ['EMAIL;TYPE=PREF,INTERNET', 'email'],
            ['EMAIL;TYPE=INTERNET', 'email']
        ];
        var keysV40 = [
            ['N', 'Nome'],
            ['FN', 'Nome'],
            ['ORG', 'Organizzazione'],
            ['TEL;TYPE=work,voice;VALUE=uri:tel', 'Telefono ufficio'],
            ['TEL;TYPE=home,voice;VALUE=uri:tel', 'Telefono casa'],
            ['TEL', 'Telefono'],
            ['EMAIL', 'email']
        ];
//helper.alert(text);
        var lines = text.split('\n');
        var version = '';
        var usedKeys = null;
        for(var i in lines) {
            var l = lines[i];
            if(l.indexOf('VERSION:') === 0) {
                version = l.split(':')[1];
                if(version == '2.1') {
                    usedKeys = keysV21;
                } else if(version == '3.0') {
                    usedKeys = keysV30;
                } else if(version == '4.0') {
                    usedKeys = keysV40;
                }   
            } else if(usedKeys != null) {
                for(var j in usedKeys) {
                    var k = usedKeys[j][0];
                    if(l.indexOf(k + ':') === 0) {
                        //console.log('qrCodeData.elements["'+usedKeys[j][1]+'"]=\''+l.substr(l.lastIndexOf(k) + k.length + 1)+'\'');
                        eval('qrCodeData.elements["'+usedKeys[j][1]+'"]=\''+l.substr(l.lastIndexOf(k) + k.length + 1)+'\'');
                        break;
                    }
                }
            }
        }
    } else if(text.indexOf('tel:') === 0) {
        qrCodeData.type = QrCodeData.TYPE_PHONE_NUMBER;
        qrCodeData.elements.phoneNumber = text.split(':')[1];
    } else if(text.indexOf('SMSTO:') === 0) {
        qrCodeData.type = QrCodeData.TYPE_SMS;
        var parts = text.split(':');
        qrCodeData.elements.phoneNumber = parts[1];
        qrCodeData.elements.message = parts[2];
    } else if(text.indexOf('http://') === 0) {
        qrCodeData.type = QrCodeData.TYPE_URL;
        qrCodeData.elements.url = text;
    } else {
        qrCodeData.type = QrCodeData.TYPE_TEXT;
        qrCodeData.elements.text = text;
    }
    
    return qrCodeData;
}

/*function qrCodeTest() {
    var text = 'BEGIN:VCARD\n' +
               'VERSION:3.0\n' +
               'N:Gump;Forrest;;Mr.\n' +
               'FN:Forrest Gump\n' +
               'ORG:Bubba Gump Shrimp Co.\n' +
               'TITLE:Shrimp Man\n' +
               'PHOTO;VALUE=URL;TYPE=GIF:http://www.example.com/dir_photos/my_photo.gif\n' +
               'TEL;TYPE=WORK,VOICE:(111) 555-12121\n' +
               'TEL;TYPE=HOME,VOICE:(404) 555-1212\n' +
               'ADR;TYPE=WORK:;;100 Waters Edge;Baytown;LA;30314;United States of America\n' +
               'LABEL;TYPE=WORK:100 Waters Edge\nBaytown, LA 30314\nUnited States of America\n' +
               'ADR;TYPE=HOME:;;42 Plantation St.;Baytown;LA;30314;United States of America\n' +
               'LABEL;TYPE=HOME:42 Plantation St.\nBaytown, LA 30314\nUnited States of America\n' +
               'EMAIL;TYPE=PREF,INTERNET:forrestgump@example.com\n' +
               'REV:2008-04-24T19:52:43Z\n' +
               'END:VCARD';
    //var text = 'http://www.google.com';
    //var text = 'tel:003994629374398792';
    //var text = 'This is a simple text';
    //var text = 'SMSTO:003933929387493:text of message';
    
    var qrCodeData = QrCodeData.fromText(text);
    //console.log(qrCodeData);
    for(var i in qrCodeData.elements) {
        console.log(i + ': ' + qrCodeData.elements[i]);
    }
    
    console.log(qrCodeData.toString());
}*/