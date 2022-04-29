const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const url = process.env.MONGO_URI;
const PORT = process.env.PORT || 8080;
const cors = require('cors');
const AuthRoute = require('./Routes/Auth');
const userRoute = require('./Routes/Users');
const incidentRoute = require('./Routes/Incident');

app.use(express.json());
const corsOptions ={
    exposedHeaders:'x-total-count',
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
})
.then(console.log("Connected to DB"))
.catch((err) => console.log(err));

app.use("/",AuthRoute);
app.use("/users",userRoute);
app.use("/incident",incidentRoute);

app.listen(PORT,()=>{
    console.log(`Backend is running on ${PORT}`);
});