import { basename } from "node:path";
import { socialSettings } from "../social.config.mjs";
const escape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
export function resolveSocialMetadata(siteUrl = "", page = "index.html") {
  let base = "";
  if (siteUrl.trim()) {
    const url = new URL(siteUrl);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    )
      throw new Error(
        "SITE_URL must be a public HTTPS URL without credentials, query or fragment.",
      );
    base = url.href.endsWith("/") ? url.href : url.href + "/";
  }
  const title =
    page === "media.html"
      ? "Veyra — Media kit & artwork"
      : page === "privacy.html"
        ? "Veyra — Website privacy"
        : page === "credits.html"
          ? "Veyra — Credits & licenses"
          : socialSettings.title;
  return {
    title,
    description: socialSettings.description,
    image: base
      ? new URL(socialSettings.imagePath, base).href
      : socialSettings.fallbackImageUrl,
    url: base ? new URL(page === "index.html" ? "" : page, base).href : null,
    imageAlt: socialSettings.imageAlt,
  };
}
export function socialMetadata(siteUrl = "") {
  return {
    name: "veyra-static-social-metadata",
    transformIndexHtml: {
      order: "post",
      handler(html, context) {
        const page = basename(context.filename || "index.html");
        if (
          ![
            "index.html",
            "media.html",
            "privacy.html",
            "credits.html",
          ].includes(page)
        )
          return html;
        const meta = resolveSocialMetadata(siteUrl, page);
        const fields = [
          ["property", "og:site_name", "Veyra"],
          ["property", "og:type", "website"],
          ["property", "og:locale", "en_US"],
          ["property", "og:title", meta.title],
          ["property", "og:description", meta.description],
          ["property", "og:image", meta.image],
          ["property", "og:image:secure_url", meta.image],
          ["property", "og:image:type", "image/jpeg"],
          ["property", "og:image:width", "1200"],
          ["property", "og:image:height", "630"],
          ["property", "og:image:alt", meta.imageAlt],
          ["name", "twitter:card", "summary_large_image"],
          ["name", "twitter:title", meta.title],
          ["name", "twitter:description", meta.description],
          ["name", "twitter:image", meta.image],
          ["name", "twitter:image:alt", meta.imageAlt],
        ];
        if (meta.url) fields.push(["property", "og:url", meta.url]);
        const tags = fields
          .map(
            ([kind, name, value]) =>
              `<meta ${kind}="${name}" content="${escape(value)}" />`,
          )
          .join("\n");
        return html.replace(
          "</head>",
          `${tags}\n<link rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon.png" />\n${meta.url ? `<link rel="canonical" href="${escape(meta.url)}" />` : "<!-- Public site URL is intentionally unset until deployment. -->"}\n</head>`,
        );
      },
    },
  };
}
