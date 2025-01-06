const applicationModel = require("../models/applicationModel");
const groupModel = require("../models/groupModel");
const applicationStateModel = require("../models/applicationStateModel");

const addNewApplication = async (req, res) => {
  if (!req.body.startDate || !req.body.groupId) {
    res.status(400).json({ message: "Start date and group id are required" });
    return;
  }

  try {
    const fetchedGroup = await groupModel.getGroupById(req.body.groupId);
    if (!fetchedGroup) {
      res.status(404).json({ message: "Group not found" });
      return;
    }

    const state = await applicationStateModel.getStateByName(
      "W trakcie rozpatrywania"
    );

    if (!state) {
      console.log("state not found");
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    const application = {
      studentId: req.userId,
      startDate: req.body.startDate,
      groupId: req.body.groupId,
      comment: req.body.comment || null,
      state: state.id,
    };

    await applicationModel.addNewApplication(application);
    res.status(201).send("Application added");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteApplicationById = async (req, res) => {
  const applicationId = req.params.id;

  try {
    const fetchedApplication = await applicationModel.getApplicationById(
      applicationId
    );
    if (!fetchedApplication) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    await applicationModel.deleteApplicationById(req.params.id);
    res.status(200).send("Application deleted");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addNewApplication,
  deleteApplicationById,
};
