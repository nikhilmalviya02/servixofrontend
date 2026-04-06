import { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  ArrowLeft, Eye, Download, CheckCircle, XCircle, Clock, AlertCircle,
  FileText, CreditCard, Phone, Camera, Shield, User, MessageSquare,
  Mail
} from "lucide-react";

const AdminVerificationReview = () => {
  const { logout }: any = useContext(AuthContext);
  const navigate = useNavigate();
  const { userId } = useParams();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<{ [key: string]: string }>({});

  const handleLogout = () => {
    logout();
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    if (userId) {
      fetchProviderDetails();
    }
  }, [userId]);

  const fetchProviderDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.get(
        `https://servixobackend.vercel.app/api/admin/verification/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProvider(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch provider details");
      navigate("/admin/verifications");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-green-100 text-green-800 border-green-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return <CheckCircle size={16} />;
      case "rejected": return <XCircle size={16} />;
      case "pending": return <Clock size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case "aadharCard": return <FileText size={20} />;
      case "panCard": return <FileText size={20} />;
      case "drivingLicense": return <FileText size={20} />;
      case "phone": return <Phone size={20} />;
      case "bankAccount": return <CreditCard size={20} />;
      case "profilePhoto": return <Camera size={20} />;
      default: return <FileText size={20} />;
    }
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case "aadharCard": return "Aadhar Card";
      case "panCard": return "PAN Card";
      case "drivingLicense": return "Driving License";
      case "phone": return "Phone Number";
      case "bankAccount": return "Bank Account";
      case "profilePhoto": return "Profile Photo";
      default: return section;
    }
  };

  const handleStatusUpdate = async (section: string, status: string) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.put(
        `https://servixobackend.vercel.app/api/admin/verification/${userId}/${section}`,
        {
          status,
          rejectionReason: status === "rejected" ? reviewNotes[section] : null
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(response.data.message);
      fetchProviderDetails(); // Refresh data
      setActiveSection(null);
      setReviewNotes({ ...reviewNotes, [section]: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddReviewNote = async (section: string, action: string) => {
    if (!reviewNotes[section]?.trim()) {
      toast.error("Please enter a review note");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        `https://servixobackend.vercel.app/api/admin/verification/${userId}/${section}/review`,
        {
          reviewNote: reviewNotes[section],
          action
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(response.data.message);
      fetchProviderDetails(); // Refresh data
      setReviewNotes({ ...reviewNotes, [section]: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add review note");
    } finally {
      setSubmitting(false);
    }
  };

  const getVerificationSections = () => {
    if (!provider?.verification) return [];
    
    return [
      { id: "aadharCard", data: provider.verification.aadharCard },
      { id: "panCard", data: provider.verification.panCard },
      { id: "drivingLicense", data: provider.verification.drivingLicense },
      { id: "phone", data: provider.verification.phone },
      { id: "bankAccount", data: provider.verification.bankAccount },
      { id: "profilePhoto", data: provider.verification.profilePhoto }
    ].filter(section => section.data); // Only show sections that have data
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Provider not found</h2>
          <Link
            to="/admin/verifications"
            className="text-blue-600 hover:text-blue-700"
          >
            Back to Verifications
          </Link>
        </div>
      </div>
    );
  }

  const sections = getVerificationSections();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 fixed h-full hidden md:block flex flex-col">
        <h2 className="text-xl font-bold mb-6 text-blue-600">
          Admin Panel
        </h2>

        <nav className="space-y-2">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard
          </Link>

          <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition">
            <User size={20} />
            Manage Users
          </Link>

          <Link to="/admin/verifications" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-700 font-medium">
            <Shield size={20} />
            Verifications
          </Link>

          <Link to="/admin/services" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Manage Services
          </Link>

          <Link to="/admin/bookings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Manage Bookings
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="mt-auto pt-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition w-full font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-screen bg-gray-50">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/admin/verifications"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={16} />
            Back to Verifications
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Verification Review
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  {provider.name}
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  {provider.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  {provider.phone || "N/A"}
                </div>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-0">
              <span className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium border ${getStatusColor(provider.overallVerificationStatus)}`}>
                {getStatusIcon(provider.overallVerificationStatus)}
                Overall Status: {provider.overallVerificationStatus?.replace("_", " ") || "Unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* Verification Sections */}
        <div className="space-y-6">
          {sections.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-gray-100 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No verification documents found</h3>
              <p className="text-gray-500">This provider hasn't submitted any verification documents yet.</p>
            </div>
          ) : (
            sections.map((section) => (
              <div key={section.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                        {getSectionIcon(section.id)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {getSectionTitle(section.id)}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(section.data.status)}`}>
                          {getStatusIcon(section.data.status)}
                          {section.data.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {section.data.documentUrl && (
                        <a
                          href={section.data.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                        >
                          <Eye size={16} />
                        </a>
                      )}
                      
                      <button
                        onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                      >
                        <MessageSquare size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Document Preview */}
                {section.data.documentUrl && (
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Document Preview</h4>
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      {section.id === "profilePhoto" ? (
                        <img
                          src={section.data.url}
                          alt="Profile Photo"
                          className="w-full max-w-md mx-auto rounded-lg"
                        />
                      ) : (
                        <div className="p-4 bg-gray-50 text-center">
                          <FileText size={48} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-3">Document uploaded</p>
                          <a
                            href={section.data.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <Download size={16} />
                            View Document
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Additional Details */}
                <div className="p-6 border-b border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {section.data.number && (
                      <div>
                        <span className="text-sm text-gray-500">Number:</span>
                        <p className="font-medium">{section.data.number}</p>
                      </div>
                    )}
                    {section.data.accountNumber && (
                      <div>
                        <span className="text-sm text-gray-500">Account Number:</span>
                        <p className="font-medium">{section.data.accountNumber}</p>
                      </div>
                    )}
                    {section.data.ifsc && (
                      <div>
                        <span className="text-sm text-gray-500">IFSC Code:</span>
                        <p className="font-medium">{section.data.ifsc}</p>
                      </div>
                    )}
                    {section.data.holderName && (
                      <div>
                        <span className="text-sm text-gray-500">Account Holder:</span>
                        <p className="font-medium">{section.data.holderName}</p>
                      </div>
                    )}
                    {section.data.phoneNumber && (
                      <div>
                        <span className="text-sm text-gray-500">Phone Number:</span>
                        <p className="font-medium">{section.data.phoneNumber}</p>
                      </div>
                    )}
                    {section.data.verifiedAt && (
                      <div>
                        <span className="text-sm text-gray-500">Verified At:</span>
                        <p className="font-medium">{formatDate(section.data.verifiedAt)}</p>
                      </div>
                    )}
                    {section.data.reviewedAt && (
                      <div>
                        <span className="text-sm text-gray-500">Last Reviewed:</span>
                        <p className="font-medium">{formatDate(section.data.reviewedAt)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Review Actions */}
                <div className="p-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Review Actions</h4>
                  
                  {section.data.rejectionReason && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">
                        <strong>Rejection Reason:</strong> {section.data.rejectionReason}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    {section.data.status !== "verified" && (
                      <button
                        onClick={() => handleStatusUpdate(section.id, "verified")}
                        disabled={submitting}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle size={16} className="inline mr-2" />
                        Approve
                      </button>
                    )}
                    
                    {section.data.status !== "rejected" && (
                      <button
                        onClick={() => handleStatusUpdate(section.id, "rejected")}
                        disabled={submitting}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle size={16} className="inline mr-2" />
                        Reject
                      </button>
                    )}
                  </div>
                </div>

                {/* Review Notes Section */}
                {activeSection === section.id && (
                  <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Add Review Note</h4>
                    
                    {section.data.reviewNotes && section.data.reviewNotes.length > 0 && (
                      <div className="mb-4 space-y-2">
                        {section.data.reviewNotes.map((note: any, index: number) => (
                          <div key={index} className="p-3 bg-white border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                {note.action === "approve" ? "Approved" : 
                                 note.action === "reject" ? "Rejected" : "Request More"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(note.reviewedAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{note.note}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <textarea
                        value={reviewNotes[section.id] || ""}
                        onChange={(e) => setReviewNotes({ ...reviewNotes, [section.id]: e.target.value })}
                        placeholder="Enter your review note..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddReviewNote(section.id, "approve")}
                          disabled={submitting || !reviewNotes[section.id]?.trim()}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Approve with Note
                        </button>
                        <button
                          onClick={() => handleAddReviewNote(section.id, "reject")}
                          disabled={submitting || !reviewNotes[section.id]?.trim()}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Reject with Note
                        </button>
                        <button
                          onClick={() => handleAddReviewNote(section.id, "request_more")}
                          disabled={submitting || !reviewNotes[section.id]?.trim()}
                          className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Request More Info
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminVerificationReview;
