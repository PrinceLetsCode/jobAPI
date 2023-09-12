const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config({path:'./config/config.env'});

const connectDB = require('./config/database');
const errorMiddleware = require('./middlewares/errors');

app.use(express.json());

// importing all routes.
const jobRoutes = require('./routes/jobRoutes');


app.use('/api/v1',jobRoutes);

// Middleware to handle errros.
app.use(errorMiddleware);   



const PORT = process.env.PORT || 8000;

const start = async ()=>{
    try{
        await connectDB(process.env.DB_LOCAL_URI);
        app.listen(PORT,()=>{
            console.log(`server running on port ${PORT} in ${process.env.NODE_ENV}`);
        })
    }catch(error){
        console.log(error);
    }
}

start();

