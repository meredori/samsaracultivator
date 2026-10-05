import { Hourglass, LayoutDashboard, RefreshCcw, User } from "lucide-react";
import { useState, type ReactNode } from "react";
import { spriteUrl, type SpriteKey } from "../render/sprites";
import {
  DAYS_PER_MONTH,
  DAYS_PER_YEAR,
  progressToNextLevel,
  remainingDays,
  REST_HEALTH_PER_MONTH,
  TRAIN_BAREHAND_PER_MONTH,
  TRAIN_HEALTH_COST_PER_MONTH,
  type Activity,
  type Feature,
  type Proficiency,
} from "../sim";
import { useGameStore } from "../state/gameStore";
import { ActivityScene } from "./ActivityScene";
import {
  ActionTile,
  Button,
  HoverTooltip,
  NavList,
  Panel,
  Portrait,
  ProgressBar,
  SectionTitle,
  StatList,
  Tooltip,
  type NavItem,
  type SceneVariant,
} from "./components";
import { useGameLoop } from "./useGameLoop";
import "./app.css";

const years = (days: number) => Math.floor(days / DAYS_PER_YEAR);
/** Health is shown in whole points, rounded up so a scratch does not read as a lost point. */
const hp = (health: number) => Math.ceil(health);

/* ------------------------------------------------------------------ screens */

type ScreenId = "overview" | "character";

/** Side menu entries. One with a `feature` stays hidden until the player discovers it. */
const SCREENS: Array<NavItem<ScreenId> & { feature?: Feature }> = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "character", label: "Character", icon: User, feature: "character" },
];

/* ------------------------------------------------------------------ actions */

type ActionId = Exclude<Activity, "idle">;

interface ActionDef {
  id: ActionId;
  title: string;
  /** Title while the action runs. */
  doing: string;
  flavour: string;
  /** Exact mechanics, shown on hover so the card itself stays clean. */
  effects?: string[];
  sprite: SpriteKey;
  scene: SceneVariant;
}

const ACTIONS: ActionDef[] = [
  {
    id: "rest",
    title: "Rest",
    doing: "Resting",
    flavour: "Recover from training and injury.",
    effects: ["Duration: 1 month", `+${REST_HEALTH_PER_MONTH} HP`],
    sprite: "meditate",
    scene: "mist",
  },
  {
    id: "train",
    title: "Train",
    doing: "Training",
    flavour: "Practice your strikes against the nearby tree.",
    effects: [
      "Duration: 1 month",
      `+${TRAIN_BAREHAND_PER_MONTH} Barehand Proficiency Progress`,
      `−${TRAIN_HEALTH_COST_PER_MONTH} HP`,
    ],
    sprite: "train",
    scene: "forest",
  },
  {
    id: "explore",
    title: "Explore",
    doing: "Exploring",
    flavour: "Search the surrounding area.",
    sprite: "explore",
    scene: "dawn",
  },
];

const ACTIVITY_LABEL: Record<Activity, string> = {
  idle: "Idle",
  rest: "Resting",
  train: "Training",
  explore: "Exploring",
};

/* ------------------------------------------------------------------ shell */

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
  return (
    <header className="game-header">
      <HeaderPainting />
      <h1 className="game-header__logo">Samsara Cultivator</h1>
    </header>
  );
}

function SideMenu({ screen, onSelect }: { screen: ScreenId; onSelect: (id: ScreenId) => void }) {
  const revealed = useGameStore((s) => s.game.revealed);
  const items = SCREENS.filter((s) => !s.feature || revealed.includes(s.feature));
  return (
    <aside className="game-nav">
      <NavList label="Main menu" items={items} value={screen} onSelect={onSelect} chevrons={false} />
    </aside>
  );
}

/* ------------------------------------------------------------------ overview */

function HealthBar() {
  const body = useGameStore((s) => s.game.life.body);
  return (
    <ProgressBar
      label="Health"
      value={body.health}
      max={body.maxHealth}
      tone="red"
      showValue={`${hp(body.health)} / ${body.maxHealth}`}
    />
  );
}

