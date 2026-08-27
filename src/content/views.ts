import { siteContent } from "./site";

export interface ViewTarget {
  readonly id: string;
  readonly label: string;
  /** URL rendered inside the on-screen viewer. */
  readonly embedUrl: string;
  /** URL for the pop-out link (differs from embedUrl for video players). */
  readonly pageUrl: string;
  readonly kind: "site" | "video";
}

const productViews: ViewTarget[] = siteContent.products
  .filter((product) => product.embeddable)
  .map((product) => ({
    id: product.viewId,
    label: product.name.toUpperCase(),
    embedUrl: product.href,
    pageUrl: product.href,
    kind: "site",
  }));

export const viewTargets: readonly ViewTarget[] = [
  ...productViews,
  {
    id: "IRIS DEMO",
    label: "IRIS PILOT DEMO",
    embedUrl: `${siteContent.iris.video.embed}?dnt=1&title=0&byline=0`,
    pageUrl: siteContent.iris.video.page,
    kind: "video",
  },
];

export function resolveView(query: string): ViewTarget | null {
  const q = query.trim().toUpperCase().replace(/^["']|["']$/g, "");
  if (!q) return null;
  return (
    viewTargets.find((view) => view.id === q) ??
    viewTargets.find((view) => view.label === q) ??
    viewTargets.find((view) => view.label.includes(q)) ??
    null
  );
}
