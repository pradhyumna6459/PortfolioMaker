const mongoose=require('mongoose');
const userSchema=mongoose.Schema({
    firstname:{
        type:String
    },
    lastname:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    password:{
        type:String
    },
    img:{
        type:String,
        default:'/img/imglogo.png'
    },
    link:{
        type:String,
    },
    ans:{
        type:Object,
    }

})
module.exports=mongoose.model('user',userSchema);