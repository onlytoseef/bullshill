import Link from "next/link";

import styles from "./not-found-page.module.css";

export function NotFoundPage() {
  return (
    <section className={styles.page} aria-labelledby="not-found-heading">
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.code} aria-hidden="true">
          <span>4</span><span className={styles.zero}>0</span><span>4</span>
        </div>
        <p className={styles.status}>ERROR 404 / PAGE NOT FOUND</p>
        <h1 id="not-found-heading">This page took a <span>wrong turn.</span></h1>
        <p className={styles.description}>
          The page you’re looking for has moved or doesn’t exist.
          Let’s get you back on track.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.primary}>Back to home <span aria-hidden="true">↗</span></Link>
          <Link href="/contact" className={styles.secondary}>Get in touch <span aria-hidden="true">↗</span></Link>
        </div>
        <nav className={styles.explore} aria-label="Explore Bullshill">
          <span>Keep exploring</span>
          <Link href="/services">Services</Link>
          <Link href="/case-studies">Our work</Link>
          <Link href="/blog">Insights</Link>
        </nav>
      </div>
    </section>
  );
}
