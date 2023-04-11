/*
    paht: /api/usuarios

*/
const { Router } = require('express');

const { validarJwt } = require('../middlewares/validar-jwt');


const BlogPost = require('../models/social/blogpost.model');
const Usuario = require('../models/usuario');

const multer = require('multer');

const { json } = require('express/lib/response');

const router = Router();


// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: async ( req, file, cb) => {    
        const uid = req.uid;
        const usuario = await Usuario.findById(uid); 
                          // filename of file to be stored
        cb(null, req.params.id + '.jpg');
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 6,
    },
});

router.route('/add/coverImage/:id').patch(validarJwt, upload.single('img'), async (req, res) => {
    BlogPost.findOneAndUpdate(
        { _id: req.params.id },
        {
            $set: {
                coverImage: req.file.path,
            },
        },
        { new: true },
        (err, result) => {
            if (err) return res.status(500).json({ msg: err });
            return res.json(result);
        }
    );
});

router.route('/add').post(validarJwt, async (req, res) => {
    const uid = req.uid;
        const usuario =  await Usuario.findById(uid); 
    const blogpost = BlogPost({
        username: usuario.name,
        title: req.body.title,
        body: req.body.body,
    });
    blogpost
        .save()
        .then((result) => {
            res.json({ data: result['_id'] });
        })
        .catch((err) => {
            res.status(500).json({ msg: err });
        });
});

router.route('/getOwnBlogs').get(validarJwt, async (req, res) => {
    const uid = req.uid;
    const usuario =  await Usuario.findById(uid); 
    BlogPost.find({ username: usuario.name }, (err, result) => {
        if (err) return res.status(500).json({ msg: err });
        if (result == null) return res.json({ data: [] });
        return res.json({ data: result });
    });
});

router.get("/getAllBlogs", async (req, res, next) => {
    try {
      const blogs = await BlogPost.find({});
      res.status(200).json({ data: blogs });
    } catch (err) {
      res.status(500).json({ msg: err.message });
      next(err);
    }
  });
  

router.route('/getOtherBlogs').get(validarJwt, async (req, res) => {
    const uid = req.uid;
        const usuario = await Usuario.findById(uid); 
    BlogPost.find({ username: { $ne: usuario.name} }, (err, result) => {
        if (err) return res.status(500).json({ msg: err });
        if (result == null) return res.json({ data: [] });
        return res.json({ data: result });
    });
});

router.route('/delete/:id').delete(validarJwt, async (req, res) => {
    const uid = req.uid;
        const usuario = await Usuario.findById(uid); 
    BlogPost.findOneAndDelete(
        {
            $and: [{ username: usuario.name}, { _id: req.params.id }],
        },
        (err, result) => {
            if (err) return res.status(500).json({ msg: err });
            else if (result) {
                return res.json({ msg: 'Blog deleted' });
            }
            return res.json({ msg: 'Blog not deleted' });
        }
    );
});




module.exports = router;

