const mongoose= require('mongoose')

const connect=()=>{ 
    mongoose.connect('mongodb+srv://faad123:wIsElNCgYEfePMAi@cluster0.n0ad2oh.mongodb.net/?retryWrites=true&w=majority')
   .then(()=>console.log('connect todb')) 
    .catch(err=>console.log('cannot Connect',err))
}

module.exports = {connect}


