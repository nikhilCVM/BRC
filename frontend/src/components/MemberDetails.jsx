import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_URL from "../utils/api";
import { getAuthHeaders } from "../utils/authHeaders";

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
          <p className="text-sm font-medium text-gray-500">Phone</p>
          <p className="text-gray-900">{member.phone}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Age</p>
          <p className="text-gray-900">{member.age}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Blood Group</p>
          <p className="text-gray-900">{member.bloodGroup}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Occupation</p>
          <p className="text-gray-900">{member.occupation}</p>
        </div>

        <div className="md:col-span-2">
          <p className="text-sm font-medium text-gray-500">Address</p>
          <p className="text-gray-900">{member.address}</p>
        </div>
      </div>

      <h3 className="mt-8 mb-4 text-xl font-semibold text-gray-900">
        Family Members
      </h3>

      {member.familyMembers && member.familyMembers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Relation
                </th>
                <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Phone
                </th>
                <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Address
                </th>
              </tr>
            </thead>

            <tbody>
              {member.familyMembers.map((familyMember, index) => (
                <tr key={`${familyMember.name}-${index}`} className="hover:bg-gray-50">
                  <td className="border-b px-4 py-3 text-sm text-gray-800">
                    {familyMember.name}
                  </td>
                  <td className="border-b px-4 py-3 text-sm text-gray-800">
                    {familyMember.relation}
                  </td>
                  <td className="border-b px-4 py-3 text-sm text-gray-800">
                    {familyMember.phone}
                  </td>
                  <td className="border-b px-4 py-3 text-sm text-gray-800">
                    {familyMember.address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No family members added.</p>
      )}
    </div>
  );
};

export default MemberDetails;
