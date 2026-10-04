import { ChevronRight, Lock } from "lucide-react";
import { useId, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from "react";
import { clampPct, cx, RARITY_LABEL, REALM_LABEL, type Icon, type Rarity, type Realm, type Tone } from "./types";
import "./primitives.css";

/* ------------------------------------------------------------------ buttons */

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  icon?: Icon;
  iconRight?: Icon;
  /** Stretch to the container width. */
  block?: boolean;
  /** Force a visual state, for documentation only. */
  forceState?: "hover" | "pressed";
}

export function Button({
  variant = "primary",
  size = "md",
  icon: IconL,
  iconRight: IconR,
  block,
  forceState,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx("sc-btn", `sc-btn--${variant}`, `sc-btn--${size}`, block && "sc-btn--block", className)}
      data-state={forceState}
      {...rest}
    >
      {IconL && <IconL className="sc-btn__icon" aria-hidden />}
      {children}
      {IconR && <IconR className="sc-btn__icon" aria-hidden />}
    </button>
  );
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: Icon;
  /** Accessible name, also shown as the native tooltip. */
  label: string;
  variant?: "default" | "primary" | "ghost";
  size?: "sm" | "md" | "lg";
  active?: boolean;
}

export function IconButton({
  icon: I,
  label,
  variant = "default",
  size = "md",
  active,
  className,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={cx("sc-iconbtn", `sc-iconbtn--${variant}`, `sc-iconbtn--${size}`, className)}
      {...rest}
    >
      <I aria-hidden />
    </button>
  );
}

/** A full-width clickable row chevron, used at the end of list rows. */
export function Chevron() {
  return <ChevronRight className="sc-chevron" aria-hidden />;
}

/* ------------------------------------------------------------------ badges */

export interface BadgeProps {
  tone?: Tone;
  /** solid: filled colour; soft: tinted; outline: border only */
  variant?: "solid" | "soft" | "outline";
  icon?: Icon;
  size?: "sm" | "md";
  children: ReactNode;
  className?: string;
}

export function Badge({ tone = "grey", variant = "soft", icon: I, size = "md", children, className }: BadgeProps) {
  return (
    <span className={cx("sc-badge", `sc-badge--${variant}`, `sc-badge--${size}`, `sc-tone--${tone}`, className)}>
      {I && <I aria-hidden />}
      {children}
    </span>
  );
}

export function RarityBadge({ rarity, size }: { rarity: Rarity; size?: "sm" | "md" }) {
  return (
    <span className={cx("sc-badge", "sc-badge--rarity", `sc-badge--${size ?? "md"}`, `sc-rarity--${rarity}`)}>
      {RARITY_LABEL[rarity]}
    </span>
  );
}

/** Cultivation realm tag, e.g. Spirit. */
export function RealmBadge({ realm, size }: { realm: Realm; size?: "sm" | "md" }) {
  return (
    <span className={cx("sc-badge", "sc-badge--realm", `sc-badge--${size ?? "md"}`, `sc-realm--${realm}`)}>
      {REALM_LABEL[realm]}
    </span>
  );
}

export function LockedBadge({ children = "Locked" }: { children?: ReactNode }) {
  return (
    <Badge tone="grey" variant="soft" icon={Lock}>
      {children}
    </Badge>
  );
}

/* ------------------------------------------------------------------ progress */

export interface ProgressBarProps {
  value: number;
  max?: number;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  /** Text above the bar. */
  label?: ReactNode;
  /** Show the percentage (or a custom node) to the right of the bar. */
  showValue?: boolean | ReactNode;
  className?: string;
  "aria-label"?: string;
}

export function ProgressBar({
  value,
  max = 100,
  tone = "jade",
  size = "md",
  label,
  showValue,
  className,
  "aria-label": ariaLabel,
}: ProgressBarProps) {
  const pct = clampPct(value, max);
  const labelId = useId();
  const valueNode = showValue === true ? `${Math.round(pct)}%` : showValue;
  return (
    <div className={cx("sc-progress", className)}>
      {label && (
        <div className="sc-progress__label" id={labelId}>
          {label}
        </div>
      )}
      <div className="sc-progress__row">
        <div
          className={cx("sc-bar", `sc-bar--${size}`, `sc-tone--${tone}`)}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-labelledby={label ? labelId : undefined}
          aria-label={label ? undefined : ariaLabel}
        >
          <div className="sc-bar__fill" style={{ width: `${pct}%` }} />
        </div>
        {valueNode && <span className="sc-progress__value">{valueNode}</span>}
      </div>
    </div>
  );
}

