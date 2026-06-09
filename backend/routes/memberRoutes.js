const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const Member = require("../models/Member");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const parseBoolean = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  const normalizedValue = String(value || "").trim().toLowerCase();

  return ["true", "yes", "y", "1"].includes(normalizedValue);
};

const getRowValue = (row, keys) => {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
      return row[key];
    }
  }

  return "";
};

const normalizeDate = (value) => {
  if (!value) {
    return null;
  }

  return value;
};

const normalizeSonsDaughters = (sonsDaughters) => {
  if (!Array.isArray(sonsDaughters)) {
    return [];
  }

  return sonsDaughters.map((child) => ({
    name: child.name || "",
    contact: child.contact || ""
  }));
};

const normalizeMemberData = (data) => {
  const isDeceased = parseBoolean(data.isDeceased);

  return {
    name: data.name || "",
    flatNo: data.flatNo || "",
    phone: data.phone || "",
    dob: normalizeDate(data.dob),
    bloodGroup: data.bloodGroup || "",
    address: data.address || "",
    marriageDate: normalizeDate(data.marriageDate),
    spouseName: data.spouseName || "",
    emergencyContactPerson: data.emergencyContactPerson || "",
    emergencyPhone: data.emergencyPhone || "",
    occupationDetails: data.occupationDetails || data.occupation || "",
    retiredWhenWhere: data.retiredWhenWhere || data.retiredDetails || "",
    positionsAndAchievements: data.positionsAndAchievements || "",
    countriesVisited: data.countriesVisited || "",
    additionalInformation: data.additionalInformation || "",
    sonsDaughters: normalizeSonsDaughters(data.sonsDaughters),
    isDeceased,
    deceasedDate: isDeceased ? normalizeDate(data.deceasedDate) : null
  };
};

const validateMemberData = (memberData) => {
  const errors = [];

  if (!memberData.name.trim()) {
    errors.push("Name is required");
  }

  if (!memberData.flatNo.trim()) {
    errors.push("Flat No is required");
  }

  return errors;
};

router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const memberData = normalizeMemberData(req.body);
    const errors = validateMemberData(memberData);

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Failed to save member",
        error: errors.join(", ")
      });
    }

    const savedMember = await Member.create(memberData);

    res.status(201).json(savedMember);
  } catch (error) {
    res.status(500).json({
      message: "Failed to save member",
      error: error.message
    });
  }
});

router.get("/", async (req, res) => {
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

router.get("/search", async (req, res) => {
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
      .map((row) => normalizeMemberData({
        name: getRowValue(row, ["name", "Name"]),
        flatNo: getRowValue(row, ["flatNo", "FlatNo", "Flat No", "Flat no"]),
        phone: getRowValue(row, ["phone", "Phone"]),
        dob: getRowValue(row, ["dob", "DOB", "Dob"]),
        isDeceased: parseBoolean(
          row.isDeceased ||
          row.IsDeceased ||
          row["Is Deceased"] ||
            row["is deceased"]
        ),
        deceasedDate:
          row.deceasedDate ||
          row.DeceasedDate ||
          row["Deceased Date"] ||
          row["deceased date"],
        address: getRowValue(row, ["address", "Address"]),
        marriageDate: getRowValue(row, ["marriageDate", "MarriageDate", "Marriage Date"]),
        spouseName: getRowValue(row, ["spouseName", "SpouseName", "Spouse Name", "Spouse name"]),
        emergencyContactPerson: getRowValue(row, [
          "emergencyContactPerson",
          "EmergencyContactPerson",
          "Emergency Contact Person"
        ]),
        emergencyPhone: getRowValue(row, ["emergencyPhone", "EmergencyPhone", "Emergency Phone"]),
        bloodGroup: getRowValue(row, ["bloodGroup", "BloodGroup", "Blood Group", "Blood group"]),
        occupationDetails: getRowValue(row, [
          "occupationDetails",
          "OccupationDetails",
          "Occupation Details",
          "occupation",
          "Occupation"
        ]),
        retiredWhenWhere: getRowValue(row, [
          "retiredWhenWhere",
          "RetiredWhenWhere",
          "Retired When Where",
          "retiredDetails",
          "Retired Details"
        ]),
        positionsAndAchievements: getRowValue(row, [
          "positionsAndAchievements",
          "PositionsAndAchievements",
          "Positions And Achievements"
        ]),
        countriesVisited: getRowValue(row, [
          "countriesVisited",
          "CountriesVisited",
          "Countries Visited"
        ]),
        additionalInformation: getRowValue(row, [
          "additionalInformation",
          "AdditionalInformation",
          "Additional Information"
        ])
      }))
      .filter((member) => member.name && member.flatNo);

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

router.get("/:id", async (req, res) => {
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
    const memberData = normalizeMemberData(req.body);
    const errors = validateMemberData(memberData);

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Failed to update member",
        error: errors.join(", ")
      });
    }

    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      memberData,
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
