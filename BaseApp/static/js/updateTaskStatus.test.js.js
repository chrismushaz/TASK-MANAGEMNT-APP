// updateTaskStatus.test.js
const { expect } = require("chai");
const { updateTaskStatus } = require("../updateTaskStatus");

describe("updateTaskStatus", () => {
  it("should update the status of the task", () => {
    const task = { id: 1, title: "Test Task", status: "To Do" };
    const result = updateTaskStatus(task, "In Progress");
    expect(result.status).to.equal("In Progress");
  });

  it("should throw error if task is null", () => {
    expect(() => updateTaskStatus(null, "Done")).to.throw("Invalid input");
  });
});
