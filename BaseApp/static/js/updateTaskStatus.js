// updateTaskStatus.js
function updateTaskStatus(task, newStatus) {
    if (!task || !newStatus) throw new Error("Invalid input");
    return { ...task, status: newStatus };
  }
  module.exports = { updateTaskStatus };
  