const Mongoose = require('mongoose');
const UserModel = require('./user.js');

const FileSchema = Mongoose.Schema(
    {
     filename: { type: String, default: "" },
     userId: { type: Mongoose.Schema.ObjectId,ref:UserModel, required:true, index:true },
     imgCollection: {
        type: Array
    },
      

    },{ timestamps: true, collection: "file" })
    let FileModel = Mongoose.model("files", FileSchema);

    module.exports= FileModel;