function CharacterSummary() {
  const life = useGameStore((s) => s.game.life);
  const activity = useGameStore((s) => s.game.activity);
  return (
    <div className="game-summary">
      <StatList
        dense
        stats={[
          { label: "Age", value: years(life.ageDays) },
          { label: "Lifespan", value: `${years(life.lifespanDays)} years` },
          {
            label: "Remaining",
            value: `${years(remainingDays(life))} years (${Math.floor(remainingDays(life) / DAYS_PER_MONTH)} months)`,
          },
          { label: "Activity", value: life.alive ? ACTIVITY_LABEL[activity] : "Dead", tone: life.alive ? undefined : "bad" },
        ]}
      />
      <HealthBar />
    </div>
  );
}

function ActionCard({ action, active, onClick }: { action: ActionDef; active: boolean; onClick: () => void }) {
  const tile = (
    <ActionTile
      scene={{ variant: action.scene, sprite: spriteUrl(action.sprite) }}
      title={active ? action.doing : action.title}
      description={
        <>
          {action.flavour}
          {/* the hover tooltip is visual only, so screen readers get the effects here */}
          {action.effects && <span className="sc-visually-hidden"> {action.effects.join(", ")}.</span>}
        </>
      }
      active={active}
      onClick={onClick}
    />
  );
  if (!action.effects) return tile;
  return (
    <HoverTooltip
      content={
        <Tooltip title={action.title}>
          {action.effects.map((e) => (
            <span key={e} className="game-action__effect">
              {e}
            </span>
          ))}
        </Tooltip>
      }
    >
      {tile}
    </HoverTooltip>
  );
}

function Actions() {
  const alive = useGameStore((s) => s.game.life.alive);
  const activity = useGameStore((s) => s.game.activity);
  const toggleActivity = useGameStore((s) => s.toggleActivity);
  const reincarnate = useGameStore((s) => s.reincarnate);

  if (!alive) {
    return (
      <div className="game-death">
        <Hourglass aria-hidden />
        <p>The body is gone. You remember.</p>
        <Button variant="primary" icon={RefreshCcw} onClick={reincarnate}>
          Reincarnate
        </Button>
      </div>
    );
  }
  return (
    <div className="game-actions">
      {ACTIONS.map((a) => (
        <ActionCard key={a.id} action={a} active={activity === a.id} onClick={() => toggleActivity(a.id)} />
      ))}
    </div>
  );
}

function OverviewScreen() {
  const activity = useGameStore((s) => s.game.activity);
  return (
    <Panel title="Overview" className="game-screen">
      <div className="game-overview__top">
        <CharacterSummary />
        <ActivityScene activity={activity} />
      </div>
      <section aria-label="Actions">
        <SectionTitle>Actions</SectionTitle>
        <Actions />
      </section>
    </Panel>
  );
}

/* ------------------------------------------------------------------ character */

function ProficiencyBar({ name, proficiency }: { name: string; proficiency: Proficiency }) {
  const need = progressToNextLevel(proficiency.level);
  return (
    <ProgressBar
      label={
        <span className="game-proficiency__label">
          <span>{name}</span>
          <span>Level {proficiency.level}</span>
        </span>
      }
      value={proficiency.progress}
      max={need}
      tone="gold"
      showValue={`${Math.floor(proficiency.progress)} / ${need}`}
    />
  );
}

/** Revealed with the first proficiency level. Shows only what the player has discovered. */
function CharacterScreen() {
  const life = useGameStore((s) => s.game.life);
  const { body } = life;
  return (
    <Panel title="Character" className="game-screen">
      <div className="game-character">
        <Portrait src={spriteUrl("idle")} alt="" size="lg" />
        <div className="game-character__sheets">
          <section aria-label="Body">
            <SectionTitle>Body</SectionTitle>
            <HealthBar />
            <StatList
              stats={[
                { label: "Age", value: years(life.ageDays) },
                { label: "Lifespan", value: `${years(life.lifespanDays)} years` },
              ]}
            />
          </section>
          <section aria-label="Proficiencies">
            <SectionTitle>Proficiencies</SectionTitle>
            <ProficiencyBar name="Barehand" proficiency={body.proficiencies.barehand} />
          </section>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ app */

const SCREEN_VIEWS: Record<ScreenId, () => ReactNode> = {
  overview: OverviewScreen,
  character: CharacterScreen,
};

export function App() {
  useGameLoop();
  const [screen, setScreen] = useState<ScreenId>("overview");
  const View = SCREEN_VIEWS[screen];
  return (
    <div className="sc-root game">
      <Header />
      <SideMenu screen={screen} onSelect={setScreen} />
      <main className="game-main">
        <View />
      </main>
    </div>
  );
}

