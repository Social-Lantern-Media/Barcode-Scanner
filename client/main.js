itemslist = new Mongo.Collection('items');
itemslist._collection.insert({
  name: "Coke",
  price: 1.70
});
itemslist._collection.insert({
  name: "Pepsi",
  price: 2.80
});

if (Meteor.isCordova) {

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
          "preferFrontCamera" : false, // iOS and Android
          "showFlipCameraButton" : true, // iOS and Android
          "formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
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
    /*show all items*/
    'item': function(){
      return itemslist.find({});
    },
    'correctCode': function(){
      var data = Session.get("code");
      data = JSON.stringify(data);
      if (data == "036000291452"){
        return true;
      }
    },
    'click button': function() {
      var code = Session.get("code");
      if (code == "0036000291452"){
        return itemslist.find({});
      }
    }
  });
