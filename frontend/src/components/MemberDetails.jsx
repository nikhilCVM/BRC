import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_URL from "../utils/api";
import { getAuthHeaders } from "../utils/authHeaders";

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const showValue = (value) => value || "-";

const MemberDetails = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/members/${id}`, {
          headers: getAuthHeaders()
        });
        setMember(response.data);
      } catch (err) {
        setError("Failed to fetch member details");
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  if (loading) {
    return <p className="p-6 text-gray-600">Loading member details...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  if (!member) {
    return <p className="p-6 text-gray-600">Member not found</p>;
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h2 className="mb-6 text-2xl font-semibold text-gray-900">
        Member Details
      </h2>

      <div className="grid gap-4 rounded-md border border-gray-200 bg-white p-5 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-gray-500">Name</p>
          <p className="text-gray-900">{member.name}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Flat No</p>
          <p className="text-gray-900">{showValue(member.flatNo)}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Phone</p>
          <p className="text-gray-900">{showValue(member.phone)}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">DOB</p>
          <p className="text-gray-900">{formatDate(member.dob)}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Blood Group</p>
          <p className="text-gray-900">{showValue(member.bloodGroup)}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Marriage Date</p>
          <p className="text-gray-900">{formatDate(member.marriageDate)}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Spouse Name</p>
          <p className="text-gray-900">{showValue(member.spouseName)}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">
            Emergency Contact Person
          </p>
          <p className="text-gray-900">
            {showValue(member.emergencyContactPerson)}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Emergency Phone</p>
          <p className="text-gray-900">{showValue(member.emergencyPhone)}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">
            Occupation Details
          </p>
          <p className="text-gray-900">
            {showValue(member.occupationDetails || member.occupation)}
          </p>
        </div>

        <div className="md:col-span-2">
          <p className="text-sm font-medium text-gray-500">Address</p>
          <p className="text-gray-900">{showValue(member.address)}</p>
        </div>

        <div className="md:col-span-2">
          <p className="text-sm font-medium text-gray-500">
            Retired When/Where
          </p>
          <p className="text-gray-900">
            {showValue(member.retiredWhenWhere || member.retiredDetails)}
          </p>
        </div>

        <div className="md:col-span-2">
          <p className="text-sm font-medium text-gray-500">
            Positions and Achievements
          </p>
          <p className="text-gray-900">
            {showValue(member.positionsAndAchievements)}
          </p>
        </div>

        <div className="md:col-span-2">
          <p className="text-sm font-medium text-gray-500">Countries Visited</p>
          <p className="text-gray-900">{showValue(member.countriesVisited)}</p>
        </div>

        <div className="md:col-span-2">
          <p className="text-sm font-medium text-gray-500">
            Additional Information
          </p>
          <p className="text-gray-900">
            {showValue(member.additionalInformation)}
          </p>
        </div>
      </div>

      <h3 className="mt-8 mb-4 text-xl font-semibold text-gray-900">
        Sons / Daughters
      </h3>

      {member.sonsDaughters && member.sonsDaughters.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Contact
                </th>
              </tr>
            </thead>

            <tbody>
              {member.sonsDaughters.map((familyMember, index) => (
                <tr key={`${familyMember.name}-${index}`} className="hover:bg-gray-50">
                  <td className="border-b px-4 py-3 text-sm text-gray-800">
                    {showValue(familyMember.name)}
                  </td>
                  <td className="border-b px-4 py-3 text-sm text-gray-800">
                    {showValue(familyMember.contact)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No sons or daughters added.</p>
      )}
    </div>
  );
};

export default MemberDetails;
