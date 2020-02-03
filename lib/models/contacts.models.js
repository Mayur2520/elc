var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var contactsDetails = new Schema(
    {
        name:{ type: String},
        gender:{ type: String},
        email:{ type: String},
        mobile1:{ type: Number},
        mobile2:{ type: Number},
        createdby:{ type: Number},
        createddate:{ type: Date , default: new Date()}
    });
    
    
    contactsDetails.set('toObject', { getters: true, setters: true,virtuals: true });
    contactsDetails.set('toJSON', { getters: true, setters: true ,virtuals: true});
    
    mongoose.model('contacts', contactsDetails);