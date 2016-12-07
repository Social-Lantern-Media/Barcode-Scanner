import { Meteor } from 'meteor/meteor';
// import {Orders} from '../api/items.js';
import { Accounts } from 'meteor/accounts-base';

Orders = new Mongo.Collection('items');
Orders._collection.insert({
  stallNo: 1,
  stall: "SeaFoodEat",
  name: "Grilled Salmon",
  quantity: 2,
  price: 12,
  check: false,
  memberNo: 0142657
});
Orders._collection.insert({
  stallNo: 2,
  stall: "NoodleNow",
  name: "Bacon Pasta",
  quantity: 1,
  price: 8,
  check: false,
  memberNo: 0142657
});

Restaurant = new Mongo.Collection('restaurant');
// Restaurant._collection.insert({
//   customerName: "John Tan"
//   memberNo: 0142657
//   stallNo: 1,
//   stall: "SeaFoodEat",
//   name: "Grilled Salmon",
//   quantity: 2,
//   price: 12,
//   check: false,
//   createdAt: new Date()
// });

if (Meteor.isClient || Meteor.isCordova) {

  Session.setDefault('showItems', false); //on default do not show items

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

  Template.retrieve.events({
    /*initialize items display to true*/
    'click button': function() {
      Session.set('showItems', true);
    }
  });

  Template.body.helpers({
    /*change page display to show items*/
    'showItemsDiv': function(){
      return Session.get('showItems');
    }
  });

  Template.items.events({
    /*tick checkbox to change check status*/
    'click input': function () {
      var id = this._id;
      var check = Orders.findOne(id).check;
      Orders._collection.update(id,{$set: { 'check': !check }});
    }
  });

  Template.items.helpers({
    /*show all items according to VAT*/
    'item': function(){
      // var data = Session.get("code");
      // data = JSON.parse(data);
      // var memberNo = data;
      return Orders.find({ memberNo: 0142657});
    }
  });

  Template.pay.events({
    /*deduct from credit*/
    'click #pay': function(){
      var memberNo = Session.get("code");
      var pay = Orders.find({memberNo: 0142657, check: true}).fetch();
      var amount = 0;
      var num2Pay = Orders.find({memberNo: 0142657, check: true}).count();
      for (i = 0; i < num2Pay; i++){
        amount = amount + pay[i].price;
      }
      var confirm = window.confirm("Confirm Payment?");
      /*remove ticked items from collection*/
      if(confirm){
        Orders._collection.remove({memberNo: 0142657, check: true});
        alert("Amount Paid: $" + amount);
      }
    }
  })

  Template.home.events({
    /*back button in items page*/
  'click button': function(){
    Session.set('showItems', false);
    }
  })

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY',
  });

  Template.restaurant.events({
    'submit form': function(event){
      event.preventDefault();
      var customerName = $('[name="CustName"]').val();
      var customerNo = $('[name="CustNo"]').val();
      var stallNo = $('[name="StallNo"]').val();
      var stall = $('[name="Stall"]').val();
      var food = $('[name="FoodItem"]').val();
      var qty = $('[name="Qty"]').val();
      var price = $('[name="Price"]').val();
      Restaurant._collection.insert({
        customerName: customerName,
        memberNo: customerNo,
        stallNo: stallNo,
        stall: stall,
        name: food,
        quantity: qty,
        price: price,
        check: false,
        createdAt: new Date(),
      });
      $('[name="CustName"]').val('');
      $('[name="CustNo"]').val('');
      $('[name="StallNo"]').val('');
      $('[name="Stall"]').val('');
      $('[name="FoodItem"]').val('');
      $('[name="Qty"]').val('');
      $('[name="Price"]').val('');
    },
    'keyup [name=CustName]': function(event){
      if(event.which == 13 || event.which == 27){
        $(event.target).blur();
    } else {
        var documentId = this._id;
        var name = $(event.target).val();
        Restaurant._collection.update({ _id: documentId }, {$set: { customerName: name }});
    }
  },
    'keyup [name=CustNo]': function(event){
      if(event.which == 13 || event.which == 27){
        $(event.target).blur();
    } else {
        var documentId = this._id;
        var no = $(event.target).val();
        Restaurant._collection.update({ _id: documentId }, {$set: { customerNo: no }});
    }
  },
  'keyup [name=StallNo]': function(event){
      if(event.which == 13 || event.which == 27){
        $(event.target).blur();
    } else {
        var documentId = this._id;
        var stallNo = $(event.target).val();
        Restaurant._collection.update({ _id: documentId }, {$set: { stallNo: stallNo }});
    }
  },
  'keyup [name=Stall]': function(event){
      if(event.which == 13 || event.which == 27){
        $(event.target).blur();
    } else {
        var documentId = this._id;
        var stall = $(event.target).val();
        Restaurant._collection.update({ _id: documentId }, {$set: { stall: stall }});
    }
  },
  'keyup [name=FoodItem]': function(event){
      if(event.which == 13 || event.which == 27){
        $(event.target).blur();
    } else {
        var documentId = this._id;
        var food = $(event.target).val();
        Restaurant._collection.update({ _id: documentId }, {$set: { food: foodItem }});
    }
  },
  'keyup [name=Qty]': function(event){
      if(event.which == 13 || event.which == 27){
        $(event.target).blur();
    } else {
        var documentId = this._id;
        var quantity = $(event.target).val();
        Restaurant._collection.update({ _id: documentId }, {$set: { quantity: quantity }});
    }
  },
  'keyup [name=Price]': function(event){
      if(event.which == 13 || event.which == 27){
        $(event.target).blur();
    } else {
        var documentId = this._id;
        var price = $(event.target).val();
        Restaurant._collection.update({ _id: documentId }, {$set: { price: price }});
    }
  }
});
}