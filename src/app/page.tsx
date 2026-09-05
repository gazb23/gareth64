import { Gareth64 } from "@/components/Gareth64";
import { QuickView } from "@/components/QuickView";

export default function Home() {
  return (
    <div id="top">
      <Gareth64 overlayQuickView={<QuickView compact embedded />} />
      <noscript>
        <p className="noscript-note">JavaScript is off, so Gareth64 has opened the fast résumé view.</p>
        <QuickView />
      </noscript>
    </div>
  );
}
