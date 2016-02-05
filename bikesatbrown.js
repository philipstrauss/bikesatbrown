
bikeCollection = new Mongo.Collection("bikeCollection");

if (Meteor.isClient) {

  Template.body.helpers({
    availableBikes: function () {
      if (bikeCollection.find({"name":"count"}).count() > 0){
        return bikeCollection.findOne({"name":"count"}).val;
      }
    },
    isOpen: function () {
      if (bikeCollection.find({"name":"open"}).count() > 0){

        if (bikeCollection.findOne({"name":"open"}).val){

          return "Open now";
        }
        else{

          return "Closed now";
        }
      }
    },
    openColor: function () {
      if (bikeCollection.find({"name":"open"}).count() > 0){

        if (bikeCollection.findOne({"name":"open"}).val){

          return "color:green";
        }
        else{
          return "color:red";
        }
      }
    }
  });

  Template.body.events({

    'submit #passwordForm': function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;

      var countID = bikeCollection.findOne({"name":"count"})._id;
      var openID = bikeCollection.findOne({"name":"open"})._id;

      if(text==="increase"){

        bikeCollection.update({"_id":countID}, {$inc: {val: 1}});
      }
      else if (text==="decrease"){

        if( bikeCollection.findOne({"_id":countID}).val > 0 ){
          bikeCollection.update({"_id":countID}, {$inc: {val: -1}});
        }
      }
      else if (text==="open"){

        bikeCollection.update({"_id":openID}, {$set: {val: true}});
      }
      else if (text==="close"){

        bikeCollection.update({"_id":openID}, {$set: {val: false}});
      }
 
      // Clear form
      event.target.text.value = "";
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
      bikeCollection.insert({"name":"count", "val":0});
      bikeCollection.insert({"name":"open", "val":false});
  });
}
