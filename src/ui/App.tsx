import { SceneCanvas } from "../render/SceneCanvas";
import { DAYS_PER_YEAR } from "../sim";
import { useGameStore } from "../state/gameStore";

const years = (days: number) => Math.floor(days / DAYS_PER_YEAR);

export function App() {
  const life = useGameStore((s) => s.game.life);
  const passYears = useGameStore((s) => s.passYears);
  const reincarnate = useGameStore((s) => s.reincarnate);

  return (
    <main className="app">
      <header className="lifebar">
        <span>Life {life.incarnation}</span>
        <span data-testid="age">
          Age {years(life.ageDays)} / {years(life.lifespanDays)}
        </span>
      </header>
      <SceneCanvas />
      <section className="actions">
        {life.alive ? (
          <button onClick={() => passYears(1)}>Pass 1 year</button>
        ) : (
          <>
            <p>The body is gone. You remember.</p>
            <button onClick={reincarnate}>Reincarnate</button>
          </>
        )}
      </section>
    </main>
  );
}
