import Roadmap from "../models/Roadmap.js";
import { RoadmapAgent } from "../AllAgents/roadmap.agent.js";

export const generateRoadmap = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { topic, level = "Intermediate" } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!topic?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    const result = await RoadmapAgent({ topic: topic.trim(), level });

    if (result.error || !result.roadmap) {
      return res.status(500).json({
        success: false,
        message: result.error || "Roadmap generation failed",
      });
    }

    
    const cleanPhases = (result.roadmap.phases || []).map((phase, i) => ({
      id: Number(phase.id) || i + 1,
      title: String(phase.title || `Phase ${i + 1}`).slice(0, 200),
      duration: String(phase.duration || "").slice(0, 50),
      description: String(phase.description || "").slice(0, 1000),
      tasks: Array.isArray(phase.tasks)
        ? phase.tasks.map((t) => String(t).slice(0, 500)).filter(Boolean)
        : [],
      searchKeywords: Array.isArray(phase.searchKeywords)
        ? phase.searchKeywords.map((k) => String(k).slice(0, 100)).filter(Boolean)
        : [],
      resources: Array.isArray(phase.resources)
        ? phase.resources
            .filter((r) => r && r.url)
            .map((r) => ({
              id: String(r.id || "").slice(0, 100),
              title: String(r.title || "").slice(0, 300),
              description: String(r.description || "").slice(0, 800),
              url: String(r.url || "").slice(0, 1000),
              type: String(r.type || "Documentation").slice(0, 50),
              domain: String(r.domain || "").slice(0, 100),
              keywords: String(r.keywords || "").slice(0, 200),
            }))
        : [],
    }));

   
    const saved = await Roadmap.findOneAndUpdate(
      { userId, topic: topic.trim() },
      {
        userId,
        topic: topic.trim(),
        title: String(result.roadmap.title || topic.trim()).slice(0, 200),
        totalWeeks: Number(result.roadmap.totalWeeks) || cleanPhases.length,
        phases: cleanPhases,
        completedTasks: {},
        generatedAt: new Date(),
      },
      { upsert: true, returnDocument: "after" }
    );

    console.log(`   Saved roadmap to MongoDB (id: ${saved._id})`);

    return res.json({
      success: true,
      roadmap: {
        id: saved._id,
        title: saved.title || saved.topic,
        totalWeeks: saved.totalWeeks,
        phases: saved.phases,
      },
      completedTasks: {},
    });
  } catch (error) {
    console.error("generateRoadmap error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate roadmap",
    });
  }
};


export const getRoadmap = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { topic } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const query = { userId };
    if (topic && topic.trim()) {
      query.topic = topic.trim();
    }

    const roadmap = await Roadmap.findOne(query).sort({ updatedAt: -1 });

    if (!roadmap) {
      return res.json({
        success: true,
        roadmap: null,
        completedTasks: {},
      });
    }

    return res.json({
      success: true,
      roadmap: {
        id: roadmap._id,
        title: roadmap.title || roadmap.topic,
        totalWeeks: roadmap.totalWeeks,
        phases: roadmap.phases,
      },
      completedTasks: Object.fromEntries(roadmap.completedTasks || {}),
    });
  } catch (error) {
    console.error("getRoadmap error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load roadmap",
    });
  }
};

export const toggleTask = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { roadmapId, taskKey, completed } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roadmapId || !taskKey) {
      return res.status(400).json({
        success: false,
        message: "roadmapId and taskKey are required",
      });
    }

    const roadmap = await Roadmap.findOne({ _id: roadmapId, userId });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found",
      });
    }

   
    if (completed) {
      roadmap.completedTasks.set(taskKey, true);
    } else {
      roadmap.completedTasks.delete(taskKey);
    }

    await roadmap.save();

    return res.json({
      success: true,
      completedTasks: Object.fromEntries(roadmap.completedTasks || {}),
    });
  } catch (error) {
    console.error("toggleTask error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update task",
    });
  }
};