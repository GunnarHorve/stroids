( function(){



  var app = angular.module('chatmod', function(){
  });
  /*
  Added controller definition.
  Controller is attached to the app module.
  */
  app.controller('ChatController', function(){
      //Previously, gems was an array. Now, it is the data in store-products.json

      var that = this;
      that.messages = [];
  } );
})();
