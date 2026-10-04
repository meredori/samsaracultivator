import { Check, ChevronDown } from "lucide-react";
import { useRef, type InputHTMLAttributes, type KeyboardEvent, type ReactNode, type SelectHTMLAttributes } from "react";
import { cx, type Icon } from "./types";
import "./controls.css";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "children">;

export function Checkbox({ label, className, ...rest }: InputProps & { label: ReactNode }) {
  return (
    <label className={cx("sc-check", className)}>
      <input type="checkbox" {...rest} />
      <span className="sc-check__box" aria-hidden>
        <Check />
      </span>
      <span className="sc-check__label">{label}</span>
    </label>
  );
}

export function Radio({ label, className, ...rest }: InputProps & { label: ReactNode }) {
  return (
    <label className={cx("sc-check", "sc-check--radio", className)}>
      <input type="radio" {...rest} />
      <span className="sc-check__box" aria-hidden />
      <span className="sc-check__label">{label}</span>
    </label>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
  disabled,
  showState = true,
  className,
}: {
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  /** Show "On" / "Off" beside the switch. */
  showState?: boolean;
  className?: string;
}) {
  return (
    <label className={cx("sc-toggle", className)}>
      <span className="sc-toggle__label">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className="sc-toggle__track"
        onClick={() => onChange(!checked)}
      >
        <span className="sc-toggle__thumb" />
      </button>
      {showState && <span className="sc-toggle__state">{checked ? "On" : "Off"}</span>}
    </label>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

export function Select({
  label,
  options,
  className,
  ...rest
}: Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & { label?: ReactNode; options: SelectOption[] }) {
  return (
    <label className={cx("sc-select", className)}>
      {label && <span className="sc-select__label">{label}</span>}
      <span className="sc-select__field">
        <select {...rest}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden />
      </span>
    </label>
  );
}

export interface TabOption<T extends string> {
  id: T;
  label: string;
  icon?: Icon;
  disabled?: boolean;
  /** Small count shown after the label. */
  count?: number;
}

/** Arrow-key navigation shared by the tab-like controls. */
function useRovingKeys<T extends string>(options: TabOption<T>[], value: T, onChange: (v: T) => void) {
  const ref = useRef<HTMLDivElement>(null);
  return {
    ref,
    onKeyDown(e: KeyboardEvent) {
      const enabled = options.filter((o) => !o.disabled);
      const idx = enabled.findIndex((o) => o.id === value);
      let next = -1;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (idx + 1) % enabled.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (idx - 1 + enabled.length) % enabled.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = enabled.length - 1;
      if (next < 0) return;
      e.preventDefault();
      onChange(enabled[next].id);
      const btn = ref.current?.querySelector<HTMLButtonElement>(`[data-id="${enabled[next].id}"]`);
      btn?.focus();
    },
  };
}

/** Compact filter tabs, e.g. All / Materials / Items. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name for the group. */
  label: string;
  className?: string;
}) {
  const { ref, onKeyDown } = useRovingKeys(options, value, onChange);
  return (
    <div
      ref={ref}
      role="tablist"
      aria-label={label}
      className={cx("sc-segmented", className)}
      onKeyDown={onKeyDown}
    >
      {options.map((o) => {
        const I = o.icon;
        const selected = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            role="tab"
            data-id={o.id}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            disabled={o.disabled}
            className="sc-segmented__item"
            onClick={() => onChange(o.id)}
          >
            {I && <I aria-hidden />}
            {o.label}
            {o.count !== undefined && <span className="sc-segmented__count">{o.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Large icon-over-label tabs for top-level navigation. Scrolls sideways when narrow. */
export function NavTabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
  className,
}: {
  tabs: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  const { ref, onKeyDown } = useRovingKeys(tabs, value, onChange);
  return (
    <div ref={ref} role="tablist" aria-label={label} className={cx("sc-navtabs", className)} onKeyDown={onKeyDown}>
      {tabs.map((t) => {
        const I = t.icon;
        const selected = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            data-id={t.id}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            disabled={t.disabled}
            className="sc-navtabs__tab"
            onClick={() => onChange(t.id)}
          >
            {I && <I aria-hidden />}
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
