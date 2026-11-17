import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";

// Same rules as the live site's robots.txt, plus the app's API.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/login", "/dashboard", "/logout", "/_crm/", "/media.php", "/send-quote.php"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
