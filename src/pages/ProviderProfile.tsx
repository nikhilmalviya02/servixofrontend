import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Mail, Star, Briefcase, BadgeCheck } from "lucide-react";

/* ─── Styles ─── */
const PP_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    --sg-bg: #0a0a0f;
    --sg-surface: #12121a;
    --sg-surface2: #1a1a26;
    --sg-accent: #ff6b35;
    --sg-accent2: #ffbe0b;
    --sg-text: #f0f0f8;
    --sg-muted: #888899;
    --sg-border: rgba(255,255,255,0.07);
    --sg-glow: rgba(255,107,53,0.22);
  }

  .pp-root {
    min-height: 100vh;
    background: var(--sg-bg);
    color: var(--sg-text);
    font-family: 'DM Sans', sans-serif;
    padding: 5.5rem 5% 4rem;
    position: relative;
  }
  .pp-root::before {
    content: '';
    position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 80% 10%, rgba(255,107,53,.11) 0%, transparent 60%),
      radial-gradient(ellipse 50% 45% at 5%  85%, rgba(0,212,255,.07)  0%, transparent 60%);
    pointer-events: none; z-index: 0;
  }

  .pp-wrap { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; }

  /* ── LOADING ── */
  .pp-loading {
    display: flex; align-items: center; justify-content: center;
    min-height: 60vh;
  }
  .pp-spinner {
    width: 36px; height: 36px; border-radius: 50%;
    border: 3px solid rgba(255,107,53,.2);
    border-top-color: var(--sg-accent);
    animation: pp-spin .7s linear infinite;
  }
  @keyframes pp-spin { to { transform: rotate(360deg); } }

  /* ── PROVIDER HERO CARD ── */
  .pp-hero {
    background: var(--sg-surface);
    border: 1px solid var(--sg-border);
    border-radius: 24px;
    padding: 2rem 2.2rem;
    margin-bottom: 1.8rem;
    display: flex;
    align-items: center;
    gap: 1.8rem;
    flex-wrap: wrap;
    position: relative;
    overflow: hidden;
  }
  .pp-hero::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 80% at 0% 50%, rgba(255,107,53,.07) 0%, transparent 60%);
    pointer-events: none;
  }

  .pp-avatar {
    width: 80px; height: 80px; border-radius: 50%; flex-shrink: 0;
    background: rgba(255,107,53,.15);
    border: 2px solid rgba(255,107,53,.35);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 2rem;
    color: var(--sg-accent);
    position: relative; z-index: 1;
  }

  .pp-hero-info { flex: 1; min-width: 0; position: relative; z-index: 1; }

  .pp-name-row { display: flex; align-items: center; gap: .75rem; flex-wrap: wrap; }
  .pp-name {
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: clamp(1.3rem, 3vw, 1.8rem);
    letter-spacing: -.5px; color: var(--sg-text);
  }
  .pp-verified {
    display: inline-flex; align-items: center; gap: .35rem;
    background: rgba(74,222,128,.1); border: 1px solid rgba(74,222,128,.25);
    border-radius: 100px; padding: .25rem .75rem;
    font-size: .72rem; font-weight: 700; color: #4ade80;
  }

  .pp-email {
    display: flex; align-items: center; gap: .45rem;
    color: var(--sg-muted); font-size: .85rem; margin-top: .5rem;
  }

  .pp-hero-stats {
    display: flex; gap: 1.2rem; flex-wrap: wrap;
    position: relative; z-index: 1;
  }
  .pp-hero-stat {
    background: rgba(255,255,255,.04);
    border: 1px solid var(--sg-border);
    border-radius: 14px; padding: .8rem 1.2rem;
    text-align: center; min-width: 80px;
  }
  .pp-hero-stat-val {
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 1.3rem; color: var(--sg-text);
  }
  .pp-hero-stat-val span { color: var(--sg-accent); }
  .pp-hero-stat-label { font-size: .65rem; color: var(--sg-muted); margin-top: .15rem; letter-spacing: .4px; text-transform: uppercase; }

  /* ── SECTION HEADER ── */
  .pp-section-head { display: flex; align-items: center; gap: .75rem; margin-bottom: 1.4rem; }
  .pp-section-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(255,107,53,.1); border: 1px solid rgba(255,107,53,.2);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .pp-section-title {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 1.1rem; letter-spacing: -.3px; color: var(--sg-text);
  }

  /* ── SERVICE CARDS ── */
  .pp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap: 1.1rem; }

  .pp-srv-card {
    background: var(--sg-surface); border: 1px solid var(--sg-border);
    border-radius: 20px; overflow: hidden;
    transition: transform .3s, border-color .3s, box-shadow .3s;
  }
  .pp-srv-card:hover { transform: translateY(-5px); border-color: rgba(255,107,53,.25); box-shadow: 0 12px 36px rgba(0,0,0,.4); }

  .pp-srv-img { height: 160px; overflow: hidden; position: relative; background: var(--sg-surface2); }
  .pp-srv-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s; }
  .pp-srv-card:hover .pp-srv-img img { transform: scale(1.07); }
  .pp-srv-img-placeholder {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    font-size: 3.5rem;
    background: linear-gradient(135deg, #1a1a26, #0a0a0f);
  }

  .pp-srv-body { padding: 1.1rem 1.3rem; }
  .pp-srv-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: .95rem; color: var(--sg-text); margin-bottom: .6rem; }

  .pp-srv-rating {
    display: flex; align-items: center; gap: .4rem; margin-bottom: .5rem;
  }
  .pp-rating-chip {
    display: flex; align-items: center; gap: .28rem;
    background: rgba(255,190,11,.1); border: 1px solid rgba(255,190,11,.2);
    border-radius: 100px; padding: .2rem .6rem;
    font-size: .75rem; font-weight: 700; color: var(--sg-accent2);
  }
  .pp-review-count { font-size: .73rem; color: var(--sg-muted); }

  .pp-srv-price {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 1.05rem; color: var(--sg-accent);
  }

  /* empty services */
  .pp-empty {
    text-align: center; padding: 3.5rem 2rem;
    background: rgba(255,255,255,.02);
    border: 1px dashed var(--sg-border);
    border-radius: 18px;
  }
  .pp-empty-icon { color: var(--sg-muted); margin-bottom: .7rem; }
  .pp-empty h4 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: .92rem; color: var(--sg-text); }
  .pp-empty p  { font-size: .78rem; color: var(--sg-muted); margin-top: .3rem; }
