const User = require('../models/User.js');
const jwt = require ('jsonwebtoken');
const bcrypt = require ('bcryptjs');

const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            role: user.role
        }, process.env.JWT_SECRET, {expiresIn: '1h'});
};

const register = async (req,res) => {
    const { email , password, role} = req.body;
    console.log ("Email:: ", email , "Password::" , password, "Role:: ", role);

    try{

        const exists = await User.findOne({email});
        if(exists) return res.status(400).json({message: "User already exists"});

        const user = new User({email, password, role});
        await user.save();
        const token = generateToken(user);
        res.status(201).json({token});

    }catch(err){
       res.status(500).json({message: "Internal Server Error"}); 
    }

};

const login = async (req,res) => {

    const {email, password} = req.body;
    try{

        const user = await User.findOne({email});
        if (!user) return res.status(400).json({message : "Invalid Credentials"});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message: "Invalid Credentials"});

        const token = generateToken(user);
        console.log("Valid Creds..Moving on..")
        res.json({token});

    }catch(err){
        res.status(500).json({message: "Internal Server Error"}); 
    }


};

module.exports = {register , login};