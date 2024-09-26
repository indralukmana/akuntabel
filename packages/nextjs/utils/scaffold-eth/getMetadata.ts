import type { Metadata } from "next";

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : `http://localhost:${process.env.PORT || 3000}`;
const titleTemplate = "%s | Scaffold-ETH 2";

export const getMetadata = ({ title, description }: { title: string; description: string }): Metadata => {
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: titleTemplate,
    },
    description: description,

    icons: {
      icon: [{ url: "/logo.svg", sizes: "32x32", type: "image/svg+xml" }],
    },
  };
};
