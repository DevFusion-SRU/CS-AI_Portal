import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  User,
  Briefcase,
  Building,
  MedalStar,
  Crown,
  DocumentText,
  DocumentDownload,
  Link,
} from "iconsax-react";

const ProfileView = () => {
  const { BASE_URL } = useAuth();
  const { studentId } = useParams(); // studentId is rollNumber from URL
  const [profileImage, setProfileImage] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [info, setInfo] = useState({});
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [skills, setSkills] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const defaultEducation = {
    degree: "B.Tech",
    endYear: "",
    grade: "",
    institution: "SR University",
    isCurrent: true,
    specialization: "",
    startYear: "",
  };

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}students/${studentId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      const data = response.data.data;

      setProfileImage(data.photoUrl || "https://via.placeholder.com/150");
      setAboutText(data.about || "Add something about yourself...");
      setFirstName(data.firstName || "First");
      setLastName(data.lastName || "Last");
      setInfo({
        email: data.email || "",
        phone: data.mobile || "",
        website: data.website || "",
        gender: data.gender || "",
        address: data.address || "",
      });

      const sortedExperiences = (data.experiences || []).sort((a, b) => {
        const dateA = new Date(a.duration?.startDate || 0);
        const dateB = new Date(b.duration?.startDate || 0);
        return dateB - dateA;
      });
      setExperiences(sortedExperiences);

      const educationData =
        data.education && data.education.length > 0 ? data.education : [defaultEducation];
      const sortedEducations = educationData.sort((a, b) => {
        const dateA = new Date(a.duration?.startDate || 0);
        const dateB = new Date(b.duration?.startDate || 0);
        return dateB - dateA;
      });
      setEducations(sortedEducations);

      const sortedCertifications = (data.certifications || []).sort((a, b) => {
        const dateA = new Date(a.validTime?.startDate || 0);
        const dateB = new Date(b.validTime?.startDate || 0);
        return dateB - dateA;
      });
      setCertifications(sortedCertifications);

      const sortedSkills = (data.skills || []).sort((a, b) => {
        const dateA = a._id
          ? new Date(parseInt(a._id.toString().slice(0, 8), 16) * 1000)
          : new Date(0);
        const dateB = b._id
          ? new Date(parseInt(b._id.toString().slice(0, 8), 16) * 1000)
          : new Date(0);
        return dateB - dateA;
      });
      setSkills(sortedSkills);

      const sortedAttachments = (data.resumes || []).sort((a, b) => {
        const dateA = a._id
          ? new Date(parseInt(a._id.toString().slice(0, 8), 16) * 1000)
          : new Date(0);
        const dateB = b._id
          ? new Date(parseInt(b._id.toString().slice(0, 8), 16) * 1000)
          : new Date(0);
        return dateB - dateA;
      });
      setAttachments(sortedAttachments);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load profile data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [BASE_URL, studentId]);

  const formatDateRange = (startDate, endDate) => {
    if (!startDate) return "Start date not specified";
    return `${new Date(startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} - ${
      endDate
        ? new Date(endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "Present"
    }`;
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Profile Header */}
      <div
        className={`fixed top-12 pt-10 left-0 right-0 bg-white shadow-md z-30 transition-all duration-300 ${
          isScrolled ? "h-12 py-1" : "h-24 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-row items-center justify-center gap-4 h-full">
          <div className="relative">
            <img
              src={profileImage}
              alt="Profile"
              className={`rounded-full border-2 border-blue-600 object-cover transition-all duration-300 ${
                isScrolled ? "w-8 h-8" : "w-16 h-16"
              }`}
            />
          </div>
          <div className="flex flex-col items-center sm:items-start transition-all duration-300">
            <h1
              className={`font-bold text-gray-900 whitespace-nowrap ${
                isScrolled ? "text-sm" : "text-xl"
              }`}
            >
              {firstName} {lastName}
            </h1>
            <p
              className={`text-gray-600 whitespace-nowrap ${
                isScrolled ? "text-xs" : "text-base"
              }`}
            >
              {studentId || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div
        className={`flex gap-4 transition-all duration-300 ${
          isScrolled ? "pt-15" : "pt-20"
        } relative max-w-7xl mx-auto w-full`}
      >
        {/* Main Content Area */}
        <div className="flex-1 p-4 md:p-6">
          {/* About Section */}
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">About</h2>
            <p className="text-gray-600 text-sm md:text-base">{aboutText}</p>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <User size={24} className="text-blue-600" /> Basic Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm md:text-base">
              <div>
                <p className="text-gray-600">Email Address</p>
                <p className="text-gray-800">{info.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone Number</p>
                <p className="text-gray-800">{info.phone || "-"}</p>
              </div>
              <div>
                <p className="text-gray-600">Website</p>
                {info.website ? (
                  <a
                    href={info.website.startsWith("http") ? info.website : `https://${info.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {info.website}
                  </a>
                ) : (
                  <p className="text-gray-800">-</p>
                )}
              </div>
              <div>
                <p className="text-gray-600">Gender</p>
                <p className="text-gray-800">{info.gender || "-"}</p>
              </div>
              <div>
                <p className="text-gray-600">Address</p>
                <p className="text-gray-800">{info.address || "-"}</p>
              </div>
            </div>
          </div>

          {/* Experiences */}
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Briefcase size={24} className="text-blue-600" /> Experiences
            </h2>
            <div className="space-y-4">
              {experiences.map((exp, index) => (
                <div key={index} className="flex items-start gap-4 border-b pb-4">
                  <Briefcase size={20} className="text-blue-600" />
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">{exp.title || "Untitled"}</h3>
                    <p className="text-gray-800 text-sm md:text-base">
                      {exp.company || "Unknown Company"}
                    </p>
                    <p className="text-gray-600 text-sm md:text-base">
                      {exp.location || "Unknown Location"}
                    </p>
                    <p className="text-gray-600 text-sm md:text-base">
                      {exp.duration
                        ? formatDateRange(exp.duration.startDate, exp.duration.endDate)
                        : "N/A"}
                    </p>
                    <p className="text-gray-600 text-sm md:text-base mt-1">
                      {exp.description || "No description"}
                    </p>
                    {exp.certificate && (
                      <a
                        href={exp.certificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm md:text-base mt-1 flex items-center gap-1 hover:underline"
                      >
                        <Link size={14} /> View Certificate
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Building size={24} className="text-blue-600" /> Education
            </h2>
            <div className="space-y-4">
              {educations.map((edu, index) => (
                <div key={index} className="flex items-start gap-4 border-b pb-4">
                  <Building size={20} className="text-blue-600" />
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">
                      {edu.institution || "Unknown Institution"}
                    </h3>
                    <p className="text-gray-800 text-sm md:text-base">
                      {edu.degree || "Unknown Degree"}
                    </p>
                    <p className="text-gray-600 text-sm md:text-base">
                      {edu.specialization || "Unknown Specialization"}
                    </p>
                    <p className="text-gray-600 text-sm md:text-base">
                      CGPA: {edu.cgpa || "N/A"} |{" "}
                      {edu.duration
                        ? formatDateRange(edu.duration.startDate, edu.duration.endDate)
                        : "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <MedalStar size={24} className="text-blue-600" /> Certifications
            </h2>
            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-start gap-4 border-b pb-4">
                  <MedalStar size={20} className="text-blue-600" />
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">
                      {cert.title || "Unknown Provider"}
                    </h3>
                    <p className="text-gray-800 text-sm md:text-base">
                      {cert.issuer || "Unknown Issuer"}
                    </p>
                    <p className="text-gray-800 text-sm md:text-base">
                      {cert.courseName || "Unknown Course"}
                    </p>
                    <p className="text-gray-600 text-sm md:text-base">
                      {cert.validTime
                        ? formatDateRange(cert.validTime.startDate, cert.validTime.endDate)
                        : "N/A"}
                    </p>
                    {cert.certificateId && (
                      <a
                        href={cert.certificateId}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm md:text-base mt-1 flex items-center gap-1 hover:underline"
                      >
                        <Link size={14} /> View Certificate
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Crown size={24} className="text-blue-600" /> Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="text-gray-900 font-medium text-sm md:text-base">
                      {item.name || "Unknown Skill"}
                    </p>
                    <p className="text-gray-600 text-xs md:text-sm">{item.level || "N/A"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <DocumentText size={24} className="text-blue-600" /> Attachments
            </h2>
            <div className="space-y-4">
              {attachments.map((item, index) => (
                <div key={index} className="flex items-start gap-4 border-b pb-4">
                  <DocumentDownload size={20} className="text-blue-600" />
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium text-sm md:text-base">
                      {item.title || "Unnamed File"}
                    </p>
                    <p className="text-gray-600 text-sm md:text-base">
                      {item.type || "Unknown Type"} | {item.size || "Unknown Size"}
                    </p>
                    {item.resumeUrl && (
                      <a
                        href={item.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm md:text-base mt-1 flex items-center gap-1 hover:underline"
                      >
                        <Link size={14} /> View Attachment
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;