import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  Shield, Upload, CheckCircle, XCircle, Clock, AlertCircle,
  FileText, User, Briefcase, Phone, Camera, CreditCard,
  Award, Building, Eye, Edit, Trash2, Plus, Download
} from "lucide-react";

/* ─── Styles ─── */
const PV_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  :root {
    --sg-bg: #ffffff;
    --sg-surface: #f8fafc;
    --sg-surface2: #f1f5f9;
    --sg-accent: #3b82f6;
    --sg-accent2: #0ea5e9;
    --sg-cyan: #06b6d4;
    --sg-text: #1e293b;
    --sg-muted: #64748b;
    --sg-border: rgba(0,0,0,0.08);
    --sg-success: #10b981;
    --sg-warning: #f59e0b;
    --sg-error: #ef4444;
  }

  .pv-root {
    font-family: 'Inter', sans-serif;
  }

  .pv-section {
    margin-bottom: 2rem;
  }

  .pv-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--sg-border);
  }

  .pv-section-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--sg-text);
  }

  .pv-section-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .pv-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  .pv-card {
    background: #fff;
    border: 1px solid var(--sg-border);
    border-radius: 16px;
    padding: 1.5rem;
    transition: all 0.2s ease;
    position: relative;
  }

  .pv-card:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    transform: translateY(-2px);
  }

  .pv-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .pv-card-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--sg-text);
  }

  .pv-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.75rem;
    border-radius: 100px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .pv-status-pending {
    background: rgba(245, 158, 11, 0.1);
    color: var(--sg-warning);
    border: 1px solid rgba(245, 158, 11, 0.2);
  }

  .pv-status-verified {
    background: rgba(16, 185, 129, 0.1);
    color: var(--sg-success);
    border: 1px solid rgba(16, 185, 129, 0.2);
  }

  .pv-status-rejected {
    background: rgba(239, 68, 68, 0.1);
    color: var(--sg-error);
    border: 1px solid rgba(239, 68, 68, 0.2);
  }

  .pv-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .pv-form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .pv-form-label {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--sg-text);
  }

  .pv-form-input {
    padding: 0.75rem;
    border: 1px solid var(--sg-border);
    border-radius: 8px;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    background: var(--sg-surface);
  }

  .pv-form-input:focus {
    outline: none;
    border-color: var(--sg-accent);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .pv-file-upload {
    position: relative;
    border: 2px dashed var(--sg-border);
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    transition: all 0.2s ease;
    cursor: pointer;
    background: var(--sg-surface);
  }

  .pv-file-upload:hover {
    border-color: var(--sg-accent);
    background: rgba(59, 130, 246, 0.02);
  }

  .pv-file-upload.dragover {
    border-color: var(--sg-accent);
    background: rgba(59, 130, 246, 0.05);
  }

  .pv-upload-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 1rem;
    color: var(--sg-muted);
  }

  .pv-upload-text {
    font-size: 0.9rem;
    color: var(--sg-text);
    margin-bottom: 0.5rem;
  }

  .pv-upload-hint {
    font-size: 0.8rem;
    color: var(--sg-muted);
  }

  .pv-file-input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }

  .pv-preview {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--sg-surface);
    border-radius: 8px;
    border: 1px solid var(--sg-border);
  }

  .pv-preview-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--sg-accent);
    color: white;
  }

  .pv-preview-info {
    flex: 1;
  }

  .pv-preview-name {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--sg-text);
  }

  .pv-preview-size {
    font-size: 0.8rem;
    color: var(--sg-muted);
  }

  .pv-preview-actions {
    display: flex;
    gap: 0.5rem;
  }

  .pv-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    text-decoration: none;
  }

  .pv-btn-primary {
    background: var(--sg-accent);
    color: white;
  }

  .pv-btn-primary:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }

  .pv-btn-secondary {
    background: var(--sg-surface);
    color: var(--sg-text);
    border: 1px solid var(--sg-border);
  }

  .pv-btn-secondary:hover {
    background: var(--sg-surface2);
  }

  .pv-btn-icon {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid var(--sg-border);
    background: white;
  }

  .pv-btn-icon:hover {
    background: var(--sg-surface);
  }

  .pv-btn-icon.danger:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.2);
    color: var(--sg-error);
  }

  .pv-empty-state {
    text-align: center;
    padding: 3rem 2rem;
    color: var(--sg-muted);
  }

  .pv-empty-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 1rem;
    opacity: 0.5;
  }

  .pv-empty-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--sg-text);
  }

  .pv-empty-text {
    font-size: 0.85rem;
  }

  .pv-progress-bar {
    height: 4px;
    background: var(--sg-surface2);
    border-radius: 100px;
    overflow: hidden;
    margin-top: 1rem;
  }

  .pv-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--sg-accent), var(--sg-cyan));
    transition: width 0.3s ease;
  }

  .pv-overview-card {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%);
    border: 1px solid rgba(59, 130, 246, 0.1);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .pv-overview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .pv-overview-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 700;
    font-size: 1.2rem;
    color: var(--sg-text);
  }

  .pv-overview-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .pv-stat-item {
    text-align: center;
  }

  .pv-stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--sg-accent);
  }

  .pv-stat-label {
    font-size: 0.8rem;
    color: var(--sg-muted);
    margin-top: 0.25rem;
  }

  .pv-document-preview {
    max-width: 100%;
    max-height: 200px;
    border-radius: 8px;
    margin-top: 0.5rem;
  }

  .pv-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: var(--sg-muted);
  }

  .pv-spinner {
    width: 24px;
    height: 24px;
    border: 2px solid var(--sg-surface2);
    border-top-color: var(--sg-accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 0.5rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

function InjectPVStyle() {
  useEffect(() => {
    if (!document.getElementById("pv-style")) {
      const el = document.createElement("style");
      el.id = "pv-style";
      el.textContent = PV_STYLE;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

interface VerificationData {
  aadharCard?: {
    number?: string;
    documentUrl?: string;
    cloudinaryPublicId?: string;
    status?: string;
    verifiedAt?: string;
    rejectionReason?: string;
  };
  panCard?: {
    number?: string;
    documentUrl?: string;
    cloudinaryPublicId?: string;
    status?: string;
    verifiedAt?: string;
    rejectionReason?: string;
  };
  drivingLicense?: {
    number?: string;
    documentUrl?: string;
    cloudinaryPublicId?: string;
    status?: string;
    verifiedAt?: string;
    rejectionReason?: string;
  };
  phone?: {
    number?: string;
    isVerified?: boolean;
    verifiedAt?: string;
  };
  skillCertificates?: Array<{
    name?: string;
    documentUrl?: string;
    cloudinaryPublicId?: string;
    issuer?: string;
    issueDate?: string;
    status?: string;
    verifiedAt?: string;
    rejectionReason?: string;
  }>;
  workExperience?: Array<{
    company?: string;
    position?: string;
    duration?: string;
    documentUrl?: string;
    cloudinaryPublicId?: string;
    status?: string;
    verifiedAt?: string;
    rejectionReason?: string;
  }>;
  bankAccount?: {
    accountNumber?: string;
    ifsc?: string;
    holderName?: string;
    documentUrl?: string;
    cloudinaryPublicId?: string;
    status?: string;
    verifiedAt?: string;
    rejectionReason?: string;
  };
  profilePhoto?: {
    url?: string;
    cloudinaryPublicId?: string;
    status?: string;
    verifiedAt?: string;
    rejectionReason?: string;
  };
}

interface ProviderVerificationProps {
  providerId?: string;
}

function ProviderVerification({ providerId }: ProviderVerificationProps) {
  const { user } = useAuth();
  const [verification, setVerification] = useState<VerificationData>({});
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVerificationData();
  }, []);

  const fetchVerificationData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://servixobackend.vercel.app/api/provider/verification`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVerification(response.data.verification || {});
    } catch (error) {
      toast.error("Failed to load verification data");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, section: string, additionalData?: any) => {
    const formData = new FormData();
    formData.append("file", file);
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    try {
      setUploading(true);
      await axios.post(
        `https://servixobackend.vercel.app/api/provider/verification/upload/${section}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Document uploaded successfully");
      fetchVerificationData();
      setEditingSection(null);
      setFormData({});
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (section: string, index?: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const url = index !== undefined 
        ? `https://servixobackend.vercel.app/api/provider/verification/${section}/${index}`
        : `https://servixobackend.vercel.app/api/provider/verification/${section}`;
      
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Document deleted successfully");
      fetchVerificationData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete document");
    }
  };

  const handlePhoneVerification = async (phoneNumber: string) => {
    try {
      const response = await axios.post(
        `https://servixobackend.vercel.app/api/provider/verification/phone/send-otp`,
        { phoneNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const otp = prompt("Enter OTP sent to your phone:");
      if (otp) {
        await axios.post(
          `https://servixobackend.vercel.app/api/provider/verification/phone/verify-otp`,
          { otp },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Phone number verified successfully");
        fetchVerificationData();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Phone verification failed");
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "verified": return "pv-status-verified";
      case "rejected": return "pv-status-rejected";
      default: return "pv-status-pending";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "verified": return <CheckCircle size={14} />;
      case "rejected": return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const calculateProgress = () => {
    const sections = [
      verification.aadharCard,
      verification.panCard,
      verification.drivingLicense,
      verification.phone,
      verification.bankAccount,
      verification.profilePhoto
    ];
    
    const verifiedCount = sections.filter(section => section?.status === "verified").length;
    return Math.round((verifiedCount / sections.length) * 100);
  };

  const renderDocumentPreview = (url?: string, type?: string) => {
    if (!url) return null;
    
    if (type === 'pdf' || url.includes('.pdf')) {
      return (
        <div className="pv-preview">
          <div className="pv-preview-icon">
            <FileText size={20} />
          </div>
          <div className="pv-preview-info">
            <div className="pv-preview-name">PDF Document</div>
            <div className="pv-preview-size">Click to view</div>
          </div>
          <div className="pv-preview-actions">
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="pv-btn-icon"
            >
              <Eye size={14} />
            </a>
          </div>
        </div>
      );
    }
    
    return (
      <div className="pv-preview">
        <div className="pv-preview-icon">
          <FileText size={20} />
        </div>
        <div className="pv-preview-info">
          <div className="pv-preview-name">Image Document</div>
          <div className="pv-preview-size">Click to view</div>
        </div>
        <div className="pv-preview-actions">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="pv-btn-icon"
          >
            <Eye size={14} />
          </a>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <InjectPVStyle />
        <div className="pv-root">
          <div className="pv-loading">
            <div className="pv-spinner" />
            Loading verification data...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <InjectPVStyle />
      <div className="pv-root">
        {/* Overview Section */}
        <div className="pv-overview-card">
          <div className="pv-overview-header">
            <div className="pv-overview-title">
              <Shield size={24} style={{ color: "var(--sg-accent)" }} />
              Verification Overview
            </div>
            <div className={`pv-status-badge ${getStatusColor(verification.aadharCard?.status || "pending")}`}>
              {getStatusIcon(verification.aadharCard?.status)}
              {verification.aadharCard?.status || "pending"}
            </div>
          </div>
          <div className="pv-overview-stats">
            <div className="pv-stat-item">
              <div className="pv-stat-value">{calculateProgress()}%</div>
              <div className="pv-stat-label">Complete</div>
            </div>
            <div className="pv-stat-item">
              <div className="pv-stat-value">
                {[
                  verification.aadharCard,
                  verification.panCard,
                  verification.drivingLicense,
                  verification.phone,
                  verification.bankAccount,
                  verification.profilePhoto
                ].filter(s => s?.status === "verified").length}
              </div>
              <div className="pv-stat-label">Verified</div>
            </div>
            <div className="pv-stat-item">
              <div className="pv-stat-value">
                {[
                  verification.aadharCard,
                  verification.panCard,
                  verification.drivingLicense,
                  verification.phone,
                  verification.bankAccount,
                  verification.profilePhoto
                ].filter(s => s?.status === "pending").length}
              </div>
              <div className="pv-stat-label">Pending</div>
            </div>
          </div>
          <div className="pv-progress-bar">
            <div className="pv-progress-fill" style={{ width: `${calculateProgress()}%` }} />
          </div>
        </div>

        {/* Identity Documents */}
        <div className="pv-section">
          <div className="pv-section-header">
            <div className="pv-section-title">
              <div className="pv-section-icon" style={{ background: "rgba(59, 130, 246, 0.1)", color: "var(--sg-accent)" }}>
                <User size={18} />
              </div>
              Identity Documents
            </div>
          </div>
          <div className="pv-grid">
            {/* Aadhar Card */}
            <div className="pv-card">
              <div className="pv-card-header">
                <div className="pv-card-title">
                  <CreditCard size={16} />
                  Aadhar Card
                </div>
                <div className={`pv-status-badge ${getStatusColor(verification.aadharCard?.status)}`}>
                  {getStatusIcon(verification.aadharCard?.status)}
                  {verification.aadharCard?.status || "pending"}
                </div>
              </div>
              {verification.aadharCard?.number ? (
                <div>
                  <p style={{ fontSize: "0.85rem", color: "var(--sg-muted)", marginBottom: "0.5rem" }}>
                    Number: {verification.aadharCard.number}
                  </p>
                  {verification.aadharCard.documentUrl && renderDocumentPreview(verification.aadharCard.documentUrl)}
                  {verification.aadharCard.rejectionReason && (
                    <p style={{ fontSize: "0.8rem", color: "var(--sg-error)", marginTop: "0.5rem" }}>
                      Reason: {verification.aadharCard.rejectionReason}
                    </p>
                  )}
                </div>
              ) : (
                <div className="pv-empty-state">
                  <Upload size={24} />
                  <div className="pv-empty-title">No Aadhar Card</div>
                  <div className="pv-empty-text">Add your Aadhar card for verification</div>
                </div>
              )}
              {editingSection === "aadharCard" ? (
                <div className="pv-form">
                  <div className="pv-form-group">
                    <label className="pv-form-label">Aadhar Number</label>
                    <input
                      type="text"
                      className="pv-form-input"
                      placeholder="Enter 12-digit Aadhar number"
                      maxLength={12}
                      value={formData.aadharNumber || ""}
                      onChange={(e) => setFormData({...formData, aadharNumber: e.target.value})}
                    />
                  </div>
                  <div className="pv-form-group">
                    <label className="pv-form-label">Upload Document</label>
                    <div className="pv-file-upload">
                      <input
                        type="file"
                        className="pv-file-input"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && formData.aadharNumber) {
                            handleFileUpload(file, "aadharCard", { number: formData.aadharNumber });
                          } else if (file) {
                            toast.error("Please enter Aadhar number first");
                          }
                        }}
                      />
                      <Upload className="pv-upload-icon" size={24} />
                      <div className="pv-upload-text">Click to upload or drag and drop</div>
                      <div className="pv-upload-hint">PDF, JPG, PNG up to 10MB</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="pv-btn pv-btn-secondary"
                      onClick={() => {
                        setEditingSection(null);
                        setFormData({});
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: "1rem" }}>
                  <button
                    className="pv-btn pv-btn-primary"
                    onClick={() => setEditingSection("aadharCard")}
                  >
                    <Plus size={14} />
                    {verification.aadharCard?.number ? "Update" : "Add"} Aadhar Card
                  </button>
                  {verification.aadharCard?.documentUrl && (
                    <button
                      className="pv-btn-icon danger"
                      onClick={() => handleDeleteDocument("aadharCard")}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* PAN Card */}
            <div className="pv-card">
              <div className="pv-card-header">
                <div className="pv-card-title">
                  <CreditCard size={16} />
                  PAN Card
                </div>
                <div className={`pv-status-badge ${getStatusColor(verification.panCard?.status)}`}>
                  {getStatusIcon(verification.panCard?.status)}
                  {verification.panCard?.status || "pending"}
                </div>
              </div>
              {verification.panCard?.number ? (
                <div>
                  <p style={{ fontSize: "0.85rem", color: "var(--sg-muted)", marginBottom: "0.5rem" }}>
                    Number: {verification.panCard.number}
                  </p>
                  {verification.panCard.documentUrl && renderDocumentPreview(verification.panCard.documentUrl)}
                  {verification.panCard.rejectionReason && (
                    <p style={{ fontSize: "0.8rem", color: "var(--sg-error)", marginTop: "0.5rem" }}>
                      Reason: {verification.panCard.rejectionReason}
                    </p>
                  )}
                </div>
              ) : (
                <div className="pv-empty-state">
                  <Upload size={24} />
                  <div className="pv-empty-title">No PAN Card</div>
                  <div className="pv-empty-text">Add your PAN card for verification</div>
                </div>
              )}
              {editingSection === "panCard" ? (
                <div className="pv-form">
                  <div className="pv-form-group">
                    <label className="pv-form-label">PAN Number</label>
                    <input
                      type="text"
                      className="pv-form-input"
                      placeholder="Enter 10-digit PAN number"
                      maxLength={10}
                      value={formData.panNumber || ""}
                      onChange={(e) => setFormData({...formData, panNumber: e.target.value})}
                    />
                  </div>
                  <div className="pv-form-group">
                    <label className="pv-form-label">Upload Document</label>
                    <div className="pv-file-upload">
                      <input
                        type="file"
                        className="pv-file-input"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && formData.panNumber) {
                            handleFileUpload(file, "panCard", { number: formData.panNumber });
                          } else if (file) {
                            toast.error("Please enter PAN number first");
                          }
                        }}
                      />
                      <Upload className="pv-upload-icon" size={24} />
                      <div className="pv-upload-text">Click to upload or drag and drop</div>
                      <div className="pv-upload-hint">PDF, JPG, PNG up to 10MB</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="pv-btn pv-btn-secondary"
                      onClick={() => {
                        setEditingSection(null);
                        setFormData({});
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: "1rem" }}>
                  <button
                    className="pv-btn pv-btn-primary"
                    onClick={() => setEditingSection("panCard")}
                  >
                    <Plus size={14} />
                    {verification.panCard?.number ? "Update" : "Add"} PAN Card
                  </button>
                  {verification.panCard?.documentUrl && (
                    <button
                      className="pv-btn-icon danger"
                      onClick={() => handleDeleteDocument("panCard")}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Driving License */}
            <div className="pv-card">
              <div className="pv-card-header">
                <div className="pv-card-title">
                  <CreditCard size={16} />
                  Driving License
                </div>
                <div className={`pv-status-badge ${getStatusColor(verification.drivingLicense?.status)}`}>
                  {getStatusIcon(verification.drivingLicense?.status)}
                  {verification.drivingLicense?.status || "pending"}
                </div>
              </div>
              {verification.drivingLicense?.number ? (
                <div>
                  <p style={{ fontSize: "0.85rem", color: "var(--sg-muted)", marginBottom: "0.5rem" }}>
                    Number: {verification.drivingLicense.number}
                  </p>
                  {verification.drivingLicense.documentUrl && renderDocumentPreview(verification.drivingLicense.documentUrl)}
                  {verification.drivingLicense.rejectionReason && (
                    <p style={{ fontSize: "0.8rem", color: "var(--sg-error)", marginTop: "0.5rem" }}>
                      Reason: {verification.drivingLicense.rejectionReason}
                    </p>
                  )}
                </div>
              ) : (
                <div className="pv-empty-state">
                  <Upload size={24} />
                  <div className="pv-empty-title">No Driving License</div>
                  <div className="pv-empty-text">Add your driving license for verification</div>
                </div>
              )}
              {editingSection === "drivingLicense" ? (
                <div className="pv-form">
                  <div className="pv-form-group">
                    <label className="pv-form-label">License Number</label>
                    <input
                      type="text"
                      className="pv-form-input"
                      placeholder="Enter license number"
                      value={formData.licenseNumber || ""}
                      onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                    />
                  </div>
                  <div className="pv-form-group">
                    <label className="pv-form-label">Upload Document</label>
                    <div className="pv-file-upload">
                      <input
                        type="file"
                        className="pv-file-input"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && formData.licenseNumber) {
                            handleFileUpload(file, "drivingLicense", { number: formData.licenseNumber });
                          } else if (file) {
                            toast.error("Please enter license number first");
                          }
                        }}
                      />
                      <Upload className="pv-upload-icon" size={24} />
                      <div className="pv-upload-text">Click to upload or drag and drop</div>
                      <div className="pv-upload-hint">PDF, JPG, PNG up to 10MB</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="pv-btn pv-btn-secondary"
                      onClick={() => {
                        setEditingSection(null);
                        setFormData({});
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: "1rem" }}>
                  <button
                    className="pv-btn pv-btn-primary"
                    onClick={() => setEditingSection("drivingLicense")}
                  >
                    <Plus size={14} />
                    {verification.drivingLicense?.number ? "Update" : "Add"} Driving License
                  </button>
                  {verification.drivingLicense?.documentUrl && (
                    <button
                      className="pv-btn-icon danger"
                      onClick={() => handleDeleteDocument("drivingLicense")}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Phone Verification */}
        <div className="pv-section">
          <div className="pv-section-header">
            <div className="pv-section-title">
              <div className="pv-section-icon" style={{ background: "rgba(6, 182, 212, 0.1)", color: "var(--sg-cyan)" }}>
                <Phone size={18} />
              </div>
              Phone Verification
            </div>
          </div>
          <div className="pv-grid">
            <div className="pv-card">
              <div className="pv-card-header">
                <div className="pv-card-title">
                  <Phone size={16} />
                  Mobile Number
                </div>
                <div className={`pv-status-badge ${verification.phone?.isVerified ? "pv-status-verified" : "pv-status-pending"}`}>
                  {verification.phone?.isVerified ? <CheckCircle size={14} /> : <Clock size={14} />}
                  {verification.phone?.isVerified ? "verified" : "pending"}
                </div>
              </div>
              {verification.phone?.number ? (
                <div>
                  <p style={{ fontSize: "0.85rem", color: "var(--sg-muted)", marginBottom: "0.5rem" }}>
                    Number: {verification.phone.number}
                  </p>
                  {verification.phone.isVerified && (
                    <p style={{ fontSize: "0.8rem", color: "var(--sg-success)" }}>
                      ✓ Verified on {new Date(verification.phone.verifiedAt || "").toLocaleDateString()}
                    </p>
                  )}
                </div>
              ) : (
                <div className="pv-empty-state">
                  <Phone size={24} />
                  <div className="pv-empty-title">No Phone Number</div>
                  <div className="pv-empty-text">Add and verify your phone number</div>
                </div>
              )}
              <div style={{ marginTop: "1rem" }}>
                <button 
                  className="pv-btn pv-btn-primary"
                  onClick={() => {
                    const phoneNumber = prompt("Enter your 10-digit phone number:");
                    if (phoneNumber && phoneNumber.length === 10) {
                      handlePhoneVerification(phoneNumber);
                    } else if (phoneNumber) {
                      toast.error("Please enter a valid 10-digit phone number");
                    }
                  }}
                >
                  <Plus size={14} />
                  {verification.phone?.isVerified ? "Update Number" : "Verify Phone"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Details */}
        <div className="pv-section">
          <div className="pv-section-header">
            <div className="pv-section-title">
              <div className="pv-section-icon" style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--sg-success)" }}>
                <Briefcase size={18} />
              </div>
              Professional Details
            </div>
          </div>
          <div className="pv-grid">
            {/* Skill Certificates */}
            <div className="pv-card">
              <div className="pv-card-header">
                <div className="pv-card-title">
                  <Award size={16} />
                  Skill Certificates
                </div>
              </div>
              {verification.skillCertificates && verification.skillCertificates.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {verification.skillCertificates.map((cert, index) => (
                    <div key={index} className="pv-preview">
                      <div className="pv-preview-icon">
                        <Award size={20} />
                      </div>
                      <div className="pv-preview-info">
                        <div className="pv-preview-name">{cert.name}</div>
                        <div className="pv-preview-size">{cert.issuer}</div>
                      </div>
                      <div className={`pv-status-badge ${getStatusColor(cert.status)}`}>
                        {getStatusIcon(cert.status)}
                        {cert.status}
                      </div>
                      <button
                        className="pv-btn-icon danger"
                        onClick={() => handleDeleteDocument("skillCertificates", index)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pv-empty-state">
                  <Award size={24} />
                  <div className="pv-empty-title">No Certificates</div>
                  <div className="pv-empty-text">Add your skill certificates</div>
                </div>
              )}
              {editingSection === "skillCertificate" ? (
                <div className="pv-form">
                  <div className="pv-form-group">
                    <label className="pv-form-label">Certificate Name</label>
                    <input
                      type="text"
                      className="pv-form-input"
                      placeholder="Enter certificate name"
                      value={formData.certificateName || ""}
                      onChange={(e) => setFormData({...formData, certificateName: e.target.value})}
                    />
                  </div>
                  <div className="pv-form-group">
                    <label className="pv-form-label">Issuing Organization</label>
                    <input
                      type="text"
                      className="pv-form-input"
                      placeholder="Enter issuing organization"
                      value={formData.issuer || ""}
                      onChange={(e) => setFormData({...formData, issuer: e.target.value})}
                    />
                  </div>
                  <div className="pv-form-group">
                    <label className="pv-form-label">Issue Date</label>
                    <input
                      type="date"
                      className="pv-form-input"
                      value={formData.issueDate || ""}
                      onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                    />
                  </div>
                  <div className="pv-form-group">
                    <label className="pv-form-label">Upload Document</label>
                    <div className="pv-file-upload">
                      <input
                        type="file"
                        className="pv-file-input"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && formData.certificateName && formData.issuer) {
                            handleFileUpload(file, "skillCertificate", {
                              name: formData.certificateName,
                              issuer: formData.issuer,
                              issueDate: formData.issueDate
                            });
                          } else if (file) {
                            toast.error("Please fill in all fields first");
                          }
                        }}
                      />
                      <Upload className="pv-upload-icon" size={24} />
                      <div className="pv-upload-text">Click to upload or drag and drop</div>
                      <div className="pv-upload-hint">PDF, JPG, PNG up to 10MB</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="pv-btn pv-btn-secondary"
                      onClick={() => {
                        setEditingSection(null);
                        setFormData({});
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: "1rem" }}>
                  <button
                    className="pv-btn pv-btn-primary"
                    onClick={() => setEditingSection("skillCertificate")}
                  >
                    <Plus size={14} />
                    Add Certificate
                  </button>
                </div>
              )}
            </div>

            {/* Work Experience */}
            <div className="pv-card">
              <div className="pv-card-header">
                <div className="pv-card-title">
                  <Building size={16} />
                  Work Experience
                </div>
              </div>
              {verification.workExperience && verification.workExperience.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {verification.workExperience.map((exp, index) => (
                    <div key={index} className="pv-preview">
                      <div className="pv-preview-icon">
                        <Building size={20} />
                      </div>
                      <div className="pv-preview-info">
                        <div className="pv-preview-name">{exp.position}</div>
                        <div className="pv-preview-size">{exp.company} • {exp.duration}</div>
                      </div>
                      <div className={`pv-status-badge ${getStatusColor(exp.status)}`}>
                        {getStatusIcon(exp.status)}
                        {exp.status}
                      </div>
                      <button
                        className="pv-btn-icon danger"
                        onClick={() => handleDeleteDocument("workExperience", index)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pv-empty-state">
                  <Building size={24} />
                  <div className="pv-empty-title">No Experience</div>
                  <div className="pv-empty-text">Add your work experience</div>
                </div>
              )}
              {editingSection === "workExperience" ? (
                <div className="pv-form">
                  <div className="pv-form-group">
                    <label className="pv-form-label">Company Name</label>
                    <input
                      type="text"
                      className="pv-form-input"
                      placeholder="Enter company name"
                      value={formData.company || ""}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                    />
                  </div>
                  <div className="pv-form-group">
                    <label className="pv-form-label">Position</label>
                    <input
                      type="text"
                      className="pv-form-input"
                      placeholder="Enter your position"
                      value={formData.position || ""}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                    />
                  </div>
                  <div className="pv-form-group">
                    <label className="pv-form-label">Duration</label>
                    <input
                      type="text"
                      className="pv-form-input"
                      placeholder="e.g., 2 years, 6 months"
                      value={formData.duration || ""}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    />
                  </div>
                  <div className="pv-form-group">
                    <label className="pv-form-label">Upload Document (Optional)</label>
                    <div className="pv-file-upload">
                      <input
                        type="file"
                        className="pv-file-input"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && formData.company && formData.position && formData.duration) {
                            handleFileUpload(file, "workExperience", {
                              company: formData.company,
                              position: formData.position,
                              duration: formData.duration
                            });
                          } else if (file) {
                            toast.error("Please fill in all fields first");
                          }
                        }}
                      />
                      <Upload className="pv-upload-icon" size={24} />
                      <div className="pv-upload-text">Click to upload or drag and drop</div>
                      <div className="pv-upload-hint">PDF, JPG, PNG up to 10MB</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="pv-btn pv-btn-secondary"
                      onClick={() => {
                        setEditingSection(null);
                        setFormData({});
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: "1rem" }}>
                  <button
                    className="pv-btn pv-btn-primary"
                    onClick={() => setEditingSection("workExperience")}
                  >
                    <Plus size={14} />
                    Add Experience
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bank & Profile */}
        <div className="pv-section">
          <div className="pv-section-header">
            <div className="pv-section-title">
              <div className="pv-section-icon" style={{ background: "rgba(245, 158, 11, 0.1)", color: "var(--sg-warning)" }}>
                <CreditCard size={18} />
              </div>
              Bank & Profile
            </div>
          </div>
          <div className="pv-grid">
            {/* Bank Account */}
            <div className="pv-card">
              <div className="pv-card-header">
                <div className="pv-card-title">
                  <CreditCard size={16} />
                  Bank Account
                </div>
                <div className={`pv-status-badge ${getStatusColor(verification.bankAccount?.status)}`}>
                  {getStatusIcon(verification.bankAccount?.status)}
                  {verification.bankAccount?.status || "pending"}
                </div>
              </div>
              {verification.bankAccount?.accountNumber ? (
                <div>
                  <p style={{ fontSize: "0.85rem", color: "var(--sg-muted)", marginBottom: "0.5rem" }}>
                    Account: ****{verification.bankAccount.accountNumber.slice(-4)}
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "var(--sg-muted)", marginBottom: "0.5rem" }}>
                    IFSC: {verification.bankAccount.ifsc}
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "var(--sg-muted)" }}>
                    Holder: {verification.bankAccount.holderName}
                  </p>
                  {verification.bankAccount.documentUrl && renderDocumentPreview(verification.bankAccount.documentUrl)}
                  {verification.bankAccount.rejectionReason && (
                    <p style={{ fontSize: "0.8rem", color: "var(--sg-error)", marginTop: "0.5rem" }}>
                      Reason: {verification.bankAccount.rejectionReason}
                    </p>
                  )}
                </div>
              ) : (
                <div className="pv-empty-state">
                  <CreditCard size={24} />
                  <div className="pv-empty-title">No Bank Account</div>
                  <div className="pv-empty-text">Add your bank account details</div>
                </div>
              )}
              {editingSection === "bankAccount" ? (
                <div className="pv-form">
                  <div className="pv-form-group">
                    <label className="pv-form-label">Account Number</label>
                    <input
                      type="text"
                      className="pv-form-input"
                      placeholder="Enter account number"
                      value={formData.accountNumber || ""}
                      onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                    />
                  </div>
                  <div className="pv-form-group">
                    <label className="pv-form-label">IFSC Code</label>
                    <input
                      type="text"
                      className="pv-form-input"
                      placeholder="Enter IFSC code"
                      value={formData.ifsc || ""}
                      onChange={(e) => setFormData({...formData, ifsc: e.target.value})}
                    />
                  </div>
                  <div className="pv-form-group">
                    <label className="pv-form-label">Account Holder Name</label>
                    <input
                      type="text"
                      className="pv-form-input"
                      placeholder="Enter account holder name"
                      value={formData.holderName || ""}
                      onChange={(e) => setFormData({...formData, holderName: e.target.value})}
                    />
                  </div>
                  <div className="pv-form-group">
                    <label className="pv-form-label">Upload Document (Optional)</label>
                    <div className="pv-file-upload">
                      <input
                        type="file"
                        className="pv-file-input"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && formData.accountNumber && formData.ifsc && formData.holderName) {
                            handleFileUpload(file, "bankAccount", {
                              accountNumber: formData.accountNumber,
                              ifsc: formData.ifsc,
                              holderName: formData.holderName
                            });
                          } else if (file) {
                            toast.error("Please fill in all fields first");
                          }
                        }}
                      />
                      <Upload className="pv-upload-icon" size={24} />
                      <div className="pv-upload-text">Click to upload or drag and drop</div>
                      <div className="pv-upload-hint">PDF, JPG, PNG up to 10MB</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="pv-btn pv-btn-secondary"
                      onClick={() => {
                        setEditingSection(null);
                        setFormData({});
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: "1rem" }}>
                  <button
                    className="pv-btn pv-btn-primary"
                    onClick={() => setEditingSection("bankAccount")}
                  >
                    <Plus size={14} />
                    {verification.bankAccount?.accountNumber ? "Update" : "Add"} Bank Account
                  </button>
                  {verification.bankAccount?.documentUrl && (
                    <button
                      className="pv-btn-icon danger"
                      onClick={() => handleDeleteDocument("bankAccount")}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Profile Photo */}
            <div className="pv-card">
              <div className="pv-card-header">
                <div className="pv-card-title">
                  <Camera size={16} />
                  Profile Photo
                </div>
                <div className={`pv-status-badge ${getStatusColor(verification.profilePhoto?.status)}`}>
                  {getStatusIcon(verification.profilePhoto?.status)}
                  {verification.profilePhoto?.status || "pending"}
                </div>
              </div>
              {verification.profilePhoto?.url ? (
                <div>
                  {renderDocumentPreview(verification.profilePhoto.url)}
                  {verification.profilePhoto.rejectionReason && (
                    <p style={{ fontSize: "0.8rem", color: "var(--sg-error)", marginTop: "0.5rem" }}>
                      Reason: {verification.profilePhoto.rejectionReason}
                    </p>
                  )}
                </div>
              ) : (
                <div className="pv-empty-state">
                  <Camera size={24} />
                  <div className="pv-empty-title">No Profile Photo</div>
                  <div className="pv-empty-text">Upload a profile photo</div>
                </div>
              )}
              {editingSection === "profilePhoto" ? (
                <div className="pv-form">
                  <div className="pv-form-group">
                    <label className="pv-form-label">Upload Profile Photo</label>
                    <div className="pv-file-upload">
                      <input
                        type="file"
                        className="pv-file-input"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, "profilePhoto", { url: "profile-photo" });
                          }
                        }}
                      />
                      <Upload className="pv-upload-icon" size={24} />
                      <div className="pv-upload-text">Click to upload or drag and drop</div>
                      <div className="pv-upload-hint">JPG, PNG up to 10MB</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="pv-btn pv-btn-secondary"
                      onClick={() => {
                        setEditingSection(null);
                        setFormData({});
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: "1rem" }}>
                  <button
                    className="pv-btn pv-btn-primary"
                    onClick={() => setEditingSection("profilePhoto")}
                  >
                    <Plus size={14} />
                    {verification.profilePhoto?.url ? "Update" : "Upload"} Photo
                  </button>
                  {verification.profilePhoto?.url && (
                    <button
                      className="pv-btn-icon danger"
                      onClick={() => handleDeleteDocument("profilePhoto")}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProviderVerification;
