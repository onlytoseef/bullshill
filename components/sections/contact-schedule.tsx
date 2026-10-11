import { Reveal } from "@/components/motion/reveal";
import { GoogleMeetIcon } from "@/components/ui/google-meet-icon";
import { Container } from "@/components/ui/section";
import { contactPage } from "@/lib/content";

export function ContactSchedule() {
  const { schedule } = contactPage;

  return (
    <section className="contact-schedule">
      <Container>
        <Reveal className="contact-schedule-heading">
          <h2>{schedule.title}</h2>
          <p>{schedule.subtitle}</p>
        </Reveal>

        <div className="contact-schedule-row">
          <Reveal x={-24} y={0} className="contact-schedule-copy">
            <h3>{schedule.label}</h3>
            <a
              href={schedule.href}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-meet-button"
            >
              <GoogleMeetIcon className="h-7 w-auto" />
              {schedule.button}
            </a>
            <p>{schedule.note}</p>
          </Reveal>

          <Reveal x={24} y={0} className="contact-meet-card">
            <GoogleMeetIcon className="contact-meet-card-icon" />
            <span>
              <b>Google</b> Meet
            </span>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
