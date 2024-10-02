import { MetadataRoute } from "next";
import { env } from "@syrs/env/env.client";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: env.clientHttpUri, lastModified: new Date() },
    //
  ];
}
