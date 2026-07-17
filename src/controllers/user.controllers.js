import { asyncHandler } from "../Utils/asyncHandler.js";
import {ApiError} from "../Utils/ApiError.js";
import { User } from "../models/user.model.js";
import {cloudinaryUpload} from "../Utils/cloudinary.js";
import { ApiResponses } from "../Utils/ApiResponses.js";
const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: "User registered successfully" });




        const {fullname,email,username,password} = req.body
         console.log("email", email);


         if([fullname ,email ,username, password].some(field => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required");
         }
         const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] });
         if(existingUser) {
            throw new ApiError(400, "User already exists");
         }  

        const avatarPath = req.files?.avatar[0]?.path;
        const coverImagePath = req.files?.coverImage[0]?.path;

        if(!avatarPath){
             throw new ApiError(400, "Avatar image is required");
        }
        if(!coverImagePath){
             throw new ApiError(400, "Cover image is required");
        }

        const avatarUpload = await cloudinaryUpload(avatarPath)
        const coverImageUpload = await cloudinaryUpload(coverImagePath)
           
        if(!avatarUpload || !coverImageUpload){
           throw new ApiError(400, "Avatar image is required");
        }

        const user = await User.create({
            fullname,
            email,
            username:username.toLowerCase(),
            password,
            avatar: avatarUpload.secure_url,
            coverImage: coverImageUpload?.secure_url||""
        })

        const createduser = await user.findbyId(user._id).select("-password  -refreshToken ");

         if(!createduser){
            throw new ApiError(500, "something went wrong while creating the user");
         }
         res.status(201).json(new ApiResponses(201, "User registered successfully", createduser));




        });
          
      




export { registerUser }; 