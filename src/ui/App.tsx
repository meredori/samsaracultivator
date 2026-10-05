import { Hourglass, LayoutDashboard, RefreshCcw, Sprout } from "lucide-react";
import { useId } from "react";
import { spriteUrl } from "../render/sprites";
import { DAYS_PER_YEAR, qiForStage, REALM_NAMES, remainingDays, STAGES_PER_REALM } from "../sim";
import { useGameStore } from "../state/gameStore";
import { ActivityScene } from "./ActivityScene";
import {
  ActionTile,
  Button,
  CharacterSheet,
  Emblem,
  NavList,
  Panel,
  ProgressBar,
  RealmBadge,
  REALMS,
  StepProgress,
} from "./components";
import { useGameLoop } from "./useGameLoop";
import "./app.css";

const years = (days: number) => Math.floor(days / DAYS_PER_YEAR);

/** Ink-wash mountain strip behind the title bar. */
function HeaderPainting() {
  return (
    <svg className="game-header__painting" viewBox="0 0 1600 90" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <path
        d="M0 90 L0 60 L90 40 L160 58 L260 22 L330 50 L420 30 L520 62 L640 18 L720 44 L800 28 L900 56 L1010 14 L1090 46 L1180 30 L1300 60 L1420 24 L1500 50 L1600 36 L1600 90 Z"
        fill="#cfd5d3"
      />
      <path
        d="M0 90 L0 74 L120 58 L220 72 L340 48 L460 76 L560 54 L700 70 L820 46 L940 74 L1060 50 L1200 72 L1330 52 L1460 70 L1600 56 L1600 90 Z"
        fill="#aab4b1"
      />
      <path d="M0 90 L0 82 L200 76 L420 84 L700 78 L980 84 L1250 76 L1600 82 L1600 90 Z" fill="#7f8c86" />
    </svg>
  );
}

function Header() {
  const life = useGameStore((s) => s.game.life);
  const { realm, stage } = life.cultivation;
  return (
    <header className="game-header">
      <HeaderPainting />
      <h1 className="game-header__logo">Samsara Cultivator</h1>
      <dl className="game-header__clock">
        <div>
          <dt>Realm</dt>
          <dd data-testid="header-realm">
            <RealmBadge realm={REALMS[realm]} size="sm" /> Stage {stage}
          </dd>
        </div>
        <div>
          <dt>Age</dt>
          <dd data-testid="age">
            {years(life.ageDays)} / {years(life.lifespanDays)}
          </dd>
        </div>
        <div>
          <dt>Life</dt>
          <dd>{life.incarnation}</dd>
        </div>
      </dl>
    </header>
  );
}

function SideMenu() {
  return (
    <aside className="game-nav">
      <NavList
        label="Main menu"
        items={[{ id: "overview", label: "Overview", icon: LayoutDashboard }]}
        value="overview"
        chevrons={false}
      />
    </aside>
  );
}

function CharacterPanel() {
  const life = useGameStore((s) => s.game.life);
  const activity = useGameStore((s) => s.game.activity);
  const { realm, stage } = life.cultivation;
  return (
    <Panel title="Character" className="game-character">
      <CharacterSheet
        portrait={spriteUrl("idle")}
        name="Reincarnator"
        stats={[
          { label: "Age", value: years(life.ageDays) },
          { label: "Lifespan", value: years(life.lifespanDays) },
          { label: "Remaining", value: `${years(remainingDays(life))} years` },
          { label: "Realm", value: REALM_NAMES[realm] },
          { label: "Stage", value: `${stage} / ${STAGES_PER_REALM}` },
          {
            label: "Activity",
            value: !life.alive ? "Dead" : activity === "cultivate" ? "Cultivating" : "Resting",
            tone: !life.alive ? "bad" : activity === "cultivate" ? "good" : undefined,
          },
        ]}
      />
    </Panel>
  );
}

function OverviewPanel() {
  const life = useGameStore((s) => s.game.life);
  const cultivating = useGameStore((s) => s.game.activity === "cultivate");
  const toggleCultivate = useGameStore((s) => s.toggleCultivate);
  const reincarnate = useGameStore((s) => s.reincarnate);
  const qiId = useId();
  const c = life.cultivation;
  const need = qiForStage(c);

  return (
    <Panel title="Overview" className="game-overview">
      <ActivityScene cultivating={cultivating} />

      <section className="game-realm" aria-label="Cultivation">
        <Emblem icon={Sprout} tone="jade" size="lg" />
        <div className="game-realm__body">
          <div className="game-realm__head">
            <h3>{REALM_NAMES[c.realm]} Realm</h3>
            <StepProgress current={c.stage} total={STAGES_PER_REALM} tone="jade" />
          </div>
          <span id={qiId} className="sc-tone-muted">
            Qi toward stage {c.stage === STAGES_PER_REALM ? "breakthrough" : c.stage + 1}
          </span>
          <ProgressBar
            value={c.qi}
            max={need}
            showValue={`${Math.floor(c.qi)} / ${need}`}
            aria-labelledby={qiId}
          />
        </div>
      </section>

      <section className="game-actions" aria-label="Actions">
        {life.alive ? (
          <ActionTile
            scene={{ variant: "mist", sprite: spriteUrl("meditate"), pagoda: true }}
            title={cultivating ? "Cultivating" : "Cultivate"}
            description={
              cultivating
                ? "Gathering qi. Time passes while you sit. Click to stop."
                : "Gather qi to advance your stage. Time passes while you cultivate."
            }
            active={cultivating}
            onClick={toggleCultivate}
          />
        ) : (
          <div className="game-death">
            <Hourglass aria-hidden />
            <p>The body is gone. You remember.</p>
            <Button variant="primary" icon={RefreshCcw} onClick={reincarnate}>
              Reincarnate
            </Button>
          </div>
        )}
      </section>
    </Panel>
  );
}

export function App() {
  useGameLoop();
  return (
    <div className="sc-root game">
      <Header />
      <SideMenu />
      <CharacterPanel />
      <OverviewPanel />
    </div>
  );
}

