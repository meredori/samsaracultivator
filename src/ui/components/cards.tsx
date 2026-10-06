import { AlertTriangle, Check, CircleCheck, Clock, Hourglass, Lock, Mountain, Shield, X } from "lucide-react";
import { useId, type ReactNode } from "react";
import { Badge, Button, Chevron, Emblem, ProgressBar, Scene, StepProgress, type SceneProps } from "./primitives";
import { cx, RISK_LABEL, RISK_TONE, type Icon, type Risk, type Tone } from "./types";
import "./cards.css";

/** Wraps a card in a button when it is clickable. */
function Clickable({
  onClick,
  className,
  children,
  label,
}: {
  onClick?: () => void;
  className: string;
  children: ReactNode;
  label?: string;
}) {
  return onClick ? (
    <button type="button" className={cx(className, "is-clickable")} onClick={onClick} aria-label={label}>
      {children}
    </button>
  ) : (
    <div className={className}>{children}</div>
  );
}

export function RiskBadge({ risk, prefix }: { risk: Risk; prefix?: string }) {
  return (
    <Badge tone={RISK_TONE[risk]} size="sm">
      {prefix}
      {RISK_LABEL[risk]}
    </Badge>
  );
}

/* ------------------------------------------------------------------ list rows */

/** General row: media on the left, title and subtitle, optional badge, progress and chevron. */
export function ListRow({
  media,
  title,
  subtitle,
  badge,
  progress,
  trailing,
  onClick,
}: {
  media?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  progress?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Clickable onClick={onClick} className="sc-listrow">
      {media && <span className="sc-listrow__media">{media}</span>}
      <span className="sc-listrow__body">
        <span className="sc-listrow__head">
          <strong>{title}</strong>
          {badge}
        </span>
        {subtitle && <span className="sc-listrow__sub">{subtitle}</span>}
        {progress && <span className="sc-listrow__progress">{progress}</span>}
      </span>
      {trailing ?? (onClick && <Chevron />)}
    </Clickable>
  );
}

/** A manual or technique in a compact list, e.g. Permanent Expertise. */
export function ManualRow({
  icon,
  title,
  current,
  total,
  onClick,
}: {
  icon: ReactNode;
  title: ReactNode;
  current: number;
  total: number;
  onClick?: () => void;
}) {
  const titleId = useId();
  return (
    <ListRow
      media={icon}
      title={<span id={titleId}>{title}</span>}
      subtitle={`Sections ${current} / ${total}`}
      progress={<ProgressBar value={current} max={total} size="sm" showValue aria-labelledby={titleId} />}
      onClick={onClick}
    />
  );
}

/** A technique with level and progress, e.g. in a cultivation plan. */
export function TechniqueRow({
  icon,
  name,
  level,
  value,
  max = 100,
  onClick,
}: {
  icon: ReactNode;
  name: ReactNode;
  level: number;
  value: number;
  max?: number;
  onClick?: () => void;
}) {
  const nameId = useId();
  return (
    <ListRow
      media={icon}
      title={<span id={nameId}>{name}</span>}
      subtitle={
        <span className="sc-techrow__meta">
          <span>Lv.{level}</span>
          <ProgressBar value={value} max={max} size="sm" showValue aria-labelledby={nameId} />
        </span>
      }
      onClick={onClick}
    />
  );
}

/* ------------------------------------------------------------------ action / opportunity */

