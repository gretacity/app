
var barcodeReader = {
    
    acquireQrCode: function(successCallback, errorCallback) {
        
        if(config.EMULATE_ON_BROWSER) {
            //helper.alert('This feature is not available on browser');
            successCallback('00001');
            return;
        }
        
        cordova.plugins.barcodeScanner.scan(
			function (result) {
                if(!result.cancelled && (result.format == 'QR_CODE')) {
                    var pos = result.text.lastIndexOf('/');
                    var code = (pos != -1) ? result.text.substr(pos + 1) : result.text;
                    //$('#qrCode').val(code);
                    if(successCallback) successCallback(code);
                }
			}, 
			function (error) {
				//helper.alert("Errore durante la scansione: " + error);
                if(errorCallback) errorCallback(error);
			}
		);
    },
    
    
}