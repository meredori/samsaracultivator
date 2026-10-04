import { ChevronDown, X } from "lucide-react";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Chevron, Emblem } from "./primitives";
import { cx, type Icon, type Tone } from "./types";
import "./shells.css";

/* ------------------------------------------------------------------ panel */

export interface PanelProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  icon?: Icon;
  /** Right side of the header, e.g. a button or badge. */
  action?: ReactNode;
  /** framed: corner ornaments; plain: no inner rule; sunk: recessed background */
  variant?: "framed" | "plain" | "sunk";
  padding?: "none" | "sm" | "md";
  as?: "section" | "div" | "article" | "aside";
}

/** The basic paper surface every module sits on. */
export function Panel({
  title,
  icon: I,
  action,
  variant = "framed",
  padding = "md",
  as: Tag = "section",
  className,
  children,
  ...rest
}: PanelProps) {
  const headingId = useId();
  return (
    <Tag
      className={cx("sc-panel", `sc-panel--${variant}`, `sc-panel--pad-${padding}`, className)}
      aria-labelledby={title ? headingId : undefined}
      {...rest}
    >
      {title && (
        <header className="sc-panel__head">
          <h3 id={headingId}>
            {I ? <I className="sc-panel__icon" aria-hidden /> : <span className="sc-diamond" aria-hidden />}
            {title}
          </h3>
          {action && <div className="sc-panel__action">{action}</div>}
        </header>
      )}
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ nav list */

export interface NavItem<T extends string = string> {
  id: T;
  label: ReactNode;
  icon?: Icon;
  disabled?: boolean;
  /** Trailing content in place of the chevron, e.g. a badge or count. */
  trailing?: ReactNode;
}

/** Vertical list of selectable rows, used in side panels and subsection panels. */
export function NavList<T extends string>({
  items,
  value,
  onSelect,
  chevrons = true,
  label,
  className,
}: {
  items: NavItem<T>[];
  value?: T;
  onSelect?: (id: T) => void;
  chevrons?: boolean;
  /** Accessible name for the list. */
  label: string;
  className?: string;
}) {
  return (
    <nav aria-label={label} className={cx("sc-navlist", className)}>
      <ul>
        {items.map((it) => {
          const I = it.icon;
          const active = it.id === value;
          return (
            <li key={it.id}>
              <button
                type="button"
                className="sc-navlist__item"
                aria-current={active ? "page" : undefined}
                disabled={it.disabled}
                onClick={() => onSelect?.(it.id)}
              >
                {I && <I className="sc-navlist__icon" aria-hidden />}
                <span className="sc-navlist__label">{it.label}</span>
                {it.trailing ?? (chevrons && <Chevron />)}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ------------------------------------------------------------------ window */

/** A large framed window with a navy title bar and optional side navigation. */
export function GameWindow({
  title,
  icon = undefined,
  nav,
  actions,
  className,
  children,
}: {
  title: ReactNode;
  icon?: Icon;
  /** Usually a NavList. Moves above the content on narrow screens. */
  nav?: ReactNode;
  /** Title bar buttons, e.g. a close IconButton. */
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cx("sc-window", nav ? "sc-window--with-nav" : undefined, className)}>
      <header className="sc-window__bar">
        {icon && <Emblem icon={icon} tone="navy" size="sm" className="sc-window__emblem" />}
        <h2>{title}</h2>
        {actions && <div className="sc-window__actions">{actions}</div>}
      </header>
      <div className="sc-window__body">
        {nav && <div className="sc-window__nav">{nav}</div>}
        <div className="sc-window__content">{children}</div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ rows */

/** A single clickable row with icon, label and chevron. */
export function LinkRow({
  icon: I,
  children,
  trailing,
  onClick,
  disabled,
}: {
  icon?: Icon;
  children: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button type="button" className="sc-linkrow" onClick={onClick} disabled={disabled}>
      {I && <I className="sc-linkrow__icon" aria-hidden />}
      <span className="sc-linkrow__label">{children}</span>
      {trailing ?? <Chevron />}
    </button>
  );
}

/* ------------------------------------------------------------------ collapsible */

export function Collapsible({
  title,
  icon: I,
  defaultOpen = false,
  children,
  className,
}: {
  title: ReactNode;
  icon?: Icon;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();
  return (
    <div className={cx("sc-collapsible", open && "is-open", className)}>
      <button
        type="button"
        className="sc-collapsible__head"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((o) => !o)}
      >
        {I ? <I className="sc-collapsible__icon" aria-hidden /> : <span className="sc-diamond" aria-hidden />}
        <span className="sc-collapsible__title">{title}</span>
        <ChevronDown className="sc-collapsible__caret" aria-hidden />
      </button>
      <div id={bodyId} className="sc-collapsible__body" hidden={!open}>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ dialogs */

export interface DialogProps {
  title: ReactNode;
  icon?: Icon;
  tone?: Tone;
  children?: ReactNode;
  /** Buttons along the bottom: the primary action first, then Cancel. */
  actions?: ReactNode;
  onClose?: () => void;
  className?: string;
  titleId?: string;
}

/** The dialog card itself. Render inline, or inside Modal to float it over the screen. */
export function Dialog({ title, icon, tone = "red", children, actions, onClose, className, titleId }: DialogProps) {
  return (
    <div className={cx("sc-dialog", className)}>
      {onClose && (
        <button type="button" className="sc-dialog__close" aria-label="Close" onClick={onClose}>
          <X aria-hidden />
        </button>
      )}
      <div className="sc-dialog__head">
        {icon && <Emblem icon={icon} tone={tone} size="sm" ring={false} />}
        <h3 id={titleId}>{title}</h3>
      </div>
      {children && <div className="sc-dialog__body">{children}</div>}
      {actions && <div className="sc-dialog__actions">{actions}</div>}
    </div>
  );
}

/** Floats a Dialog over the page with a dimmed backdrop. Escape and backdrop clicks close it. */
export function Modal({
  open,
  onClose,
  children,
  ...dialog
}: Omit<DialogProps, "onClose" | "titleId"> & { open: boolean; onClose: () => void }) {
  const titleId = useId();
  const ref = useRef<HTMLDivElement>(null);
  // Read the latest onClose from a ref so an inline callback does not re-run the focus trap.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const node = ref.current;
    const focusables = () =>
      Array.from(node?.querySelectorAll<HTMLElement>("button, [href], input, select, textarea, [tabindex]") ?? []).filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1,
      );
    // Focus the dialog itself so Enter can't trigger a destructive action by accident.
    node?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
      } else if (e.key === "Tab") {
        const els = focusables();
        if (els.length === 0) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [open]);

  if (!open) return null;
  return createPortal(
    <div className="sc-root sc-modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className="sc-modal__box">
        <Dialog {...dialog} titleId={titleId} onClose={onClose}>
          {children}
        </Dialog>
      </div>
    </div>,
    document.body,
  );
}

/* ------------------------------------------------------------------ tooltips */

/** Dark tooltip card. Use on its own for docs, or through HoverTooltip. */
export function Tooltip({
  title,
  icon,
  media,
  children,
  className,
  id,
}: {
  title?: ReactNode;
  icon?: Icon;
  /** Replaces the icon slot, e.g. an ItemIcon. */
  media?: ReactNode;
  children?: ReactNode;
  className?: string;
  id?: string;
}) {
  const I = icon;
  return (
    <div className={cx("sc-tooltip", className)} role="tooltip" id={id}>
      {(media || I) && <div className="sc-tooltip__media">{media ?? (I && <I aria-hidden />)}</div>}
      <div className="sc-tooltip__text">
        {title && <strong className="sc-tooltip__title">{title}</strong>}
        {children && <div className="sc-tooltip__body">{children}</div>}
      </div>
    </div>
  );
}

/** Shows `content` in a tooltip above its child while hovered or focused, kept inside the viewport. */
export function HoverTooltip({
  content,
  children,
  placement = "top",
}: {
  content: ReactNode;
  /** A focusable element works best, so keyboard users can reach the tooltip. */
  children: ReactNode;
  placement?: "top" | "bottom";
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState(placement);
  const popRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const pop = popRef.current;
    if (!open || !pop) return;
    pop.style.setProperty("--shift", "0px");
    const margin = 8;
    const rect = pop.getBoundingClientRect();
    let shift = 0;
    if (rect.left < margin) shift = margin - rect.left;
    else if (rect.right > window.innerWidth - margin) shift = window.innerWidth - margin - rect.right;
    pop.style.setProperty("--shift", `${shift}px`);
    if (placement === "top" && rect.top < margin) setSide("bottom");
    else if (placement === "bottom" && rect.bottom > window.innerHeight - margin) setSide("top");
  }, [open, placement, side]);

  // Keep any description the trigger already has, adding the tooltip while it is open.
  const trigger = isValidElement<{ "aria-describedby"?: string }>(children)
    ? cloneElement(children, {
        "aria-describedby":
          [children.props["aria-describedby"], open ? id : undefined].filter(Boolean).join(" ") || undefined,
      })
    : children;
  const show = () => setOpen(true);
  const hide = () => {
    setOpen(false);
    setSide(placement);
  };
  return (
    <span
      className={cx("sc-hovertip", `sc-hovertip--${side}`)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(e) => e.key === "Escape" && hide()}
    >
      {trigger}
      {open && (
        <span className="sc-hovertip__pop" id={id} ref={popRef}>
          {content}
        </span>
      )}
    </span>
  );
}
