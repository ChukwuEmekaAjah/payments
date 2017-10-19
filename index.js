var express = require('express');
var mongoose = require('mongoose');


mongoose.connect(process.env.dbUrl || dbUrl)

var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var couponCodes = require('./app/models/coupons.js');
var Success = require('./app/models/success.js');

// we first validate it on the server before going to do the computation on the database.
var couponTypes = [
  {'couponCodeType':2500, 'couponCode':'BOMA-AGBAKE-AISEC'},
  {'couponCodeType':2500, 'couponCode':'radio-tedxph2017'},
  {'couponCodeType':2500, 'couponCode':'facebook-tedxph2017'},
  {'couponCodeType':2500, 'couponCode':'twitter-tedxph2017'},
  {'couponCodeType':2500, 'couponCode':'partners-tedxph2017'},
  {'couponCodeType':10000, 'couponCode':'tedxphloyals'}
]

app.get('/couponValidator', function (req, res) {
    // so we now loop through all the possible coupon types
    console.log(req.query)
    var matchedCoupon;
    for(var i = 0; i< couponTypes.length; i++){
      if(couponTypes[i]['couponCodeType'] == Number(req.query.ticketPrice) && couponTypes[i]['couponCode'] == req.query.couponCode){
        matchedCoupon = req.query;
        break;
      }
      // we just need the coupon code to be wrong to send back a wrong message.
      if (couponTypes[i]['couponCode'] !== req.query.couponCode && i== couponTypes.length-1){
          console.log('bros why you want cheat na?')
          res.json(JSON.stringify({'message':'You sent an invalid coupon code','proceed':false}))
      }
    }

    // so now if we have a matched coupon let's do the database computation
    if(matchedCoupon){
      couponCodes.findOne({'couponCodeType':matchedCoupon['ticketPrice'], 'couponCode':matchedCoupon['couponCode']},function(err,data){
          if(err)
            throw err
          if(data['numberOfTicketsSold'] < data['numberOfCouponCodeTickets']){
            data['numberOfTicketsSold'] +=1;
            data.save(function(err,data){
              if(err)
                throw err
              console.log('we made it ooo')
              res.json(({'message':'We have successfully validated the tickets','proceed':true,'ticketPrice':data['couponCodeReturnValue']}))
            })
          }
          else{
            console.log('the window has closed bros')
            res.json(({'message':'We have exhausted the number of tickets for this coupon code. Please try again without the coupon code','proceed':false}))
          }
      })
    }


    
});

app.get('/successful',function(req,res){
      console.log(req.query)
      if(req.query){
        var newTicket = new Success();
        newTicket.attendeeName = req.query.attendeeName;
        newTicket.attendeeEmail = req.query.attendeeEmail;
        newTicket.ticketCategory = String(req.query.ticketCategory);
        newTicket.numberOfTicketsBought = Number(req.query.numberOfTicketsBought);
        newTicket.save(function(err,data){
          if(err)
            throw err
          res.send('Successfully saved the new payment data')
        })
      }
})

app.get('/',function(req,res){
  res.send('hello world')
})


var server = app.listen(process.env.PORT || 3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});