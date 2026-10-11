import Link from "next/link";
import Image from "next/image";

import contactIcon from "../../app/assets/contact -us/contact-icon.svg";

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
