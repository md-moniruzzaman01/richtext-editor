
import styles from "./page.module.css";
import RichTextEditor from "./RichTextEditor";

export default function Home() {
  return (
    <div className={styles.page}>
      <RichTextEditor />
      <footer className={styles.footer}>
        <a
          href="https://github.com/md-moniruzzaman01"
          target="_blank"
          rel="noopener noreferrer"
        >
          © 2025 Md Moniruzzaman. All rights reserved. View on GitHub
        </a>
      </footer>
    </div>
  );
}
