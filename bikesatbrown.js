
bikeCollection = new Mongo.Collection("bikeCollection");

if (Meteor.isClient) {

  Template.body.helpers({
    availableBikesString: function () {
      if (bikeCollection.find({"name":"count"}).count() > 0){

        if (bikeCollection.findOne({"name":"count"}).val == 1 )
          return "There is currently 1 bike available."

        return "There are currently " + String(bikeCollection.findOne({"name":"count"}).val) + " bikes available.";
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
    },
    announcement: function () {
      if (bikeCollection.find({"name":"announcement"}).count() > 0){

        return bikeCollection.findOne({"name":"announcement"}).val;

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
      var announcementID = bikeCollection.findOne({"name":"announcement"})._id;

      if(text === "increase"){

        bikeCollection.update({"_id":countID}, {$inc: {val: 1}});
      }
      else if (text === "decrease"){

        if( bikeCollection.findOne({"_id":countID}).val > 0 ){
          bikeCollection.update({"_id":countID}, {$inc: {val: -1}});
        }
      }
      else if (text === "open"){

        bikeCollection.update({"_id":openID}, {$set: {val: true}});
      }
      else if (text === "close"){

        bikeCollection.update({"_id":openID}, {$set: {val: false}});
      }
      else if (text.slice(0,3) === "set"){

        if ( text.split(" ").length == 2 ){
          if ( !isNaN( parseInt( text.split(" ")[1] ) ) ){

            var newVal = parseInt( text.split(" ")[1] );
            if (newVal >= 0)
              bikeCollection.update({"_id":countID}, {$set: {val: newVal}});
          }
        }
      }
      else if (text.split(" ")[0] == "announce"){

        bikeCollection.update({"_id":announcementID}, {$set: {val: text.slice(8)}});
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
      bikeCollection.insert({"name":"announcement", "val":""});
  });
}