/** Picture tile for an action the character can take. */
export function ActionTile({
  scene,
  title,
  description,
  active,
  progress,
  onClick,
}: {
  scene: SceneProps;
  title: ReactNode;
  description?: ReactNode;
  active?: boolean;
  /** 0–1 through the current cycle of a running action; shows a looping bar when set. */
  progress?: number;
  onClick?: () => void;
}) {
  return (
    <Clickable onClick={onClick} className={cx("sc-actiontile", active && "is-active")}>
      <Scene {...scene} />
      <span className="sc-actiontile__body">
        <span>
          <strong>{title}</strong>
          {description && <span className="sc-actiontile__desc">{description}</span>}
        </span>
        {onClick && <Chevron />}
      </span>
      {/* always rendered so tiles keep the same height whether or not they are running */}
      <span className={cx("sc-actiontile__cycle", progress === undefined && "is-idle")} aria-hidden>
        <span style={{ width: `${Math.max(0, Math.min(1, progress ?? 0)) * 100}%` }} />
      </span>
    </Clickable>
  );
}

/** Horizontal opportunity row with thumbnail and risk. */
export function OpportunityRow({
  scene,
  title,
  description,
  risk,
  onClick,
}: {
  scene: SceneProps;
  title: ReactNode;
  description?: ReactNode;
  risk?: Risk;
  onClick?: () => void;
}) {
  return (
    <Clickable onClick={onClick} className="sc-opprow">
      <Scene aspect={4 / 3} {...scene} />
      <span className="sc-opprow__body">
        <span className="sc-opprow__head">
          <strong>{title}</strong>
          {risk && <RiskBadge risk={risk} />}
        </span>
        {description && <span className="sc-opprow__desc">{description}</span>}
      </span>
      {onClick && <Chevron />}
    </Clickable>
  );
}

/** Vertical opportunity card with a risk tag on the picture and an action button. */
export function OpportunityCard({
  scene,
  title,
  description,
  risk,
  actionLabel = "Explore",
  onAction,
  disabled,
}: {
  scene: SceneProps;
  title: ReactNode;
  description?: ReactNode;
  risk?: Risk;
  actionLabel?: string;
  onAction?: () => void;
  disabled?: boolean;
}) {
  return (
    <article className="sc-oppcard">
      <Scene {...scene}>{risk && <RiskBadge risk={risk} />}</Scene>
      <div className="sc-oppcard__body">
        <h4>{title}</h4>
        {description && <p>{description}</p>}
      </div>
      <Button variant="primary" block onClick={onAction} disabled={disabled}>
        {actionLabel}
      </Button>
    </article>
  );
}

/** Scene, title, duration and risk, with a start button. */
export function ActionCard({
  scene,
  title,
  description,
  duration,
  risk,
  actionLabel = "Start Action",
  onAction,
  disabled,
}: {
  scene: SceneProps;
  title: ReactNode;
  description?: ReactNode;
  duration?: ReactNode;
  risk?: Risk;
  actionLabel?: string;
  onAction?: () => void;
  disabled?: boolean;
}) {
  return (
    <article className="sc-actioncard">
      <Scene {...scene} />
      <div className="sc-actioncard__body">
        <h4>{title}</h4>
        {description && <p>{description}</p>}
        {(duration || risk) && (
          <div className="sc-actioncard__meta">
            {duration && (
              <span>
                <Clock aria-hidden /> {duration}
              </span>
            )}
            {risk && (
              <span className={`sc-tone-${risk === "low" ? "good" : risk === "medium" ? "warn" : "bad"}`}>
                <Shield aria-hidden /> {RISK_LABEL[risk]} Risk
              </span>
            )}
          </div>
        )}
      </div>
      <Button variant="success" block onClick={onAction} disabled={disabled}>
        {actionLabel}
      </Button>
    </article>
  );
}

/** Region condition with a status badge, e.g. Fire-Touched Lands (Active). */
export function WorldConditionCard({
  scene,
  title,
  status,
  statusTone = "red",
  description,
}: {
  scene: SceneProps;
  title: ReactNode;
  status?: ReactNode;
  statusTone?: Tone;
  description?: ReactNode;
}) {
  return (
    <article className="sc-worldcard">
      <Scene {...scene} />
      <div className="sc-worldcard__head">
        <h4>{title}</h4>
        {status && (
          <Badge tone={statusTone} variant="solid" size="sm">
            {status}
          </Badge>
        )}
      </div>
      {description && <p>{description}</p>}
    </article>
  );
}

