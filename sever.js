require('dotenv').config();


// const UserModel = require('./models/user.js');

const http=require('http');
const express=require('express');
const {connectToDb,connection} = require('./db/connect.js');
var faker = require('faker');
const bcrypt = require('bcryptjs');


var cors = require('cors')


const Mongoose = require('mongoose');




// Import jwt for API's endpoints authentication
const jwt = require('jsonwebtoken');
var apiRouter = require("./routes/api");
const UserModel = require('./models/user.js');





const app= express();
const port=5004;
const host= "127.0.0.1";
const secret="somexhyruion3456";
connectToDb();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors())

app.use("/", apiRouter);

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

app.post('/lg',async(req,res)=>{
    var params = req.params;
    const query = req.query;
    const body= req.body;
  
    // console.log(query);
    // console.log(params);
    // console.log(body);
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
          
          res.json({message:'Login Succeed',token});

  })

app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
  });