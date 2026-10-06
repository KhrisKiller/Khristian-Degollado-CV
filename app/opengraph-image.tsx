import { ImageResponse } from "next/og";

export const alt = "Khristian Degollado — Industrial Engineer & Digital Solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STAGES = ["Operations", "Data", "System", "Insights", "Decisions"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#07080a",
          backgroundImage:
            "radial-gradient(circle at 85% 10%, rgba(255,122,69,0.22), transparent 45%), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 48px 48px, 48px 48px",
          color: "#eceef1",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, letterSpacing: 4 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "#ff7a45",
              color: "#1a0b04",
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 0,
            }}
          >
            KD
          </div>
          KHRISTIAN.DEV
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 34, color: "#a3a9b3" }}>Khristian Degollado</div>
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: 68, fontWeight: 700, letterSpacing: -2.5, lineHeight: 1.05, marginTop: 14, maxWidth: 980 }}>
            <span>Industrial Engineer building&nbsp;</span>
            <span style={{ color: "#ff7a45" }}>digital solutions&nbsp;</span>
            <span>for real-world operations.</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 20, color: "#a3a9b3" }}>
          {STAGES.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  padding: "8px 16px",
                  borderRadius: 999,
                  border: i === STAGES.length - 1 ? "1px solid rgba(255,122,69,0.7)" : "1px solid rgba(255,255,255,0.16)",
                  color: i === STAGES.length - 1 ? "#ffffff" : "#a3a9b3",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  fontSize: 16,
                }}
              >
                {s}
              </div>
              {i < STAGES.length - 1 ? <div style={{ display: "flex", width: 28, height: 1, background: "rgba(255,255,255,0.25)" }} /> : null}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
