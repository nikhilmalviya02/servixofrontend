import { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Tag, Home, Map, Building2, Hash, Plus, Pencil, Trash2, X, Check } from "lucide-react";

/* ─── Data ─── */
const indianStates = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"
];

const citiesByState: Record<string, string[]> = {
  "Andhra Pradesh":["Visakhapatnam","Vijayawada","Guntur","Nellore","Kurnool","Rajahmundry","Tirupati","Kakinada","Kadapa","Anantapur"],
  "Arunachal Pradesh":["Itanagar","Naharlagun","Pasighat","Namsai","Bomdila","Ziro","Tezu","Aalo","Roing"],
  "Assam":["Guwahati","Silchar","Dibrugarh","Nagaon","Jorhat","Tinsukia","Tezpur","Bongaigaon","Karimganj","Sivasagar"],
  "Bihar":["Patna","Gaya","Bhagalpur","Muzaffarpur","Darbhanga","Arrah","Begusarai","Katihar","Chhapra","Purnia"],
  "Chhattisgarh":["Raipur","Bhilai","Korba","Bilaspur","Durg","Rajnandgaon","Jagdalpur","Raigarh","Ambikapur"],
  "Goa":["Panaji","Vasco da Gama","Margao","Mapusa","Ponda","Bicholim","Curchorem","Sanquelim","Cuncolim"],
  "Gujarat":["Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Jamnagar","Gandhinagar","Junagadh","Anand","Bharuch"],
  "Haryana":["Faridabad","Gurgaon","Panipat","Ambala","Yamunanagar","Rohtak","Hisar","Karnal","Sonipat","Panchkula"],
  "Himachal Pradesh":["Shimla","Mandi","Solan","Dharamshala","Palampur","Baddi","Nahan","Una","Kullu","Manali"],
  "Jharkhand":["Ranchi","Jamshedpur","Dhanbad","Bokaro","Deoghar","Hazaribagh","Giridih","Ramgarh","Medininagar"],
  "Karnataka":["Bangalore","Mysore","Hubli","Mangalore","Belgaum","Gulbarga","Davanagere","Bellary","Bijapur","Shimoga"],
  "Kerala":["Thiruvananthapuram","Kochi","Kozhikode","Kollam","Thrissur","Alappuzha","Palakkad","Malappuram","Ponnani","Kannur"],
  "Madhya Pradesh":["Indore","Bhopal","Jabalpur","Gwalior","Ujjain","Sagar","Dewas","Satna","Ratlam","Rewa"],
  "Maharashtra":["Mumbai","Pune","Nagpur","Thane","Nashik","Kalyan","Vasai-Virar","Aurangabad","Navi Mumbai","Solapur"],
  "Manipur":["Imphal","Thoubal","Kakching","Lilong","Mayang Imphal","Nambol","Moirang","Bishnupur"],
  "Meghalaya":["Shillong","Tura","Nongstoin","Jowai","Baghmara","Williamnagar","Nongpoh"],
  "Mizoram":["Aizawl","Lunglei","Saiha","Champhai","Kolasib","Serchhip","Lawngtlai"],
  "Nagaland":["Kohima","Dimapur","Mokokchung","Tuensang","Wokha","Zunheboto","Mon","Phek"],
  "Odisha":["Bhubaneswar","Cuttack","Rourkela","Berhampur","Sambalpur","Puri","Balasore","Bhadrak","Baripada"],
  "Punjab":["Ludhiana","Amritsar","Jalandhar","Patiala","Bathinda","Mohali","Pathankot","Hoshiarpur","Moga"],
  "Rajasthan":["Jaipur","Jodhpur","Udaipur","Kota","Bikaner","Ajmer","Bhilwara","Alwar","Bharatpur","Sikar"],
  "Sikkim":["Gangtok","Namchi","Gyalshing","Mangan","Rangpo","Singtam"],
  "Tamil Nadu":["Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem","Tiruppur","Erode","Tirunelveli","Vellore","Thoothukudi"],
  "Telangana":["Hyderabad","Warangal","Nizamabad","Karimnagar","Ramagundam","Khammam","Mahbubnagar","Nalgonda","Adilabad"],
  "Tripura":["Agartala","Udaipur","Dharmanagar","Pratapgarh","Kailasahar","Belonia","Khowai"],
  "Uttar Pradesh":["Lucknow","Kanpur","Ghaziabad","Agra","Varanasi","Meerut","Allahabad","Bareilly","Aligarh","Gorakhpur"],
  "Uttarakhand":["Dehradun","Haridwar","Roorkee","Haldwani","Rudrapur","Kashipur","Rishikesh","Pithoragarh"],
  "West Bengal":["Kolkata","Howrah","Durgapur","Asansol","Siliguri","Bardhaman","Malda","Kharagpur","Haldia","Darjeeling"],
};

