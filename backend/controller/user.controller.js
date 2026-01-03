import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import ConnectionRequest from "../models/connections.model.js";

import PDFDownload from "pdfkit";
import fs from "fs";


const convertUserDataToPDF = async (userData) => {
    const doc = new PDFDownload({ margin: 50 });

    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
    const stream = fs.createWriteStream("uploads/" + outputPath);

    doc.pipe(stream);

    // ===== HEADER =====
    if (userData.userId.profilePicture) {
        doc.image(`uploads/${userData.userId.profilePicture}`, 50, 50, {
            width: 80,
            height: 80
        });
    }

    doc
        .fontSize(22)
        .font("Helvetica-Bold")
        .text(userData.userId.name, 150, 50);

    doc
        .fontSize(12)
        .font("Helvetica")
        .text(userData.currentPosition, 150, 80);

    doc
        .fontSize(10)
        .fillColor("gray")
        .text(
            `${userData.userId.email} | @${userData.userId.username}`,
            150,
            100
        );

    doc.moveDown(3);
    doc.fillColor("black");

    // ===== PROFILE =====
    doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Profile");

    doc
        .moveDown(0.5)
        .fontSize(11)
        .font("Helvetica")
        .text(userData.bio, { align: "justify" });

    doc.moveDown(1.5);

    // ===== EXPERIENCE =====
    doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Experience");

    doc.moveDown(0.5);

    userData.pastWork.forEach((work) => {
        doc
            .fontSize(12)
            .font("Helvetica-Bold")
            .text(work.position);

        doc
            .fontSize(11)
            .font("Helvetica")
            .fillColor("gray")
            .text(`${work.company} | ${work.years}`);

        doc.moveDown(0.8);
        doc.fillColor("black");
    });

    doc.end();

    return outputPath;
};


// const convertUserDataToPDF = async (userData) => {

//     const doc = new PDFDownload();

//     const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
//     const stream = fs.createWriteStream("uploads/" + outputPath);

//     doc.pipe(stream);

//     doc.image(`uploads/${userData.userId.profilePicture}`, {align: "center", width: 100})
//     doc.fontSize(14).text(`Name: ${userData.userId.name}`);
//     doc.fontSize(14).text(`Username: ${userData.userId.username}`);
//     doc.fontSize(14).text(`Email: ${userData.userId.email}`);
//     doc.fontSize(14).text(`Bio: ${userData.bio}`);
//     doc.fontSize(14).text(`Current Position: ${userData.currentPosition}`);

//     doc.fontSize(14).text("Past Work: ")
//     userData.pastWork.forEach((work, index) => {
//         doc.fontSize(14).text(`Company Name: ${work.company}`);
//         doc.fontSize(14).text(`Position: ${work.position}`);
//         doc.fontSize(14).text(`Years: ${work.years}`);
//     });

//     doc.end();

//     return outputPath;

// }


export const register = async (req, res) => {
    try {

        const { name, email, password, username} = req.body;

        if (!name || !email || !password || !username) return res.status(400).json({ message: "All fields are required" });
        
        const user = await User.findOne({email});
        if (user) return res.status(400).json({message: "User already exists"});

        const hashedPassword = await bcrypt.hash (password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username
        });
        
        await newUser.save();

        const profile = new Profile({
            userId : newUser._id
        });

        await profile.save();

        res.json({message : "User registered succesfully"});

    } catch (err) {

        return res.status(500).json({ message: err.message });

    }
};


export const login = async (req, res) =>{
    try {

        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: "All fields are required" });

        const user = await User.findOne({email});
        if (!user) return res.status(404).json({message: "User does not exists"});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({message: "Invalid Credentials"});

        const token = crypto.randomBytes(32).toString("hex");

        await User.updateOne({ _id : user._id}, { token });

        res.json({token : token});


    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


