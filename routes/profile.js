/*
    paht: /api/usuarios

*/
const { Router } = require('express');

const { validarJwt } = require('../middlewares/validar-jwt');

const Profile = require('../models/social/profile.model');

const Usuario = require('../models/usuario');

const multer = require('multer');
const path = require('path');

const router = Router();

// Multer Configuration
const storage = multer.diskStorage({



    destination: async (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: async ( req, file, cb) => {  
        const uid = req.uid;
        const usuario = await  Usuario.findById(uid); 
           // filename of file to be stored
        cb(null, usuario.name + '.jpg');
        // cb(null, req.decoded.name + '.jpg');
    },
});

const fileFilter = async (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 6,
    },
    // fileFilter: fileFilter,
});

// adding/updating profile image
router.route('/add/image').patch(validarJwt, upload.single('img'), async (req, res) => {
    const uid = req.uid;
    const usuario = await Usuario.findById(uid); 
   
    Profile.findOneAndUpdate(
        { username: usuario.name },
        {
            $set: {
                img: req.file.path,
            },
        },
        { new: true },
        (err, profile) => {
            if (err) return res.status(500).send(err);
            const response = {
                message: 'image added successfully',
                data: profile,
            };
            return res.status(200).send(response);
        }
    );
});

router.route('/add').post(validarJwt, async (req, res) => {
    const uid = req.uid;
    const usuario =  await Usuario.findById(uid);  
    
    const profile = Profile({
        username: usuario.name,
        name: req.body.name,
        profession: req.body.profession,
        DOB: req.body.DOB,
        titleline: req.body.titleline,
        about: req.body.about,
    });
    profile.save().then(() => {
        return res.json({ msg: 'Profile Successfully Saved' });
    }).catch((err) => {
        return res.status(400).json({ msg: err });
    });
});

router.route('/checkprofile').get(validarJwt, async (req, res) => {
    const uid = req.uid;
    const usuario = await Usuario.findById(uid); 
   
    Profile.findOne({ username: usuario.name }, (err, result) => {
        if (err) return res.status(500).json({ msg: err });
        else if (result == null) {
            return res.json({ status: false, name: usuario.name });
        } else {
            return res.json({ status: true, name: usuario.name });
        }
    });
});

router.route('/getData').get(validarJwt, async (req, res) => {
    const uid = req.uid;
        const usuario = await Usuario.findById(uid); 
   
    Profile.findOne({ username: usuario.name }, (err, result) => {
        if (err) return res.status(500).json({ msg: err });
        else if (result == null) return res.json({ data: [] });
        else return res.json({ data: result });
    });
});

router.route('/update').patch(validarJwt, async (req, res) => {
    const uid = req.uid;
    const usuario = await Usuario.findById(uid); 
    
    let profile = {};           // We will store old profile data in this
    await Profile.findOne({ username: usuario.name }, (err, result) => {
        if (err) {
            profile = {};
        }
        if (result != null) {
            profile = result;
        }
    });
    Profile.findOneAndUpdate(
        { username: usuario.name },
        {
            $set: {
                name: req.body.name ? req.body.name : profile.name,
                profession: req.body.profession
                    ? req.body.profession
                    : profile.profession,
                DOB: req.body.DOB ? req.body.DOB : profile.DOB,
                titleline: req.body.titleline ? req.body.titleline : profile.titleline,
                about: req.body.about ? req.body.about : profile.about, //about:""
            },
        },
        { new: true },
        (err, result) => {
            if (err) return res.status(500).json({ err: err });
            if (result == null) return res.json({ data: [] });
            else return res.json({ data: result });
        }
    );
});


module.exports = router;

