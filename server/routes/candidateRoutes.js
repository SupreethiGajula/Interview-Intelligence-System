const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");



router.post('/',async(req,res)=>{
    try {
    const newCandidate = new Candidate(req.body);
    const savedCandidate = await newCandidate.save();
    res.status(201).json(savedCandidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//route to get all candidates from DB
router.get('/',async(req,res)=>{
    try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.put("/:id/status", async (req,res)=>{
    try{
        const {status} = req.body;

        const updatedCandidate = await Candidate.findByIdAndUpdate(
            req.params.id,
            {status},
            {new:true}
        );
        res.json(updatedCandidate);
    }catch(err){
        res.status(500).json({error:err.message});
    }
});

router.put("/:id/scores",async(req,res)=>{
    try{
        const { dsaScore, systemDesignScore, projectScore, hrScore } = req.body;
        const finalScore =
            (dsaScore + systemDesignScore + projectScore + hrScore) / 4;

        const updatedCandidate = await Candidate.findByIdAndUpdate(
            req.params.id,
            {
                dsaScore,
                systemDesignScore,
                projectScore,
                hrScore,
                finalScore
            },
            { new: true }
        );

        res.json(updatedCandidate);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})
module.exports = router;