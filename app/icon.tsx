import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ff7a45",
          borderRadius: 7,
          color: "#1a0b04",
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: -0.5,
        }}
      >
        KD
      </div>
    ),
    size,
  );
}
