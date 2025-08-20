import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/boss/",
        "/bossdashboard/",
        "/api/",
        "/_next/",
        "/admin/",
        "/private/",
      ],
    },
    sitemap: "https://www.instalabel.co/sitemap.xml",
  }
}
