const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
const RoleWeight = require("../models/RoleWeight");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.post('/',authMiddleware,roleMiddleware(['recruiter']),async(req,res)=>{
    try {
    const newCandidate = new Candidate(req.body);
    const savedCandidate = await newCandidate.save();
    res.status(201).json(savedCandidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//route to get all candidates from DB
router.get('/',authMiddleware,roleMiddleware(["recruiter"]),async(req,res)=>{
    try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.put("/:id/status",authMiddleware,roleMiddleware(["recruiter"]),async (req,res)=>{
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

router.put("/:id/scores",authMiddleware,roleMiddleware(["recruiter"]),async(req,res)=>{
    try{
        const { dsaScore, systemDesignScore, projectScore, hrScore } = req.body;
        const newCandidate = await Candidate.findById(req.params.id);
        if (!newCandidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        console.log("Candidate role:", newCandidate.targetRole);

        const roleWeight = await RoleWeight.findOne({ role: newCandidate.targetRole });

        console.log("Role weight found:", roleWeight);        if(!roleWeight){
            return res.status(404).json({ message: "Role weights not found" });
        }
        const finalScore = dsaScore * roleWeight.dsaWeight +
            systemDesignScore * roleWeight.systemDesignWeight +
            projectScore * roleWeight.projectWeight +
            hrScore * roleWeight.hrWeight;
            
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

router.get("/top/:role", authMiddleware,roleMiddleware(["recruiter"]),async (req, res) => {
    try {

        const role = req.params.role;
        //we get top 5 candidates for a specific role
        const candidates = await Candidate.find(
                { targetRole: role },
                { name: 1, finalScore: 1, experience: 1 }
            )
            .sort({ finalScore: -1 })
            .limit(5);

        if (candidates.length === 0) {
            return res.status(404).json({ message: "No candidates found for this role" });
        }

        res.json(candidates);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//leaderboard API - ranks

router.get("/leaderboard/:role", authMiddleware,roleMiddleware(["recruiter"]),async (req, res) => {
    try {

        const role = req.params.role;

        const candidates = await Candidate.find(
            { targetRole: role },
            { name: 1, finalScore: 1, experience: 1 }
        ).sort({ finalScore: -1 });

        if (candidates.length === 0) {
            return res.status(404).json({ message: "No candidates found for this role" });
        }

        const leaderboard = candidates.map((candidate, index) => ({
            rank: index + 1,
            name: candidate.name,
            experience: candidate.experience,
            finalScore: candidate.finalScore
        }));

        res.json(leaderboard);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get("/me", authMiddleware, async (req, res) => {

  try {

    const userId = req.user.id;

    const candidate = await Candidate.findOne({ email: req.user.email });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.json(candidate);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

});
module.exports = router;