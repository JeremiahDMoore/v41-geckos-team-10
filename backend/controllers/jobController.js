const Job = require("../models/jobModel");

//@desc Get all jobs
//@route GET /jobs
//@access Private
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user._id });
    res.status(200).send(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//@desc Get job by ID
//@route GET /jobs:id
//@access Private
const getJobById = async (req, res) => {
  try {
    const filter = { _id: req.params.id, user: req.user._id };
    const job = await Job.findOne(filter);
    if (!job) return res.sendStatus(404);
    res.status(200).send(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//@desc Create a job
//@route POST /jobs
//@access Private
const createJob = async (req, res) => {
  const {
    companyName,
    jobTitle,
    salary,
    listingLink,
    companyLocation,
    contactName,
    contactEmail,
    contactPhone,
    trackerStatus,
    dateApplied,
    trackerResume,
    trackerTimestamp,
  } = req.body;

  try {
    const newJob = new Job({
      user: req.user._id,
      companyName: companyName,
      jobTitle: jobTitle,
      salary: salary,
      listingLink: listingLink,
      companyLocation: companyLocation,
      contactName: contactName,
      contactEmail: contactEmail,
      contactPhone: contactPhone,
      trackerStatus: trackerStatus,
      dateApplied: dateApplied,
      trackerResume: trackerResume,
      trackerTimestamp: trackerTimestamp,
    });

    const job = await newJob.save();
    res.status(200).send("Job has been tracked");
  } catch (err) {
    res.status(404).send("Error creating job");
  }
};

//@desc Update a job
//@route PUT /jobs:id
//@access Private
const updateJob = async (req, res) => {
  try {
    const fields = [
      "companyName", "jobTitle", "salary", "listingLink", "companyLocation",
      "contactName", "contactEmail", "contactPhone", "trackerStatus",
      "dateApplied", "trackerResume", "trackerTimestamp", "followUp", "favorite",
    ];
    const updates = Object.fromEntries(
      fields.filter((field) => Object.prototype.hasOwnProperty.call(req.body, field))
        .map((field) => [field, req.body[field]])
    );
    const filter = { _id: req.params.id, user: req.user._id };
    const updatedJob = await Job.findOneAndUpdate(filter, { $set: updates }, {
      new: true,
      runValidators: true,
    });
    if (!updatedJob) return res.sendStatus(404);
    res.status(200).send(`Job ${updatedJob.jobTitle} has been updated`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//@desc Update a job
//@route Delete /jobs:id
//@access Private
const deleteJob = async (req, res) => {
  try {
    const filter = { _id: req.params.id, user: req.user._id };
    const job = await Job.findOneAndDelete(filter);
    if (!job) return res.sendStatus(404);
    res.status(200).send(`Job ${job.title} has been deleted`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
