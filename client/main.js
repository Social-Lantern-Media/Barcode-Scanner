import { Meteor } from 'meteor/meteor';

Orders = new Mongo.Collection('items');
Orders._collection.insert({
  name: "Coke",
  quantity: 2,
  price: 3.50,
  check: false,
  vat: 5000292001001
});
Orders._collection.insert({
  name: "Pepsi",
  quantity: 1,
  price: 1.75,
  check: false,
  vat: 5000292001001
});

if (Meteor.isClient || Meteor.isCordova) {

  Template.barcode_scanner.events({
    'click button': function () {
      cordova.plugins.barcodeScanner.scan(
        function (result) {
          Session.set("code", result.text);
          alert("We got a barcode\n" +
            "Result: " + result.text + "\n" +
            "Format: " + result.format + "\n" +
            "Cancelled: " + result.cancelled);
        }, 
        function (error) {
          alert("Scanning failed: " + error);
        },
        {
          "preferFrontCamera" : false, 
          "showFlipCameraButton" : true, 
          "formats" : "QR_CODE,PDF_417",
      }

     );

    }

  });

  Template.display.events({
    'click button': function() {
      var data = Session.get("code");
      alert("Barcode is: " + data); //displays barcode scanned
    }
  });

}

Template.items.helpers({
    /*show all items according to VAT*/
    'item': function(){
      var data = Session.get("code");
      data = JSON.parse(data);
      var vatNum = data;
      return Orders.find({vat:vatNum});
    }
  });
