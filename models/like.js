
const mongoose = require('mongoose');
// mongoose schema for like button in posts
const likeSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId
    },
    // this defines the object  Id of the liked object 
    likeable: {
        type : mongoose.Schema.Types.Mixed,  
        required : true,
        refPath:'onModel'
    },
    // this field is used for the type of liked object since this is a dyanamic refrence
    onModel : {
        type : String,  
        require : true,
        enum: ['Post' , 'Comment'] //restricts(enum) the like to post and comment not anything other than that.
    }
}, {
    
    timestamps : true

});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like ;