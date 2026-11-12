import { Button } from "@/components/ui/button";
import { ChatIcon } from "@/components/ui/icons";

export function ContactBubble() {
  return (
    <Button
      href="/contact"
      variant="primary"
      aria-label="Contact us"
      className="contact-bubble fixed right-5 bottom-5 z-40"
    >
      <ChatIcon />
      <span className="contact-bubble-label">Contact us</span>
    </Button>
  );
}
