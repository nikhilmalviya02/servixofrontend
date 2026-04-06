import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  Shield, Upload, CheckCircle, XCircle, AlertCircle,
  Camera, FileText, Phone, CreditCard, Clock, Plus
} from "lucide-react";

/* ─── Styles ─── */
const PVF_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  :root {
    --pvf-bg: #ffffff;
    --pvf-surface: #f8fafc;
    --pvf-surface2: #f1f5f9;
    --pvf-accent: #3b82f6;
    --pvf-accent2: #0ea5e9;
    --pvf-cyan: #06b6d4;
    --pvf-success: #10b981;
    --pvf-warning: #f59e0b;
    --pvf-error: #ef4444;
    --pvf-text: #1e293b;
    --pvf-muted: #64748b;
    --pvf-border: rgba(0,0,0,0.08);
    --pvf-glow: rgba(59,130,246,0.15);
  }

  * { box-sizing: border-box; }

  .pvf-root {
    font-family: 'Inter', sans-serif;
    margin-top: 4rem;
    padding: 0 1rem;
  }

  /* ── FIELD LIST ── */
  .pvf-field-list {
    background: #fff;
    border: 1px solid var(--pvf-border);
    border-radius: 22px;
    padding: 1.8rem;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
    margin-bottom: 2rem;
  }

  .pvf-field-list-head {
    display: flex; align-items: center; gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--pvf-border);
  }

  .pvf-field-list-icon {
    width: 44px; height: 44px; border-radius: 13px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    background: rgba(59,130,246,.08); border: 1px solid rgba(59,130,246,.15);
  }

  .pvf-field-list-title {
    font-family: 'Inter', sans-serif; font-weight: 700;
    font-size: 1.1rem; color: var(--pvf-text);
  }

  .pvf-field-list-sub {
    font-size: .78rem; color: var(--pvf-muted);
    margin-top: .2rem; font-weight: 400;
  }

  .pvf-field-item {
    display: flex; align-items: center; gap: 1rem;
    padding: 1.2rem; background: var(--pvf-surface);
    border: 1px solid var(--pvf-border); border-radius: 14px;
    margin-bottom: 1.5rem; transition: all .2s;
  }

  .pvf-field-item:hover {
    background: linear-gradient(135deg, rgba(59,130,246,.03) 0%, var(--pvf-surface) 100%);
    border-color: rgba(59,130,246,.2);
    transform: translateX(3px);
  }

  .pvf-field-item.completed {
    background: rgba(16,185,129,.05); border-color: rgba(16,185,129,.2);
  }

  .pvf-field-icon {
    width: 40px; height: 40px; border-radius: 11px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(59,130,246,.08); border: 1px solid rgba(59,130,246,.15);
  }

  .pvf-field-item.completed .pvf-field-icon {
    background: rgba(16,185,129,.08); border: 1px solid rgba(16,185,129,.15);
  }

  .pvf-field-info {
    flex: 1; min-width: 0;
  }

  .pvf-field-name {
    font-size: .9rem; font-weight: 600; color: var(--pvf-text);
    margin-bottom: .2rem;
  }

  .pvf-field-desc {
    font-size: .75rem; color: var(--pvf-muted);
  }

  .pvf-field-status {
    display: flex; align-items: center; gap: .5rem;
    font-size: .73rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: .02em; padding: .3rem .8rem;
    border-radius: 100px; background: var(--pvf-surface2);
    color: var(--pvf-muted); border: 1px solid var(--pvf-border);
  }

  .pvf-field-status.completed {
    background: rgba(16,185,129,.1); color: var(--pvf-success);
    border: 1px solid rgba(16,185,129,.25);
  }

  .pvf-field-action {
    display: flex; align-items: center; gap: .5rem;
    padding: .6rem 1.2rem; border-radius: 10px;
    background: var(--pvf-accent); color: #fff;
    border: none; font-size: .8rem; font-weight: 600;
    cursor: pointer; transition: all .2s;
  }

  .pvf-field-action:hover {
    background: #2563eb; transform: translateY(-1px);
  }

  .pvf-field-action.secondary {
    background: var(--pvf-surface); color: var(--pvf-text);
    border: 1px solid var(--pvf-border);
  }

  .pvf-field-action.secondary:hover {
    background: var(--pvf-surface2);
  }

  /* ── FORM MODAL ── */
  .pvf-form-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; padding: 2rem;
  }

  .pvf-form-modal {
    background: #fff; border-radius: 20px; padding: 2rem;
    max-width: 500px; width: 100%; max-height: 90vh; overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,.3);
  }

  .pvf-form-modal-head {
    display: flex; align-items: center; justify-content: flex-start;
    margin-bottom: 1.5rem; padding-bottom: 1rem;
    border-bottom: 1px solid var(--pvf-border);
  }

  .pvf-form-modal-title {
    font-family: 'Inter', sans-serif; font-weight: 700;
    font-size: 1.2rem; color: var(--pvf-text);
  }

  .pvf-form-close {
    width: 32px; height: 32px; border-radius: 8px;
    background: none; border: 1px solid var(--pvf-border);
    color: var(--pvf-muted); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all .2s;
  }

  .pvf-form-close:hover {
    background: rgba(239,68,68,.08); border-color: rgba(239,68,68,.25);
    color: var(--pvf-error);
  }

  .pvf-form-group {
    margin-bottom: 1.3rem;
  }

  .pvf-form-label {
    display: flex; align-items: center; gap: .5rem;
    font-size: .85rem; font-weight: 600; color: var(--pvf-text);
    margin-bottom: .6rem;
  }

  .pvf-form-label .required {
    color: var(--pvf-error); font-weight: 700;
  }

  .pvf-form-input,
  .pvf-form-textarea {
    width: 100%; padding: .7rem 1rem;
    background: var(--pvf-surface); border: 1px solid var(--pvf-border);
    border-radius: 11px; font-family: 'Inter', sans-serif;
    font-size: .85rem; color: var(--pvf-text);
    transition: all .2s;
  }

  .pvf-form-input:focus,
  .pvf-form-textarea:focus {
    outline: none; border-color: var(--pvf-accent);
    box-shadow: 0 0 0 3px rgba(59,130,246,.08);
    background: #fff;
  }

  .pvf-form-textarea { resize: vertical; min-height: 100px; }

  .pvf-file-upload {
    border: 2px dashed var(--pvf-border);
    border-radius: 14px; padding: 1.5rem;
    text-align: center; transition: all .2s;
    cursor: pointer; background: var(--pvf-surface);
  }

  .pvf-file-upload:hover {
    border-color: var(--pvf-accent);
    background: rgba(59,130,246,.03);
  }

  .pvf-upload-icon {
    width: 48px; height: 48px; border-radius: 12px;
    background: rgba(59,130,246,.08); border: 1px solid rgba(59,130,246,.15);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1rem;
  }

  .pvf-upload-text {
    font-size: .85rem; font-weight: 600; color: var(--pvf-text);
    margin-bottom: .4rem;
  }

  .pvf-upload-sub {
    font-size: .73rem; color: var(--pvf-muted);
    margin-bottom: 1rem;
  }

  .pvf-upload-btn {
    display: inline-flex; align-items: center; gap: .5rem;
    padding: .6rem 1.2rem; border-radius: 10px;
    background: var(--pvf-accent); color: #fff;
    border: none; font-size: .8rem; font-weight: 600;
    cursor: pointer; transition: all .2s;
  }

  .pvf-upload-btn:hover {
    background: #2563eb; transform: translateY(-1px);
  }

  .pvf-file-list {
    margin-top: 1rem; display: flex; flex-direction: column; gap: .5rem;
  }

  .pvf-file-item {
    display: flex; align-items: center; gap: .8rem;
    padding: .8rem 1rem; background: var(--pvf-surface);
    border: 1px solid var(--pvf-border); border-radius: 10px;
  }

  .pvf-file-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: rgba(59,130,246,.08); border: 1px solid rgba(59,130,246,.15);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .pvf-file-info {
    flex: 1; min-width: 0;
  }

  .pvf-file-name {
    font-size: .8rem; font-weight: 600; color: var(--pvf-text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .pvf-file-size {
    font-size: .7rem; color: var(--pvf-muted);
  }

  .pvf-file-remove {
    width: 28px; height: 28px; border-radius: 8px;
    background: none; border: 1px solid var(--pvf-border);
    color: var(--pvf-muted); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all .2s;
  }

  .pvf-file-remove:hover {
    background: rgba(239,68,68,.08); border-color: rgba(239,68,68,.25);
    color: var(--pvf-error);
  }

  .pvf-form-actions {
    display: flex; gap: 1rem; justify-content: flex-end;
    margin-top: 1.5rem; padding-top: 1.5rem;
    border-top: 1px solid var(--pvf-border);
  }

  .pvf-btn {
    display: flex; align-items: center; gap: .5rem;
    padding: .8rem 1.6rem; border-radius: 12px;
    font-family: 'Inter', sans-serif; font-weight: 600; font-size: .85rem;
    cursor: pointer; transition: all .2s; border: none;
    letter-spacing: .01em;
  }

  .pvf-btn-primary {
    background: linear-gradient(135deg, var(--pvf-accent) 0%, #60a5fa 100%);
    color: #fff; box-shadow: 0 4px 16px rgba(59,130,246,.35);
  }

  .pvf-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(59,130,246,.45);
  }

  .pvf-btn-secondary {
    background: var(--pvf-surface); color: var(--pvf-muted);
    border: 1px solid var(--pvf-border);
  }

  .pvf-btn-secondary:hover {
    background: var(--pvf-surface2); color: var(--pvf-text);
  }

  /* ── PROGRESS BAR ── */
  .pvf-progress {
    background: #fff;
    border: 1px solid var(--pvf-border);
    border-radius: 20px;
    padding: 1.5rem 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }

  .pvf-progress-head {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1rem;
  }

  .pvf-progress-title {
    font-family: 'Inter', sans-serif; font-weight: 700;
    font-size: 1rem; color: var(--pvf-text);
  }

  .pvf-progress-percentage {
    font-family: 'Inter', sans-serif; font-weight: 800;
    font-size: 1.5rem; color: var(--pvf-success);
  }

  .pvf-progress-bar {
    height: 8px; background: var(--pvf-surface2);
    border-radius: 100px; overflow: hidden;
  }

  .pvf-progress-fill {
    height: 100%; background: linear-gradient(90deg, var(--pvf-success), var(--pvf-cyan));
    border-radius: 100px; transition: width 0.5s cubic-bezier(.4,0,.2,1);
  }

  /* ── ACTIONS ── */
  .pvf-actions {
    display: flex; gap: 1rem; justify-content: flex-end;
    margin-top: 2rem; padding-top: 2rem;
    border-top: 1px solid var(--pvf-border);
  }

  /* ── LOADING ── */
  .pvf-loading {
    display: flex; align-items: center; justify-content: center;
    padding: 2rem; gap: .8rem;
  }

  .pvf-spinner {
    width: 24px; height: 24px; border-radius: 50%;
    border: 2px solid var(--pvf-surface2); border-top-color: var(--pvf-accent);
    animation: pvf-spin .7s linear infinite;
  }

  @keyframes pvf-spin { to { transform: rotate(360deg); } }
`;

function InjectPVFStyle() {
  useEffect(() => {
    if (!document.getElementById("pvf-style")) {
      const el = document.createElement("style");
      el.id = "pvf-style";
      el.textContent = PVF_STYLE;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

/* ══════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════ */
interface VerificationField {
  id: string;
  type: 'aadharCard' | 'panCard' | 'drivingLicense' | 'phoneNumber' | 'bankAccountDetails' | 'profilePhoto';
  label: string;
  description: string;
  required: boolean;
  completed: boolean;
  value: any;
  icon: React.ElementType;
  accept?: string;
  multiple?: boolean;
}

function ProviderVerificationForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  
  const [fields, setFields] = useState<VerificationField[]>([
    {
      id: 'aadharCard',
      type: 'aadharCard',
      label: 'Aadhar Card',
      description: 'Upload your Aadhar card for identity verification',
      required: true,
      completed: false,
      value: null,
      icon: FileText,
      accept: 'image/*,.pdf'
    },
    {
      id: 'panCard',
      type: 'panCard',
      label: 'PAN Card',
      description: 'Upload your PAN card for identity verification',
      required: true,
      completed: false,
      value: null,
      icon: FileText,
      accept: 'image/*,.pdf'
    },
    {
      id: 'drivingLicense',
      type: 'drivingLicense',
      label: 'Driving License',
      description: 'Upload your driving license for verification',
      required: true,
      completed: false,
      value: null,
      icon: FileText,
      accept: 'image/*,.pdf'
    },
    {
      id: 'phoneNumber',
      type: 'phoneNumber',
      label: 'Phone Number',
      description: 'Verify your phone number with OTP',
      required: true,
      completed: false,
      value: '',
      icon: Phone
    },
    {
      id: 'bankAccountDetails',
      type: 'bankAccountDetails',
      label: 'Bank Account Details',
      description: 'Upload bank statement or passbook for payment processing',
      required: true,
      completed: false,
      value: null,
      icon: CreditCard,
      accept: 'image/*,.pdf'
    },
    {
      id: 'profilePhoto',
      type: 'profilePhoto',
      label: 'Profile Photo',
      description: 'Upload a clear passport size photo',
      required: true,
      completed: false,
      value: null,
      icon: Camera,
      accept: 'image/*'
    }
  ]);

  useEffect(() => {
    // Pre-fill phone number if available
    if (user && (user as any).phone) {
      setFields(prev => prev.map(field => 
        field.id === 'phoneNumber' 
          ? { ...field, value: (user as any).phone, completed: true }
          : field
      ));
    }
  }, [user]);

  const handleFieldUpdate = (fieldId: string, value: any) => {
    setFields(prev => prev.map(field => {
      if (field.id === fieldId) {
        const completed = field.type === 'phoneNumber' 
          ? value.length > 0 
          : value !== null;
        
        return { ...field, value, completed };
      }
      return field;
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldId: string) => {
    const files = e.target.files;
    if (!files) return;
    
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;
    
    if (field.multiple) {
      // Handle multiple files
      const fileArray = Array.from(files);
      handleFieldUpdate(fieldId, [...(field.value || []), ...fileArray]);
    } else {
      // Handle single file
      const file = files[0];
      if (file) {
        handleFieldUpdate(fieldId, file);
      }
    }
  };

  const removeFile = (fieldId: string, index?: number) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;
    
    if (field.multiple && index !== undefined) {
      const newFiles = field.value.filter((_: any, i: number) => i !== index);
      handleFieldUpdate(fieldId, newFiles);
    } else {
      handleFieldUpdate(fieldId, null);
    }
  };

  const calculateProgress = () => {
    const requiredFields = fields.filter(f => f.required);
    const completedRequired = requiredFields.filter(f => f.completed);
    return requiredFields.length > 0 ? Math.round((completedRequired.length / requiredFields.length) * 100) : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem("token");
      
      // Upload each file individually and handle phone number
      const uploadPromises = fields.map(async (field) => {
        if (field.type === 'phoneNumber' && field.value) {
          // Handle phone number submission
          return axios.post(
            "https://servixobackend.vercel.app/api/provider/verification/phone/send-otp",
            { phoneNumber: field.value },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else if (field.value && field.value instanceof File) {
          // Handle single file upload
          const formData = new FormData();
          formData.append('file', field.value);
          
          return axios.post(
            `https://servixobackend.vercel.app/api/provider/verification/upload/${field.id}`,
            formData,
            { 
              headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            }
          );
        } else if (field.value && Array.isArray(field.value) && field.value.length > 0) {
          // Handle multiple files (if any field supports it)
          const uploadPromises = field.value.map((file: File) => {
            const formData = new FormData();
            formData.append('file', file);
            
            return axios.post(
              `https://servixobackend.vercel.app/api/provider/verification/upload/${field.id}`,
              formData,
              { 
                headers: { 
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'multipart/form-data'
                }
              }
            );
          });
          
          return Promise.all(uploadPromises);
        }
        return Promise.resolve();
      });
      
      // Wait for all uploads to complete
      await Promise.all(uploadPromises);
      
      // Submit final verification
      const finalSubmissionData = new FormData();
      fields.forEach(field => {
        if (field.type === 'phoneNumber') {
          finalSubmissionData.append('phoneNumber', field.value);
        }
      });
      
      await axios.post(
        "https://servixobackend.vercel.app/api/provider/verification", 
        finalSubmissionData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      toast.success("Verification submitted successfully!");
      navigate("/provider");
    } catch (error: any) {
      console.error("Verification submission error:", error);
      toast.error(error.response?.data?.message || "Failed to submit verification");
    } finally {
      setSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const renderFieldModal = (field: VerificationField) => {
    if (!activeField || activeField !== field.id) return null;

    const Icon = field.icon;

    return (
      <div className="pvf-form-overlay" onClick={() => setActiveField(null)}>
        <div className="pvf-form-modal" onClick={(e) => e.stopPropagation()}>
          <div className="pvf-form-modal-head">
            <div className="pvf-form-modal-title">
              <Icon size={20} style={{ color: "var(--pvf-accent)", marginRight: ".5rem" }} />
              {field.label}
            </div>
          </div>

          {field.type === 'phoneNumber' ? (
            <div className="pvf-form-group">
              <label className="pvf-form-label">
                Phone Number <span className="required">*</span>
              </label>
              <input
                type="tel"
                value={field.value}
                onChange={(e) => handleFieldUpdate(field.id, e.target.value)}
                className="pvf-form-input"
                placeholder="+91 98765 43210"
              />
              <div className="pvf-form-hint">
                <AlertCircle size={12} />
                We will send an OTP to verify this number
              </div>
            </div>
          ) : (
            <div className="pvf-form-group">
              <label className="pvf-form-label">
                {field.label} {field.required && <span className="required">*</span>}
              </label>
              <div className="pvf-file-upload">
                <input
                  type="file"
                  accept={field.accept}
                  multiple={field.multiple}
                  onChange={(e) => handleFileUpload(e, field.id)}
                  style={{ display: 'none' }}
                  id={`file-${field.id}`}
                />
                <label htmlFor={`file-${field.id}`} style={{ cursor: 'pointer' }}>
                  <div className="pvf-upload-icon">
                    <Upload size={20} style={{ color: "var(--pvf-accent)" }} />
                  </div>
                  <div className="pvf-upload-text">
                    {field.multiple 
                      ? (field.value?.length > 0 
                          ? `${field.value.length} files selected` 
                          : `Choose ${field.label} files`)
                      : (field.value?.name || `Choose ${field.label} file`)
                    }
                  </div>
                  <div className="pvf-upload-sub">
                    {field.multiple ? 'Multiple files allowed' : 'Single file'} (PDF/JPG/PNG)
                  </div>
                  <button type="button" className="pvf-upload-btn">
                    <Upload size={14} /> Choose Files
                  </button>
                </label>
              </div>
              
              {/* Show uploaded files */}
              {field.value && (
                <div className="pvf-file-list">
                  {field.multiple ? (
                    (field.value as File[]).map((file: File, index: number) => (
                      <div key={index} className="pvf-file-item">
                        <div className="pvf-file-icon">
                          <FileText size={14} style={{ color: "var(--pvf-accent)" }} />
                        </div>
                        <div className="pvf-file-info">
                          <div className="pvf-file-name">{file.name}</div>
                          <div className="pvf-file-size">{formatFileSize(file.size)}</div>
                        </div>
                        <button
                          type="button"
                          className="pvf-file-remove"
                          onClick={() => removeFile(field.id, index)}
                        >
                          <XCircle size={14} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="pvf-file-item">
                      <div className="pvf-file-icon">
                        <FileText size={14} style={{ color: "var(--pvf-accent)" }} />
                      </div>
                      <div className="pvf-file-info">
                        <div className="pvf-file-name">{(field.value as File).name}</div>
                        <div className="pvf-file-size">{formatFileSize((field.value as File).size)}</div>
                      </div>
                      <button
                        type="button"
                        className="pvf-file-remove"
                        onClick={() => removeFile(field.id)}
                      >
                        <XCircle size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="pvf-form-actions">
            <button
              type="button"
              className="pvf-btn pvf-btn-secondary"
              onClick={() => setActiveField(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="pvf-btn pvf-btn-primary"
              onClick={() => setActiveField(null)}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <InjectPVFStyle />
      <div className="pvf-root">
        
        {/* Progress Bar */}
        <div className="pvf-progress">
          <div className="pvf-progress-head">
            <div className="pvf-progress-title">Verification Progress</div>
            <div className="pvf-progress-percentage">{calculateProgress()}%</div>
          </div>
          <div className="pvf-progress-bar">
            <div className="pvf-progress-fill" style={{ width: `${calculateProgress()}%` }} />
          </div>
        </div>

        {/* Field List */}
        <div className="pvf-field-list">
          <div className="pvf-field-list-head">
            <div className="pvf-field-list-icon">
              <Shield size={20} style={{ color: "var(--pvf-accent)" }} />
            </div>
            <div>
              <div className="pvf-field-list-title">Verification Documents</div>
              <div className="pvf-field-list-sub">Complete each verification step by step</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.id} className={`pvf-field-item ${field.completed ? 'completed' : ''}`}>
                  <div className="pvf-field-icon">
                    <Icon size={18} style={{ color: field.completed ? "var(--pvf-success)" : "var(--pvf-accent)" }} />
                  </div>
                  <div className="pvf-field-info">
                    <div className="pvf-field-name">{field.label}</div>
                    <div className="pvf-field-desc">{field.description}</div>
                  </div>
                  <div className={`pvf-field-status ${field.completed ? 'completed' : ''}`}>
                    {field.completed ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {field.completed ? 'Completed' : 'Pending'}
                  </div>
                  <button
                    className={`pvf-field-action ${field.completed ? 'secondary' : ''}`}
                    onClick={() => setActiveField(field.id)}
                  >
                    {field.completed ? 'Update' : <><Plus size={14} /> Add</>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <form onSubmit={handleSubmit}>
          <div className="pvf-actions">
            <button
              type="button"
              className="pvf-btn pvf-btn-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="pvf-btn pvf-btn-primary"
              disabled={submitting || calculateProgress() < 100}
            >
              {submitting ? (
                <>
                  <div className="pvf-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                  Submitting...
                </>
              ) : (
                <>
                  <Shield size={16} />
                  Submit Verification
                </>
              )}
            </button>
          </div>
        </form>

        {/* Render active field modal */}
        {fields.map(field => renderFieldModal(field))}
      </div>
    </>
  );
}

export default ProviderVerificationForm;
