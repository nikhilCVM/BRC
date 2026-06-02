import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_URL from "../utils/api";
import { getAuthHeaders } from "../utils/authHeaders";

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const getBlockLetter = (flatNo = "") => {
  const match = flatNo.trim().match(/^([A-Z])/i);
  return match ? match[1].toUpperCase() : "Other";
};

const getFlatNumber = (flatNo = "") => {
  const match = flatNo.match(/\d+/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
};

const sortMembersByFlatNo = (memberA, memberB) => {
  const blockA = getBlockLetter(memberA.flatNo);
  const blockB = getBlockLetter(memberB.flatNo);

  if (blockA !== blockB) {
    return blockA.localeCompare(blockB);
  }

  return getFlatNumber(memberA.flatNo) - getFlatNumber(memberB.flatNo);
};

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError("");

        const endpoint = search
          ? `${API_URL}/api/members/search?q=${encodeURIComponent(search)}`
          : `${API_URL}/api/members`;

        const response = await axios.get(endpoint, {
          headers: getAuthHeaders()
        });
        setMembers(response.data);
      } catch (err) {
        setError("Failed to fetch members");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [search]);

  const handleDelete = async (memberId) => {
    const shouldDelete = window.confirm("Delete this member?");

    if (!shouldDelete) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/members/${memberId}`, {
        headers: getAuthHeaders()
      });
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member._id !== memberId)
      );
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to delete member"
      );
    }
  };

  const renderMemberTable = (title, sectionMembers, showDeceasedDate = false) => {
    const sortedMembers = [...sectionMembers].sort(sortMembersByFlatNo);
    let currentBlock = "";
    const columnCount = showDeceasedDate ? 7 : 6;

    return (
      <section className="mt-8">
        <h3 className="mb-4 text-xl font-semibold text-gray-900">{title}</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  S.No
                </th>
                <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Flat No
                </th>
                <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Phone
                </th>
                <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  DOB
                </th>
                {showDeceasedDate && (
                  <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Deceased Date
                  </th>
                )}
                <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedMembers.map((member, index) => {
                const block = getBlockLetter(member.flatNo);
                const shouldShowBlockHeading = block !== currentBlock;
                currentBlock = block;

                return (
                  <Fragment key={member._id}>
                    {shouldShowBlockHeading && (
                      <tr>
                        <td
                          colSpan={columnCount}
                          className="bg-gray-200 px-4 py-3 text-sm font-semibold text-gray-900"
                        >
                          {block} Block
                        </td>
                      </tr>
                    )}

                    <tr className="hover:bg-gray-50">
                      <td className="border-b px-4 py-3 text-sm text-gray-800">
                        {index + 1}
                      </td>
                      <td className="border-b px-4 py-3 text-sm text-gray-800">
                        {member.name}
                      </td>
                      <td className="border-b px-4 py-3 text-sm text-gray-800">
                        {member.flatNo || "-"}
                      </td>
                      <td className="border-b px-4 py-3 text-sm text-gray-800">
                        {member.phone}
                      </td>
                      <td className="border-b px-4 py-3 text-sm text-gray-800">
                        {formatDate(member.dob) || "-"}
                      </td>
                      {showDeceasedDate && (
                        <td className="border-b px-4 py-3 text-sm text-gray-800">
                          {formatDate(member.deceasedDate) || "-"}
                        </td>
                      )}
                      <td className="border-b px-4 py-3 text-sm">
                        <div className="flex gap-3">
                          <Link
                            to={`/members/${member._id}`}
                            className="font-medium text-blue-600 hover:text-blue-800"
                          >
                            View
                          </Link>
                          {isAdmin && (
                            <>
                              <Link
                                to={`/members/${member._id}/edit`}
                                className="font-medium text-emerald-600 hover:text-emerald-800"
                              >
                                Edit
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleDelete(member._id)}
                                className="font-medium text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  </Fragment>
                );
              })}

              {!loading && sortedMembers.length === 0 && (
                <tr>
                  <td
                    colSpan={columnCount}
                    className="border-b px-4 py-6 text-center text-sm text-gray-600"
                  >
                    No members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    );
  };

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  const activeMembers = members.filter((member) => !member.isDeceased);
  const deceasedMembers = members.filter((member) => member.isDeceased);

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Members</h2>

        {isAdmin && (
          <Link
            to="/members/add"
            className="rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Member
          </Link>
        )}
      </div>

      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by name, flat no, or phone"
        className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
      />

      {loading && <p className="mb-4 text-sm text-gray-600">Loading members...</p>}

      {renderMemberTable("Active Members", activeMembers)}
      {renderMemberTable("Deceased Members", deceasedMembers, true)}
    </div>
  );
};

export default MemberList;
