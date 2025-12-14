import express from "express";
import { InterestModel } from "../models/InterestModel.js";

const router = express.Router();

/**
 * This route will display all interests.
**/
router.get('/', async (req, res) => {
  try {
    const interests = await InterestModel.find({});
    return res.status(200).json({
      count: interests.length,
      data: interests
    });
  } catch (error) {
    console.log('Error fetching interests:', error.message);
    res.status(500).send({message: error.message});
  }
});

/**
 * This route will display 1 interest by ID.
**/
router.get('/:id', async (req, res) => {
  try{
    const interest = await InterestModel.findById(req.params.id);
    return res.status(200).json(interest);
  }catch(error){
    console.log(error.message);
    res.status(500).send({message: error.message});
  }
});

/**
 * This route will add a interest.
**/
router.post('/new', async(req, res) => {
  try{
    if(!req.body){
      return res.status(400).send({message: 'Content cannot be empty'});
    }
    const newInterest = {
      interestName: req.body.interestName,
      categories: req.body.categories,
    }
    const interest = await InterestModel.create(newInterest);
    return res.status(201).send(newInterest)
  }catch(error){
    console.log(error.message);
    res.status(500).send({message: error.message});
  }
});

/**
 * This route will update an interest.
**/
router.put('/:id', async (req, res) => {
  try{
    if(!req.body){
      return res.status(400).send({message: 'Content cannot be empty'});
    }
    const interest = await InterestModel.findByIdAndUpdate(req.params.id, {
      interestName: req.body.interestName,
      categories: req.body.categories,
      updatedAt: Date.now()
    });
    if(!interest){
      return res.status(404).send({message: 'Interest not found'});
    }
    return res.status(200).send(interest);
  }catch(error){
    console.log(error.message);
    res.status(500).send({message: error.message});
  }
});

/**
 * This route will delete an interest.
**/
router.delete('/:id', async (req, res) => {
  try{
    const interest = await InterestModel.findByIdAndDelete(req.params.id);
    if(!interest){
      return res.status(404).send({message: 'Interest not found'});
    }
    return res.status(200).send({message: 'Interest deleted successfully'});
  }catch(error){
    console.log(error.message);
    res.status(500).send({message: error.message});
  }
});

export default router;