/** Diamond pips for discrete stages, e.g. sections read or stages cleared. */
export function StepProgress({
  current,
  total,
  showValue = true,
  tone = "navy",
}: {
  current: number;
  total: number;
  showValue?: boolean;
  tone?: Tone;
}) {
  return (
    <div
      className={cx("sc-steps", `sc-tone--${tone}`)}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label={`${current} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={cx("sc-steps__pip", i < current && "is-done", i === current - 1 && "is-current")} />
      ))}
      {showValue && (
        <span className="sc-steps__value">
          {current} / {total}
        </span>
      )}
    </div>
  );
}

export interface ResourceBarProps {
  icon?: Icon;
  label: ReactNode;
  value: number;
  max: number;
  tone?: Tone;
  /** Defaults to "value / max". */
  format?: (value: number, max: number) => ReactNode;
  /** Colour the value text red, e.g. for Impurity. */
  valueTone?: "good" | "bad" | "warn";
}

export function ResourceBar({ icon: I, label, value, max, tone = "jade", format, valueTone }: ResourceBarProps) {
  return (
    <div className="sc-resbar">
      <span className={cx("sc-resbar__label", `sc-tone--${tone}`)}>
        {I && <I aria-hidden />}
        <span>{label}</span>
      </span>
      <ProgressBar value={value} max={max} tone={tone} size="sm" aria-label={String(label)} />
      <span className={cx("sc-resbar__value", valueTone && `sc-tone-${valueTone}`)}>
        {format ? format(value, max) : `${value} / ${max}`}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ emblem */

/** Round seal used for realm stages, bottlenecks and states. */
export function Emblem({
  icon: I,
  tone = "jade",
  size = "md",
  ring = true,
  className,
}: {
  icon: Icon;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  ring?: boolean;
  className?: string;
}) {
  return (
    <span className={cx("sc-emblem", `sc-emblem--${size}`, `sc-tone--${tone}`, ring && "sc-emblem--ring", className)}>
      <I aria-hidden />
    </span>
  );
}

/* ------------------------------------------------------------------ stats */

export interface StatRowProps {
  label: ReactNode;
  value: ReactNode;
  icon?: Icon;
  tone?: "good" | "bad" | "warn" | "info";
  note?: ReactNode;
}

export function StatRow({ label, value, icon: I, tone, note }: StatRowProps) {
  return (
    <div className="sc-stat">
      <dt>
        {I && <I aria-hidden />}
        {label}
      </dt>
      <dd className={tone && `sc-tone-${tone}`}>
        {value}
        {note && <small className="sc-stat__note">{note}</small>}
      </dd>
    </div>
  );
}

export function StatList({
  stats,
  dense,
  className,
}: {
  stats: StatRowProps[];
  dense?: boolean;
  className?: string;
}) {
  return (
    <dl className={cx("sc-stats", dense && "sc-stats--dense", className)}>
      {stats.map((s, i) => (
        <StatRow key={i} {...s} />
      ))}
    </dl>
  );
}

/* ------------------------------------------------------------------ headings */

/** Small heading with the gold diamond glyph. */
export function SectionTitle({
  children,
  icon: I,
  action,
  as: Tag = "h3",
}: {
  children: ReactNode;
  icon?: Icon;
  action?: ReactNode;
  as?: "h2" | "h3" | "h4";
}) {
  return (
    <div className="sc-section-title">
      <Tag>
        {I ? <I className="sc-section-title__icon" aria-hidden /> : <span className="sc-diamond" aria-hidden />}
        {children}
      </Tag>
      {action && <div className="sc-section-title__action">{action}</div>}
    </div>
  );
}

/** Dark navy banner with an ink-wash ridge, e.g. "Current Frontier". */
export function PanelHeader({ children, icon: I }: { children: ReactNode; icon?: Icon }) {
  return (
    <div className="sc-panel-header">
      <Ridge className="sc-panel-header__ridge" />
      {I && <Emblem icon={I} tone="navy" size="sm" className="sc-panel-header__emblem" />}
      <h3>{children}</h3>
    </div>
  );
}

/** Numbered ribbon used to open a major area of a screen. */
export function SectionBanner({ index, children }: { index?: number | string; children: ReactNode }) {
  return (
    <div className="sc-banner">
      {index !== undefined && <span className="sc-banner__index">{index}</span>}
      <h2>{children}</h2>
    </div>
  );
}

/** Ornamental divider with an optional centred label. */
export function Divider({ label }: { label?: ReactNode }) {
  return (
    <div className="sc-divider" role="separator">
      <span className="sc-divider__line" />
      {label && <span className="sc-divider__label">{label}</span>}
      <span className="sc-divider__line" />
    </div>
  );
}

/* ------------------------------------------------------------------ scenes */

export type SceneVariant = "mist" | "dawn" | "forest" | "fire" | "demonic" | "night";

const SCENE_COLORS: Record<SceneVariant, [sky1: string, sky2: string, far: string, near: string, ground: string]> = {
  mist: ["#e9eef0", "#c9d4d8", "#a9b8bd", "#6f8189", "#4f5f63"],
  dawn: ["#f6e7d0", "#e9c9a1", "#c2a68a", "#8a7a6b", "#5e544a"],
  forest: ["#e3ece2", "#bcd0bb", "#8fae8f", "#557a5a", "#3b5a41"],
  fire: ["#f2b46a", "#c9532f", "#8f2f22", "#55201a", "#2b1411"],
  demonic: ["#7b7590", "#45405e", "#2f2b43", "#1d1b2b", "#121019"],
  night: ["#41587a", "#24344d", "#1a283c", "#111c2b", "#0b131e"],
};

function Ridge({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden>
      <path d="M0 40 L0 26 L22 18 L40 27 L64 8 L84 24 L104 14 L128 30 L150 12 L172 25 L200 16 L200 40 Z" fill={color} />
    </svg>
  );
}

export interface SceneProps {
  variant?: SceneVariant;
  /** Optional painted or pixel art background in place of the generated one. */
  src?: string;
  /** Optional pixel sprite standing in the foreground. */
  sprite?: string;
  /** Show a pagoda silhouette on the far ridge. */
  pagoda?: boolean;
  /** Width / height. Defaults to 16 / 9. */
  aspect?: number;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** A framed scenic thumbnail. Generated ink-wash landscape unless `src` is given. */
export function Scene({
  variant = "mist",
  src,
  sprite,
  pagoda,
  aspect = 16 / 9,
  alt = "",
  className,
  style,
  children,
}: SceneProps) {
  const [s1, s2, far, near, ground] = SCENE_COLORS[variant];
  const gid = useId();
  return (
    <div
      className={cx("sc-scene", `sc-scene--${variant}`, className)}
      style={{ aspectRatio: String(aspect), ...style }}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
    >
      {src ? (
        <img className="sc-scene__bg" src={src} alt="" />
      ) : (
        <svg className="sc-scene__bg" viewBox="0 0 160 90" preserveAspectRatio="xMidYMax slice" aria-hidden>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={s1} />
              <stop offset="1" stopColor={s2} />
            </linearGradient>
            <linearGradient id={`${gid}-mist`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={variant === "fire" || variant === "demonic" ? s2 : "#fff"} stopOpacity="0" />
              <stop offset="0.6" stopColor={variant === "fire" || variant === "demonic" ? s2 : "#fff"} stopOpacity="0.45" />
              <stop offset="1" stopColor={variant === "fire" || variant === "demonic" ? s2 : "#fff"} stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="160" height="90" fill={`url(#${gid})`} />
          {(variant === "fire" || variant === "dawn") && <circle cx="118" cy="24" r="9" fill={s1} opacity="0.85" />}
          {variant === "night" && <circle cx="124" cy="16" r="5" fill="#e9e4d2" opacity="0.85" />}
          <path
            d="M0 58 C10 50 16 40 26 42 C34 44 42 30 52 20 C60 28 66 40 76 38 C86 36 92 30 100 34 C110 40 116 26 126 22 C134 30 142 40 160 36 L160 90 L0 90 Z"
            fill={far}
          />
          {pagoda && (
            <g fill={far} transform="translate(47.5 11) scale(0.5)">
              <rect x="6" y="0" width="2" height="3" />
              <path d="M-2 4 L16 4 L13 6 L1 6 Z" />
              <rect x="3" y="6" width="8" height="3" />
              <path d="M-3 9 L17 9 L14 11.5 L0 11.5 Z" />
              <rect x="2" y="11.5" width="10" height="7.5" />
            </g>
          )}
          <rect y="40" width="160" height="26" fill={`url(#${gid}-mist)`} />
          <path
            d="M0 70 C14 62 22 56 34 60 C44 64 52 50 64 48 C76 50 84 64 98 62 C110 60 118 52 130 54 C142 58 150 64 160 62 L160 90 L0 90 Z"
            fill={near}
          />
          <path d="M0 82 C30 78 50 80 80 83 C110 86 130 78 160 81 L160 90 L0 90 Z" fill={ground} />
          {variant === "fire" && (
            <g fill="#ffcf6a" opacity="0.8">
              <circle cx="30" cy="66" r="0.8" />
              <circle cx="74" cy="58" r="0.8" />
              <circle cx="110" cy="64" r="0.8" />
              <circle cx="138" cy="54" r="0.8" />
            </g>
          )}
          {variant === "demonic" && (
            <g fill="#b04848" opacity="0.7">
              <circle cx="58" cy="60" r="1" />
              <circle cx="100" cy="66" r="1" />
            </g>
          )}
        </svg>
      )}
      {sprite && <img className="sc-scene__sprite" src={sprite} alt="" />}
      {children && <div className="sc-scene__overlay">{children}</div>}
    </div>
  );
}

/** A pixel sprite on a soft backdrop, for character portraits. */
export function Portrait({
  src,
  alt,
  size = "md",
  className,
}: {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <div className={cx("sc-portrait", `sc-portrait--${size}`, className)}>
      <img src={src} alt={alt} />
    </div>
  );
}

/* ------------------------------------------------------------------ item icon */

/** An item glyph in a rarity-tinted frame. */
export function ItemIcon({
  icon: I,
  rarity = "common",
  size = "md",
  className,
}: {
  icon: Icon;
  rarity?: Rarity;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span className={cx("sc-itemicon", `sc-itemicon--${size}`, `sc-rarity--${rarity}`, className)}>
      <I aria-hidden />
    </span>
  );
}
