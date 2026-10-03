import {
  Backpack,
  Bone,
  Check,
  ChevronRight,
  ChevronsRight,
  Clock,
  Flame,
  Gem,
  Hourglass,
  Landmark,
  Leaf,
  Lock,
  Map as MapIcon,
  Mountain,
  Pause,
  Play,
  RefreshCcw,
  ScrollText,
  Settings,
  Shield,
  Sparkles,
  Sprout,
  TreePine,
  User,
  type LucideIcon,
} from "lucide-react";
import { useEffect, type ReactNode } from "react";
import {
  ACTION_DETAIL,
  ACTIONS,
  LOCATIONS,
  NAV,
  OPPORTUNITIES,
  RESOURCES,
  SEASONS,
  STAGES,
  spriteUrl,
  type Resource,
} from "./data";
import { SceneView } from "./SceneView";
import { useMock } from "./store";
import "./mockup.css";

const NAV_ICONS: Record<string, LucideIcon> = {
  character: User,
  cultivation: Sprout,
  explore: MapIcon,
  techniques: ScrollText,
  samsara: RefreshCcw,
  inventory: Backpack,
  sect: Landmark,
};

const RESOURCE_ICONS: Record<Resource["icon"], LucideIcon> = {
  wood: TreePine,
  marrow: Bone,
  herb: Leaf,
  powder: Mountain,
  fire: Flame,
  stone: Gem,
};