`;

function InjectPPStyle() {
  useEffect(() => {
    if (!document.getElementById("pp-style")) {
      const el = document.createElement("style");
      el.id = "pp-style";
      el.textContent = PP_STYLE;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

/* ══════════════════════════════
   COMPONENT
══════════════════════════════ */
function ProviderProfile() {
  const { id }  = useParams();
  const [provider, setProvider] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(`https://servixobackend.vercel.app/api/user/provider/${id}`)
      .then((res) => { setProvider(res.data.provider); setServices(res.data.services); })
      .catch((err) => console.log(err));
  }, [id]);

  if (!provider) return (
    <>
      <InjectPPStyle />
      <div className="pp-root">
        <div className="pp-loading"><div className="pp-spinner" /></div>
      </div>
    </>
  );

  const avgRating = services.length > 0
    ? (services.reduce((a, s) => a + (s.averageRating || 0), 0) / services.length).toFixed(1)
    : "0.0";

  const totalReviews = services.reduce((a, s) => a + (s.totalReviews || 0), 0);

  /* emoji fallback per category */
  const categoryEmoji: Record<string, string> = {
    Cleaning:"🧹", Plumbing:"🔧", Electrical:"⚡", "AC Repair":"❄️",
    Painting:"🎨", Carpentry:"🔨", Gardening:"🪴", "Vehicle Care":"🚗",
  };

  return (
    <>
      <InjectPPStyle />
      <div className="pp-root">
        <div className="pp-wrap">

          {/* ── PROVIDER HERO ── */}
          <div className="pp-hero">
            <div className="pp-avatar">
              {provider.name?.charAt(0).toUpperCase()}
            </div>

            <div className="pp-hero-info">
              <div className="pp-name-row">
                <span className="pp-name">{provider.name}</span>
                {provider.isVerified && (
                  <span className="pp-verified">
                    <BadgeCheck size={13} /> Verified Provider
                  </span>
                )}
              </div>
              <div className="pp-email">
                <Mail size={13} /> {provider.email}
              </div>
            </div>

            {/* stats */}
            <div className="pp-hero-stats">
              <div className="pp-hero-stat">
                <div className="pp-hero-stat-val">{services.length}<span>+</span></div>
                <div className="pp-hero-stat-label">Services</div>
              </div>
              <div className="pp-hero-stat">
                <div className="pp-hero-stat-val">{avgRating}<span>★</span></div>
                <div className="pp-hero-stat-label">Avg Rating</div>
              </div>
              <div className="pp-hero-stat">
                <div className="pp-hero-stat-val">{totalReviews}<span>+</span></div>
                <div className="pp-hero-stat-label">Reviews</div>
              </div>
            </div>
          </div>

          {/* ── SERVICES ── */}
          <div className="pp-section-head">
            <div className="pp-section-icon">
              <Briefcase size={17} style={{ color:"#ff6b35" }} />
            </div>
            <div className="pp-section-title">Services Offered</div>
          </div>

          {services.length === 0 ? (
            <div className="pp-empty">
              <div className="pp-empty-icon"><Briefcase size={32} /></div>
              <h4>No services listed</h4>
              <p>This provider hasn't added any services yet</p>
            </div>
          ) : (
            <div className="pp-grid">
              {services.map((s) => (
                <div key={s._id} className="pp-srv-card">
                  <div className="pp-srv-img">
                    {s.image ? (
                      <img src={s.image} alt={s.title} />
                    ) : (
                      <div className="pp-srv-img-placeholder">
                        {categoryEmoji[s.category] ?? "🛠️"}
                      </div>
                    )}
                  </div>
                  <div className="pp-srv-body">
                    <div className="pp-srv-title">{s.title}</div>
                    <div className="pp-srv-rating">
                      <div className="pp-rating-chip">
                        <Star size={11} style={{ fill:"#ffbe0b", color:"#ffbe0b" }} />
                        {s.averageRating?.toFixed(1) ?? "0.0"}
                      </div>
                      <span className="pp-review-count">({s.totalReviews || 0} reviews)</span>
                    </div>
                    <div className="pp-srv-price">₹{s.price}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default ProviderProfile;