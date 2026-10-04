import {
  AlertTriangle,
  Backpack,
  Bone,
  BookOpen,
  Brain,
  CircleAlert,
  Clover,
  Compass,
  Crown,
  Dumbbell,
  Eye,
  Feather,
  Flame,
  Footprints,
  Gauge,
  Gem,
  Heart,
  HeartPulse,
  Hourglass,
  House,
  Key,
  Leaf,
  Map as MapIcon,
  Mountain,
  Pause,
  Plus,
  Rabbit,
  ScrollText,
  Settings,
  Shield,
  Shirt,
  Sparkles,
  Sprout,
  Star,
  Sword,
  Swords,
  Trophy,
  User,
  Waves,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  AchievementBanner,
  ActionCard,
  ActionTile,
  Badge,
  BottleneckCard,
  Button,
  CharacterSheet,
  Checkbox,
  Collapsible,
  Dialog,
  Divider,
  Emblem,
  EquipmentGrid,
  EquipmentSlot,
  ForecastCard,
  GameWindow,
  HelpCard,
  HoverTooltip,
  IconButton,
  InventoryGrid,
  ItemCard,
  ItemChip,
  ItemIcon,
  ItemIconRow,
  ItemInfoCard,
  ItemSlot,
  ItemTooltip,
  LifeSummary,
  LinkRow,
  ListRow,
  LockedBadge,
  LockedNotice,
  ManualCard,
  ManualRow,
  MasteryRow,
  MilestoneCard,
  Modal,
  NavList,
  NavTabs,
  NpcDialogue,
  OpportunityCard,
  OpportunityRow,
  Panel,
  PanelHeader,
  PortraitCard,
  ProgressBar,
  Radio,
  RARITIES,
  RarityBadge,
  RarityRow,
  REALMS,
  RealmBadge,
  RequirementChecklist,
  ResourceBar,
  ResourceChip,
  Scene,
  SceneModule,
  SectionBanner,
  SectionTitle,
  SegmentedControl,
  Select,
  StatList,
  StateCard,
  StepProgress,
  Toast,
  Toggle,
  ToastViewport,
  Tooltip,
  TechniqueRow,
  WorldConditionCard,
  cx,
  useToasts,
  type ButtonVariant,
  type Rarity,
  type SceneVariant,
} from "../ui/components";
import { CATALYST, ITEMS, SPRITES } from "./data";
import "./gallery.css";

const item = (id: string) => ITEMS.find((i) => i.id === id)!;

function Specimen({ title, wide, children }: { title: string; wide?: boolean; children: ReactNode }) {
  return (
    <figure className={cx("gal-specimen", wide && "gal-specimen--wide")}>
      <figcaption>{title}</figcaption>
      <div className="gal-specimen__body">{children}</div>
    </figure>
  );
}

function Section({ id, index, title, children }: { id: string; index: number; title: string; children: ReactNode }) {
  return (
    <section className="gal-section" id={id} aria-labelledby={`${id}-h`}>
      <div id={`${id}-h`}>
        <SectionBanner index={index}>{title}</SectionBanner>
      </div>
      <div className="gal-grid">{children}</div>
    </section>
  );
}

const SECTIONS = [
  { id: "shells", title: "Window and Panel Shells" },
  { id: "controls", title: "Buttons and Controls" },
  { id: "display", title: "Core Display" },
  { id: "character", title: "Character and Progression" },
  { id: "content", title: "Content Cards" },
  { id: "inventory", title: "Inventory and Items" },
  { id: "dialogue", title: "Dialogue and Communication" },
  { id: "states", title: "States and Utilities" },
  { id: "foundations", title: "Foundations" },
];

/** Book glyph used for manuals, tinted by rarity. */
function Book({ rarity = "rare" as Rarity }) {
  return <ItemIcon icon={BookOpen} rarity={rarity} />;
}

/* ================================================================== 1 */