function useTicker() {
  const tick = useMock((s) => s.tick);
  useEffect(() => {
    let last = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      tick(Math.max(0, Math.min(0.25, (now - last) / 1000)));
      last = now;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [tick]);
}

/** Ink-wash mountain strip behind the title bar. */
function HeaderPainting() {
  return (
    <svg className="header-painting" viewBox="0 0 1600 90" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <path d="M0 90 L0 60 L90 40 L160 58 L260 22 L330 50 L420 30 L520 62 L640 18 L720 44 L800 28 L900 56 L1010 14 L1090 46 L1180 30 L1300 60 L1420 24 L1500 50 L1600 36 L1600 90 Z" fill="#cfd5d3" />
      <path d="M0 90 L0 74 L120 58 L220 72 L340 48 L460 76 L560 54 L700 70 L820 46 L940 74 L1060 50 L1200 72 L1330 52 L1460 70 L1600 56 L1600 90 Z" fill="#aab4b1" />
      <g fill="#7d8985">
        <rect x="1176" y="26" width="30" height="4" />
        <rect x="1181" y="30" width="20" height="8" />
        <rect x="1172" y="38" width="38" height="4" />
        <rect x="1178" y="42" width="26" height="10" />
      </g>
      <path d="M0 90 L0 82 L200 76 L420 84 L700 78 L980 84 L1250 76 L1600 82 L1600 90 Z" fill="#7f8c86" />
    </svg>
  );
}

function Header() {
  const age = useMock((s) => s.age);
  const lifespan = useMock((s) => s.lifespan);
  const running = useMock((s) => s.running);
  const toggle = useMock((s) => s.toggleRunning);
  const season = SEASONS[Math.floor((age % 1) * 4)];
  const year = Math.floor(age - 18) + 1;

  return (
    <header className="topbar">
      <HeaderPainting />
      <h1 className="logo">
        Samsara Cultivator <span className="seal">輪</span>
      </h1>
      <div className="clock">
        <span>
          Realm: <b>Mortal</b>
        </span>
        <span>
          Year <b data-testid="mock-age">{Math.floor(age)}</b> / {lifespan}
        </span>
        <span>
          Season: {season}, Year {year}
        </span>
      </div>
      <div className="topbar-buttons">
        <button className="icon-btn" onClick={toggle} title={running ? "Pause time" : "Resume time"}>
          {running ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button className="icon-btn" title="Settings">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
}

function SideNav() {
  const nav = useMock((s) => s.nav);
  const setNav = useMock((s) => s.setNav);
  return (
    <nav className="sidenav">
      {NAV.map((item) => {
        const Icon = NAV_ICONS[item.id];
        return (
          <button
            key={item.id}
            className={`nav-item${nav === item.id ? " active" : ""}${item.locked ? " locked" : ""}`}
            onClick={() => !item.locked && setNav(item.id)}
            title={item.locked ? "Revealed in a later life" : item.label}
          >
            <Icon size={18} />
            <span>{item.label}</span>
            {item.locked && <Lock size={12} className="lock" />}
          </button>
        );
      })}
    </nav>
  );
}

function Stat({ label, value, tone }: { label: string; value: ReactNode; tone?: "bad" | "good" }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <b className={tone}>{value}</b>
    </div>
  );
}

function CharacterPanel() {
  const age = useMock((s) => s.age);
  const lifespan = useMock((s) => s.lifespan);
  const stage = useMock((s) => s.stage);
  const impurity = useMock((s) => s.impurity);
  const action = useMock((s) => s.action);
  const running = useMock((s) => s.running);
  const def = ACTIONS.find((a) => a.id === action)!;

  return (
    <section className="panel character">
      <h2>Reincarnator</h2>
      <div className="char-top">
        <div className="portrait">
          <img src={spriteUrl("idle")} alt="The reincarnator" />
        </div>
        <div className="char-stats">
          <Stat label="Age" value={Math.floor(age)} />
          <Stat label="Lifespan" value={lifespan} />
          <Stat label="Remaining" value={`${Math.ceil(lifespan - age)} years`} />
          <div className="stat realm">
            <span>Current Realm</span>
            <b>Body Tempering</b>
          </div>
          <Stat label="Stage" value={`${stage} / 9`} />
          <div className="stat-note">({STAGES[stage - 1]} Tempering)</div>
          <Stat label="Impurity" value={`${Math.round(impurity * 100)}%`} tone="bad" />
          <Stat label="Condition" value="Healthy" tone="good" />
        </div>
      </div>
      <h3>Current Action</h3>
      <div className="current-action">
        <div className="ca-thumb">
          <img src={spriteUrl(def.sprite)} alt="" />
        </div>
        <div>
          <b>{running ? def.verb : `${def.verb} (paused)`}</b>
          <p>{ACTION_DETAIL[action]}</p>
        </div>
        <button className="icon-btn small" title="Queue next action">
          <ChevronsRight size={16} />
        </button>
      </div>
      <blockquote>
        “A single lifetime is but a seed.
        <br />
        The Dao spans countless springs.”
        <span className="seal small">道</span>
      </blockquote>
    </section>
  );
}

function RealmPanel() {
  const stage = useMock((s) => s.stage);
  const progress = useMock((s) => s.stageProgress);
  const bonePowder = useMock((s) => s.bonePowder);
  const beastMarrow = useMock((s) => s.beastMarrow);
  const pct = Math.floor(progress * 100);

  return (
    <section className="panel realm">
      <div className="realm-head">
        <div className="realm-emblem">
          <Sparkles size={30} />
        </div>
        <div>
          <h2>Body Tempering</h2>
          <p>
            Temper the mortal body, refine the flesh and bones, and lay the foundation for a longer life and greater
            realms. A solid body endures all tribulations.
          </p>
        </div>
        <button className="ghost-btn">
          Realm Details <ChevronRight size={14} />
        </button>
      </div>
      <SceneView />
      <ol className="stages">
        {STAGES.map((name, i) => {
          const n = i + 1;
          const state = n < stage ? "done" : n === stage ? "current" : "todo";
          return (
            <li key={name} className={state}>
              <span className="dot">{state === "done" ? <Check size={14} /> : n}</span>
              <span className="label">{name}</span>
            </li>
          );
        })}
      </ol>
      <div className="realm-cards">
        <div className="card progress-card">
          <h4>
            Stage {stage} · {STAGES[stage - 1]} Tempering
          </h4>
          <div className="bar-row">
            <div className="bar">
              <div className="fill" style={{ width: `${pct}%` }} />
            </div>
            <span>{pct}%</span>
          </div>
        </div>
        <div className="card">
          <h5>Next Milestone</h5>
          <ul className="kv">
            <li>
              <Bone size={13} /> Bone Density <b>+15%</b>
            </li>
            <li>
              <Hourglass size={13} /> Lifespan <b>+5 years</b>
            </li>
            <li>
              <Shield size={13} /> Impurity Tolerance <b>+10%</b>
            </li>
          </ul>
        </div>
        <div className="card">
          <h5>Requirements</h5>
          <ul className="kv">
            <li>
              <Mountain size={13} /> Bone Powder <b>{Math.floor(bonePowder)} / 30</b>
            </li>
            <li>
              <Bone size={13} /> Beast Marrow <b>{Math.floor(beastMarrow)} / 10</b>
            </li>
            <li>
              <Clock size={13} /> Cultivation Time <b>2 years</b>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Opportunities() {
  return (
    <section className="panel opportunities">
      <h2>
        <span className="diamond">◈</span> Discovered Opportunities <span className="count">{OPPORTUNITIES.length}</span>
      </h2>
      <ul>
        {OPPORTUNITIES.map((o) => (
          <li key={o.id}>
            <div
              className="opp-thumb"
              style={{ background: `linear-gradient(180deg, ${o.thumb[0]}, ${o.thumb[1]})` }}
              aria-hidden
            >
              <div className="opp-ridge" />
            </div>
            <div className="opp-body">
              <b>{o.name}</b>
              <p>{o.blurb}</p>
            </div>
            <div className="opp-act">
              <button className={`act-btn ${o.tone}`}>{o.action}</button>
              <small>{o.tag}</small>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function EncounterPreview() {
  return (
    <section className="panel encounter">
      <div className="enc-head">
        <h2>
          <span className="diamond">◈</span> Encounter Preview
        </h2>
        <span className="threat">Threat: Moderate</span>
      </div>
      <div className="enc-scene">
        <div className="enc-title">
          <b>Spirit Wolf Den</b>
          <span>Lv. 15 · Spirit Beast Pack</span>
        </div>
        <img className="enc-hero" src={spriteUrl("combat")} alt="" />
        <div className="wolves" aria-hidden>
          <i style={{ left: "58%", top: "52%" }} />
          <i style={{ left: "72%", top: "44%" }} />
          <i style={{ left: "84%", top: "58%" }} />
        </div>
      </div>
      <div className="enc-foot">
        <span>Possible Rewards</span>
        <button className="ghost-btn">
          View Details <ChevronRight size={14} />
        </button>
      </div>
      <div className="enc-rewards">
        {[Bone, Gem, Sprout, Bone, Shield].map((Icon, i) => (
          <span key={i} className="reward">
            <Icon size={20} />
          </span>
        ))}
        <button className="act-btn attack engage">Engage</button>
      </div>
    </section>
  );
}

function PrimaryActions() {
  const action = useMock((s) => s.action);
  const setAction = useMock((s) => s.setAction);
  return (
    <section className="primary-actions">
      <h2>
        <span className="diamond">◈</span> Primary Actions
      </h2>
      <div className="action-row">
        {ACTIONS.map((a) => (
          <button
            key={a.id}
            className={`action-card scene-${a.scene}${action === a.id ? " selected" : ""}`}
            onClick={() => setAction(a.id)}
          >
            <div className="ac-art">
              <img src={spriteUrl(a.sprite)} alt="" />
            </div>
            <div className="ac-text">
              <b>{a.name}</b>
              <p>{a.blurb}</p>
            </div>
            <ChevronRight size={16} className="ac-chev" />
          </button>
        ))}
      </div>
    </section>
  );
}

function ResourcesBar() {
  const tab = useMock((s) => s.resourceTab);
  const setTab = useMock((s) => s.setResourceTab);
  return (
    <section className="panel resources">
      <div className="res-head">
        <h2>
          <span className="diamond">◈</span> Resources &amp; Locations
        </h2>
        <div className="tabs">
          <button className={tab === "resources" ? "on" : ""} onClick={() => setTab("resources")}>
            Resources
          </button>
          <button className={tab === "locations" ? "on" : ""} onClick={() => setTab("locations")}>
            Claimed Locations
          </button>
        </div>
      </div>
      <div className="res-row">
        {tab === "resources"
          ? RESOURCES.map((r) => {
              const Icon = RESOURCE_ICONS[r.icon];
              return (
                <div key={r.id} className={`res-item ${r.icon}`}>
                  <Icon size={26} />
                  <div>
                    <span>{r.name}</span>
                    <b>{r.amount}</b>
                  </div>
                </div>
              );
            })
          : LOCATIONS.map((l) => (
              <div key={l.id} className="res-item">
                <MapIcon size={26} />
                <div>
                  <span>{l.name}</span>
                  <b>{l.note}</b>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
}

export function MockupApp() {
  useTicker();
  return (
    <div className="mockup">
      <Header />
      <SideNav />
      <CharacterPanel />
      <RealmPanel />
      <Opportunities />
      <PrimaryActions />
      <ResourcesBar />
      <EncounterPreview />
    </div>
  );
}
