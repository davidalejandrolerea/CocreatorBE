const express = require("express");
const adminRouter = express.Router();
const admin = require("../middlewares/admin");
const { Question } = require("../models/question");
const { Accounts } = require("../models/accounts-connect");

const User = require("../models/user");




// Get all users

adminRouter.get("/admin/get-users", async (req, res) => {
  try {
    const users = await User.find()
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


// add question 

adminRouter.post("/admin/add-question",  async (req, res) => {
  try {
    const { title,  description, item } = req.body;
    let question = new Question({
      title,
      description,
      item
    
    });
    question= await question.save();
    res.json(question);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get questions

adminRouter.get("/admin/get-questions",  async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// update question

adminRouter.post("/admin/update-question", async (req, res) => {
  try {
    const { id,title, description, item } = req.body;
    let question = await Question.findById(id);
    question.title= title;
    
    question.description= description;
    question.item= item;
    
    question = await question.save();
    res.json(question);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// delete question

adminRouter.post("/admin/delete-question", async (req, res) => {
  try {
    const { id } = req.body;
    let question = await Question.findByIdAndDelete(id);
    res.json(question);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


// accounts conectt!!
// add account

adminRouter.post("/admin/add-account",  async (req, res) => {
  try {
    const { title,  image, item } = req.body;
    let account = new Accounts({
      title,
      image,
      item
    
    });
    account= await account.save();
    res.json(account);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get accounts

adminRouter.get("/admin/get-accounts",  async (req, res) => {
  try {
    const accounts = await Accounts.find();
    res.json(accounts);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// update account

adminRouter.post("/admin/update-account", async (req, res) => {
  try {
    const { id,title, image, item } = req.body;
    let account = await Accounts.findById(id);
    account.title= title;
    
    account.image= image;
    account.item= item;
    
    account = await account.save();
    res.json(account);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// delete account

adminRouter.post("/admin/delete-account", async (req, res) => {
  try {
    const { id } = req.body;
    let account = await Accounts.findByIdAndDelete(id);
    res.json(account);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = adminRouter;