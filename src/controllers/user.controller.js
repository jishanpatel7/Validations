const express = require('express');

const {body, validationResult} = require('express-validator');

const User = require('../models/user.model');

const router = express.Router();

router.post("/", 
   body('first_name').isString().isLength({min:3, max:20}).withMessage('First name must be at least 3 characters long'),
   body('last_name').notEmpty().withMessage('Last name is required'),
   body("email").custom(async (value) => {
       //Email characters must be between 6 and 30 - valid email format
       const Email = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(value); //Email characters must be between 6 and 30 - valid email format
         if(!Email){
                throw new Error('Email is not valid'); //custom error message
            }
         //Email must be unique
            const emailExist = await User.findOne({email:value});//Email must be unique
            if(emailExist){
                throw new Error('Email already exist'); //custom error message
            }
        return true; //Email is valid
   }),
   body('pincode').isLength({min:6, max:6}).withMessage('Pincode must be 6 digits long').custom((value) => {
         //Pincode must be numeric
            const Pincode = /^\d+$/.test(value);
            if(!Pincode){
                throw new Error('Pincode must be numeric'); //custom error message
            }
            return true; //Pincode is valid
    }),
    body("age").notEmpty().withMessage('Age is required').custom((value) => {
        if(value < 1 || value > 100){
            throw new Error('Age must be between 1 and 100'); //custom error message
            }
            return true; //Age is valid
            }),
    body('gender').notEmpty().withMessage("Gender is required").custom((value)=>{
        if(value == "Male" || value == "Female" || value == "Others") {
            return true;
        }
        throw new Error("Gender should be correct")
    }),
    async (req, res) => {
        //Middleware Validation check
        const errors = validationResult(req);
        if(!errors.notEmpty()) {
            const newErrors = errors.array().map(({param, msg}) => {
                return {
                    [param]: msg,
                }
            });
            return res.status(422).json({errors: newErrors});
        }
        //Create new user
        try{
            const newUser = await User.create(req.body);
            res.status(201).json(newUser);
        } catch(err) {
            res.status(500).json({message: err.message});
        }

    });

    //Get all users
    router.get("/", async (req, res) => {
        try{
            const users = await User.find();
            res.json(users).status(200);
        } catch(err) {
            res.status(500).json({message: err.message, status:"Failed"});
        }
    });

    //Get user by id
    router.get("/:id", async (req, res) => {
        try{
            const user = await User.findById(req.params.id);
            res.json(user).status(200);
        } catch(err) {
            res.status(500).json({message: err.message, status:"Failed"});
        }
    });

    //Update user by id
    router.patch("/:id", async (req, res) => {
        try{
            const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
            res.json(user).status(200);
        } catch(err) {
            res.status(500).json({message: err.message, status:"Failed"});
        }
    });
    //Delete user by id
    router.delete("/:id", async (req, res) => {
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.json(user).status(200);
        } catch(err) {
            res.status(500).json({message: err.message, status:"Failed"});
        }
    });

    module.exports = router;