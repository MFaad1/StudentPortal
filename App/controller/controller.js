const {stddata,admindb, classdb} = require('../model/model')
const jwt = require('jsonwebtoken');
const secretKey= 'rrrrrrrrrrrrrewr'
const bcrypt = require('bcrypt');

const signup = async(req,res)=>{
const User = new admindb(req.body)
   await User.save()
    return res.status(200).json({
        message: 'data has been saved',
        User
    })
 }

 
const login =(req,res)=>{
    const {email, password} = req.body
    admindb.findOne({email:email}).then(resp=>{
        if(!resp){
            return res.status(404).json({
                message: 'userNot Found'
            })
        }  
     let hash= resp.password
        bcrypt.compare(password, hash,(err, result) => {
          if(err){
            return res.status(401).json({
              message: 'incorrect Password'
            })
          }
        else if(result){
          const token = jwt.sign({email}, secretKey)
          return res.status(200).json({
              message: 'login sucess',
              resp,
              token,
          })
        }
      })
      
    }).catch(err=>{
      console.log('err recieved',err)
      return res.status(401).json({
        message: "error received",
      })
  })
}



const addstd=(req,res)=>{
const {classname} = req.body
    classdb.findOne({classname:classname}).then(resp=>{
        if(resp){
            const std = new stddata(req.body)
        std.save().then((response)=>{
            const stdId = response.id
       return classdb.findOneAndUpdate({classname:classname},{ $push: { student: stdId }},{ new: true })
        }).then((result) => {
            return res.status(200).json({
                message: 'user Added'
            })
        })
        .catch((err) => {
            console.log(err);
        });
    }
    else if(!resp){
      return res.status(401).json({
        message:'Class not found '
    })
    }
    else{
        return res.status(401).json({
            message:'Class not found '
        })
    }
    }).catch(err=>console.log('error', err))
   
}

const addClass=(req,res)=>{
    const clas = new classdb(req.body)
    clas.save()
    return res.status(200).json({
        message: 'class has been added'
    })

}


const getstudent = async (req, res) => {
    try {
      const response = await classdb.find({});
      const { student } = response[0];
      const respon = await Promise.all(
        student.map(async (id) => {
          const respond = await stddata.findById({ _id: id });
          if (respond) {
            return respond;
          } else {
            return {};
          }
        })
      );
      return res.status(200).json({
        message: "data get",
        response,
        respon,
      });
    } catch (err) {
      return res.status(500).json({
        message: "error",
        err,
      });
    }
  };

  const getClass=(req,res)=>{
   stddata.find({})
   .then(resp=>{
    console.log(resp)
    return res.status(200).json({
      message: 'sucessfull message',
      resp
    })
   })
   .catch(err=>{
      return res.status(500).json({
        message:'Error occured'
      })
    }
    )
  }
  
  const searchMethod = (req, res) => {
    const { q } = req.query;
  
    let query;
    if (isNaN(q)) {
      query = { name: q };
    } else {
      const rollNumber = parseInt(q);
      if (isNaN(rollNumber)) {
        return res.status(400).json({
          message: 'Invalid roll number',
        });
      }
      query = { roll: rollNumber };
    }
  
    stddata.find(query)
      .then(students => {
        if(!students){
          return res.status(404).json({
            students: "not found"
          });
        }
        return res.status(200).json({
          students: students
        });
      })
      .catch(err => {
        console.log('Error received', err);
        return res.status(500).json({
          message: 'Internal server error'
        });
      });
  };
  


const getByClass = (req,res)=>{
  const {clas} = req.query
  stddata.find({classname:clas})
  .then(resp=>
  {if(resp){
    return res.status(200).json({
      message:'students',
      resp
    })
  }} 
    )
}
  


 module.exports= {signup,login,addstd, addClass,getstudent,getClass,searchMethod,getByClass}