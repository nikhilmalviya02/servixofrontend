import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import ProviderVerification from "../components/ProviderVerification";
import ProviderVerificationForm from "../components/ProviderVerificationForm";
import {
  ArrowLeft, Shield, CheckCircle, AlertCircle,
  Clock
} from "lucide-react";

/* ─── Styles ─── */
const PVP_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

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

  .pvp-root {
    min-height: 100vh;
    background: var(--sg-bg);
    color: var(--sg-text);
    font-family: 'Inter', sans-serif;
    padding: 5.5rem 5% 4rem;
    position: relative;
  }

  .pvp-root::before {
    content: '';
    position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 70% 55% at 90% 5%, rgba(59,130,246,.07) 0%, transparent 65%),
      radial-gradient(ellipse 55% 50% at 5% 90%, rgba(14,165,233,.05) 0%, transparent 65%);
    pointer-events: none; z-index: 0;
  }

  .pvp-wrap { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; }

  /* ── HEADER ── */
  .pvp-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
    padding: 1.8rem 2.2rem;
    background: linear-gradient(135deg, #fff 0%, var(--sg-surface) 100%);
    border: 1px solid var(--sg-border);
    border-radius: 20px;
    box-shadow: 0 2px 12px rgba(0,0,0,.05);
  }

  .pvp-back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.2rem;
    border-radius: 10px;
    background: var(--sg-surface);
    border: 1px solid var(--sg-border);
    color: var(--sg-text);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .pvp-back-btn:hover {
    background: var(--sg-surface2);
    transform: translateY(-1px);
  }

  .pvp-header-content {
    flex: 1;
  }

  .pvp-title {
    font-family: 'Inter', sans-serif;
    font-weight: 800;
    font-size: clamp(1.5rem, 3vw, 2rem);
    color: var(--sg-text);
    margin-bottom: 0.5rem;
  }

  .pvp-subtitle {
    color: var(--sg-muted);
    font-size: 0.95rem;
  }

  /* ── STATS BAR ── */
  .pvp-stats-bar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .pvp-stat-card {
    background: #fff;
    border: 1px solid var(--sg-border);
    border-radius: 16px;
    padding: 1.5rem;
    text-align: center;
    transition: all 0.2s ease;
  }

  .pvp-stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  }

  .pvp-stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
  }

  .pvp-stat-value {
    font-size: 2rem;
    font-weight: 800;
    color: var(--sg-text);
    margin-bottom: 0.5rem;
  }

  .pvp-stat-label {
    font-size: 0.85rem;
    color: var(--sg-muted);
    font-weight: 500;
  }

  /* ── ALERTS ── */
  .pvp-alert {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
  }

  .pvp-alert-info {
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.2);
    color: var(--sg-accent);
  }

  .pvp-alert-success {
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.2);
    color: var(--sg-success);
  }

  .pvp-alert-warning {
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.2);
    color: var(--sg-warning);
  }

  .pvp-alert-icon {
    flex-shrink: 0;
  }

  .pvp-alert-content {
    flex: 1;
  }

  .pvp-alert-title {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .pvp-alert-text {
    font-size: 0.9rem;
    opacity: 0.9;
  }

  /* ── LOADING ── */
  .pvp-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    color: var(--sg-muted);
  }

  .pvp-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--sg-surface2);
    border-top-color: var(--sg-accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 1rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

function InjectPVPStyle() {
  useEffect(() => {
    if (!document.getElementById("pvp-style")) {
      const el = document.createElement("style");
      el.id = "pvp-style";
      el.textContent = PVP_STYLE;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

interface VerificationStats {
  total: number;
  verified: number;
  pending: number;
  rejected: number;
  percentage: number;
}

function ProviderVerificationPage() {
  const [stats, setStats] = useState<VerificationStats>({
    total: 7,
    verified: 0,
    pending: 0,
    rejected: 0,
    percentage: 0
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVerificationStats();
  }, []);

  const fetchVerificationStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://servixobackend.vercel.app/api/provider/verification",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const verification = response.data.verification || {};
      const calculatedStats = calculateStats(verification);
      setStats(calculatedStats);
    } catch (error) {
      toast.error("Failed to load verification stats");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (verification: any): VerificationStats => {
    const sections = [
      verification.aadharCard,
      verification.panCard,
      verification.drivingLicense,
      verification.phone,
      verification.bankAccount,
      verification.profilePhoto,
      ...(verification.skillCertificates || []),
      ...(verification.workExperience || [])
    ];

    const verified = sections.filter(s => s && s.status === "verified").length;
    const pending = sections.filter(s => s && s.status === "pending").length;
    const rejected = sections.filter(s => s && s.status === "rejected").length;
    const total = sections.length;

    return {
      total,
      verified,
      pending,
      rejected,
      percentage: total > 0 ? Math.round((verified / total) * 100) : 0
    };
  };

  const getAlertType = () => {
    if (stats.percentage === 100) return "success";
    if (stats.percentage >= 50) return "warning";
    return "info";
  };

  const getAlertMessage = () => {
    if (stats.percentage === 100) {
      return {
        title: "Verification Complete! 🎉",
        text: "Your profile is fully verified. You now have access to all platform features."
      };
    }
    if (stats.percentage >= 50) {
      return {
        title: "Almost There!",
        text: `You're ${stats.percentage}% verified. Complete the remaining verifications to unlock full benefits.`
      };
    }
    return {
      title: "Start Your Verification Journey",
      text: "Complete your profile verification to build trust with customers and increase your booking potential."
    };
  };

  const alert = getAlertMessage();
  const alertType = getAlertType();

  if (loading) {
    return (
      <>
        <InjectPVPStyle />
        <div className="pvp-root">
          <div className="pvp-wrap">
            <div className="pvp-loading">
              <div className="pvp-spinner" />
              <h2>Loading verification data...</h2>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <InjectPVPStyle />
      <div className="pvp-root">
        <div className="pvp-wrap">
          {/* Header */}
          <div className="pvp-header">
            <Link to="/provider/dashboard" className="pvp-back-btn">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
            <div className="pvp-header-content">
              <h1 className="pvp-title">Provider Verification</h1>
              <p className="pvp-subtitle">Complete your verification to build trust and unlock more opportunities</p>
            </div>
          </div>

          {/* Alert */}
          <div className={`pvp-alert pvp-alert-${alertType}`}>
            <div className="pvp-alert-icon">
              {alertType === "success" && <CheckCircle size={24} />}
              {alertType === "warning" && <AlertCircle size={24} />}
              {alertType === "info" && <AlertCircle size={24} />}
            </div>
            <div className="pvp-alert-content">
              <div className="pvp-alert-title">{alert.title}</div>
              <div className="pvp-alert-text">{alert.text}</div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="pvp-stats-bar">
            <div className="pvp-stat-card">
              <div className="pvp-stat-icon" style={{ background: "rgba(59, 130, 246, 0.1)", color: "var(--sg-accent)" }}>
                <Shield size={24} />
              </div>
              <div className="pvp-stat-value">{stats.percentage}%</div>
              <div className="pvp-stat-label">Complete</div>
            </div>
            <div className="pvp-stat-card">
              <div className="pvp-stat-icon" style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--sg-success)" }}>
                <CheckCircle size={24} />
              </div>
              <div className="pvp-stat-value">{stats.verified}</div>
              <div className="pvp-stat-label">Verified</div>
            </div>
            <div className="pvp-stat-card">
              <div className="pvp-stat-icon" style={{ background: "rgba(245, 158, 11, 0.1)", color: "var(--sg-warning)" }}>
                <Clock size={24} />
              </div>
              <div className="pvp-stat-value">{stats.pending}</div>
              <div className="pvp-stat-label">Pending</div>
            </div>
            <div className="pvp-stat-card">
              <div className="pvp-stat-icon" style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--sg-error)" }}>
                <AlertCircle size={24} />
              </div>
              <div className="pvp-stat-value">{stats.rejected}</div>
              <div className="pvp-stat-label">Rejected</div>
            </div>
          </div>

          {/* Verification Form Component */}
          <ProviderVerificationForm />
        </div>
      </div>
    </>
  );
}

export default ProviderVerificationPage;
