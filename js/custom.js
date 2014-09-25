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
                           "ecb":"callbacks.notificationHandler"
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
