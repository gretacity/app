
var helper = {
    
    isOnline: function() {

        if(config.EMULATE_ON_BROWSER) return true;
        
        if(typeof(navigator.connection) == 'undefined') {
            alert('Impossibile stabilire il tipo di connessione');
            return false;
        }
        
        return config.getUseWifiOnly() ? (navigator.connection.type == Connection.WIFI) :
                                         (navigator.connection.type != Connection.NONE);
    },
    
    
    getDocumentLocation: function() {
        return document.location.toString().substr(document.location.href.indexOf('/www/') + 5);
    },
    
    // Get parameter value from query string
    getParamValue: function(name) {
        return (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1];
    },
    
    maximizeContent: function() {
        window.scrollTo(0,0);
        var winhigh = $.mobile.getScreenHeight(); //Get available screen height, not including any browser chrome
        var headhigh = $('[data-role="header"]').first().outerHeight(); //Get height of first page's header
        var foothigh = $('[data-role="footer"]').first().outerHeight(); //Get height of first page's header
        var $content=$('[data-role="main"]');
        var contentpaddingwidth=parseInt(($content.css("padding-left")||'').replace("px", ""))+parseInt(($('[data-role="main"]').css("padding-right")||'').replace("px", ""));
        var contentpaddingheight=parseInt(($content.css("padding-top")||'').replace("px", ""))+parseInt(($('[data-role="main"]').css("padding-bottom")||'').replace("px", ""));
        winhigh = winhigh - headhigh - foothigh - contentpaddingheight; 
        winwide = $(document).width(); //Get width of document
        winwide = winwide - contentpaddingwidth; 
        $content.css('width',winwide + 'px').css('height',winhigh + 'px'); //Change div to maximum visible area
    },
    
    
    
    imageShrinkToFit: function(item) {
        var img_height = $(item).height();
        var div_height = $(item).parent().height();
        if(img_height<div_height){
            //IMAGE IS SHORTER THAN CONTAINER HEIGHT - CENTER IT VERTICALLY
            var newMargin = (div_height-img_height)/2+'px';
            $(item).css({'margin-top': newMargin });
        }else if(img_height>div_height){
            //IMAGE IS GREATER THAN CONTAINER HEIGHT - REDUCE HEIGHT TO CONTAINER MAX - SET WIDTH TO AUTO  
            $(item).css({'width': 'auto', 'height': '100%'});
            //CENTER IT HORIZONTALLY
            var img_width = $(item).width();
            var div_width = $(item).parent().width();
            var newMargin = (div_width-img_width)/2+'px';
            $(item).css({'margin-left': newMargin});
        }
    },
    
    imageCropToFit: function(item) {
        var img_height = $(item).height();
        var div_height = $(item).parent().height();
        if(img_height<div_height){
            //INCREASE HEIGHT OF IMAGE TO MATCH CONTAINER
            $(item).css({'width': 'auto', 'height': div_height });
            //GET THE NEW WIDTH AFTER RESIZE
            var img_width = $(item).width();
            //GET THE PARENT WIDTH
            var div_width = $(item).parent().width();
            //GET THE NEW HORIZONTAL MARGIN
            var newMargin = (div_width-img_width)/2+'px';
            //SET THE NEW HORIZONTAL MARGIN (EXCESS IMAGE WIDTH IS CROPPED)
            $(item).css({'margin-left': newMargin });
        }else{
            //CENTER IT VERTICALLY (EXCESS IMAGE HEIGHT IS CROPPED)
            var newMargin = (div_height-img_height)/2+'px';
            $(item).css({'margin-top': newMargin});
        }
        /*
        var img_width = $(item).width();
        var div_width = $(item).parent().width();
        if(img_width<div_width){
            //INCREASE WIDTH OF IMAGE TO MATCH CONTAINER
            $(item).css({'height': 'auto', 'width': div_width });
            //GET THE NEW HEIGHT AFTER RESIZE
            var img_height = $(item).height();
            //GET THE PARENT HEIGHT
            var div_height = $(item).parent().height();
            //GET THE NEW VERTICAL MARGIN
            var newMargin = (div_height-img_height)/2+'px';
            //SET THE NEW VERTICAL MARGIN (EXCESS IMAGE HEIGHT IS CROPPED)
            $(item).css({'margin-top': newMargin });
        }else{
            //CENTER IT HORIZONTALLY (EXCESS IMAGE WIDTH IS CROPPED)
            var newMargin = (div_width-img_width)/2+'px';
            $(item).css({'margin-left': newMargin});
        }*/
    },
    
    
    
    
    
    
    alert: function(message, callback, title, buttonName) {
        if(config.EMULATE_ON_BROWSER) {
            alert(message);
            if(callback != null) callback();
        } else {
            navigator.notification.alert(message, callback, title, buttonName);
        }
    },
    
    confirm: function(message, callback, title, buttonLabels)  {
        if(config.EMULATE_ON_BROWSER) {
            var result = confirm(message);
            if(callback != null) {
                callback(result ? 1 : 2);
            }
        } else {
            navigator.notification.confirm(message, callback, title, buttonLabels);
        }
    },
    
    
    
    toArray: function(list) {
        return Array.prototype.slice.call(list || [], 0);
    },
    
    
    
    isEmailValid: function(email) {
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/;
        return emailReg.test(email);
    },
    isPhoneNumberValid: function(number) {
        for(var i in number) {
            if(number[i] < '0' || number[i] > '9') {
                return false;
            }    
        }
        if(number.length < 6) return false;
        return true;
    }
    

}