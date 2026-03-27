import { Link, NavLink } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Home,
  Grid3X3,
  LayoutDashboard,
  CalendarDays,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const NAVBAR_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    --sg-bg: #0a0a0f;
    --sg-surface: #12121a;
    --sg-surface2: #1a1a26;
    --sg-accent: #ff6b35;
    --sg-text: #f0f0f8;
    --sg-muted: #888899;
    --sg-border: rgba(255,255,255,0.07);
    --sg-glow: rgba(255,107,53,0.25);
  }

  .nb-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    font-family: 'DM Sans', sans-serif;
    background: rgba(10,10,15,.88);
    backdrop-filter: blur(22px);
    border-bottom: 1px solid var(--sg-border);
    box-shadow: 0 4px 32px rgba(0,0,0,.4);
  }

  .nb-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 clamp(16px, 3vw, 40px);
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  /* ── logo ── */
  .nb-logo {
    display: flex; align-items: center; gap: .5rem;
    text-decoration: none;
  }
  /* wrapper span — display:inline removes whitespace between text nodes */
  .nb-logo-text {
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 1.55rem;
    letter-spacing: -1px;
    color: #ffffff;
    white-space: nowrap;
    display: inline;
    line-height: 1;
  }
  .nb-logo-text > span {
    color: var(--sg-accent);
  }

  .nb-logo-icon {
    width: 34px; height: 34px; border-radius: 10px;
    background: rgba(255,107,53,.15);
    border: 1px solid rgba(255,107,53,.3);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: background .2s;
  }
  .nb-logo:hover .nb-logo-icon { background: rgba(255,107,53,.25); }

  /* ── desktop links ── */
  .nb-links {
    display: none;
    align-items: center;
    gap: .25rem;
    margin-left: auto;
  }
  @media(min-width:768px){ .nb-links { display:flex; } }

  .nb-link {
    display: flex; align-items: center; gap: .45rem;
    padding: .45rem .9rem;
    border-radius: 100px;
    font-size: .85rem; font-weight: 500;
    text-decoration: none;
    color: var(--sg-muted);
    transition: color .2s, background .2s;
    white-space: nowrap;
  }
  .nb-link:hover { color: var(--sg-text); background: rgba(255,255,255,.05); }
  .nb-link.active { color: var(--sg-accent); background: rgba(255,107,53,.1); font-weight: 600; }

  .nb-sep { width: 1px; height: 22px; background: var(--sg-border); margin: 0 .5rem; }

  .nb-signin {
    display: flex; align-items: center; gap: .4rem;
    padding: .45rem .95rem; border-radius: 100px;
    font-size: .85rem; font-weight: 500;
    text-decoration: none; color: var(--sg-muted);
    transition: color .2s, background .2s;
  }
  .nb-signin:hover { color: var(--sg-text); background: rgba(255,255,255,.05); }

  .nb-cta {
    display: flex; align-items: center; gap: .4rem;
    padding: .48rem 1.2rem; border-radius: 100px;
    font-size: .85rem; font-weight: 600;
    text-decoration: none; background: var(--sg-accent); color: #fff;
    box-shadow: 0 0 18px var(--sg-glow);
    transition: background .2s, transform .15s, box-shadow .2s;
    white-space: nowrap;
  }
  .nb-cta:hover { background: #ff855a; transform: translateY(-1px); box-shadow: 0 4px 24px rgba(255,107,53,.45); }

  .nb-user {
    display: flex; align-items: center; gap: .6rem;
    padding: .3rem .3rem .3rem .8rem; border-radius: 100px;
    background: rgba(255,255,255,.04); border: 1px solid var(--sg-border);
  }
  .nb-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(255,107,53,.2); border: 1.5px solid rgba(255,107,53,.4);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: .82rem; color: var(--sg-accent);
  }
  .nb-username { font-size: .82rem; font-weight: 500; color: var(--sg-text); max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .nb-logout {
    width: 30px; height: 30px; border-radius: 50%;
    background: none; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--sg-muted); transition: color .2s, background .2s;
  }
  .nb-logout:hover { color: #ff6b6b; background: rgba(255,107,107,.1); }

  .nb-toggle {
    display: flex; align-items: center; justify-content: center;
    width: 38px; height: 38px; border-radius: 10px;
    background: rgba(255,255,255,.04); border: 1px solid var(--sg-border);
    color: var(--sg-muted); cursor: pointer; transition: color .2s, background .2s;
  }
  .nb-toggle:hover { color: var(--sg-text); background: rgba(255,255,255,.08); }
  @media(min-width:768px){ .nb-toggle { display:none; } }

  /* ── mobile drawer ── */
  .nb-drawer {
    display: block;
    background: rgba(10,10,15,.97); backdrop-filter: blur(24px);
    border-top: 1px solid var(--sg-border); border-bottom: 1px solid var(--sg-border);
    padding: 1rem 5% 1.4rem;
  }
  @media(min-width:768px){ .nb-drawer { display:none !important; } }

  .nb-drawer-link {
    display: flex; align-items: center; gap: .75rem;
    padding: .8rem 1rem; border-radius: 12px;
    text-decoration: none; color: var(--sg-muted);
    font-size: .9rem; font-weight: 500;
    transition: color .2s, background .2s; margin-bottom: .25rem;
  }
  .nb-drawer-link:hover  { color: var(--sg-text); background: rgba(255,255,255,.05); }
  .nb-drawer-link.active { color: var(--sg-accent); background: rgba(255,107,53,.08); font-weight: 600; }

  .nb-drawer-sep { height: 1px; background: var(--sg-border); margin: .7rem 0; }

  .nb-drawer-cta {
    display: flex; align-items: center; justify-content: center; gap: .5rem;
    width: 100%; padding: .82rem; border-radius: 12px;
    background: var(--sg-accent); color: #fff;
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: .92rem;
    border: none; cursor: pointer; text-decoration: none;
    box-shadow: 0 0 20px var(--sg-glow); transition: background .2s; margin-top: .4rem;
  }
  .nb-drawer-cta:hover { background: #ff855a; }

  .nb-drawer-logout {
    display: flex; align-items: center; gap: .75rem;
    width: 100%; padding: .8rem 1rem; border-radius: 12px;
    background: none; border: none; cursor: pointer;
    color: #ff6b6b; font-family:'DM Sans',sans-serif;
    font-size: .9rem; font-weight: 500; transition: background .2s; margin-top: .25rem;
  }
  .nb-drawer-logout:hover { background: rgba(255,107,107,.08); }

  .nb-drawer-user {
    display: flex; align-items: center; gap: .75rem;
    padding: .8rem 1rem;
    background: rgba(255,255,255,.03); border: 1px solid var(--sg-border);
    border-radius: 12px; margin-bottom: .7rem;
  }
  .nb-drawer-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: rgba(255,107,53,.15); border: 1.5px solid rgba(255,107,53,.3);
    display: flex; align-items: center; justify-content: center;
    font-family:'Syne',sans-serif; font-weight:800; font-size:.9rem;
    color: var(--sg-accent); flex-shrink:0;
  }
  .nb-drawer-uname { font-size:.9rem; font-weight:600; color:var(--sg-text); }
  .nb-drawer-urole  { font-size:.72rem; color:var(--sg-muted); text-transform:capitalize; }
`;

function InjectNavbarStyle() {
  useEffect(() => {
    if (!document.getElementById("nb-style")) {
      const el = document.createElement("style");
      el.id = "nb-style";
      el.textContent = NAVBAR_STYLE;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

function Navbar() {
  const { user, logout }: any = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    logout();
    localStorage.removeItem("role");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);
  const showHome = !user || role === "user";

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `nb-link${isActive ? " active" : ""}`;
  const drawerLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nb-drawer-link${isActive ? " active" : ""}`;

  const avatarLetter = user?.name
    ? user.name.charAt(0).toUpperCase()
    : role?.charAt(0).toUpperCase() ?? "U";

  return (
    <>
      <InjectNavbarStyle />
      <nav className="nb-nav">
        <div className="nb-inner">

          {/* Logo — .nb-logo-text with display:inline removes whitespace gap */}
          <Link to={user ? "/home" : "/"} className="nb-logo" onClick={closeMenu}>
            <span className="nb-logo-text">Servexa<span>Go</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="nb-links">
            {showHome && (
              <NavLink to={user ? "/home" : "/"} className={linkClass}>
                <Home size={14} /> Home
              </NavLink>
            )}
            <NavLink to={user ? "/services" : "/login"} className={linkClass}>
              <Grid3X3 size={14} /> Services
            </NavLink>
            {user && role === "provider" && (
              <>
                <NavLink to="/provider" className={linkClass}>
                  <LayoutDashboard size={14} /> Dashboard
                </NavLink>
                <NavLink to="/provider/bookings" className={linkClass}>
                  <CalendarDays size={14} /> Bookings
                </NavLink>
              </>
            )}
            {user && role === "user" && (
              <NavLink to="/user" className={linkClass}>
                <CalendarDays size={14} /> My Bookings
              </NavLink>
            )}
            {user && role === "admin" && (
              <NavLink to="/admin" className={linkClass}>
                <LayoutDashboard size={14} /> Admin
              </NavLink>
            )}

            <div className="nb-sep" />

            {!user ? (
              <>
                <Link to="/login" className="nb-signin">Sign In</Link>
                <Link to="/register" className="nb-cta">Get Started</Link>
              </>
            ) : (
              <div className="nb-user">
                <div className="nb-avatar">{avatarLetter}</div>
                <span className="nb-username">{user?.name ?? role}</span>
                <button className="nb-logout" onClick={handleLogout} title="Logout">
                  <LogOut size={15} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="nb-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="nb-drawer">
            {user && (
              <div className="nb-drawer-user">
                <div className="nb-drawer-avatar">{avatarLetter}</div>
                <div>
                  <div className="nb-drawer-uname">{user?.name ?? "User"}</div>
                  <div className="nb-drawer-urole">{role}</div>
                </div>
              </div>
            )}
            {showHome && (
              <NavLink to={user ? "/home" : "/"} className={drawerLinkClass} onClick={closeMenu}>
                <Home size={17} /> Home
              </NavLink>
            )}
            <NavLink to={user ? "/services" : "/login"} className={drawerLinkClass} onClick={closeMenu}>
              <Grid3X3 size={17} /> Services
            </NavLink>
            {user && role === "provider" && (
              <>
                <NavLink to="/provider" className={drawerLinkClass} onClick={closeMenu}>
                  <LayoutDashboard size={17} /> Dashboard
                </NavLink>
                <NavLink to="/provider/bookings" className={drawerLinkClass} onClick={closeMenu}>
                  <CalendarDays size={17} /> Bookings
                </NavLink>
              </>
            )}
            {user && role === "user" && (
              <NavLink to="/user" className={drawerLinkClass} onClick={closeMenu}>
                <CalendarDays size={17} /> My Bookings
              </NavLink>
            )}
            {user && role === "admin" && (
              <NavLink to="/admin" className={drawerLinkClass} onClick={closeMenu}>
                <LayoutDashboard size={17} /> Admin Panel
              </NavLink>
            )}
            <div className="nb-drawer-sep" />
            {!user ? (
              <>
                <NavLink to="/login" className={drawerLinkClass} onClick={closeMenu}>Sign In</NavLink>
                <Link to="/register" className="nb-drawer-cta" onClick={closeMenu}>Get Started →</Link>
              </>
            ) : (
              <button className="nb-drawer-logout" onClick={handleLogout}>
                <LogOut size={17} /> Logout
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;