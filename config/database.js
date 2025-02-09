const mongoose =require('mongoose')
const dotenv =require('dotenv')
dotenv.config({path :'config.env'});

// connection with db
const dbConnection=()=>{
mongoose.connect(process.env.DB_URL_COMPASS)
.then((conn)=>{
    console.log(`db connected :${conn.connection.host}`)
}).catch(err=>{
    console.log(`database error : ${err}`)
    process.exit(1)
})
}
module.exports=dbConnection