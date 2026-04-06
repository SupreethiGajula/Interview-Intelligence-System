const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
const RoleWeight = require("../models/RoleWeight");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { candidateSchema } = require("../validationSchemas/candidateValidation");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

router.post(
    "/",
    authMiddleware,
    roleMiddleware(["recruiter"]),
    async (req, res) => {
        try {
            const { error } = candidateSchema.validate(req.body);

            if (error) {
                return res.status(400).json({
                    message: error.details[0].message,
                });
            }

            const newCandidate = new Candidate(req.body);
            const savedCandidate = await newCandidate.save();

            res.status(201).json({
                message: "Candidate added successfully",
                candidate: savedCandidate,
            });
        } catch (error) {
            res.status(500).json({
                message: "Server error while adding candidate",
            });
        }
    }
);

//route to get all candidates from DB
router.get('/', authMiddleware, roleMiddleware(["recruiter"]), async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.put("/:id/status", authMiddleware, roleMiddleware(["recruiter"]), async (req, res) => {
    try {
        const { status } = req.body;

        const updatedCandidate = await Candidate.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(updatedCandidate);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/:id/scores", authMiddleware, roleMiddleware(["recruiter"]), async (req, res) => {
    try {
        const { dsaScore, systemDesignScore, projectScore, hrScore } = req.body;
        const newCandidate = await Candidate.findById(req.params.id);
        if (!newCandidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        console.log("Candidate role:", newCandidate.targetRole);

        const roleWeight = await RoleWeight.findOne({ role: newCandidate.targetRole });

        console.log("Role weight found:", roleWeight);
        if (!roleWeight) {
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

router.get("/top/:role", authMiddleware, roleMiddleware(["recruiter"]), async (req, res) => {
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

router.get("/leaderboard/:role", authMiddleware, roleMiddleware(["recruiter"]), async (req, res) => {
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
// DELETE /candidates/:id/delete
router.delete("/:id/delete", async (req, res) => {
    try {
        const { id } = req.params; // Correct way to get id from URL
        const deletedCandidate = await Candidate.findByIdAndDelete(id);

        if (!deletedCandidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        res.json({ message: "Candidate deleted successfully", candidate: deletedCandidate });
    } catch (err) {
        console.error(err);
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
router.get(
    "/me/ai-feedback",
    authMiddleware,
    roleMiddleware(["candidate"]),
    async (req, res) => {
        try {
            const candidate = await Candidate.findOne({ email: req.user.email });

            if (!candidate) {
                return res.status(404).json({ message: "Candidate not found" });
            }

            //             const prompt = `
            // Generate personalized interview feedback.

            // Candidate:
            // Name: ${candidate.name}
            // Role: ${candidate.targetRole}
            // Experience: ${candidate.experience}
            // Skills: ${candidate.skills.join(", ")}
            // Status: ${candidate.status}
            // DSA Score: ${candidate.dsaScore}
            // System Design Score: ${candidate.systemDesignScore}
            // Project Score: ${candidate.projectScore}
            // HR Score: ${candidate.hrScore}
            // Final Score: ${candidate.finalScore}

            // Provide:
            // - strengths
            // - weak areas
            // - next preparation advice
            // - keep it under 100 words
            // `;

            //             const completion = await openai.chat.completions.create({
            //                 model: "gpt-4o-mini",
            //                 messages: [
            //                     {
            //                         role: "system",
            //                         content: "You are an expert technical interviewer.",
            //                     },
            //                     {
            //                         role: "user",
            //                         content: prompt,
            //                     },
            //                 ],
            //                 max_tokens: 150,
            //             });

            //             const feedback = completion.choices[0].message.content;

            // 1️⃣ Status-based feedback first
            // if (candidate.status === "Rejected") {
            //     feedback =
            //         "Although this opportunity did not work out, your completed rounds show promise. Focus on improving weaker areas and come back stronger for your next interview.";
            // }
            // else if (candidate.status === "Selected") {
            //     feedback =
            //         "Congratulations 🎉 You performed strongly across the interview process. Keep sharpening your technical depth and communication skills for future growth.";
            // }
            // else if (candidate.status === "Applied") {
            //     feedback =
            //         "Your interview process has not started yet. Begin with DSA practice, resume storytelling, and preparation for your target role.";
            // }
            // else if (candidate.status === "Interviewed") {
            //     // 2️⃣ Score-based feedback for ongoing rounds
            //     const completedRounds = [
            //         candidate.dsaScore,
            //         candidate.systemDesignScore,
            //         candidate.projectScore,
            //         candidate.hrScore,
            //     ].filter((score) => score > 0).length;

            //     if (completedRounds < 4) {
            //         feedback =
            //             "Good progress so far 🚀 Based on completed rounds, focus on the upcoming interview stages and strengthen weak concepts before the next round.";
            //     } else {
            //         feedback =
            //             "Excellent effort across all rounds 👏 Your strengths are visible in technical and communication rounds. Work on consistency in weaker sections for even stronger future performance.";
            //     }
            //}
            //this below thing is because AI is assuming that if scores are 0 - candidate performance is poor 
            //so if score is 0 then we put put the score as pending
            const dsaStatus =
                candidate.dsaScore > 0 ? candidate.dsaScore : "Pending";
            const systemDesignStatus =
                candidate.systemDesignScore > 0
                    ? candidate.systemDesignScore
                    : "Pending";
            const projectStatus =
                candidate.projectScore > 0 ? candidate.projectScore : "Pending";
            const hrStatus =
                candidate.hrScore > 0 ? candidate.hrScore : "Pending";
            const prompt = `
Generate personalized interview feedback.

Candidate:
Name: ${candidate.name}
Role: ${candidate.targetRole}
Experience: ${candidate.experience}
Skills: ${candidate.skills.join(", ")}
Status: ${candidate.status}

Interview Round Progress:
DSA Score: ${dsaStatus}
System Design Score: ${systemDesignStatus}
Project Score: ${projectStatus}
HR Score: ${hrStatus}
Final Score: ${candidate.finalScore}

Important:
- "Pending" means that round is not completed yet
- Do not treat pending rounds as poor performance
- Give feedback only based on completed rounds
- Mention preparation tips for upcoming pending rounds
- keep it under 100 words
`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });

            const feedback = response.text;

            res.json({ feedback });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error generating AI feedback" });
        }
    }
);
router.get(
  "/me/ai-roadmap",
  authMiddleware,
  roleMiddleware(["candidate"]),
  async (req, res) => {
    try {
      const candidate = await Candidate.findOne({ email: req.user.email });

      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }

      const dsaStatus =
        candidate.dsaScore > 0 ? candidate.dsaScore : "Pending";
      const systemDesignStatus =
        candidate.systemDesignScore > 0
          ? candidate.systemDesignScore
          : "Pending";
      const projectStatus =
        candidate.projectScore > 0
          ? candidate.projectScore
          : "Pending";
      const hrStatus =
        candidate.hrScore > 0 ? candidate.hrScore : "Pending";

      const prompt = `
Generate a personalized interview preparation roadmap.

Candidate:
Role: ${candidate.targetRole}
Experience: ${candidate.experience}
Skills: ${candidate.skills.join(", ")}

Round Progress:
DSA: ${dsaStatus}
System Design: ${systemDesignStatus}
Projects: ${projectStatus}
HR: ${hrStatus}

Instructions:
- Focus only on pending rounds
- Suggest 3-5 specific preparation topics
- Mention role-specific concepts
- Keep response concise and practical
- Use bullet points
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      res.json({ roadmap: response.text });
    } catch (err) {
      console.error("Gemini roadmap error:", err);
      res.status(500).json({ message: "Error generating roadmap" });
    }
  }
);
module.exports = router;