import Link from "next/link";
import Image from "next/image";

import contactIcon from "../../app/assets/contact -us/contact-icon.svg";

/**
 * Floating contact affordance, bottom-right on every page.
 *
 * A plain link for now. If a chat provider (Intercom, Crisp, …) gets added
 * later, this is the element to replace with their launcher.
 */
export function ContactBubble() {
  return (
    <Link
      href="/#contact"
      className="contact-bubble fixed right-5 bottom-5 z-40 flex items-center justify-center"
    >
      <Image
        src={contactIcon}
        alt=""
        width={42}
        height={42}
        className="contact-bubble-icon"
      />
      Contact us
    </Link>
  );
}