/* ------------------------------------------------------------------ manuals */

/** A manual or technique with sections read, tags and an action. */
export function ManualCard({
  icon,
  title,
  path,
  current,
  total,
  percent,
  steps,
  tags,
  description,
  action,
  onClick,
}: {
  icon: ReactNode;
  title: ReactNode;
  /** Small tag beside the title, e.g. "Human Path". */
  path?: ReactNode;
  current: number;
  total: number;
  /** Overall mastery percentage. Defaults to current / total. */
  percent?: number;
  /** Show diamond pips in place of the plain section count. */
  steps?: boolean;
  tags?: ReactNode[];
  description?: ReactNode;
  action?: ReactNode;
  onClick?: () => void;
}) {
  const pct = percent ?? (current / Math.max(1, total)) * 100;
  const titleId = useId();
  return (
    <article className="sc-manual">
      <div className="sc-manual__top">
        <span className="sc-manual__icon">{icon}</span>
        <div className="sc-manual__meta">
          <div className="sc-manual__head">
            <h4 id={titleId}>{title}</h4>
            {path && (
              <Badge tone="blue" size="sm">
                {path}
              </Badge>
            )}
          </div>
          {steps ? (
            <div className="sc-manual__steps">
              <span className="sc-tone-muted">Sections</span>
              <StepProgress current={current} total={total} showValue={false} />
            </div>
          ) : (
            <span className="sc-manual__sections">
              Sections {current} / {total}
            </span>
          )}
          <ProgressBar value={pct} size="sm" showValue aria-labelledby={titleId} />
        </div>
        {onClick && (
          <button type="button" className="sc-manual__open" aria-label="Open manual" onClick={onClick}>
            <Chevron />
          </button>
        )}
      </div>
      {tags && tags.length > 0 && <div className="sc-manual__tags">{tags}</div>}
      {description && <p className="sc-manual__desc">{description}</p>}
      {action && <div className="sc-manual__action">{action}</div>}
    </article>
  );
}

/* ------------------------------------------------------------------ progression */

export interface Factor {
  icon?: Icon;
  label: ReactNode;
  value: ReactNode;
  tone?: "good" | "bad" | "warn";
}

/** Estimated time to the next goal with the factors behind it. */
export function ForecastCard({
  label = "Estimated Years",
  value,
  delta,
  deltaTone = "bad",
  factors,
}: {
  label?: ReactNode;
  value: ReactNode;
  delta?: ReactNode;
  deltaTone?: "good" | "bad";
  factors?: Factor[];
}) {
  return (
    <article className="sc-forecast">
      <div className="sc-forecast__head">
        <Hourglass className="sc-forecast__icon" aria-hidden />
        <div>
          <span className="sc-tone-muted">{label}</span>
          <strong>{value}</strong>
          {delta && <span className={`sc-tone-${deltaTone}`}>{delta}</span>}
        </div>
      </div>
      {factors && factors.length > 0 && (
        <>
          <h5>Key Factors</h5>
          <dl className="sc-factors">
            {factors.map((f, i) => {
              const I = f.icon;
              return (
                <div key={i}>
                  <dt>
                    {I && <I aria-hidden />}
                    {f.label}
                  </dt>
                  <dd className={f.tone && `sc-tone-${f.tone}`}>{f.value}</dd>
                </div>
              );
            })}
          </dl>
        </>
      )}
    </article>
  );
}