function Shells() {
  const [win, setWin] = useState("overview");
  const [side, setSide] = useState("one");
  const [sub, setSub] = useState("b");
  const [modal, setModal] = useState<null | "confirm" | "delete">(null);
  const close = () => setModal(null);

  return (
    <Section id="shells" index={1} title={SECTIONS[0].title}>
      <Specimen title="Large Main Window" wide>
        <GameWindow
          title="Window Title"
          icon={Mountain}
          nav={
            <NavList
              label="Window sections"
              chevrons={false}
              value={win}
              onSelect={setWin}
              items={[
                { id: "overview", label: "Overview", icon: House },
                { id: "cultivation", label: "Cultivation", icon: Sprout },
                { id: "explore", label: "Explore", icon: MapIcon },
                { id: "inventory", label: "Inventory", icon: Backpack },
                { id: "character", label: "Character", icon: User },
                { id: "system", label: "System", icon: Settings },
              ]}
            />
          }
        >
          <Scene variant="mist" pagoda aspect={2} alt="Misty peaks with a pagoda" />
        </GameWindow>
      </Specimen>

      <Specimen title="Side Panel">
        <Panel title="Section Title">
          <NavList
            label="Side panel"
            value={side}
            onSelect={setSide}
            items={[
              { id: "one", label: "Item One", icon: House },
              { id: "two", label: "Item Two", icon: Sprout },
              { id: "three", label: "Item Three", icon: MapIcon },
              { id: "four", label: "Item Four", icon: Leaf },
              { id: "five", label: "Item Five", icon: Sparkles, disabled: true, trailing: <LockedBadge /> },
            ]}
          />
        </Panel>
      </Specimen>

      <Specimen title="Subsection Panel">
        <Panel title="Subsection" variant="sunk">
          <NavList
            label="Subsection"
            value={sub}
            onSelect={setSub}
            items={[
              { id: "a", label: "Option A", icon: Wind },
              { id: "b", label: "Option B", icon: Shield },
              { id: "c", label: "Option C", icon: Sparkles },
              { id: "d", label: "Option D", icon: Gem },
            ]}
          />
        </Panel>
      </Specimen>

      <Specimen title="Compact Info Card">
        <ItemInfoCard item={item("herb")} />
      </Specimen>

      <Specimen title="Collapsible Section">
        <div>
          <Collapsible title="Cultivation Records" defaultOpen>
            <LinkRow icon={ScrollText}>Recent Progress</LinkRow>
            <LinkRow icon={Gauge}>Stat Details</LinkRow>
          </Collapsible>
          <Collapsible title="Character Background">
            <p className="gal-note">Born in a mountain village to a family of herb gatherers.</p>
          </Collapsible>
        </div>
      </Specimen>

      <Specimen title="Tooltip">
        <Tooltip icon={Leaf} title="Purity of Mind">
          Increases meditation efficiency and reduces impurity gain.
        </Tooltip>
      </Specimen>

      <Specimen title="Modal Dialog">
        <Dialog
          title="Confirm Action"
          actions={
            <>
              <Button variant="success">Confirm</Button>
              <Button variant="secondary">Cancel</Button>
            </>
          }
        >
          Consume 1 Spirit Herb to refine?
        </Dialog>
        <Button variant="tertiary" size="sm" onClick={() => setModal("confirm")}>
          Open as modal
        </Button>
      </Specimen>

      <Specimen title="Confirmation Dialog">
        <Dialog
          title="Delete Item?"
          icon={CircleAlert}
          tone="red"
          actions={
            <>
              <Button variant="danger">Delete</Button>
              <Button variant="secondary">Cancel</Button>
            </>
          }
        >
          This action cannot be undone.
        </Dialog>
        <Button variant="tertiary" size="sm" onClick={() => setModal("delete")}>
          Open as modal
        </Button>
      </Specimen>

      <Modal
        open={modal === "confirm"}
        onClose={close}
        title="Confirm Action"
        actions={
          <>
            <Button variant="success" onClick={close}>
              Confirm
            </Button>
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
          </>
        }
      >
        Consume 1 Spirit Herb to refine?
      </Modal>
      <Modal
        open={modal === "delete"}
        onClose={close}
        title="Delete Item?"
        icon={CircleAlert}
        actions={
          <>
            <Button variant="danger" onClick={close}>
              Delete
            </Button>
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
          </>
        }
      >
        This action cannot be undone.
      </Modal>
    </Section>
  );
}

/* ================================================================== 2 */

const BUTTON_ROWS: Array<{ variant: ButtonVariant; label: string; text: string }> = [
  { variant: "primary", label: "Primary", text: "Button" },
  { variant: "secondary", label: "Secondary", text: "Button" },
  { variant: "tertiary", label: "Tertiary", text: "Button" },
  { variant: "success", label: "Success", text: "Confirm" },
  { variant: "warning", label: "Warning", text: "Warning" },
  { variant: "danger", label: "Danger", text: "Delete" },
  { variant: "neutral", label: "Neutral", text: "Button" },
];

