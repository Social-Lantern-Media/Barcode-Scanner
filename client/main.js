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
  })
}