/* ─── Styles ─── */
const AM_STYLE = `
  :root {
    --sg-bg: #0a0a0f;
    --sg-surface: #12121a;
    --sg-surface2: #1a1a26;
    --sg-accent: #ff6b35;
    --sg-text: #f0f0f8;
    --sg-muted: #888899;
    --sg-border: rgba(255,255,255,0.07);
    --sg-glow: rgba(255,107,53,0.22);
  }

  .am-wrap { max-width: 680px; margin: 0 auto; font-family: 'DM Sans', sans-serif; }

  /* ── form card ── */
  .am-form-card {
    background: var(--sg-surface2);
    border: 1px solid var(--sg-border);
    border-radius: 20px;
    padding: 1.8rem;
    margin-bottom: 1.5rem;
  }

  .am-form-head { display:flex; align-items:center; gap:.85rem; margin-bottom:1.6rem; }
  .am-form-head-icon {
    width: 42px; height: 42px; border-radius: 12px;
    background: rgba(255,107,53,.12); border: 1px solid rgba(255,107,53,.25);
    display: flex; align-items: center; justify-content: center; flex-shrink:0;
  }
  .am-form-title { font-family:'Syne',sans-serif; font-weight:700; font-size:1rem; color:var(--sg-text); }
  .am-form-sub   { font-size:.75rem; color:var(--sg-muted); margin-top:.1rem; }

  /* fields */
  .am-field { margin-bottom: 1rem; }
  .am-label {
    display: block; font-size:.72rem; font-weight:600;
    color:var(--sg-muted); letter-spacing:.5px;
    text-transform:uppercase; margin-bottom:.4rem;
  }
  .am-label span { color:#ff6b6b; }

  .am-input-wrap { position: relative; }
  .am-input-icon {
    position:absolute; left:12px; top:50%; transform:translateY(-50%);
    color:var(--sg-muted); pointer-events:none; transition:color .2s;
  }
  .am-input-wrap:focus-within .am-input-icon { color:var(--sg-accent); }

  .am-textarea-icon {
    position:absolute; left:12px; top:14px;
    color:var(--sg-muted); pointer-events:none; transition:color .2s;
  }
  .am-input-wrap:focus-within .am-textarea-icon { color:var(--sg-accent); }

  .am-input, .am-select, .am-textarea {
    width:100%;
    background: var(--sg-surface);
    border: 1px solid var(--sg-border);
    border-radius: 12px;
    padding: .72rem .9rem .72rem 2.5rem;
    color: var(--sg-text);
    font-family: 'DM Sans', sans-serif; font-size:.9rem;
    outline: none; transition: border-color .2s, box-shadow .2s;
  }
  .am-input::placeholder, .am-textarea::placeholder { color:var(--sg-muted); }
  .am-input:focus, .am-select:focus, .am-textarea:focus {
    border-color: rgba(255,107,53,.5);
    box-shadow: 0 0 0 3px rgba(255,107,53,.1);
  }
  .am-textarea { resize: none; padding-top:.72rem; }
  .am-select { appearance: none; cursor: pointer; }
  .am-select option { background:#1a1a26; color:var(--sg-text); }
  .am-select:disabled { opacity:.45; cursor:not-allowed; }

  .am-select-caret {
    position:absolute; right:12px; top:50%; transform:translateY(-50%);
    color:var(--sg-muted); pointer-events:none;
  }

  /* 2-col grid */
  .am-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:.9rem; }
  @media(max-width:480px){ .am-grid2 { grid-template-columns:1fr; } }

  /* buttons */
  .am-actions { display:flex; gap:.75rem; margin-top:1.3rem; }

  .am-btn-submit {
    flex:1; display:flex; align-items:center; justify-content:center; gap:.45rem;
    background: var(--sg-accent); color:#fff; border:none; border-radius:12px;
    padding:.8rem; font-family:'DM Sans',sans-serif; font-weight:600; font-size:.92rem;
    cursor:pointer; box-shadow: 0 0 22px var(--sg-glow);
    transition: transform .2s, box-shadow .2s, background .2s;
  }
  .am-btn-submit:hover { transform:translateY(-1px); box-shadow:0 4px 28px rgba(255,107,53,.45); background:#ff855a; }

  .am-btn-cancel {
    display:flex; align-items:center; gap:.4rem;
    background:rgba(255,255,255,.04); border:1px solid var(--sg-border);
    color:var(--sg-muted); border-radius:12px;
    padding:.8rem 1.3rem; font-family:'DM Sans',sans-serif;
    font-weight:500; font-size:.88rem; cursor:pointer;
    transition: background .2s, color .2s;
  }
  .am-btn-cancel:hover { background:rgba(255,255,255,.08); color:var(--sg-text); }

  /* ── address list ── */
  .am-list { display:flex; flex-direction:column; gap:.9rem; }

  .am-addr-card {
    background: var(--sg-surface2);
    border: 1px solid var(--sg-border);
    border-radius: 18px; padding:1.3rem 1.5rem;
    transition: border-color .25s, box-shadow .25s;
    position: relative;
  }
  .am-addr-card:hover { border-color:rgba(255,107,53,.18); box-shadow:0 6px 24px rgba(0,0,0,.3); }

  .am-addr-top { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; }

  .am-addr-label-row { display:flex; align-items:center; gap:.6rem; }
  .am-addr-icon {
    width:36px; height:36px; border-radius:10px; flex-shrink:0;
    background:rgba(255,107,53,.1); border:1px solid rgba(255,107,53,.2);
    display:flex; align-items:center; justify-content:center;
  }
  .am-addr-label {
    font-family:'Syne',sans-serif; font-weight:700; font-size:.97rem; color:var(--sg-text);
  }

  .am-addr-body { margin-top:.8rem; display:flex; flex-direction:column; gap:.25rem; }
  .am-addr-line { font-size:.83rem; color:var(--sg-muted); display:flex; align-items:center; gap:.4rem; }
  .am-addr-line strong { color:var(--sg-text); font-weight:500; }

  .am-addr-btns { display:flex; gap:.5rem; flex-shrink:0; }

  .am-icon-btn {
    width:34px; height:34px; border-radius:9px;
    display:flex; align-items:center; justify-content:center;
    border:1px solid var(--sg-border); cursor:pointer;
    background:rgba(255,255,255,.04);
    transition: background .2s, border-color .2s, color .2s;
  }
  .am-icon-btn-edit  { color:var(--sg-muted); }
  .am-icon-btn-edit:hover  { background:rgba(0,212,255,.1); border-color:rgba(0,212,255,.25); color:#00d4ff; }
  .am-icon-btn-del   { color:var(--sg-muted); }
  .am-icon-btn-del:hover   { background:rgba(255,107,107,.1); border-color:rgba(255,107,107,.25); color:#ff6b6b; }

  /* empty */
  .am-empty {
    text-align:center; padding:3rem 1rem;
    background:rgba(255,255,255,.02);
    border:1px dashed var(--sg-border);
    border-radius:18px;
  }
  .am-empty-icon {
    width:52px; height:52px; border-radius:50%;
    background:rgba(255,255,255,.04); border:1px solid var(--sg-border);
    display:flex; align-items:center; justify-content:center;
    margin:0 auto .9rem;
  }
  .am-empty h4 { font-family:'Syne',sans-serif; font-weight:700; font-size:.95rem; color:var(--sg-text); }
  .am-empty p  { color:var(--sg-muted); font-size:.8rem; margin-top:.3rem; }
`;

