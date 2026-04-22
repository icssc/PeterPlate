import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "PeterPlate",
    short_name: "PeterPlate",
    description:
      "A dynamic web app to discover what UCI's dining halls have to offer. Find anything from daily menus and special events to dining hall features and updates.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#0064a4",
    screenshots: [
      {
        src: "/screenshots/home-mobile.jpg",
        sizes: "1206x2034",
        type: "image/jpeg",
        form_factor: "narrow",
        label: "Home screen on mobile",
      },
      {
        src: "/screenshots/restaurant-mobile.jpg",
        sizes: "1206x2034",
        type: "image/jpeg",
        form_factor: "narrow",
        label: "Restaurant screen on mobile",
      },
      {
        src: "/screenshots/home-desktop.png",
        sizes: "2992x1494",
        type: "image/png",
        form_factor: "wide",
        label: "Home screen on desktop",
      },
    ],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
