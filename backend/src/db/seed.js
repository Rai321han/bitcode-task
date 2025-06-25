import Roadmap from "../models/roadmap.model.js";
import { connectDB } from "./db.js";

export async function seedDB() {
  try {
    await connectDB();
    const count = await Roadmap.countDocuments();

    if (count > 0) {
      console.log("👉 Database already has data. Skipped seeding!");
      process.exit(0);
    }

    const roadmapData = [
      {
        feature: "User authentication",
        status: "in-progress",
        upvotes: 0,
        comments: 0,
        milestones: [
          { title: "Identify auth approach", status: "incompleted" },
          { title: "Implement registration", status: "incompleted" },
          { title: "Implement login", status: "incompleted" },
          { title: "Test auth", status: "incompleted" },
        ],
      },
      {
        feature: "Dark mode support",
        status: "completed",
        upvotes: 0,
        comments: 0,
        milestones: [
          { title: "Design dark theme palette", status: "completed" },
          { title: "Implement theme toggle", status: "completed" },
          { title: "Persist user preference", status: "completed" },
        ],
      },
      {
        feature: "Mobile responsiveness",
        status: "in-progress",
        upvotes: 0,
        comments: 0,
        milestones: [
          { title: "Update layout for small screens", status: "completed" },
          { title: "Test on iOS/Android", status: "incompleted" },
          { title: "Bug fixes", status: "incompleted" },
        ],
      },
      {
        feature: "Admin dashboard",
        status: "planned",
        upvotes: 0,
        comments: 0,
        milestones: [
          { title: "Define admin features", status: "incompleted" },
          { title: "Design dashboard UI", status: "incompleted" },
          { title: "Implement user management", status: "incompleted" },
        ],
      },
      {
        feature: "Notification system",
        status: "planned",
        upvotes: 0,
        comments: 0,
        milestones: [
          { title: "Decide notification types", status: "incompleted" },
          { title: "Build backend API", status: "incompleted" },
          { title: "Display alerts in UI", status: "incompleted" },
        ],
      },
      {
        feature: "Performance improvements",
        status: "completed",
        upvotes: 0,
        comments: 0,
        milestones: [
          { title: "Lazy load components", status: "completed" },
          { title: "Optimize bundle size", status: "completed" },
          { title: "Improve API response time", status: "completed" },
        ],
      },
    ];

    await Roadmap.insertMany(roadmapData);
    console.log("✅ Seeding complete!");
    process.exit(0)
  } catch (error) {
    console.log("Error while database seeding", error);
    
  }
}

seedDB();
