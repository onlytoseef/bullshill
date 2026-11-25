import Image from "next/image";
import bullLogo from "../../app/assets/images/logo.webp";

/** Server markup: parser readiness, never hydration, owns this cover. */
export function PageLoader() {
  return (
    <div className="charge" aria-hidden="true">
      <div className="charge__veil" />
      <div className="charge__identity">
        <div className="charge__logo">
          <Image src={bullLogo} alt="" width={bullLogo.width} height={bullLogo.height} sizes="160px" unoptimized fetchPriority="low" draggable={false} />
        </div>
        <div className="charge__brand">BULL<span>SHILL</span></div>
        <p className="charge__label">Preparing your experience</p>
        <div className="charge__indicator"><span className="charge__segment" /></div>
      </div>
    </div>
  );
}
