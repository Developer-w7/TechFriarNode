const UserModel = require('../models/user.js');
const FileModel = require('../models/files.js');
// const StudentModel = require('../models/to-del/student.js');

var mongoose = require("mongoose");



exports.listCategories = [
   async(req, res)=> {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Access-Control-Allow-Origin', '*');
    query={};
    let results= await UserModel.find(query).then((val)=>{return val})
    res.json(results);
    return res;
   }
];


exports.getFiles = [
   async(req, res)=> {

      const {id,token}=req.body;
      const query = req.query;

      console.log(id,token)
      try{
         const records = await FileModel.find().where('userId').in(['648d4e5cf73ce300389a2154']).populate('userId').exec();
            //  console.log(records);
             res.setHeader('Content-Type', 'text/plain');
             res.setHeader('Access-Control-Allow-Origin', '*');
             res.status(200).json(records);
         }catch (e){
     res.status(500).json(e); return; 
   }
   }
];