export const uploadProfilePicture = async (req, res) => {
    const {token} = req.body;
    try {
    
        const user = await User.findOne({token: token });
        if(!user) return res.status(404).json({message: "User not found"});

        user.profilePicture = req.file.filename;

        await user.save();

        res.json({message: "Profile Picture Updated"});

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


export const updateUserProfile = async (req, res) => {

    try {
        const {token, ...newUserData} = req.body;

        const user = await User.findOne({ token: token });
        if (!user) return res.status(404).json({message: "User not found"});

        const {username, email} = newUserData;

        const existingUser = await User.findOne({ $or: [{username}, { email }] });

        if(existingUser) {
            if(existingUser || String(existingUser._id) !== String(user._id)) {
                return res.status(400).json({ message: "User already exists" });
            }
        }

        Object.assign(user, newUserData);

        await user.save();

        res.json({ message : "User Updated"});

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

};


export const getUserAndProfile = async (req, res) => {
    
    try {
        const { token } = req.query;

        const user = await User.findOne({ token: token });
        if (!user) return res.status(404).json({message: "User not found"});

        const userProfile = await Profile.findOne({userId : user._id})
        .populate("userId", "name username email profilePicture");

        res.json({userProfile});

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


export const updateProfileData = async (req, res) => {

    try {

        const { token, ...newProfileData } = req.body;

        const userProfile = await User.findOne({token: token});
        if (!userProfile) return res.status(404).json({ message: "User not found" });
        
        const profile_to_update = await Profile.findOne({ userId: userProfile._id });

        Object.assign(profile_to_update, newProfileData);

        await profile_to_update.save();

        res.json({ message: "Profile Updated" });

    } catch (err) {
        return res.status(500).json({message: err.message })
    }
};


export const getAllUserProfile = async (req, res) => {
    try {

        const profiles = await Profile.find().populate('userId', 'name username email profilePicture');

        return res.json({ profiles });

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
};


export const downloadProfile = async (req, res) => {

    const user_id = req.query.id;

    const userProfile = await Profile.findOne({ userId: user_id})
    .populate("userId", "name username email profilePicture");

    let outputPath = await convertUserDataToPDF(userProfile);

    return res.json({ "message" : outputPath });

};



export const sendConnectionRequest = async (req, res) => {

    const { token, connectionId } = req.body;
    try {

        const user = await User.findOne({token});
        if (!user) return res.status(404).json({ message: "User not found" });

        const connectionUser = await User.findOne({ _id: connectionId });
        if (!connectionUser) return res.status(404).json({ message: "Connection User not found" });

        const existingRequst = await ConnectionRequest.findOne({
            userId: user._id,
            connectionId: connectionUser._id
        });

        if (existingRequst) {
            return res.status(400).json({ message: "Request already sent" });
        }

        const request = new ConnectionRequest({
            userId: user._id,
            connectionId: connectionUser._id
        });

        await request.save();

        res.json({message:"Request Sent"});

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
};


export const getMyConnectionsRequests = async (req, res) => {

    const { token } = req.query;

    try {

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const connections = await ConnectionRequest.find({ userId: user._id })
        .populate("connectionId", "name username email profilePicture");

        res.json({connections});

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

};



export const whatAreMyConnections = async (req, res) => {

    const { token } = req.body;

    try {

        const user = await User.findOne({ token });

        if (!user) return res.status(404).json({ message: "User not found" });

        const connections = await ConnectionRequest.find({ connectionId:user._id })
        .populate("userId", "name username email profilePicture");;

        res.json({connections});

    } catch (err) {
        return res.status(500).json({ message: err.message })

    }

};


export const acceptConnectionRequest = async (req, res) => {

    const { token, requestId, action_type } = req.body;

    try {

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const connection = await ConnectionRequest.findOne({ _id: requestId });

        if (!connection) {
            return res.status(404).json({ message: "Connection not found" });
        }

        if (action_type === "accept") {
            connection.status_accepted = true;
        } else {
            connection.status_accepted = false;
        }

        await connection.save();

        res.json({message:"Request Updated"});


    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


export const getUserProfileAndUserBasedOnUsername = async (req, res) => {

    const { username } = req.query;

    try {
        
        const user = await User.findOne({ username : username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userprofile = await Profile.findOne({ userId : user._id })
        .populate("userId", "name username email profilePicture");

        return res.json({ "profile" : userprofile });


    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}