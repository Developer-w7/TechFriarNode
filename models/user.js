const Mongoose = require('mongoose');
// const FileModel = require('./files.js')


const UserSchema = Mongoose.Schema(
    {
      
      
      userName: { type: String, default: "" },
      email: { type: String,required:true,unique:true},
      password:   {type: String },
      // files: { type: Mongoose.Schema.ObjectId,ref:FileModel, required:false, index:true },
  

    },{ timestamps: true, collection: "tech_user" })
    let UserModel = Mongoose.model("tech_users", UserSchema);


    UserModel.getXPerson = (where) => {
        return UserModel.findOne({  _id:"61d1b461b974ab6f0b816c73" });
      };
//    UserModel = Mongoose.model('User', UserSchema , { timestamps: true, collection: "user" });

    module.exports= UserModel;