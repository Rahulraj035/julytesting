import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const userSchema = new Schema({ 
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },
    avatar:{
        type:String,
        required:true,
    },
    coverImage:{
        type:String,
        
    },
    watchHistory:{
        type:schema.Types.ObjectId,
        ref:"WatchHistory",
    },
    password:{
        type:String,
        required:[true, 'password must be at least 8 characters long']

    },
     timestamps: true  

})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    
    this.password = await bcrypt.hash(this.password, 10);
    next();
}),
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
} 
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname},
             process.env.ACCESS_TOKEN_SECRET,
              {expiresIn:process.env.ACCESS_TOKEN_EXPIRES_IN});
}
userSchema.methods.generateRefreshToken = function(){
    return 
    jwt.sign(
        {id:this._id}, 
        process.env.REFRESH_TOKEN_SECRET,
         {expiresIn:process.env.REFRESH_TOKEN_EXPIRES_IN});
}
    export const User = mongoose.model("User", userSchema);