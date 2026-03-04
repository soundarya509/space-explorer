import { useState, useEffect } from "react";

const API_URL =
  "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&count=12";

const StarField = () => (
  <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
    {Array.from({ length: 80 }).map((_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          width: Math.random() * 2 + 1 + "px",
          height: Math.random() * 2 + 1 + "px",
          borderRadius: "50%",
          background: "white",
          top: Math.random() * 100 + "%",
          left: Math.random() * 100 + "%",
          opacity: Math.random() * 0.7 + 0.2,
          animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
          animationDelay: Math.random() * 4 + "s",
        }}
      />
    ))}
  </div>
);

const SkeletonCard = ({ i }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "16px",
      overflow: "hidden",
      animation: `pulse 1.8s ease-in-out infinite`,
      animationDelay: `${i * 0.1}s`,
    }}
  >
    <div style={{ height: "200px", background: "rgba(255,255,255,0.06)" }} />
    <div style={{ padding: "20px" }}>
      <div style={{ height: "14px", background: "rgba(255,255,255,0.08)", borderRadius: "6px", marginBottom: "10px", width: "60%" }} />
      <div style={{ height: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "6px", marginBottom: "6px" }} />
      <div style={{ height: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "6px", width: "80%" }} />
    </div>
  </div>
);

const Modal = ({ item, onClose }) => {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(135deg, #0f1a2e 0%, #0a0f1e 100%)",
          border: "1px solid rgba(99,179,237,0.2)",
          borderRadius: "20px",
          maxWidth: "760px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(99,179,237,0.1)",
          animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {item.media_type === "image" ? (
          <img
            src={item.url}
            alt={item.title}
            style={{ width: "100%", maxHeight: "420px", objectFit: "cover", borderRadius: "20px 20px 0 0", display: "block" }}
          />
        ) : (
          <div style={{ height: "280px", background: "#000", borderRadius: "20px 20px 0 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <iframe src={item.url} style={{ width: "100%", height: "100%", border: "none", borderRadius: "20px 20px 0 0" }} title={item.title} />
          </div>
        )}
        <div style={{ padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(18px,4vw,26px)", color: "#e8f4fd", margin: 0, lineHeight: 1.3, flex: 1, marginRight: "16px" }}>{item.title}</h2>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#aaa", width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer", fontSize: "18px", flexShrink: 0, transition: "all 0.2s" }}>×</button>
          </div>
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
            <span style={{ background: "rgba(99,179,237,0.15)", color: "#63b3ed", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontFamily: "monospace" }}>{item.date}</span>
            {item.copyright && <span style={{ background: "rgba(255,255,255,0.06)", color: "#888", padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>© {item.copyright.replace("\n", " ")}</span>}
          </div>
          <p style={{ color: "#94a3b8", lineHeight: 1.75, fontSize: "15px", margin: 0, fontFamily: "'Lora', Georgia, serif" }}>{item.explanation}</p>
        </div>
      </div>
    </div>
  );
};

const Card = ({ item, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      onClick={() => onClick(item)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? "rgba(99,179,237,0.3)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: "16px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(99,179,237,0.08)" : "none",
      }}
    >
      <div style={{ position: "relative", height: "200px", overflow: "hidden", background: "#080d1a" }}>
        {item.media_type === "image" ? (
          <>
            {!imgLoaded && <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.04)", animation: "pulse 1.8s ease-in-out infinite" }} />}
            <img
              src={item.url}
              alt={item.title}
              onLoad={() => setImgLoaded(true)}
              style={{
                width: "100%", height: "100%", objectFit: "cover", display: "block",
                transition: "transform 0.5s ease",
                transform: hovered ? "scale(1.06)" : "scale(1)",
                opacity: imgLoaded ? 1 : 0,
              }}
            />
          </>
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0a1628, #1a0a28)" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "8px" }}>🎬</div>
              <span style={{ color: "#63b3ed", fontSize: "12px", fontFamily: "monospace" }}>VIDEO</span>
            </div>
          </div>
        )}
        <div style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", padding: "3px 10px", borderRadius: "20px" }}>
          <span style={{ color: "#63b3ed", fontSize: "11px", fontFamily: "monospace" }}>{item.date}</span>
        </div>
      </div>
      <div style={{ padding: "18px" }}>
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "15px", color: "#e8f4fd", margin: "0 0 8px", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.title}</h3>
        <p style={{ color: "#64748b", fontSize: "13px", margin: 0, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", fontFamily: "'Lora', Georgia, serif" }}>{item.explanation}</p>
        <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "6px", color: hovered ? "#63b3ed" : "#475569", transition: "color 0.2s", fontSize: "12px", fontFamily: "monospace" }}>
          <span>View full image</span>
          <span style={{ transform: hovered ? "translateX(4px)" : "translateX(0)", transition: "transform 0.2s", display: "inline-block" }}>→</span>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);
      const json = await res.json();
      setData(json.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      setError(err.message || "Something went wrong fetching space data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = data.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.explanation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lora:ital@0;1&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050a12; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #050a12; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 3px; }
        @keyframes twinkle { 0%,100% { opacity:0.2; transform:scale(1); } 50% { opacity:1; transform:scale(1.3); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes slideUp { from { opacity:0; transform:translateY(40px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes cardIn { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #334155; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #050a12 0%, #080d1a 50%, #050a12 100%)", color: "white", position: "relative" }}>
        <StarField />

        <header style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "clamp(40px,8vw,80px) 20px clamp(30px,5vw,50px)" }}>
          <div style={{ display: "inline-block", background: "rgba(99,179,237,0.1)", border: "1px solid rgba(99,179,237,0.2)", borderRadius: "20px", padding: "6px 16px", marginBottom: "20px" }}>
            <span style={{ fontFamily: "Space Mono, monospace", fontSize: "11px", color: "#63b3ed", letterSpacing: "2px", textTransform: "uppercase" }}>NASA · Astronomy Picture of the Day</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(32px,7vw,72px)", fontWeight: 700, lineHeight: 1.1, marginBottom: "16px", background: "linear-gradient(135deg, #e8f4fd 30%, #63b3ed 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            The Universe,<br />Daily
          </h1>
          <p style={{ fontFamily: "'Lora', Georgia, serif", color: "#64748b", fontSize: "clamp(14px,2vw,17px)", fontStyle: "italic", maxWidth: "460px", margin: "0 auto 32px", lineHeight: 1.7 }}>
            Each day, a different image or photograph of our universe — explained by a professional astronomer.
          </p>
          <div style={{ maxWidth: "400px", margin: "0 auto", position: "relative" }}>
            <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#334155", fontSize: "16px" }}>🔍</span>
            <input
              type="text"
              placeholder="Search galaxies, nebulae, planets…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "14px 16px 14px 44px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "50px", color: "white",
                fontFamily: "Space Mono, monospace", fontSize: "13px",
                outline: "none", transition: "all 0.2s",
              }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(99,179,237,0.4)"; e.target.style.background = "rgba(255,255,255,0.07)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
            />
          </div>
        </header>

        <main style={{ position: "relative", zIndex: 10, maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(16px,4vw,40px) 80px" }}>
          {loading && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
                <div style={{ width: "20px", height: "20px", border: "2px solid rgba(99,179,237,0.2)", borderTop: "2px solid #63b3ed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: "12px", color: "#475569" }}>Fetching from NASA API…</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,280px),1fr))", gap: "20px" }}>
                {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} i={i} />)}
              </div>
            </div>
          )}

          {error && !loading && (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div style={{ fontSize: "56px", marginBottom: "20px" }}>🌌</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", color: "#e8f4fd", marginBottom: "12px" }}>Lost in Space</h2>
              <p style={{ color: "#64748b", fontFamily: "Space Mono, monospace", fontSize: "13px", marginBottom: "28px", maxWidth: "360px", margin: "0 auto 28px" }}>{error}</p>
              <button
                onClick={fetchData}
                style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8f)", border: "1px solid rgba(99,179,237,0.3)", color: "#63b3ed", padding: "12px 28px", borderRadius: "50px", cursor: "pointer", fontFamily: "Space Mono, monospace", fontSize: "13px", transition: "all 0.2s" }}
                onMouseEnter={(e) => e.target.style.transform = "scale(1.03)"}
                onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
              >
                Try Again →
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "10px" }}>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: "12px", color: "#475569" }}>
                  {search ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"` : `${data.length} images from NASA`}
                </span>
                <button onClick={fetchData} style={{ background: "rgba(99,179,237,0.08)", border: "1px solid rgba(99,179,237,0.2)", color: "#63b3ed", padding: "8px 18px", borderRadius: "50px", cursor: "pointer", fontFamily: "Space Mono, monospace", fontSize: "11px", transition: "all 0.2s" }}
                  onMouseEnter={(e) => e.target.style.background = "rgba(99,179,237,0.15)"}
                  onMouseLeave={(e) => e.target.style.background = "rgba(99,179,237,0.08)"}
                >↺ Refresh</button>
              </div>

              {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 20px", color: "#475569", fontFamily: "Space Mono, monospace", fontSize: "13px" }}>
                  No images match your search. Try something else.
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,280px),1fr))", gap: "20px" }}>
                  {filtered.map((item, i) => (
                    <div key={item.date + item.title} style={{ animation: `cardIn 0.5s ease both`, animationDelay: `${i * 0.04}s` }}>
                      <Card item={item} onClick={setSelected} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>

        <footer style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ fontFamily: "Space Mono, monospace", fontSize: "11px", color: "#334155" }}>Data from NASA APOD API · Built with React</span>
        </footer>
      </div>

      {selected && <Modal item={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