function Controls() {
  const [paused, setPaused] = useState(false);
  const [seg, setSeg] = useState("resources");
  const [tab, setTab] = useState("overview");
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState("selected");
  const [on, setOn] = useState(true);
  const [off, setOff] = useState(false);
  const [cat, setCat] = useState("all");

  return (
    <Section id="controls" index={2} title={SECTIONS[1].title}>
      <Specimen title="Buttons" wide>
        <div className="gal-scroll">
          <table className="gal-btn-table">
            <thead>
              <tr>
                <th />
                <th scope="col">Idle</th>
                <th scope="col">Hover</th>
                <th scope="col">Pressed</th>
                <th scope="col">Disabled</th>
              </tr>
            </thead>
            <tbody>
              {BUTTON_ROWS.map((r) => (
                <tr key={r.variant}>
                  <th scope="row">{r.label}</th>
                  <td>
                    <Button variant={r.variant}>{r.text}</Button>
                  </td>
                  <td>
                    <Button variant={r.variant} forceState="hover">
                      {r.text}
                    </Button>
                  </td>
                  <td>
                    <Button variant={r.variant} forceState="pressed">
                      {r.text}
                    </Button>
                  </td>
                  <td>
                    <Button variant={r.variant} disabled>
                      {r.text}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Specimen>

      <Specimen title="Button Sizes and Icons">
        <div className="gal-row">
          <Button size="sm">Small</Button>
          <Button>Medium</Button>
          <Button size="lg">Large</Button>
        </div>
        <div className="gal-row">
          <Button variant="success" icon={Sparkles}>
            Break Through
          </Button>
          <Button variant="secondary" iconRight={Compass}>
            Explore
          </Button>
        </div>
        <Button variant="primary" block>
          Full Width
        </Button>
      </Specimen>

      <Specimen title="Icon Buttons">
        <div className="gal-row">
          <IconButton icon={Settings} label="Settings" />
          <IconButton icon={Pause} label={paused ? "Resume" : "Pause"} active={paused} onClick={() => setPaused((p) => !p)} />
          <IconButton icon={Plus} label="Add" variant="primary" />
          <IconButton icon={Star} label="Favourite" variant="ghost" />
          <IconButton icon={Settings} label="Settings (disabled)" disabled />
        </div>
        <div className="gal-row">
          <IconButton icon={Settings} label="Small" size="sm" />
          <IconButton icon={Settings} label="Medium" />
          <IconButton icon={Settings} label="Large" size="lg" />
        </div>
      </Specimen>

      <Specimen title="Segmented Control / Filter Tabs">
        <SegmentedControl
          label="Filter"
          value={seg}
          onChange={setSeg}
          options={[
            { id: "all", label: "All" },
            { id: "cultivation", label: "Cultivation" },
            { id: "resources", label: "Resources" },
            { id: "items", label: "Items", count: 12 },
          ]}
        />
      </Specimen>

      <Specimen title="Navigation Tabs" wide>
        <NavTabs
          label="Main"
          value={tab}
          onChange={setTab}
          tabs={[
            { id: "overview", label: "Overview", icon: Sprout },
            { id: "cultivation", label: "Cultivation", icon: Leaf },
            { id: "explore", label: "Explore", icon: MapIcon },
            { id: "inventory", label: "Inventory", icon: Backpack },
            { id: "character", label: "Character", icon: User },
            { id: "sect", label: "Sect", icon: House, disabled: true },
          ]}
        />
      </Specimen>

      <Specimen title="Checkbox, Radio and Toggle">
        <div className="gal-cols">
          <div className="gal-stack">
            <Checkbox label="Checked" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
            <Checkbox label="Unchecked" checked={!checked} onChange={(e) => setChecked(!e.target.checked)} />
            <Checkbox label="Disabled" disabled />
          </div>
          <div className="gal-stack" role="radiogroup" aria-label="Radio example">
            <Radio label="Selected" name="gal-radio" checked={radio === "selected"} onChange={() => setRadio("selected")} />
            <Radio label="Unselected" name="gal-radio" checked={radio === "other"} onChange={() => setRadio("other")} />
            <Radio label="Disabled" name="gal-radio" disabled />
          </div>
          <div className="gal-stack">
            <Toggle label={<span className="sc-visually-hidden">Toggle one</span>} checked={on} onChange={setOn} />
            <Toggle label={<span className="sc-visually-hidden">Toggle two</span>} checked={off} onChange={setOff} />
            <Toggle label="Auto-cultivate" checked={false} onChange={() => {}} disabled showState={false} />
          </div>
        </div>
      </Specimen>

      <Specimen title="Dropdown Field">
        <Select
          label="Category"
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          options={[
            { value: "all", label: "All Categories" },
            { value: "herbs", label: "Herbs" },
            { value: "ores", label: "Ores" },
            { value: "manuals", label: "Manuals" },
          ]}
        />
      </Specimen>
    </Section>
  );
}

/* ================================================================== 3 */

const SCENE_VARIANTS: SceneVariant[] = ["mist", "dawn", "forest", "fire", "demonic", "night"];

function Display() {
  return (
    <Section id="display" index={3} title={SECTIONS[2].title}>
      <Specimen title="Progress Bars">
        <div className="gal-stack">
          <ProgressBar value={68} showValue aria-label="Standard" />
          <ProgressBar value={28} label="Cultivation Progress" showValue />
          <ProgressBar value={45} tone="blue" size="lg" showValue aria-label="Large blue" />
          <ProgressBar value={80} tone="gold" size="sm" aria-label="Small gold" />
          <StepProgress current={3} total={5} />
        </div>
      </Specimen>

      <Specimen title="Resource Bars">
        <div className="gal-stack">
          <ResourceBar icon={HeartPulse} label="Vitality" value={72} max={100} tone="jade" />
          <ResourceBar icon={Zap} label="Spirit Power" value={48} max={100} tone="blue" />
          <ResourceBar icon={Brain} label="Mental State" value={30} max={100} tone="gold" />
          <ResourceBar
            icon={Waves}
            label="Impurity"
            value={16}
            max={100}
            tone="red"
            valueTone="bad"
            format={(v) => `${v}%`}
          />
        </div>
      </Specimen>

      <Specimen title="Status Pills / Badges">
        <div className="gal-row">
          <Badge tone="jade" variant="solid">
            Active
          </Badge>
          <Badge tone="grey">Inactive</Badge>
          <Badge tone="jade">Favourite</Badge>
          <Badge tone="red" variant="solid">
            Threat
          </Badge>
          <Badge tone="blue" variant="solid">
            New
          </Badge>
          <LockedBadge />
          <Badge tone="gold" variant="outline" icon={Star}>
            Bonus
          </Badge>
        </div>
        <div className="gal-row">
          {RARITIES.map((r) => (
            <RarityBadge key={r} rarity={r} />
          ))}
        </div>
        <div className="gal-row">
          {REALMS.map((r) => (
            <RealmBadge key={r} realm={r} />
          ))}
        </div>
        <div className="gal-row">
          <RealmBadge realm="spirit" stage="Stage 3" />
          <RealmBadge realm="divine" stage={9} size="sm" />
        </div>
      </Specimen>

      <Specimen title="List Row Styles">
        <div>
          <ListRow
            media={<ItemIcon icon={Sword} rarity="uncommon" />}
            title="Sword Arts Ascendant"
            badge={<Badge tone="jade" size="sm">Favourite</Badge>}
            subtitle="Sword cultivation techniques are more commonly found."
            onClick={() => {}}
          />
          <ListRow
            media={<Book rarity="epic" />}
            title="Demonic Ember Manual"
            badge={
              <Badge tone="red" variant="solid" size="sm">
                Threat
              </Badge>
            }
            subtitle="Sections 1 / 4"
            progress={<ProgressBar value={18} size="sm" showValue tone="red" />}
            onClick={() => {}}
          />
        </div>
      </Specimen>

      <Specimen title="Framed Scenic Thumbnails" wide>
        <div className="gal-thumbs">
          {SCENE_VARIANTS.map((v, i) => (
            <figure key={v}>
              <Scene variant={v} pagoda={i % 2 === 0} aspect={4 / 3} alt={`${v} scene`} />
              <figcaption>{v}</figcaption>
            </figure>
          ))}
        </div>
      </Specimen>

      <Specimen title="Panel Headers and Dividers">
        <div className="gal-stack">
          <PanelHeader icon={Mountain}>Current Frontier</PanelHeader>
          <SectionTitle>Section Title</SectionTitle>
          <SectionTitle icon={Flame} action={<Button size="sm" variant="secondary">View</Button>}>
            With Action
          </SectionTitle>
          <Divider label="Subsection Divider" />
          <Divider />
        </div>
      </Specimen>

      <Specimen title="Emblems">
        <div className="gal-row">
          <Emblem icon={Sprout} tone="jade" size="lg" />
          <Emblem icon={Mountain} tone="navy" />
          <Emblem icon={Flame} tone="red" />
          <Emblem icon={Crown} tone="gold" />
          <Emblem icon={Sparkles} tone="purple" size="sm" />
          <Emblem icon={Key} tone="grey" size="sm" />
        </div>
      </Specimen>

      <Specimen title="Stat List">
        <StatList
          stats={[
            { label: "Age", value: 18 },
            { label: "Realm", value: "Mortal" },
            { label: "Core Trait", value: "Steady", tone: "good" },
            { label: "Impurity", value: "16%", tone: "bad" },
            { label: "Stage", value: "3 / 9", note: "(Bone Tempering)" },
          ]}
        />
      </Specimen>
    </Section>
  );
}

/* ================================================================== 4 */

function CharacterSection() {
  return (
    <Section id="character" index={4} title={SECTIONS[3].title}>
      <Specimen title="Character Sheet (Large)" wide>
        <CharacterSheet
          portrait={SPRITES.idle}
          name="Disciple"
          onEdit={() => {}}
          stats={[
            { label: "Age", value: 18 },
            { label: "Lifespan", value: 73 },
            { label: "Realm", value: "Mortal" },
            { label: "Stage", value: "3 / 9", note: "(Bone Tempering)" },
            { label: "Sect", value: "Cloudridge Sect" },
            { label: "Core Trait", value: "Steady", tone: "good" },
            { label: "Impurity", value: "16%", tone: "bad" },
            { label: "Condition", value: "Healthy", tone: "good" },
          ]}
        />
      </Specimen>

      <Specimen title="Attributes">
        <Panel title="Attributes" variant="plain">
          <StatList
            dense
            stats={[
              { label: "Body", value: 18, icon: Dumbbell },
              { label: "Lifespan", value: 12, icon: Hourglass },
              { label: "Perception", value: 14, icon: Eye },
              { label: "Mental", value: 10, icon: Brain },
              { label: "Luck", value: 8, icon: Clover },
            ]}
          />
        </Panel>
      </Specimen>

      <Specimen title="Combat Stats">
        <Panel title="Combat Stats" variant="plain">
          <StatList
            dense
            stats={[
              { label: "Vitality", value: "72 / 100", icon: Heart },
              { label: "Spirit Power", value: "48 / 100", icon: Zap },
              { label: "Mental State", value: "30 / 100", icon: Brain },
              { label: "Inspiring", value: "3 / 5", icon: Flame },
            ]}
          />
        </Panel>
      </Specimen>

      <Specimen title="Current Life Summary">
        <LifeSummary
          realm="Body Tempering"
          stage={3}
          stages={9}
          progress={28}
          rows={[
            { label: "Estimated Years", value: "12 years", icon: Hourglass },
            { label: "Major Bottleneck", value: "Impurity 16%", tone: "bad", icon: AlertTriangle },
            { label: "Current Location", value: "Secluded Peak", icon: Mountain },
            { label: "Current Focus", value: "Refine the body", icon: Footprints },
            { label: "Next Goal", value: "Reach Stage 4", tone: "good", icon: Star },
          ]}
        />
      </Specimen>

      <Specimen title="Permanent Expertise">
        <div>
          <ManualRow icon={<Book rarity="rare" />} title="Human Sword Canon" current={3} total={5} onClick={() => {}} />
          <ManualRow icon={<Book rarity="epic" />} title="Demonic Ember Manual" current={1} total={4} onClick={() => {}} />
          <ManualRow icon={<Book rarity="uncommon" />} title="Pure Qi Breathing Method" current={4} total={4} onClick={() => {}} />
        </div>
      </Specimen>

      <Specimen title="Frontier / Bottleneck">
        <BottleneckCard
          title="Stage 3 → Stage 4"
          subtitle="Bone Tempering → Organs Tempering"
          progress={28}
          bottleneck={{
            title: "Current Bottleneck",
            value: "Impurity 16%",
            description: "Impurity hinders the refining of the body. Clear impurities to advance.",
          }}
          action={
            <Button variant="secondary" block>
              View Solutions
            </Button>
          }
        />
      </Specimen>

      <Specimen title="Requirement Checklist">
        <RequirementChecklist
          items={[
            { label: "Bone Density", value: "15% / 30%", state: "failed" },
            { label: "Lifespan", value: "73 / 80", state: "met" },
            { label: "Impurity Tolerance", value: "10% / 10%", state: "met" },
            { label: "Find Clear Spring", state: "pending" },
          ]}
        />
      </Specimen>

      <Specimen title="Mastery / Automated State">
        <div className="gal-stack">
          <MasteryRow title="Basic Conditioning" description="Routines execute automatically." />
          <MasteryRow title="Routine Herb Gathering" description="Resources gathered during exploration." status={null} />
        </div>
      </Specimen>

      <Specimen title="Locked Foundation Notice">
        <LockedNotice title="Meridian Opening" description="Reach Mortal Realm Stage 6 to unlock this foundation." />
      </Specimen>

      <Specimen title="Small Portrait Module">
        <div className="gal-stack">
          <PortraitCard portrait={SPRITES.idle} name="Disciple" tag="Mortal" />
          <PortraitCard portrait={SPRITES.contemplate} name="Elder Chen" tag="Foundation" tagTone="gold" />
        </div>
      </Specimen>

      <Specimen title="Cultivation Scene Module" wide>
        <SceneModule
          scene={{ variant: "forest", sprite: SPRITES.meditate, alt: "Meditating under the trees" }}
          title="Body Tempering · Stage 3"
          badge="Breakthrough"
          progress={28}
        />
      </Specimen>
    </Section>
  );
}

/* ================================================================== 5 */

function Content() {
  const [active, setActive] = useState("refine");
  return (
    <Section id="content" index={5} title={SECTIONS[4].title}>
      <Specimen title="World Condition Card">
        <WorldConditionCard
          scene={{ variant: "fire", pagoda: true }}
          title="Fire-Touched Lands"
          status="Active"
          description="Fire-aligned materials and techniques appear more frequently in this region."
        />
      </Specimen>

      <Specimen title="Opportunity Cards" wide>
        <div className="gal-cards">
          <OpportunityCard
            scene={{ variant: "mist", pagoda: true }}
            title="Ancient Battlefield"
            description="Traces of old heroes linger. May find basic resources."
            risk="low"
          />
          <OpportunityCard
            scene={{ variant: "fire" }}
            title="Crimson Fire Valley"
            description="Intense fire energy. High risk, high reward."
            risk="medium"
          />
          <OpportunityCard
            scene={{ variant: "demonic", pagoda: true }}
            title="Demonic Ruins"
            description="Strong demonic presence. Great opportunities, greater danger."
            risk="high"
          />
        </div>
      </Specimen>

      <Specimen title="Action Card">
        <ActionCard
          scene={{ variant: "forest", sprite: SPRITES.explore }}
          title="Gather Spirit Herb"
          description="Search the area for spirit herbs and valuable materials."
          duration="4 hours"
          risk="low"
        />
      </Specimen>

      <Specimen title="Action Tiles">
        <div className="gal-cards gal-cards--2">
          <ActionTile
            scene={{ variant: "forest", sprite: SPRITES.meditate }}
            title="Refine Pill"
            description="Refine elixirs to improve cultivation."
            active={active === "refine"}
            onClick={() => setActive("refine")}
          />
          <ActionTile
            scene={{ variant: "dawn", sprite: SPRITES.train }}
            title="Train"
            description="Temper the body."
            active={active === "train"}
            onClick={() => setActive("train")}
          />
        </div>
      </Specimen>

      <Specimen title="Opportunity Row Card">
        <div>
          <OpportunityRow
            scene={{ variant: "mist", pagoda: true }}
            title="Ancient Battlefield"
            description="Traces of old heroes linger. A chance for rare insights."
            risk="medium"
            onClick={() => {}}
          />
          <OpportunityRow
            scene={{ variant: "fire" }}
            title="Crimson Fire Valley"
            description="Intense fire energy. High risk, high reward."
            risk="high"
            onClick={() => {}}
          />
        </div>
      </Specimen>

      <Specimen title="Manual / Technique Card">
        <ManualCard icon={<Book />} title="Human Sword Canon" path="Human Path" current={3} total={5} percent={42} steps />
      </Specimen>

      <Specimen title="Manual / Inheritance Card">
        <ManualCard
          icon={<Book rarity="uncommon" />}
          title="Spirit Herb Manual"
          current={1}
          total={3}
          onClick={() => {}}
          tags={[
            <Badge key="c" tone="blue" size="sm">
              Cultivation
            </Badge>,
            <Badge key="m" tone="gold" size="sm">
              Material
            </Badge>,
          ]}
          description="Records the properties and gathering methods of common spirit herbs."
          action={
            <Button variant="secondary" size="sm">
              Study
            </Button>
          }
        />
      </Specimen>

      <Specimen title="Technique / Cultivation Plan Row">
        <div>
          <TechniqueRow icon={<ItemIcon icon={Waves} rarity="rare" />} name="Basic Bone Tempering" level={2} value={40} onClick={() => {}} />
          <TechniqueRow icon={<ItemIcon icon={Feather} rarity="epic" />} name="Meridian Clearing" level={1} value={25} onClick={() => {}} />
          <TechniqueRow icon={<ItemIcon icon={Flame} rarity="legendary" />} name="Fire Breath Refining" level={3} value={68} onClick={() => {}} />
        </div>
      </Specimen>

      <Specimen title="Forecast / Estimated Years">
        <ForecastCard
          value="12 years"
          delta="(+8% risk)"
          factors={[
            { icon: Hourglass, label: "Base Duration", value: "10 years" },
            { icon: Waves, label: "Realm Impurity", value: "+8%", tone: "bad" },
            { icon: ScrollText, label: "Technique Bonus", value: "−2 years", tone: "good" },
            { icon: Gem, label: "Resource Quality", value: "−1 year", tone: "good" },
          ]}
        />
      </Specimen>

      <Specimen title="Milestone / Next Breakthrough">
        <MilestoneCard
          scene={{ variant: "mist", pagoda: true }}
          title="Stage 3 → Stage 4"
          subtitle="Organs Tempering"
          benefits={["Refine the bones further", "Increase longevity and endurance", "Lay a sturdier foundation"]}
          action={
            <Button variant="secondary" block>
              View Details
            </Button>
          }
        />
      </Specimen>
    </Section>
  );
}

/* ================================================================== 6 */

function Inventory() {
  const [selected, setSelected] = useState<string>();
  return (
    <Section id="inventory" index={6} title={SECTIONS[5].title}>
      <Specimen title="Inventory Grid" wide>
        <InventoryGrid
          items={ITEMS}
          filters={[
            { id: "Material", label: "Materials" },
            { id: "Consumable", label: "Items" },
            { id: "Equipment", label: "Equipment" },
            { id: "Manual", label: "Manuals" },
          ]}
          minSlots={16}
          onAdd={() => {}}
          selectedId={selected}
          onSelect={(i) => setSelected(i.id)}
        />
      </Specimen>

      <Specimen title="Equipment Slots">
        <EquipmentGrid>
          <EquipmentSlot label="Weapon" icon={Swords} item={item("wood")} />
          <EquipmentSlot label="Clothes" icon={Shirt} />
          <EquipmentSlot label="Accessory" icon={Gem} />
          <EquipmentSlot label="Talisman" icon={ScrollText} />
          <EquipmentSlot label="Artifact" icon={Shield} item={item("shell")} />
          <EquipmentSlot label="Mount" icon={Rabbit} locked />
        </EquipmentGrid>
      </Specimen>

      <Specimen title="Resource Chips">
        <div className="gal-stack">
          <ResourceChip icon={Leaf} label="Spirit Herb" amount={12} />
          <ResourceChip icon={Mountain} label="Bone Powder" amount={30} tint="#8a7a6b" />
          <ResourceChip icon={Flame} label="Beast Marrow" amount={10} tint="#b0342a" />
          <ResourceChip icon={Gem} label="Spirit Stone" amount={25} tint="#3d78b5" />
        </div>
      </Specimen>

      <Specimen title="Material Card">
        <ItemCard item={item("herb")} />
      </Specimen>

      <Specimen title="Catalyst Card">
        <ItemCard item={CATALYST} />
      </Specimen>

      <Specimen title="Item Tooltip (Basic)">
        <ItemTooltip item={item("herb")} />
      </Specimen>

      <Specimen title="Item Tooltip (Epic)">
        <ItemTooltip item={item("lotus")} />
      </Specimen>

      <Specimen title="Item Tooltip (Legendary)">
        <ItemTooltip item={item("core")} />
      </Specimen>

      <Specimen title="Item Tooltip (Mythic)">
        <ItemTooltip item={item("feather")} />
      </Specimen>

      <Specimen title="Rarity Treatments">
        <div className="gal-stack gal-stack--tight">
          <RarityRow icon={Leaf} rarity="common" count={12} />
          <RarityRow icon={Bone} rarity="uncommon" count={8} />
          <RarityRow icon={Gem} rarity="rare" count={3} />
          <RarityRow icon={Flame} rarity="epic" count={1} />
          <RarityRow icon={Sparkles} rarity="legendary" count={1} />
          <RarityRow icon={Crown} rarity="mythic" count={1} />
        </div>
      </Specimen>

      <Specimen title="Item Slots and Stacked Chips">
        <div className="gal-row">
          <ItemSlot onClick={() => {}} />
          <ItemSlot item={item("herb")} />
          <ItemSlot item={item("crystal")} size="lg" />
          <ItemSlot item={item("core")} size="sm" />
        </div>
        <div className="gal-row">
          <ItemChip item={item("herb")} />
          <ItemChip item={item("crystal")} />
          <ItemChip item={item("lotus")} />
        </div>
      </Specimen>

      <Specimen title="Rarity Frames and Icon Row">
        <div className="gal-row">
          {RARITIES.map((r) => (
            <ItemIcon key={r} icon={[Leaf, Bone, Gem, Flame, Sparkles, Crown][RARITIES.indexOf(r)]} rarity={r} size="lg" />
          ))}
        </div>
        <ItemIconRow
          items={ITEMS.slice(0, 8).map((i) => ({ icon: i.icon, rarity: i.rarity, label: i.name }))}
        />
      </Specimen>
    </Section>
  );
}

/* ================================================================== 7 */

const TOAST_SAMPLES: Array<{ message: string; icon: LucideIcon; tone: "jade" | "gold" | "red" | "blue" }> = [
  { message: "Obtained Spirit Herb × 3", icon: Leaf, tone: "jade" },
  { message: "Stage 3 reached", icon: Sparkles, tone: "gold" },
  { message: "Impurity rose to 18%", icon: AlertTriangle, tone: "red" },
  { message: "A new opportunity appeared", icon: Compass, tone: "blue" },
];

function Dialogue() {
  const { toasts, push, dismiss } = useToasts();
  const [said, setSaid] = useState<string>();
  return (
    <Section id="dialogue" index={7} title={SECTIONS[6].title}>
      <Specimen title="NPC Dialogue" wide>
        <NpcDialogue
          portrait={SPRITES.contemplate}
          name="Elder Chen"
          onChoose={setSaid}
          choices={[
            { id: "promising", label: "That sounds promising.", primary: true },
            { id: "risks", label: "What are the risks?" },
            { id: "prepare", label: "I'll prepare first." },
          ]}
        >
          {said === "risks"
            ? "Beasts guard the valley, and the fire qi there burns the careless."
            : said
              ? "Then go when you are ready. The mountains will wait, but not forever."
              : "The mountains have changed. A rare opportunity has appeared in the eastern valley. Will you go take a look?"}
        </NpcDialogue>
      </Specimen>

      <Specimen title="Notification Toast">
        <div className="gal-stack">
          <Toast icon={Leaf} onClose={() => {}}>
            Obtained Spirit Herb × 3
          </Toast>
          <Toast icon={AlertTriangle} tone="red">
            Impurity rose to 18%
          </Toast>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => push(TOAST_SAMPLES[Math.floor(Math.random() * TOAST_SAMPLES.length)])}
          >
            Show a toast
          </Button>
        </div>
        <ToastViewport toasts={toasts} onDismiss={dismiss} />
      </Specimen>

      <Specimen title="Achievement Banner">
        <AchievementBanner icon={Trophy} onClose={() => {}}>
          First Breakthrough
        </AchievementBanner>
      </Specimen>

      <Specimen title="Hover Tooltip">
        <div className="gal-row gal-row--tip">
          <HoverTooltip
            content={
              <Tooltip icon={Heart} title="Vitality">
                Determines physical endurance and resistance to trauma.
              </Tooltip>
            }
          >
            <Button variant="secondary" icon={Heart}>
              Hover me
            </Button>
          </HoverTooltip>
          <ItemSlot item={item("lotus")} />
        </div>
      </Specimen>

      <Specimen title="Help / Info Card">
        <HelpCard title="Impurity">
          Impurities hinder cultivation. They can be cleared through certain techniques or items.
        </HelpCard>
      </Specimen>
    </Section>
  );
}

/* ================================================================== 8 */

function States() {
  return (
    <Section id="states" index={8} title={SECTIONS[7].title}>
      <Specimen title="Empty State">
        <StateCard kind="empty" title="No items yet.">
          Items obtained will appear here.
        </StateCard>
      </Specimen>
      <Specimen title="Locked State">
        <StateCard kind="locked" title="Locked">
          Complete the required conditions to unlock.
        </StateCard>
      </Specimen>
      <Specimen title="Disabled State">
        <StateCard kind="disabled" title="Unavailable">
          Requirements not met.
        </StateCard>
      </Specimen>
      <Specimen title="Mastered State">
        <StateCard kind="mastered" title="Mastered">
          This content is fully mastered.
        </StateCard>
      </Specimen>
      <Specimen title="Loading / Searching">
        <StateCard kind="loading" title="Searching…">
          Exploring the area…
        </StateCard>
      </Specimen>
      <Specimen title="Confirmation / Warning">
        <Dialog
          title="Delete this item?"
          icon={CircleAlert}
          actions={
            <>
              <Button variant="danger" size="sm">
                Confirm
              </Button>
              <Button variant="secondary" size="sm">
                Cancel
              </Button>
            </>
          }
        />
      </Specimen>
    </Section>
  );
}

/* ================================================================== 9 */

const SWATCHES = [
  ["Parchment", "--sc-parchment"],
  ["Paper", "--sc-paper"],
  ["Navy", "--sc-navy"],
  ["Jade", "--sc-jade"],
  ["Blue", "--sc-blue"],
  ["Gold", "--sc-gold"],
  ["Red", "--sc-red"],
  ["Purple", "--sc-purple"],
  ["Grey", "--sc-grey"],
  ["Ink", "--sc-ink"],
];

function Foundations() {
  return (
    <Section id="foundations" index={9} title={SECTIONS[8].title}>
      <Specimen title="Colour Palette" wide>
        <div className="gal-swatches">
          {SWATCHES.map(([name, v]) => (
            <div key={v}>
              <span style={{ background: `var(${v})` }} />
              <b>{name}</b>
              <code>{v}</code>
            </div>
          ))}
        </div>
      </Specimen>
      <Specimen title="Typography">
        <div className="gal-stack gal-stack--tight">
          <span className="gal-logo-sample">Samsara Cultivator</span>
          <span style={{ fontSize: "var(--sc-text-xl)" }}>Heading 22 · EB Garamond</span>
          <span style={{ fontSize: "var(--sc-text-lg)" }}>Title 18</span>
          <span>Body 15 · The mountains have changed.</span>
          <span style={{ fontSize: "var(--sc-text-sm)" }} className="sc-tone-muted">
            Small 13.5 · muted helper text
          </span>
        </div>
      </Specimen>
      <Specimen title="Spacing (4px base) and Radius">
        <div className="gal-stack">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="gal-space">
              <span style={{ width: `var(--sc-space-${n})` }} />
              <code>--sc-space-{n}</code>
            </div>
          ))}
          <div className="gal-row">
            {["sm", "", "lg"].map((r) => (
              <span key={r} className="gal-radius" style={{ borderRadius: `var(--sc-radius${r ? `-${r}` : ""})` }}>
                {r || "md"}
              </span>
            ))}
          </div>
        </div>
      </Specimen>
    </Section>
  );
}

/* ================================================================== page */

export function Gallery() {
  return (
    <div className="sc-root gal">
      <header className="gal-header">
        <h1>
          <span className="gal-logo">Samsara Cultivator</span>
          <span className="gal-title">UI Component Library</span>
        </h1>
        <p>A design system for a cultivation journey. Every component is live: click, hover and resize.</p>
        <nav aria-label="Sections" className="gal-toc">
          {SECTIONS.map((s, i) => (
            <a key={s.id} href={`#${s.id}`}>
              {i + 1}. {s.title}
            </a>
          ))}
        </nav>
      </header>
      <main className="gal-main">
        <Shells />
        <Controls />
        <Display />
        <CharacterSection />
        <Content />
        <Inventory />
        <Dialogue />
        <States />
        <Foundations />
      </main>
    </div>
  );
}
