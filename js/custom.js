function onNotificationGCM(e) {
    $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

    switch( e.event )
    {
    case 'registered':
        if ( e.regid.length > 0 )
        {
            $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
            // Your GCM push server needs to know the regID before it can push to this device
            // here is where you might want to send it the regID for later use.
            console.log("regID = " + e.regid);
        }
    break;

    case 'message':
        // if this flag is set, this notification happened while we were in the foreground.
        // you might want to play a sound to get the user's attention, throw up a dialog, etc.
        if ( e.foreground )
        {
            $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

            // if the notification contains a soundname, play it.
            var my_media = new Media("/android_asset/www/"+e.soundname);
            my_media.play();
        }
        else
        {  // otherwise we were launched because the user touched a notification in the notification tray.
            if ( e.coldstart )
            {
                $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
            }
            else
            {
                $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
            }
        }

        $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
        $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
    break;

    case 'error':
        $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
    break;

    default:
        $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
    break;
  }
}


/// App  notificadora
var PushNotApp = PushNotApp || {};
 
PushNotApp.main = (function() {
 
 var pushNotification = window.plugins.pushNotification,
 
 showAlert = function(message, title) {
  if(navigator.notification) {
   navigator.notification.alert(message, null, title, 'Close');
   navigator.notification.vibrate(1000);
  }else{
   alert(title ? (title + ": " + message) : message);
  }
 },
 
 addCallback = function(key, callback) {
  if(window.callbacks === undefined) {
   window.callbacks = {};
  }
  window.callbacks[key] = callback;
 },
 
 addNotification = function(notificationTxt) {
  console.log('notification added to DOM');
  $('#notificaciones').append('<li>notification added to DOM</li>');
  var el = document.getElementById('notification');
  el.innerHTML += notificationTxt;
 },
 
 registrationSuccessHandler = function(token) {
  console.log('successful registration with token: ' + token);
  $('#notificaciones').append('<li>successful registration with token: ' + token+'</li>');
  addCallback('notificationHandler', notificationHandler);
 },
 
 registrationFailedHandler = function(error) {
  showAlert(error, "Error");
 },
 
 notificationHandler = function(evt) {
  console.log("received a notification: " + evt.alert);
  $('#notificaciones').append("<li>received a notification: " + evt.alert+"</li>");
  navigator.notification.beep(3);
  if(evt.alert) {
   addNotification(evt.alert);
  }
  if(evt.prop){
   addNotification("<li>received a special property: " + evt.prop+"</li>");
  }
 },
 
deviceReady = function() {
 console.log('Device is ready');
 $('#notificaciones').append('<li>Device is ready</li>');
 if(parseFloat(device.version) === 7.0) {
  document.body.style.marginTop = "20px";
 }
 pushNotification.register(registrationSuccessHandler,
                           registrationFailedHandler, {
                            "senderID":"441104991036",
                           "badge":"true",
                           "sound":"true",
                           "alert":"true",
                           ///"ecb":"callbacks.notificationHandler"
                           "ecb":"onNotificationGCM"
                           });
},
 
initialize = function(){
 document.addEventListener("deviceready", deviceReady, false);
}
 
return {
 initialize:initialize
}
 
}());
 
PushNotApp.main.initialize();
