import { Sprout } from "lucide-react";
import { useId, type ReactNode } from "react";
import { Badge, Button, Emblem, Portrait, ProgressBar, Scene, StatList, type SceneProps, type StatRowProps } from "./primitives";
import { cx, type Icon, type Tone } from "./types";
import "./character.css";

/** Large character sheet: portrait, name and a stat list. */
export function CharacterSheet({
  portrait,
  name,
  stats,
  onEdit,
  className,
}: {
  portrait: string;
  name: ReactNode;
  stats: StatRowProps[];
  onEdit?: () => void;
  className?: string;
}) {
  return (
    <article className={cx("sc-charsheet", className)}>
      <Portrait src={portrait} alt="" size="lg" className="sc-charsheet__portrait" />
      <div className="sc-charsheet__body">
        <div className="sc-charsheet__head">
          <h3>{name}</h3>
          {onEdit && (
            <Button variant="secondary" size="sm" onClick={onEdit}>
              Edit
            </Button>
          )}
        </div>
        <StatList stats={stats} />
      </div>
    </article>
  );
}

/** Compact portrait with name and a tag, for lists or headers. */
export function PortraitCard({
  portrait,
  name,
  tag,
  tagTone = "blue",
}: {
  portrait: string;
  name: ReactNode;
  tag?: ReactNode;
  tagTone?: Tone;
}) {
  return (
    <article className="sc-portraitcard">
      <Portrait src={portrait} alt="" size="sm" />
      <div>
        <h4>{name}</h4>
        {tag && (
          <Badge tone={tagTone} size="sm">
            {tag}
          </Badge>
        )}
      </div>
    </article>
  );
}

/** Realm emblem, stage progress and a summary of the current life. */
export function LifeSummary({
  icon = Sprout,
  realm,
  stage,
  stages,
  progress,
  rows,
}: {
  icon?: Icon;
  realm: ReactNode;
  stage: number;
  stages: number;
  /** Progress through the current stage, 0 to 100. */
  progress: number;
  rows?: StatRowProps[];
}) {
  const realmId = useId();
  return (
    <article className="sc-life">
      <div className="sc-life__head">
        <Emblem icon={icon} tone="jade" size="lg" />
        <div className="sc-life__realm">
          <h3 id={realmId}>{realm}</h3>
          <span className="sc-tone-muted">
            Stage {stage} / {stages}
          </span>
          <ProgressBar value={progress} showValue aria-labelledby={realmId} />
        </div>
      </div>
      {rows && <StatList stats={rows} className="sc-life__rows" />}
    </article>
  );
}

/** Full-width scene with the current activity, a badge and its progress. */
export function SceneModule({
  scene,
  title,
  badge,
  badgeTone = "red",
  progress,
}: {
  scene: SceneProps;
  title: ReactNode;
  badge?: ReactNode;
  badgeTone?: Tone;
  progress?: number;
}) {
  const titleId = useId();
  return (
    <article className="sc-scenemod">
      <Scene aspect={21 / 9} {...scene} />
      <div className="sc-scenemod__head">
        <strong id={titleId}>{title}</strong>
        {badge && (
          <Badge tone={badgeTone} size="sm">
            {badge}
          </Badge>
        )}
      </div>
      {progress !== undefined && <ProgressBar value={progress} showValue aria-labelledby={titleId} />}
    </article>
  );
}
