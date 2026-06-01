const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const Member = require("../models/Member");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const memberData = req.body;
    const savedMember = await Member.create(memberData);

    res.status(201).json(savedMember);
  } catch (error) {
    res.status(500).json({
      message: "Failed to save member",
      error: error.message
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const members = await Member.find();

    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch members",
      error: error.message
    });
  }
});

router.get("/search", authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      const members = await Member.find();
      return res.status(200).json(members);
    }

    const searchRegex = new RegExp(q, "i");
    const members = await Member.find({
      $or: [
        { name: { $regex: searchRegex } },
        { flatNo: { $regex: searchRegex } },
        { phone: { $regex: searchRegex } }
      ]
    });

    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({
      message: "Failed to search members",
      error: error.message
    });
  }
});

router.delete("/clear", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await Member.deleteMany({});

    res.status(200).json({
      success: true,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to clear members",
      error: error.message
    });
  }
});

router.post(
  "/import",
  authMiddleware,
  adminMiddleware,
  upload.single("file"),
  async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

    const members = rows
      .map((row) => ({
        name: row.name || row.Name,
        flatNo: row.flatNo || row.FlatNo || row["Flat No"] || row["Flat no"],
        phone: row.phone || row.Phone,
        dob: row.dob || row.DOB || row.Dob,
        address: row.address || row.Address,
        bloodGroup:
          row.bloodGroup || row.BloodGroup || row["Blood Group"] || row["Blood group"],
        occupation: row.occupation || row.Occupation,
        spouseName:
          row.spouseName || row.SpouseName || row["Spouse Name"] || row["Spouse name"]
      }))
      .filter((member) => member.name);

    await Member.deleteMany({});
    const importedMembers = await Member.insertMany(members);

    res.status(201).json({
      success: true,
      importedCount: importedMembers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to import members",
      error: error.message
    });
  }
  }
);

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch member",
      error: error.message
    });
  }
});

router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(updatedMember);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update member",
      error: error.message
    });
  }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deletedMember = await Member.findByIdAndDelete(req.params.id);

    if (!deletedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json({
      success: true,
      message: "Member deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete member",
      error: error.message
    });
  }
});

module.exports = router;
