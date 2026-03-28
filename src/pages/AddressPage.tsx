import { useEffect } from "react";
import AddressManager from "../components/AddressManager";
import { MapPin } from "lucide-react";

/* ─── Dark theme styles ─── */
const AP_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    --sg-bg: #0a0a0f;
    --sg-surface: #12121a;
    --sg-accent: #ff6b35;
    --sg-text: #f0f0f8;
    --sg-muted: #888899;
    --sg-border: rgba(255,255,255,0.07);
  }

  .ap-root {
    min-height: 100vh;
    background: var(--sg-bg);
    color: var(--sg-text);
    font-family: 'DM Sans', sans-serif;
    padding: 6rem 5% 4rem;
    position: relative;
  }

  /* mesh bg */
  .ap-root::before {
    content: '';
    position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 55% 45% at 80% 10%, rgba(255,107,53,.1) 0%, transparent 60%),
      radial-gradient(ellipse 45% 40% at 10% 80%, rgba(0,212,255,.06) 0%, transparent 60%);
    pointer-events: none; z-index: 0;
  }

  .ap-wrap {
    position: relative; z-index: 1;
    max-width: 860px; margin: 0 auto;
  }

  /* ── page header ── */
  .ap-header {
    display: flex; align-items: center; gap: 1rem;
    margin-bottom: 2rem;
  }
  .ap-header-icon {
    width: 48px; height: 48px; border-radius: 14px;
    background: rgba(255,107,53,.12);
    border: 1px solid rgba(255,107,53,.25);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .ap-page-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: clamp(1.5rem, 3vw, 2rem);
    letter-spacing: -1px; color: var(--sg-text);
  }
  .ap-page-sub {
    color: var(--sg-muted); font-size: .85rem; margin-top: .15rem;
  }

  /* ── card wrapper for AddressManager ── */
  .ap-card {
    background: var(--sg-surface);
    border: 1px solid var(--sg-border);
    border-radius: 22px;
    padding: 1.8rem;
  }
`;

function InjectAPStyle() {
  useEffect(() => {
    if (!document.getElementById("ap-style")) {
      const el = document.createElement("style");
      el.id = "ap-style";
      el.textContent = AP_STYLE;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

function AddressPage() {
  return (
    <>
      <InjectAPStyle />
      <div className="ap-root">
        <div className="ap-wrap">

          {/* Header */}
          <div className="ap-header">
            <div className="ap-header-icon">
              <MapPin size={22} style={{ color: "#ff6b35" }} />
            </div>
            <div>
              <h1 className="ap-page-title">My Addresses</h1>
              <p className="ap-page-sub">Manage your saved delivery addresses</p>
            </div>
          </div>

          {/* AddressManager wrapped in dark card */}
          <div className="ap-card">
            <AddressManager />
          </div>

        </div>
      </div>
    </>
  );
}

export default AddressPage;