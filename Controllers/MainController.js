const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcrypt');
const UserSchema = require('../Models/User');
const IncidentSchema = require('../Models/Incident');
dotenv.config();

// Registration of User //
const registerUser = async (req,res) => {
    try {
        // Connect to the DB.

        let db = await mongoose.connect(process.env.MONGO_URI);

        // Hashing the Password.

        let salt = bcryptjs.genSaltSync(10);
        let hash = bcryptjs.hashSync(req.body.password, salt);
        req.body.password = hash;

        // Setting User role as admin to false.
        req.body.admin = false;
        const user = req.body;

        // Checking if email id is already registered or not.

        const userCheck = await UserSchema.findOne({ email: req.body.email });

        if(!userCheck){
            // Creating new user.
        const newUser = new UserSchema(user);

        // Saving the deatails of new user to DB.
            await  newUser.save();

        // Closing the Connection.
        await mongoose.disconnect();
        console.log('Mongo Connection Closed');
        return res.status(201).json(newUser);
        }
        await mongoose.disconnect();
        console.log('Mongo Connection Closed');
        return res.status(400).json({
            message:"Email id is already registered."
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message:"Something went wrong!"
        });
    }
};

// User Login //

const userLogin = async (req,res) => {
    try {
        // Connect to the DB.
        let db = await mongoose.connect(process.env.MONGO_URI);

        // Fetching User Details.

        const user = await UserSchema.findOne({ email: req.body.email });
        const check = await UserSchema.find({ email:req.body.email });

        let userCheck = user;
        let userType = user.admin;
        let userId = user.email;
        console.log(userType,"This is userType")

        if(userCheck){
            //Hashing the incoming password and compare it with stored password in DB.
             let validPassword = bcryptjs.compareSync(req.body.password,userCheck.password);
            if(validPassword) {
                // Generate JWT token.
                let token = jwt.sign({ id:userCheck._id},process.env.JWT_SECRET);
                res.json({
                    message:true,
                    token,
                    userId,
                    userType,
                })  ;         
            }
            else {
                res.status(400).json({
                    message:"Username/Password is incorrect!"
                })
            }
            }
            else {
                res.status(400).json({
                    message:"Username/Password is incorrect!"
                })
            }
            // Closing the Mongo Connection.
            await mongoose.disconnect();
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message:"Username/Password is incorrect!"
        })
    }
};

// Listing all users. //

const listUsers = async (req,res) => {
    try {
        // Connect to the DB.
        let db = await mongoose.connect(process.env.MONGO_URI);

        // Fetching all Users.
        const users = await UserSchema.find();

        res.status(200).json({
            users,
            message:'success'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"Something went wrong!"
        })
    }
};

// Fetch single User Details. //

const singleUserDetails = async (req,res) => {
try {
    // console.log(req.params.id,"this is the user email")
    // Connect to the DB.
    let db = await mongoose.connect(process.env.MONGO_URI);

    // Find the user using email id.
    const singleUser = await UserSchema.findOne({ email: req.params.id });
    const {password,...others} = singleUser._doc;
const inicdentId = singleUser.incidents
    const incidentDetails = await IncidentSchema.find({ _id : inicdentId});
    console.log(incidentDetails,"--------------This is the incident deatils after fetching using id.")
    res.status(200).json({others,incidentDetails});
} catch (error) {
    console.log(error);
    res.status(500).json(err)
}
};


// Deleting an Incident by admin. //

const deleteIncident = async (req,res) => {
    
    try {
        console.log(req.body.delIndex)
            // Connect to the DB.
            let db = await mongoose.connect(process.env.MONGO_URI);

            const incident = req.body.delIndex;

             // Saving the deatails of incident user to DB.
            const deletedIncident = await  IncidentSchema.findById(incident);
            await deletedIncident.delete();

            // Closing the Mongo Connection.
            await mongoose.disconnect();
            return res.status(204).json({
                message:"Deleted the Incident Successfully!"
            });
    } catch (error) {
        console.log(error);
res.status(500).json({
    message:"Something went wrong!"
});
    }
};
// Creating an Incident by admin. //

const createIncident = async (req,res) => {
    try {
            // Connect to the DB.
            let db = await mongoose.connect(process.env.MONGO_URI);

            // const user = await UserSchema.findOne({ email: req.body.email });
            req.body.resolved=false;
            const incident = req.body;

             // Saving the deatails of incident user to DB.
            const newIncident = new IncidentSchema(incident);
            await newIncident.save();

            // Closing the Mongo Connection.
            await mongoose.disconnect();
            return res.status(201).json(newIncident);
    } catch (error) {
        console.log(error);
res.status(500).json({
    message:"Something went wrong!"
});
    }
};

// Lisitng all incidents. // 

const listIncidents = async (req,res) => {
    try {

        // Connect to the DB.
        let db = await mongoose.connect(process.env.MONGO_URI);
        
        let { page, size } = req.query;

        // If the page is not applied in query.
        if (!page) {
  
            // Make the Default value one.
            page = 1;
        }
  
        if (!size) {
            size = 10;
        }

        const limit = parseInt(size);
        const startIndex = (parseInt(page) - 1) * limit;
        const total = await IncidentSchema.countDocuments({});
        console.log(limit,"-------limit----")
        // Fetching all incidents.
        const incidents = await IncidentSchema.find().sort({ _id: -1}).limit(limit).skip(startIndex);
        
        res.status(200).json({
            incidents,
            message:"success",
            page,
            size,
            totalPages:Math.ceil(total / limit)
        });
        
        // Close the Connection
        await mongoose.disconnect();
            
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message:"Something went wrong!"
            });
        };
}

// Fetch Single Incident Details. // 

const singleIncident = async (req,res) => {
    console.log(req.params.id)
    try {
        // Connect to the DB.
        let db = await mongoose.connect(process.env.MONGO_URI);
console.log(req.params.id)
        const incident = await IncidentSchema.findById(req.params.id);
        res.status(200).json({
            incident,
            message:"Success"
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"Something went wrong!"
        });
    }
}


// Assigning an incident to user. //
const assignIncident = async (req,res) => {
    try {
        let incident = req.body.path;
        let user = req.body.id;

        // Connect to the DB.
              let db = await mongoose.connect(process.env.MONGO_URI);

        // Fetch the Incident details.
 
        const Incident = await IncidentSchema.findByIdAndUpdate(incident,{ userassigned : user });
        console.log(Incident,"Incident after Update")
        // incident.userAsssigned = user;

        // Find the user.

        const User = await UserSchema.findByIdAndUpdate(user,{"$push":{incidents:incident}});
        console.log(User,"user after Update")

           res.status(201).json({
               message:"Successfully assigned the user to the incident."
           })
  } catch (error) {
      console.log(error);
      res.status(500).json({
          message:"Something went wrong!"
      })
  };
};

// Resolving an Incident as a User. //

const resolveIncident = async (req,res) => {
    try {
        // Connect to the DB.
        let db = await mongoose.connect(process.env.MONGO_URI);

        const resolvedIncident = await IncidentSchema.findByIdAndUpdate(req.params.id,{resolved:true});
        res.status(200).json({
            message:"Incident updated successfully",
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"Something went wrong!"
        })
    }
}





module.exports = {
    
    registerUser,
    userLogin,
    createIncident,
    listIncidents,
    listUsers,
    singleIncident,
    assignIncident,
    deleteIncident,
    singleUserDetails,
    resolveIncident
}