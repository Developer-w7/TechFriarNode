require('dotenv').config();


// const UserModel = require('./models/user.js');

const http=require('http');
const express=require('express');
const {connectToDb,connection} = require('./db/connect.js');
var faker = require('faker');
const bcrypt = require('bcryptjs');


const multer = require('multer');
const uuidv4 = require('uuid/v4');

var cors = require('cors')


const Mongoose = require('mongoose');




// Import jwt for API's endpoints authentication
const jwt = require('jsonwebtoken');
var apiRouter = require("./routes/api");
const UserModel = require('./models/user.js');
const FileModel = require('./models/files.js');





const app= express();
const port=5004;
const host= "127.0.0.1";
const secret="somexhyruion3456";
connectToDb();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors())
app.use('/public', express.static('public'))
app.use("/", apiRouter);


// app.use((req, res, next) => {
 
//   setImmediate(() => {
//     next(new Error('Something went wrong'))
//   })
// })
// app.use(function (err, req, res, next) {
//   console.error(err.message)
//   if (!err.statusCode) err.statusCode = 500
//   res.status(err.statusCode).send(err.message)
// })

app.get('/',(req,res)=>{
    res.statusCode = 200;
    res.end("hiii")
})



app.post('/rg',async(req,res)=>{
    const token = jwt.sign(
        { user_id: "123", user_name: "tester", email:'e.gmail.com'},
        secret,
        {
          expiresIn: "2h",
        }
      );

      res.statusCode = 200;
      res.setHeader('Accept', 'application/json',);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.json({token});


});
const salt = 10;
const JWT_SECRET=process.env.jwt;
app.post('/user/register', async(req, res)=>{

  const query = req.query;// query = {sex:"female"}
  var randomName = faker.name.findName(); // Rowan Nikolaus
  var randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz


  const {email,reqPassword}=req.body;
  const password = await bcrypt.hash(reqPassword?reqPassword:'123456',salt);

   const userEntry = new UserModel({"userName":randomName ,'email':email?email:randomEmail,"password":password});
  const response=await userEntry.save();


  const token = jwt.sign({id:response._id,username:response.email},JWT_SECRET,{ expiresIn: '2h'})

    res.statusCode = 200;
    res.setHeader('Accept', 'application/json',);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({message:'Entry Succeed',response,token});

});


app.post('/user/updatePass', async(req, res)=>{


  const {reqPassword,token}=req.body;

  console.log(token)
  try {


    let decode ={};
    
    try{
        decode = jwt.verify(token, JWT_SECRET);
       }catch(e){
        decode =null;
   }

   console.log(decode)
    const user = await UserModel.findOne({email:decode.username}).lean()
    if(!user){
        return {status:'error',error:'user not found'}
    }

    const password = await bcrypt.hash(reqPassword?reqPassword:'123456',salt);
 

    
   if(decode){

    // const userEntry = new UserModel({"userName":randomName ,'email':email?email:randomEmail,"password":password});
    // const resp=await userEntry.save();

    await UserModel.updateOne({ email:decode.username }, {
      password
    });

    // Load the document to see the updated value
const doc = await UserModel.findOne({email:decode.username})
console.log(doc);

    res.statusCode = 200;
    res.setHeader('Accept', 'application/json',);
    res.setHeader('Content-Type', 'application/json');
    res.json({updated:true,decode,user});

}
else{
res.statusCode = 200;
res.json({status:false});
}
} catch (error) {
    console.log(error);
    return {status:'error',error:'timed out'}
}
  



});

app.post('/fileupload',async(req,res)=>{
  const FileEntry = new FileModel({

    filename: "Test Name2",
    userId: '648d4e5cf73ce300389a2154',
    link: "http://",

    
  });



    const resp=await FileEntry.save();

    res.statusCode = 200;
    res.json({message:'Entry Succeed',resp});

  })




const DIR = './uploads/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || true) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});
// const upload = multer({ dest: "uploads/" });
  app.post('/uploadImages',upload.array("files"), (req, res, next) => {

    // res.status(200).json({records:"image"});

   
    console.log(req.files);
    const reqFiles = [];
    const url = req.protocol + '://' + req.get('host')
    for (var i = 0; i < req.files.length; i++) {
        reqFiles.push(url + '/public/' + req.files[i].filename)
    }

 console.log(reqFiles)
    const FileEntry = new FileModel({
       
        userId: '648d4e5cf73ce300389a2154',
        imgCollection: reqFiles
    });
    FileEntry.save().then(result => {
        res.status(200).json({
           status:"ok",
            message: "Done upload!",
            userCreated: {
                _id: result._id,
                imgCollection: result.imgCollection
            }
        })
    }).catch(err => {
        console.log(err),
            res.status(500).json({
                error: err
            });
    })
})

  app.get('/getFiles', async(req, res)=>{


   
    // FileModel.find({userId:'648d4e5cf73ce300389a2154'})
    //   .populate('userId')
    //   .exec(function (err, doc) {
    //       if(err) { res.status(500).json(err); return; };
    //       res.setHeader('Content-Type', 'text/plain');
    //       res.setHeader('Access-Control-Allow-Origin', '*');
    //       res.status(200).json(doc);
    //   });
try{
      const records = await FileModel.find().where('userId').in(['648d4e5cf73ce300389a2154']).populate('userId').exec();
    console.log(records);
           res.setHeader('Content-Type', 'text/plain');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.status(200).json({status:"ok",records});
}catch (e){
  res.status(500).json(err); return; 
}
    });

app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
  });