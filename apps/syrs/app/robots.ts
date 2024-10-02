import { MetadataRoute } from "next";
import { env } from "@syrs/env/env.client";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/",
    },
    sitemap: `${env.clientHttpUri}/sitemap.xml`,
  };
}
