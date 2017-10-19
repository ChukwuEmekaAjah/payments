var mongoose = require('mongoose');

var successSchema = mongoose.Schema({
	'attendeeName':String,
	'attendeeEmail':String,
	'ticketCategory':String,
	'numberOfTicketsBought':Number,
	'couponCodeType':String
})



module.exports = mongoose.model('Success',successSchema)