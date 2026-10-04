import { Ban, CircleCheck, CircleHelp, Inbox, Lock, Trophy, X } from "lucide-react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button, Portrait } from "./primitives";
import { cx, type Icon, type Tone } from "./types";
import type { ToastData } from "./useToasts";
import "./feedback.css";

/* ------------------------------------------------------------------ toasts */

export function Toast({
  icon: I,
  tone = "jade",
  children,
  onClose,
}: {
  icon?: Icon;
  tone?: Tone;
  children: ReactNode;
  onClose?: () => void;
}) {
  return (
    <div className={cx("sc-toast", `sc-tone--${tone}`)} role="status">
      {I && <I className="sc-toast__icon" aria-hidden />}
      <span className="sc-toast__text">{children}</span>
      {onClose && (
        <button type="button" className="sc-toast__close" aria-label="Dismiss" onClick={onClose}>
          <X aria-hidden />
        </button>
      )}
    </div>
  );
}

/** Fixed stack of toasts in the corner of the screen. Pair with useToasts. */
export function ToastViewport({ toasts, onDismiss }: { toasts: ToastData[]; onDismiss: (id: number) => void }) {
  return createPortal(
    <div className="sc-root sc-toasts" aria-live="polite">
      {toasts.map((t) => (
        <Toast key={t.id} icon={t.icon} tone={t.tone} onClose={() => onDismiss(t.id)}>
          {t.message}
        </Toast>
      ))}
    </div>,
    document.body,
  );
}

/** Gold banner for an unlocked achievement. */
export function AchievementBanner({
  title = "Achievement Unlocked",
  children,
  icon: I = Trophy,
  onClose,
}: {
  title?: ReactNode;
  children?: ReactNode;
  icon?: Icon;
  onClose?: () => void;
}) {
  return (
    <div className="sc-achievement" role="status">
      <I className="sc-achievement__icon" aria-hidden />
      <div className="sc-achievement__text">
        <strong>{title}</strong>
        {children && <span>{children}</span>}
      </div>
      {onClose && (
        <button type="button" className="sc-toast__close" aria-label="Dismiss" onClick={onClose}>
          <X aria-hidden />
        </button>
      )}
    </div>
  );
}

/** Explains a game term, e.g. Impurity. */
export function HelpCard({ title, icon: I = CircleHelp, children }: { title: ReactNode; icon?: Icon; children: ReactNode }) {
  return (
    <aside className="sc-help">
      <I className="sc-help__icon" aria-hidden />
      <div>
        <strong>{title}</strong>
        <div className="sc-help__body">{children}</div>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ dialogue */

export interface DialogueChoice {
  id: string;
  label: ReactNode;
  /** Highlight as the suggested reply. */
  primary?: boolean;
  disabled?: boolean;
}

/** NPC portrait, name plate, line of speech and reply choices. */
export function NpcDialogue({
  portrait,
  name,
  children,
  choices,
  onChoose,
}: {
  portrait: string;
  name: ReactNode;
  children: ReactNode;
  choices?: DialogueChoice[];
  onChoose?: (id: string) => void;
}) {
  return (
    <section className="sc-dialogue">
      <div className="sc-dialogue__grid">
        <Portrait src={portrait} alt="" size="md" className="sc-dialogue__portrait" />
        <div className="sc-dialogue__speech">
          <span className="sc-dialogue__name">{name}</span>
          <div className="sc-dialogue__text">{children}</div>
        </div>
        {choices && choices.length > 0 && (
          <ul className="sc-dialogue__choices">
            {choices.map((c) => (
              <li key={c.id}>
                <Button
                  variant={c.primary ? "primary" : "secondary"}
                  block
                  disabled={c.disabled}
                  onClick={() => onChoose?.(c.id)}
                >
                  {c.label}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ states */

export type StateKind = "empty" | "locked" | "disabled" | "mastered" | "loading";

const STATE_ICON: Record<Exclude<StateKind, "loading">, Icon> = {
  empty: Inbox,
  locked: Lock,
  disabled: Ban,
  mastered: CircleCheck,
};

/** Placeholder for a panel that has nothing to show, is locked, done or loading. */
export function StateCard({
  kind,
  title,
  children,
  action,
}: {
  kind: StateKind;
  title: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
}) {
  const I = kind === "loading" ? null : STATE_ICON[kind];
  return (
    <div className={cx("sc-state", `sc-state--${kind}`)} role={kind === "loading" ? "status" : undefined}>
      <span className="sc-state__icon">{I ? <I aria-hidden /> : <Spinner />}</span>
      <strong>{title}</strong>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

/** Ring of dots that turns slowly. */
export function Spinner({ label }: { label?: string }) {
  return (
    <span className="sc-spinner" role={label ? "status" : undefined} aria-label={label}>
      {Array.from({ length: 8 }, (_, i) => (
        <i key={i} style={{ transform: `rotate(${i * 45}deg) translateY(-9px)`, opacity: 0.25 + i * 0.1 }} />
      ))}
    </span>
  );
}
