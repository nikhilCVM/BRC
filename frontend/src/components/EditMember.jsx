import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_URL from "../utils/api";
import { getAuthHeaders } from "../utils/authHeaders";

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

const EditMember = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    flatNo: "",
    phone: "",
    dob: "",
    address: "",
    bloodGroup: "",
    occupation: "",
    spouseName: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/members/${id}`, {
          headers: getAuthHeaders()
        });
        const member = response.data;

        setFormData({
          name: member.name || "",
          flatNo: member.flatNo || "",
          phone: member.phone || "",
          dob: formatDateInput(member.dob),
          address: member.address || "",
          bloodGroup: member.bloodGroup || "",
          occupation: member.occupation || "",
          spouseName: member.spouseName || ""
        });
      } catch (error) {
        setMessage("Failed to fetch member");
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await axios.put(`${API_URL}/api/members/${id}`, formData, {
        headers: getAuthHeaders()
      });
      setMessage("Member updated successfully");
    } catch (error) {
      setMessage("Failed to update member");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-600">Loading member...</p>;
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <h2 className="mb-6 text-2xl font-semibold text-gray-900">Edit Member</h2>

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
        />

        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          required
        />

        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
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
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          placeholder="Blood Group"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />

        <input
          type="text"
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          placeholder="Occupation"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />

        <input
          type="text"
          name="spouseName"
          value={formData.spouseName}
          onChange={handleChange}
          placeholder="Spouse Name"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />

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

export default EditMember;