function InjectAMStyle() {
  useEffect(() => {
    if (!document.getElementById("am-style")) {
      const el = document.createElement("style");
      el.id = "am-style";
      el.textContent = AM_STYLE;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

/* ═══════════════════════════════
   COMPONENT
═══════════════════════════════ */
function AddressManager() {
  const [addresses, setAddresses]           = useState<any[]>([]);
  const [editingId, setEditingId]           = useState<string | null>(null);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const [form, setForm] = useState({
    label: "", street: "", city: "", state: "", pincode: "",
  });

  const token = localStorage.getItem("token");

  const fetchAddresses = () => {
    axios
      .get("https://servixobackend.vercel.app/api/user/address", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAddresses(res.data));
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(
        `https://servixobackend.vercel.app/api/user/address/${editingId}`,
        form, { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
    } else {
      await axios.post(
        "https://servixobackend.vercel.app/api/user/address",
        form, { headers: { Authorization: `Bearer ${token}` } }
      );
    }
    setForm({ label:"", street:"", city:"", state:"", pincode:"" });
    fetchAddresses();
  };

  const handleDelete = async (id: string) => {
    await axios.delete(
      `https://servixobackend.vercel.app/api/user/address/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchAddresses();
  };

  const handleEdit = (addr: any) => {
    setEditingId(addr._id);
    setForm({ label:addr.label, street:addr.street, city:addr.city, state:addr.state, pincode:addr.pincode });
    if (addr.state && citiesByState[addr.state]) setAvailableCities(citiesByState[addr.state]);
  };

  const handleStateChange = (state: string) => {
    setForm({ ...form, state, city:"" });
    setAvailableCities(state && citiesByState[state] ? citiesByState[state] : []);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ label:"", street:"", city:"", state:"", pincode:"" });
    setAvailableCities([]);
  };

  return (
    <>
      <InjectAMStyle />
      <div className="am-wrap">

        {/* ── FORM CARD ── */}
        <div className="am-form-card">
          <div className="am-form-head">
            <div className="am-form-head-icon">
              {editingId ? <Pencil size={18} style={{ color:"#ff6b35" }} /> : <Plus size={18} style={{ color:"#ff6b35" }} />}
            </div>
            <div>
              <div className="am-form-title">{editingId ? "Edit Address" : "Add New Address"}</div>
              <div className="am-form-sub">{editingId ? "Update your address details" : "Enter your complete address information"}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Label */}
            <div className="am-field">
              <label className="am-label">Address Label <span>*</span></label>
              <div className="am-input-wrap">
                <Tag size={15} className="am-input-icon" />
                <input
                  className="am-input" required
                  placeholder="e.g., Home, Office, Parents House"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                />
              </div>
            </div>

            {/* Street */}
            <div className="am-field">
              <label className="am-label">Street Address <span>*</span></label>
              <div className="am-input-wrap">
                <Home size={15} className="am-textarea-icon" />
                <textarea
                  className="am-textarea" rows={2} required
                  placeholder="House/Building number, Street name, Landmark"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                />
              </div>
            </div>

            {/* State + City */}
            <div className="am-grid2">
              <div className="am-field" style={{ marginBottom:0 }}>
                <label className="am-label">State <span>*</span></label>
                <div className="am-input-wrap">
                  <Map size={15} className="am-input-icon" />
                  <select
                    className="am-select" required
                    value={form.state}
                    onChange={(e) => handleStateChange(e.target.value)}
                  >
                    <option value="">Select State</option>
                    {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <svg className="am-select-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>

              <div className="am-field" style={{ marginBottom:0 }}>
                <label className="am-label">City <span>*</span></label>
                <div className="am-input-wrap">
                  <Building2 size={15} className="am-input-icon" />
                  <select
                    className="am-select" required
                    value={form.city}
                    disabled={!form.state}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  >
                    <option value="">{form.state ? "Select City" : "Select State First"}</option>
                    {availableCities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <svg className="am-select-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Pincode */}
            <div className="am-field" style={{ marginTop:"1rem" }}>
              <label className="am-label">Pincode <span>*</span></label>
              <div className="am-input-wrap">
                <Hash size={15} className="am-input-icon" />
                <input
                  type="text" maxLength={6} className="am-input" required
                  placeholder="6 digit pincode"
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g,"").slice(0,6) })}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="am-actions">
              <button type="submit" className="am-btn-submit">
                {editingId ? <><Check size={16} /> Update Address</> : <><Plus size={16} /> Add Address</>}
              </button>
              {editingId && (
                <button type="button" className="am-btn-cancel" onClick={cancelEdit}>
                  <X size={15} /> Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ── ADDRESS LIST ── */}
        {addresses.length === 0 ? (
          <div className="am-empty">
            <div className="am-empty-icon">
              <MapPin size={22} style={{ color:"var(--sg-muted)" }} />
            </div>
            <h4>No addresses saved</h4>
            <p>Add your first address using the form above</p>
          </div>
        ) : (
          <div className="am-list">
            {addresses.map((addr) => (
              <div key={addr._id} className="am-addr-card">
                <div className="am-addr-top">
                  <div className="am-addr-label-row">
                    <div className="am-addr-icon">
                      <MapPin size={16} style={{ color:"#ff6b35" }} />
                    </div>
                    <span className="am-addr-label">{addr.label}</span>
                  </div>
                  <div className="am-addr-btns">
                    <button
                      className="am-icon-btn am-icon-btn-edit"
                      onClick={() => handleEdit(addr)}
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="am-icon-btn am-icon-btn-del"
                      onClick={() => handleDelete(addr._id)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="am-addr-body">
                  <div className="am-addr-line">
                    <Home size={12} style={{ flexShrink:0 }} />
                    <strong>{addr.street}</strong>
                  </div>
                  <div className="am-addr-line">
                    <Building2 size={12} style={{ flexShrink:0 }} />
                    <span>{addr.city}, {addr.state}</span>
                  </div>
                  <div className="am-addr-line">
                    <Hash size={12} style={{ flexShrink:0 }} />
                    <span>{addr.pincode}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </>
  );
}

export default AddressManager;