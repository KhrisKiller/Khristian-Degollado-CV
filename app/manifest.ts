import type { MetadataRoute } from "next";
import { siteDescription } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Khristian Degollado — Portfolio",
    short_name: "KHRISTIAN.DEV",
    description: siteDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#07080a",
    theme_color: "#07080a",
    icons: [{ src: "/icon", sizes: "32x32", type: "image/png" }, { src: "/apple-icon", sizes: "180x180", type: "image/png" }],
  };
}
