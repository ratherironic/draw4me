import styles from "./page.module.css";
import { DrawCanvas } from "@/components/draw-canvas";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Draw4Me</h1>
      <p>Draw4Me is a simple drawing app that lets you draw and share your drawings with others.</p>
      <DrawCanvas />
    </main>
  );
}