/** The next breakthrough with what it grants. */
export function MilestoneCard({
  scene,
  title,
  subtitle,
  benefits,
  action,
}: {
  scene?: SceneProps;
  title: ReactNode;
  subtitle?: ReactNode;
  benefits?: ReactNode[];
  action?: ReactNode;
}) {
  return (
    <article className="sc-milestone">
      <div className="sc-milestone__top">
        {scene && <Scene aspect={1} {...scene} className="sc-milestone__scene" />}
        <div>
          <span className="sc-milestone__label">
            <Mountain aria-hidden /> Next Milestone
          </span>
          <h4>{title}</h4>
          {subtitle && <p className="sc-tone-muted">{subtitle}</p>}
        </div>
      </div>
      {benefits && (
        <ul className="sc-milestone__list">
          {benefits.map((b, i) => (
            <li key={i}>
              <CircleCheck aria-hidden />
              {b}
            </li>
          ))}
        </ul>
      )}
      {action}
    </article>
  );
}

/** Frontier card: the stage jump, progress and the current bottleneck. */
export function BottleneckCard({
  icon = Mountain,
  title,
  subtitle,
  progress,
  bottleneck,
  action,
}: {
  icon?: Icon;
  title: ReactNode;
  subtitle?: ReactNode;
  progress: number;
  bottleneck?: { title: ReactNode; value?: ReactNode; description?: ReactNode };
  action?: ReactNode;
}) {
  const titleId = useId();
  return (
    <article className="sc-bottleneck">
      <div className="sc-bottleneck__head">
        <Emblem icon={icon} tone="navy" />
        <div>
          <h4 id={titleId}>{title}</h4>
          {subtitle && <p className="sc-tone-muted">{subtitle}</p>}
        </div>
      </div>
      <ProgressBar value={progress} showValue aria-labelledby={titleId} />
      {bottleneck && (
        <div className="sc-bottleneck__alert" role="note">
          <AlertTriangle className="sc-bottleneck__alert-icon" aria-hidden />
          <div>
            <strong>{bottleneck.title}</strong>
            {bottleneck.value && <span className="sc-tone-bad">{bottleneck.value}</span>}
            {bottleneck.description && <p>{bottleneck.description}</p>}
          </div>
        </div>
      )}
      {action}
    </article>
  );
}

export type RequirementState = "met" | "failed" | "pending";

export interface Requirement {
  label: ReactNode;
  value?: ReactNode;
  state: RequirementState;
}

/** Checklist of breakthrough requirements with met, failed and pending states. */
export function RequirementChecklist({ title, items }: { title?: ReactNode; items: Requirement[] }) {
  const met = items.filter((i) => i.state === "met").length;
  return (
    <div className="sc-reqs">
      <h4>
        {title ?? "Requirements"} ({met} / {items.length})
      </h4>
      <ul>
        {items.map((r, i) => (
          <li key={i} className={`is-${r.state}`}>
            <span className="sc-reqs__mark" aria-label={r.state}>
              {r.state === "met" ? <Check aria-hidden /> : r.state === "failed" ? <X aria-hidden /> : null}
            </span>
            <span className="sc-reqs__label">{r.label}</span>
            {r.value && <span className="sc-reqs__value">{r.value}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A routine that has been mastered and now runs on its own. */
export function MasteryRow({
  title,
  description,
  status = "Mastered",
  icon = Check,
}: {
  title: ReactNode;
  description?: ReactNode;
  status?: ReactNode;
  icon?: Icon;
}) {
  return (
    <div className="sc-mastery">
      <Emblem icon={icon} tone="jade" size="sm" />
      <div className="sc-mastery__body">
        <div className="sc-mastery__head">
          <strong>{title}</strong>
          {status && (
            <Badge tone="jade" size="sm">
              {status}
            </Badge>
          )}
        </div>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}

/** Explains what is needed to unlock a feature. */
export function LockedNotice({
  title,
  description,
  badge = "Locked",
}: {
  title: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
}) {
  return (
    <div className="sc-locked">
      <span className="sc-locked__icon">
        <Lock aria-hidden />
      </span>
      <div>
        <div className="sc-mastery__head">
          <strong>{title}</strong>
          {badge && (
            <Badge tone="grey" size="sm">
              {badge}
            </Badge>
          )}
        </div>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}
