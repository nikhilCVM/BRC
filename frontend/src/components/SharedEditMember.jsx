import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_URL from "../utils/api";

const formatDateInput = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().split("T")[0];
};

const getInitialFormData = () => ({
  name: "",
  flatNo: "",
  phone: "",
  dob: "",
  bloodGroup: "",
  joinedBrcYear: "",
  address: "",
  marriageDate: "",
  spouseName: "",
  emergencyContactPerson: "",
  emergencyPhone: "",
  occupationDetails: "",
  retiredWhenWhere: "",
  positionsAndAchievements: "",
  countriesVisited: "",
  additionalInformation: "",
  sonsDaughters: [],
  isDeceased: false,
  deceasedDate: ""
});

const SharedEditMember = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState(getInitialFormData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/members/shared-edit/${token}`);
        const member = response.data;

        setFormData({
          name: member.name || "",
          flatNo: member.flatNo || "",
          phone: member.phone || "",
          dob: formatDateInput(member.dob),
          bloodGroup: member.bloodGroup || "",
          joinedBrcYear: member.joinedBrcYear || "",
          address: member.address || "",
          marriageDate: formatDateInput(member.marriageDate),
          spouseName: member.spouseName || "",
          emergencyContactPerson: member.emergencyContactPerson || "",
          emergencyPhone: member.emergencyPhone || "",
          occupationDetails:
            member.occupationDetails || member.occupation || "",
          retiredWhenWhere:
            member.retiredWhenWhere || member.retiredDetails || "",
          positionsAndAchievements: member.positionsAndAchievements || "",
          countriesVisited: member.countriesVisited || "",
          additionalInformation: member.additionalInformation || "",
          sonsDaughters: member.sonsDaughters || [],
          isDeceased: Boolean(member.isDeceased),
          deceasedDate: formatDateInput(member.deceasedDate)
        });
      } catch (error) {
        setMessage(
          error.response?.data?.message || "This edit link is invalid or expired"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [token]);

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleChildChange = (index, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      sonsDaughters: prevData.sonsDaughters.map((child, childIndex) =>
        childIndex === index ? { ...child, [field]: value } : child
      )
    }));
  };

  const addChild = () => {
    setFormData((prevData) => ({
      ...prevData,
      sonsDaughters: [...prevData.sonsDaughters, { name: "", contact: "" }]
    }));
  };

  const removeChild = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      sonsDaughters: prevData.sonsDaughters.filter(
        (_, childIndex) => childIndex !== index
      )
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await axios.put(`${API_URL}/api/members/shared-edit/${token}`, {
        ...formData,
        deceasedDate: formData.isDeceased ? formData.deceasedDate : ""
      });
      setMessage("Member updated successfully");
    } catch (error) {
      setMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to update member"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-600">Loading member...</p>;
  }

  if (message && message !== "Member updated successfully") {
    return <p className="p-6 text-red-600">{message}</p>;
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <h2 className="mb-2 text-2xl font-semibold text-gray-900">
        Edit Member Details
      </h2>
      <p className="mb-6 text-sm text-gray-600">
        This secure link lets you update only this member record.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          required
        />

        <input
          type="text"
          name="flatNo"
          value={formData.flatNo}
          onChange={handleChange}
          placeholder="Flat No"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          required
        />

        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />

        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />

        <input
          type="text"
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          placeholder="Blood Group"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />

        <input
          type="number"
          name="joinedBrcYear"
          value={formData.joinedBrcYear}
          onChange={handleChange}
          placeholder="Joined BRC Year"
          min="1900"
          max="2100"
          step="1"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />

        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          rows="3"
        />

        <input
          type="text"
          name="spouseName"
          value={formData.spouseName}
          onChange={handleChange}
          placeholder="Spouse Name"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />

        <input
          type="date"
          name="marriageDate"
          value={formData.marriageDate}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />

        <input
          type="text"
          name="emergencyContactPerson"
          value={formData.emergencyContactPerson}
          onChange={handleChange}
          placeholder="Emergency Contact Person"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />

        <input
          type="tel"
          name="emergencyPhone"
          value={formData.emergencyPhone}
          onChange={handleChange}
          placeholder="Emergency Phone"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />

        <textarea
          name="occupationDetails"
          value={formData.occupationDetails}
          onChange={handleChange}
          placeholder="Occupation Details"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          rows="3"
        />

        <textarea
          name="retiredWhenWhere"
          value={formData.retiredWhenWhere}
          onChange={handleChange}
          placeholder="Retired When/Where"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          rows="3"
        />

        <textarea
          name="positionsAndAchievements"
          value={formData.positionsAndAchievements}
          onChange={handleChange}
          placeholder="Positions and Achievements"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          rows="3"
        />

        <textarea
          name="countriesVisited"
          value={formData.countriesVisited}
          onChange={handleChange}
          placeholder="Countries Visited"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          rows="3"
        />

        <textarea
          name="additionalInformation"
          value={formData.additionalInformation}
          onChange={handleChange}
          placeholder="Additional Information"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          rows="3"
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-gray-800">
              Sons / Daughters
            </h3>
            <button
              type="button"
              onClick={addChild}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Add
            </button>
          </div>

          {formData.sonsDaughters.map((child, index) => (
            <div key={index} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <input
                type="text"
                value={child.name}
                onChange={(event) =>
                  handleChildChange(index, "name", event.target.value)
                }
                placeholder="Name"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                value={child.contact}
                onChange={(event) =>
                  handleChildChange(index, "contact", event.target.value)
                }
                placeholder="Contact"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeChild(index)}
                className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            name="isDeceased"
            checked={formData.isDeceased}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Deceased
        </label>

        {formData.isDeceased && (
          <input
            type="date"
            name="deceasedDate"
            value={formData.deceasedDate}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {saving ? "Updating..." : "Update Member"}
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default SharedEditMember;
