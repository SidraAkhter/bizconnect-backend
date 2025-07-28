import User from "../models/user.model";
import Task from "../models/task.model";

/**
 * Suggest the best user to assign a task to.
 * ✅ Smarter logic: Find the user with the least assigned tasks.
 */
export const suggestBestUser = async () => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) return null;

    const userTaskCounts = await Promise.all(
      users.map(async (user) => {
        const taskCount = await Task.countDocuments({ assignedTo: user._id });
        return { user, taskCount };
      })
    );

    const sorted = userTaskCounts.sort((a, b) => a.taskCount - b.taskCount);
    return sorted[0].user;
  } catch (err) {
    console.error("❌ Error suggesting best user:", err);
    return null;
  }
};
