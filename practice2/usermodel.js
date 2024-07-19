const mongoose= require('mongoose');


mongoose.connect(`mongodb://localhost:27017/practice2`);

const userSchema =mongoose.Schema({
    name:String,
    username:String,
    email:String
});

// model 

module.exports= mongoose.model('user',userSchema);