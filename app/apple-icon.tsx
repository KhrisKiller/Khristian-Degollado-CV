import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#07080a",
          color: "#eceef1",
          fontSize: 76,
          fontWeight: 800,
          letterSpacing: -4,
        }}
      >
        K<span style={{ color: "#ff7a45" }}>D</span>
      </div>
    ),
    size,
  );
}
