import express from 'express'
import {insert_Spectator, get_Spectator, insert_Landlord, get_Landlord, insert_Performer, get_Performer} from '../model/database.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const router = express.Router()

router.post('/Spectator', async(req, res)=>{
    const {Name, Surname, Email, Password} = req.body
    const hash = await bcrypt.hash(Password, 9);
    const result = await insert_Spectator(Name, Surname, Email, hash);
    const token = await jwt.sign({name:Name, surname: Surname, email: Email}, process.env.ACCESS_TOKEN_SECRET);
    res.json({status: "success", token: token})
});

router.post('/Landlord', async(req, res)=>{
    const {Name, Surname, Address, DateofBirth, Email, Password} = req.body
    console.log(req.body)
    const hash = await bcrypt.hash(Password, 9);
    const result = await insert_Landlord(Name, Surname, Address, DateofBirth, Email, hash);
    const token = await jwt.sign({name:Name, surname: Surname, email: Email}, process.env.ACCESS_TOKEN_SECRET);
    res.json({status: "success", token: token})
});

router.post('/Performer', async(req, res)=>{
    const {Name, Surname, Artist, Category, Email, Password} = req.body
    const hash = await bcrypt.hash(Password, 9);
    const result = await insert_Performer(Name, Surname, Artist, Category, Email, hash);
    const token = await jwt.sign({ email: Email}, process.env.ACCESS_TOKEN_SECRET);
    res.json({status: "success", token: token})
});


export default router;
