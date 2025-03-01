import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import {
  User,
  Briefcase,
  Building,
  MedalStar,
  Crown,
  DocumentText,
  DocumentDownload,
  Menu,
  CloseCircle,
  Link,
  Edit,
  Trash,
} from "iconsax-react";
import EducationModal from "./EducationModal";
import CertificationModal from "./CertificationModal";
import SkillsModal from "./SkillsModal";
import AttachmentModal from "./AttachmentModal";
import ExperienceModal from "./ExperienceModal";

const Body = () => {
  const { currentUser, BASE_URL } = useAuth();
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Closed by default
  const [isScrolled, setIsScrolled] = useState(false); // Track scroll state
  const [firstName, setFirstName] = useState(""); // State for firstName
  const [lastName, setLastName] = useState("");  // State for lastName
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [editingExperienceIndex, setEditingExperienceIndex] = useState(null);
  const [showAllExperiences, setShowAllExperiences] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [editingEducationIndex, setEditingEducationIndex] = useState(null);
  const [showAllEducations, setShowAllEducations] = useState(false);
  const [isCertificationModalOpen, setIsCertificationModalOpen] = useState(false);
  const [editingCertificationIndex, setEditingCertificationIndex] = useState(null);
  const [showAllCertifications, setShowAllCertifications] = useState(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [editingSkillIndex, setEditingSkillIndex] = useState(null);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [editingAttachmentIndex, setEditingAttachmentIndex] = useState(null);
  const [showAllAttachments, setShowAllAttachments] = useState(false);

  const aboutRef = useRef(null);
  const infoRef = useRef(null);
  const experiencesRef = useRef(null);
  const educationRef = useRef(null);
  const certificationsRef = useRef(null);
  const skillsRef = useRef(null);
  const attachmentsRef = useRef(null);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}students/${currentUser.username}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      const data = response.data.data;
      console.log("Profile Data:", data); // Debug to see what’s returned
      setProfileImage(data.photo || "https://via.placeholder.com/150");
      setAboutText(data.about || "Add something about yourself...");
      setFirstName(data.firstName || currentUser?.firstName || "First"); // Set firstName from API or currentUser
      setLastName(data.lastName || currentUser?.lastName || "Last");    // Set lastName from API or currentUser
      setInfo({
        email: data.email || "",
        phone: data.mobile || "",
        website: data.website || "",
        gender: data.gender || "",
        location: data.address || "",
      });
      setExperiences(data.experiences || []);
      setEducations(data.education || []);
      setCertifications(data.certifications || []);
      setSkills(data.skills || []);
      setAttachments(data.resumes || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to load profile data");
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    console.log("Current User:", currentUser); // Debug to check currentUser
    fetchProfileData();
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Shrink photo after scrolling 50px
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [BASE_URL, currentUser]);

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await axios.patch(`${BASE_URL}students/${currentUser.username}/photo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setProfileImage(response.data.image);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload profile image");
      console.error(err);
    }
  };

  const handleSaveAbout = async () => {
    try {
      await axios.patch(
        `${BASE_URL}students/edit/${currentUser.username}`,
        { section: "about", data: aboutText },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
      setIsEditingAbout(false);
      fetchProfileData();
    } catch (err) {
      setError("Failed to save about section");
      console.error(err);
    }
  };

  const handleSaveInfo = async () => {
    const infoData = {
      email: info.email,
      mobile: info.phone,
      website: info.website,
      gender: info.gender,
      Address: info.location,
    };
    try {
      await axios.patch(
        `${BASE_URL}students/edit/${currentUser.username}`,
        { section: "info", data: infoData },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
      setIsEditingInfo(false);
      fetchProfileData();
    } catch (err) {
      setError("Failed to save info");
      console.error(err);
    }
  };

  const handleAddExperience = async (data) => {
    const experienceData = {
      _id: editingExperienceIndex !== null ? experiences[editingExperienceIndex]._id : undefined,
      title: data.title,
      company: data.company,
      duration: {
        startDate: data.startDate || null,
        endDate: data.isCurrent ? null : data.endDate || null,
      },
      location: data.location,
      description: data.description,
      certificate: data.certificateUrl || (data.file ? "" : null),
    };

    const updatedExperiences = editingExperienceIndex !== null
      ? experiences.map((exp, i) => (i === editingExperienceIndex ? experienceData : exp))
      : [...experiences, experienceData];

    try {
      const response = await axios.patch(
        `${BASE_URL}students/edit/${currentUser.username}`,
        { section: "experiences", data: updatedExperiences },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
      setExperiences(response.data.data.experiences || updatedExperiences);
      setIsExperienceModalOpen(false);
      setEditingExperienceIndex(null);
      fetchProfileData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save experience");
      console.error(err);
    }
  };

  const handleAddEducation = async (data) => {
    const educationData = {
      _id: editingEducationIndex !== null ? educations[editingEducationIndex]._id : undefined,
      institution: data.institute,
      degree: data.degree,
      specialization: data.specialization,
      duration: {
        startDate: data.startYear || null,
        endDate: data.isCurrent ? null : data.endYear || null,
      },
      cgpa: data.grade,
    };

    const updatedEducations = editingEducationIndex !== null
      ? educations.map((edu, i) => (i === editingEducationIndex ? educationData : edu))
      : [...educations, educationData];

    try {
      const response = await axios.patch(
        `${BASE_URL}students/edit/${currentUser.username}`,
        { section: "education", data: updatedEducations },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
      setEducations(response.data.data.education || updatedEducations);
      setIsEducationModalOpen(false);
      setEditingEducationIndex(null);
      fetchProfileData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save education");
      console.error(err);
    }
  };

  const handleAddCertification = async (data) => {
    const certificationData = {
      _id: editingCertificationIndex !== null ? certifications[editingCertificationIndex]._id : undefined,
      title: data.provider,
      issuer: data.issuer,
      courseName: data.title,
      validTime: {
        startDate: data.startDate || null,
        endDate: data.endDate || null,
      },
      certificateId: data.certificateUrl || "",
    };

    const updatedCertifications = editingCertificationIndex !== null
      ? certifications.map((cert, i) => (i === editingCertificationIndex ? certificationData : cert))
      : [...certifications, certificationData];

    try {
      const response = await axios.patch(
        `${BASE_URL}students/edit/${currentUser.username}`,
        { section: "certifications", data: updatedCertifications },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );

      if (data.file) {
        const formData = new FormData();
        formData.append("certificate", data.file);
        const certResponse = await axios.patch(
          `${BASE_URL}students/profile/${currentUser.username}/certifications/${
            certificationData._id || response.data.data.certifications[response.data.data.certifications.length - 1]._id
          }/certificate`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        updatedCertifications[
          editingCertificationIndex !== null ? editingCertificationIndex : updatedCertifications.length - 1
        ].certificateId = certResponse.data.certificateUrl;
      }

      setCertifications(response.data.data.certifications || updatedCertifications);
      setIsCertificationModalOpen(false);
      setEditingCertificationIndex(null);
      fetchProfileData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save certification");
      console.error(err);
    }
  };

  const handleAddSkill = async (data) => {
    const skillData = {
      _id: editingSkillIndex !== null ? skills[editingSkillIndex]._id : undefined,
      name: data.skill,
      level: data.level,
    };

    const updatedSkills = editingSkillIndex !== null
      ? skills.map((skill, i) => (i === editingSkillIndex ? skillData : skill))
      : [...skills, skillData];

    try {
      const response = await axios.patch(
        `${BASE_URL}students/edit/${currentUser.username}`,
        { section: "skills", data: updatedSkills },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );

      setSkills(response.data.data.skills || updatedSkills);
      setIsSkillsModalOpen(false);
      setEditingSkillIndex(null);
      fetchProfileData();
    } catch (err) {
      console.error("Error saving skill:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to save skill");
    }
  };

  const handleAddAttachment = async (data) => {
    const formData = new FormData();
    if (data.file) formData.append("resume", data.file);

    try {
      const response = await axios.post(
        `${BASE_URL}students/${currentUser.username}/resume`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      const newAttachment = {
        _id: response.data.data?._id || new Date().toISOString(),
        title: data.file.name,
        resumeUrl: response.data.data.resumeUrl,
        type: data.file.type,
        size: `${(data.file.size / 1024).toFixed(2)} KB`,
      };

      setAttachments((prev) =>
        editingAttachmentIndex !== null
          ? prev.map((att, i) => (i === editingAttachmentIndex ? newAttachment : att))
          : [...prev, newAttachment]
      );
      setIsAttachmentModalOpen(false);
      setEditingAttachmentIndex(null);
      fetchProfileData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save attachment");
      console.error(err);
    }
  };

  const handleDeleteExperience = async (index) => {
    const experienceId = experiences[index]._id;
    try {
      await axios.delete(`${BASE_URL}students/${currentUser.username}/experiences/${experienceId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setExperiences(experiences.filter((_, i) => i !== index));
      fetchProfileData();
    } catch (err) {
      setError("Failed to delete experience");
      console.error(err);
    }
  };

  const handleDeleteEducation = async (index) => {
    const educationId = educations[index]._id;
    try {
      await axios.delete(`${BASE_URL}students/${currentUser.username}/education/${educationId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setEducations(educations.filter((_, i) => i !== index));
      fetchProfileData();
    } catch (err) {
      setError("Failed to delete education");
      console.error(err);
    }
  };

  const handleDeleteCertification = async (index) => {
    const certificationId = certifications[index]._id;
    try {
      await axios.delete(`${BASE_URL}students/${currentUser.username}/certifications/${certificationId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setCertifications(certifications.filter((_, i) => i !== index));
      fetchProfileData();
    } catch (err) {
      setError("Failed to delete certification");
      console.error(err);
    }
  };

  const handleDeleteSkill = async (index) => {
    const skillId = skills[index]._id;
    try {
      await axios.delete(`${BASE_URL}students/${currentUser.username}/skills/${skillId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setSkills(skills.filter((_, i) => i !== index));
      fetchProfileData();
    } catch (err) {
      setError("Failed to delete skill");
      console.error(err);
    }
  };

  const handleDeleteAttachment = async (index) => {
    const attachmentId = attachments[index]._id;
    try {
      await axios.delete(`${BASE_URL}students/resume/${currentUser.username}/${attachmentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setAttachments(attachments.filter((_, i) => i !== index));
      fetchProfileData();
    } catch (err) {
      setError("Failed to delete attachment");
      console.error(err);
    }
  };

  const handleEditExperience = (index) => {
    setEditingExperienceIndex(index);
    setIsExperienceModalOpen(true);
  };

  const handleEditEducation = (index) => {
    setEditingEducationIndex(index);
    setIsEducationModalOpen(true);
  };

  const handleEditCertification = (index) => {
    setEditingCertificationIndex(index);
    setIsCertificationModalOpen(true);
  };

  const handleEditSkill = (index) => {
    console.log("Editing skill at index:", index, "data:", skills[index]);
    setEditingSkillIndex(index);
    setIsSkillsModalOpen(true);
  };

  const handleEditAttachment = (index) => {
    setEditingAttachmentIndex(index);
    setIsAttachmentModalOpen(true);
  };

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate) return "Start date not specified";
    return `${new Date(startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} - ${
      endDate ? new Date(endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Present"
    }`;
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Profile Header */}
      <div className="fixed top-15 left-0 sm-left-10 right-0 bg-white shadow-md z-20 transition-all duration-300">
        <div className="max-w-7xl mx-auto p-4 flex flex-col sm:flex-row items-center sm:justify-center gap-4">
          <div className="relative">
            <img
              src={profileImage}
              alt="Profile"
              className={`rounded-full border-2 border-blue-600 object-cover transition-all duration-300 ${
                isScrolled ? "w-16 h-16" : "w-20 h-20 sm:w-20 sm:h-20"
              }`}
            />
            <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 cursor-pointer">
              <Edit size={15} className={`text-white ${
                isScrolled ? " sm:size-10 lg:size-3": "sm:size-20 lg:size-5"
              }`}
              />
              <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
            </label>
          </div>
          <div className="flex flex-col items-center sm:items-start" >
            <h1 className="text-lg sm:text-xl lg:text-xl font-bold text-gray-900">
              {firstName} {lastName}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-x">{currentUser?.username || "N/A"}</p>
            {/* <p className="text-blue-500 text-xs sm:text-hidden lg:text-xs ">
              Mentor: Dr. Indrajeet | PHNO: 9876543210 | indrajeet@sru.edu.in
            </p> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 pt-30 md:pt-32 sm:pt-30">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed transition-all mt-3 ml-6 text-blue-600 focus:outline-none"
        >
          {isSidebarOpen ? <CloseCircle size={24} /> : <Menu size={24} />}
        </button>
        <div
          className={`fixed mt-10 top-65 left-30 h-[calc(100vh-auto)] rounded-md bg-white shadow-md transition-all duration-300 z-30 ${
            isSidebarOpen ? "w-40 sm:w-48" : "w-0 sm:w-16"
          } overflow-hidden`}
        >
          {/* Sidebar */}
          <div className="flex flex-col gap-2 p-2">
            {[
              { icon: User, label: "Information", ref: infoRef },
              { icon: Briefcase, label: "Experiences", ref: experiencesRef },
              { icon: Building, label: "Education", ref: educationRef },
              { icon: MedalStar, label: "Certifications", ref: certificationsRef },
              { icon: Crown, label: "Skills", ref: skillsRef },
              { icon: DocumentText, label: "Attachments", ref: attachmentsRef },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(item.ref)}
                className={`flex items-center gap-2 p-2 text-gray-600 hover:bg-blue-100 rounded-lg transition-colors duration-200 ${
                  isSidebarOpen ? "justify-start" : "justify-center"
                }`}
              >
                <item.icon size={20} />
                {isSidebarOpen && <span className="text-sm font-semibold">{item.label}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div
          className={`flex-1 p-4 md:p-6 transition-all duration-300 mt-0 ${
            isSidebarOpen ? "ml-0 sm:ml-48 lg:mt-0 sm:mt-60" : "ml-0 sm:ml-16 lg:mt-0 sm:mt-60"
          }`}
        >
          {/* About Section */}
          <div ref={aboutRef} className="bg-white rounded-lg p-4 md:p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">About</h2>
              <button
                onClick={() => setIsEditingAbout(!isEditingAbout)}
                className="text-blue-600 text-sm hover:underline"
              >
                {isEditingAbout ? "Cancel" : "Edit"}
              </button>
            </div>
            {isEditingAbout ? (
              <div>
                <textarea
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={4}
                />
                <button
                  onClick={handleSaveAbout}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                >
                  Save
                </button>
              </div>
            ) : (
              <p className="text-gray-600 text-sm">{aboutText}</p>
            )}
          </div>

          {/* Basic Information */}
          <div ref={infoRef} className="bg-white rounded-lg p-4 md:p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
                <User size={24} className="text-blue-600" /> Basic Information
              </h2>
              <button
                onClick={() => setIsEditingInfo(!isEditingInfo)}
                className="text-blue-600 text-sm hover:underline"
              >
                {isEditingInfo ? "Cancel" : "Edit"}
              </button>
            </div>
            {isEditingInfo ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-600 text-sm">Email Address</label>
                  <input
                    value={info.email}
                    disabled
                    className="w-full p-2 bg-gray-100 rounded-md border border-gray-300 text-sm cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-sm">Phone Number</label>
                  <input
                    value={info.phone}
                    onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-sm">Website</label>
                  <input
                    value={info.website}
                    onChange={(e) => setInfo({ ...info, website: e.target.value })}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-sm">Gender</label>
                  <input
                    value={info.gender}
                    onChange={(e) => setInfo({ ...info, gender: e.target.value })}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-sm">Location</label>
                  <input
                    value={info.location}
                    onChange={(e) => setInfo({ ...info, location: e.target.value })}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <button
                  onClick={handleSaveInfo}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm col-span-2"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Email Address</p>
                  <p className="text-gray-800">{info.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone Number</p>
                  <p className="text-gray-800">{info.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600">Website</p>
                  <p className="text-gray-800">{info.website}</p>
                </div>
                <div>
                  <p className="text-gray-600">Gender</p>
                  <p className="text-gray-800">{info.gender}</p>
                </div>
                <div>
                  <p className="text-gray-600">Location</p>
                  <p className="text-gray-800">{info.location}</p>
                </div>
              </div>
            )}
          </div>

          {/* Experiences */}
          <div ref={experiencesRef} className="bg-white rounded-lg p-4 md:p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase size={24} className="text-blue-600" /> Experiences
              </h2>
              <button
                onClick={() => setIsExperienceModalOpen(true)}
                className="text-blue-600 text-sm hover:underline"
              >
                Add Experience
              </button>
            </div>
            <div className="space-y-4">
              {(showAllExperiences ? experiences : experiences.slice(0, 2)).map((exp, index) => (
                <div key={index} className="flex items-start gap-4 border-b pb-4">
                  <Briefcase size={20} className="text-blue-600" />
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">{exp.title || "Untitled"}</h3>
                    <p className="text-gray-800 text-sm">{exp.company || "Unknown Company"}</p>
                    <p className="text-gray-600 text-sm">{exp.location || "Unknown Location"}</p>
                    <p className="text-gray-600 text-sm">
                      {exp.duration ? formatDateRange(exp.duration.startDate, exp.duration.endDate) : "N/A"}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">{exp.description || "No description"}</p>
                    {exp.certificate && (
                      <a
                        href={exp.certificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm mt-1 flex items-center gap-1 hover:underline"
                      >
                        <Link size={14} /> View Certificate
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditExperience(index)} className="text-blue-600 hover:text-blue-800">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteExperience(index)} className="text-red-500 hover:text-red-700">
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {experiences.length > 2 && !showAllExperiences && (
              <button
                onClick={() => setShowAllExperiences(true)}
                className="mt-4 text-blue-600 text-sm text-center w-full hover:underline"
              >
                Show More
              </button>
            )}
          </div>
          <ExperienceModal
            isOpen={isExperienceModalOpen}
            onClose={() => {
              setIsExperienceModalOpen(false);
              setEditingExperienceIndex(null);
            }}
            onSave={handleAddExperience}
            initialData={editingExperienceIndex !== null ? experiences[editingExperienceIndex] : {}}
          />

          {/* Education */}
          <div ref={educationRef} className="bg-white rounded-lg p-4 md:p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Building size={24} className="text-blue-600" /> Education
              </h2>
              <button
                onClick={() => setIsEducationModalOpen(true)}
                className="text-blue-600 text-sm hover:underline"
              >
                Add Education
              </button>
            </div>
            <div className="space-y-4">
              {(showAllEducations ? educations : educations.slice(0, 2)).map((edu, index) => (
                <div key={index} className="flex items-start gap-4 border-b pb-4">
                  <Building size={20} className="text-blue-600" />
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">{edu.institution || "Unknown Institution"}</h3>
                    <p className="text-gray-800 text-sm">{edu.degree || "Unknown Degree"}</p>
                    <p className="text-gray-600 text-sm">{edu.specialization || "Unknown Specialization"}</p>
                    <p className="text-gray-600 text-sm">
                      CGPA: {edu.cgpa || "N/A"} |{" "}
                      {edu.duration ? formatDateRange(edu.duration.startDate, edu.duration.endDate) : "N/A"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditEducation(index)} className="text-blue-600 hover:text-blue-800">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteEducation(index)} className="text-red-500 hover:text-red-700">
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {educations.length > 2 && !showAllEducations && (
              <button
                onClick={() => setShowAllEducations(true)}
                className="mt-4 text-blue-600 text-sm text-center w-full hover:underline"
              >
                Show More
              </button>
            )}
          </div>
          <EducationModal
            isOpen={isEducationModalOpen}
            onClose={() => {
              setIsEducationModalOpen(false);
              setEditingEducationIndex(null);
            }}
            onSave={handleAddEducation}
            initialData={editingEducationIndex !== null ? educations[editingEducationIndex] : {}}
          />

          {/* Certifications */}
          <div ref={certificationsRef} className="bg-white rounded-lg p-4 md:p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
                <MedalStar size={24} className="text-blue-600" /> Certifications
              </h2>
              <button
                onClick={() => setIsCertificationModalOpen(true)}
                className="text-blue-600 text-sm hover:underline"
              >
                Add Certification
              </button>
            </div>
            <div className="space-y-4">
              {(showAllCertifications ? certifications : certifications.slice(0, 2)).map((cert, index) => (
                <div key={index} className="flex items-start gap-4 border-b pb-4">
                  <MedalStar size={20} className="text-blue-600" />
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">{cert.title || "Unknown Provider"}</h3>
                    <p className="text-gray-800 text-sm">{cert.issuer || "Unknown Issuer"}</p>
                    <p className="text-gray-800 text-sm">{cert.courseName || "Unknown Course"}</p>
                    <p className="text-gray-600 text-sm">
                      {cert.validTime ? formatDateRange(cert.validTime.startDate, cert.validTime.endDate) : "N/A"}
                    </p>
                    {cert.certificateId && (
                      <a
                        href={cert.certificateId}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm mt-1 flex items-center gap-1 hover:underline"
                      >
                        <Link size={14} /> View Certificate
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditCertification(index)} className="text-blue-600 hover:text-blue-800">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteCertification(index)} className="text-red-500 hover:text-red-700">
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {certifications.length > 2 && !showAllCertifications && (
              <button
                onClick={() => setShowAllCertifications(true)}
                className="mt-4 text-blue-600 text-sm text-center w-full hover:underline"
              >
                Show More
              </button>
            )}
          </div>
          <CertificationModal
            isOpen={isCertificationModalOpen}
            onClose={() => {
              setIsCertificationModalOpen(false);
              setEditingCertificationIndex(null);
            }}
            onSave={handleAddCertification}
            initialData={editingCertificationIndex !== null ? certifications[editingCertificationIndex] : {}}
          />

          {/* Skills */}
          <div ref={skillsRef} className="bg-white rounded-lg p-4 md:p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Crown size={24} className="text-blue-600" /> Skills
              </h2>
              <button
                onClick={() => setIsSkillsModalOpen(true)}
                className="text-blue-600 text-sm hover:underline"
              >
                Add Skill
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(showAllSkills ? skills : skills.slice(0, 4)).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div>
                    <p className="text-gray-900 font-medium text-sm">{item.name || "Unknown Skill"}</p>
                    <p className="text-gray-600 text-xs">{item.level || "N/A"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditSkill(index)} className="text-blue-600 hover:text-blue-800">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteSkill(index)} className="text-red-500 hover:text-red-700">
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {skills.length > 4 && !showAllSkills && (
              <button
                onClick={() => setShowAllSkills(true)}
                className="mt-4 text-blue-600 text-sm text-center w-full hover:underline"
              >
                Show More
              </button>
            )}
          </div>
          <SkillsModal
            isOpen={isSkillsModalOpen}
            onClose={() => {
              setIsSkillsModalOpen(false);
              setEditingSkillIndex(null);
            }}
            onSave={handleAddSkill}
            initialData={editingSkillIndex !== null ? skills[editingSkillIndex] : {}}
          />

          {/* Attachments */}
          <div ref={attachmentsRef} className="bg-white rounded-lg p-4 md:p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
                <DocumentText size={24} className="text-blue-600" /> Attachments
              </h2>
              <button
                onClick={() => setIsAttachmentModalOpen(true)}
                className="text-blue-600 text-sm hover:underline"
              >
                Add File
              </button>
            </div>
            <div className="space-y-4">
              {(showAllAttachments ? attachments : attachments.slice(0, 2)).map((item, index) => (
                <div key={index} className="flex items-start gap-4 border-b pb-4">
                  <DocumentDownload size={20} className="text-blue-600" />
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium text-sm">{item.title || "Unnamed File"}</p>
                    <p className="text-gray-600 text-sm">
                      {item.type || "Unknown Type"} | {item.size || "Unknown Size"}
                    </p>
                    {item.resumeUrl && (
                      <a
                        href={item.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm mt-1 flex items-center gap-1 hover:underline"
                      >
                        <Link size={14} /> View Attachment
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditAttachment(index)} className="text-blue-600 hover:text-blue-800">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteAttachment(index)} className="text-red-500 hover:text-red-700">
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {attachments.length > 2 && !showAllAttachments && (
              <button
                onClick={() => setShowAllAttachments(true)}
                className="mt-4 text-blue-600 text-sm text-center w-full hover:underline"
              >
                Show More
              </button>
            )}
          </div>
          <AttachmentModal
            isOpen={isAttachmentModalOpen}
            onClose={() => {
              setIsAttachmentModalOpen(false);
              setEditingAttachmentIndex(null);
            }}
            onSave={handleAddAttachment}
            initialData={editingAttachmentIndex !== null ? attachments[editingAttachmentIndex] : {}}
          />
        </div>
      </div>
    </div>
  );
};

export default Body;
//wait 