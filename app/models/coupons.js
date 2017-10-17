var mongoose = require('mongoose');

var couponsSchema = mongoose.Schema({
	'couponCodeType':Number,
	'couponCodeReturnValue':Number,
	'numberOfCouponCodeTickets':{type:Number,default:0},
	'numberOfTicketsSold':Number,
	'couponCode':String
})



module.exports = mongoose.model('CouponCodes',couponsSchema)