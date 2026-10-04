import { Plus } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { SegmentedControl, type TabOption } from "./controls";
import { HoverTooltip } from "./shells";
import { Badge, ItemIcon, RarityBadge } from "./primitives";
import { cx, RARITY_LABEL, type Icon, type ItemData, type Rarity } from "./types";
import "./items.css";

/** One square inventory slot. Empty slots show a plus (or nothing when `onClick` is absent). */
export function ItemSlot({
  item,
  selected,
  onClick,
  tooltip = true,
  size = "md",
}: {
  item?: ItemData;
  selected?: boolean;
  onClick?: () => void;
  /** Show the item tooltip on hover and focus. */
  tooltip?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  if (!item) {
    return (
      <button
        type="button"
        className={cx("sc-slot", "sc-slot--empty", `sc-slot--${size}`)}
        aria-label="Empty slot"
        onClick={onClick}
        disabled={!onClick}
      >
        {onClick && <Plus aria-hidden />}
      </button>
    );
  }
  const I = item.icon;
  const slot = (
    <button
      type="button"
      className={cx("sc-slot", `sc-slot--${size}`, `sc-rarity--${item.rarity}`, selected && "is-selected")}
      aria-label={`${item.name}${item.count !== undefined ? `, ${item.count}` : ""}, ${RARITY_LABEL[item.rarity]}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      <I aria-hidden />
      {item.count !== undefined && <span className="sc-slot__count">{item.count}</span>}
    </button>
  );
  return tooltip ? <HoverTooltip content={<ItemTooltip item={item} />}>{slot}</HoverTooltip> : slot;
}

/** Small icon + count chip for stacked items in tight rows. */
export function ItemChip({ item }: { item: ItemData }) {
  return (
    <span className={cx("sc-itemchip", `sc-rarity--${item.rarity}`)} title={item.name}>
      <item.icon aria-hidden />
      {item.count !== undefined && <b>{item.count}</b>}
    </span>
  );
}

/** Resource name with its owned amount, e.g. Spirit Herb 12. */
export function ResourceChip({
  icon: I,
  label,
  amount,
  tint,
  onClick,
}: {
  icon: Icon;
  label: ReactNode;
  amount: ReactNode;
  /** Icon colour. */
  tint?: string;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag type={onClick ? "button" : undefined} className="sc-reschip" onClick={onClick}>
      <I aria-hidden style={tint ? { color: tint } : undefined} />
      <span className="sc-reschip__label">{label}</span>
      <b className="sc-reschip__amount">{amount}</b>
    </Tag>
  );
}

/** Equipment slot with a category icon and label. */
export function EquipmentSlot({
  label,
  icon: I,
  item,
  locked,
  onClick,
}: {
  label: string;
  icon: Icon;
  item?: ItemData;
  locked?: boolean;
  onClick?: () => void;
}) {
  const Shown = item?.icon ?? I;
  return (
    <div className={cx("sc-equip", locked && "is-locked")}>
      <button
        type="button"
        className={cx("sc-equip__slot", item && `sc-rarity--${item.rarity}`, item && "is-filled")}
        onClick={onClick}
        disabled={locked}
        aria-label={item ? `${label}: ${item.name}` : `${label}: empty${locked ? ", locked" : ""}`}
      >
        <Shown aria-hidden />
      </button>
      <span className="sc-equip__label">{label}</span>
    </div>
  );
}

export function EquipmentGrid({ children }: { children: ReactNode }) {
  return <div className="sc-equip-grid">{children}</div>;
}

/** Filterable grid of item slots. Pads to `minSlots` with empties. */
export function InventoryGrid({
  items,
  filters,
  minSlots = 0,
  onAdd,
  onSelect,
  selectedId,
}: {
  items: ItemData[];
  /** Filter tabs; each id matches an item category. "All" is added automatically. */
  filters?: Array<{ id: string; label: string }>;
  minSlots?: number;
  onAdd?: () => void;
  onSelect?: (item: ItemData) => void;
  selectedId?: string;
}) {
  const [filter, setFilter] = useState("all");
  const tabs: TabOption<string>[] = useMemo(
    () => [{ id: "all", label: "All" }, ...(filters ?? [])],
    [filters],
  );
  // Without filter tabs there is no way back to "all", so ignore any stale choice.
  const active = filters?.some((f) => f.id === filter) ? filter : "all";
  const shown = active === "all" ? items : items.filter((i) => i.category === filter);
  const empties = Math.max(0, minSlots - shown.length - (onAdd ? 1 : 0));
  return (
    <div className="sc-inventory">
      {filters && <SegmentedControl label="Filter items" options={tabs} value={active} onChange={setFilter} />}
      <div className="sc-inventory__grid">
        {shown.map((it) => (
          <ItemSlot key={it.id} item={it} selected={it.id === selectedId} onClick={onSelect && (() => onSelect(it))} />
        ))}
        {onAdd && <ItemSlot onClick={onAdd} />}
        {Array.from({ length: empties }, (_, i) => (
          <ItemSlot key={`empty-${i}`} />
        ))}
      </div>
    </div>
  );
}

/** Compact card for an item: icon, name, category tag, blurb and count. */
export function ItemInfoCard({ item, action }: { item: ItemData; action?: ReactNode }) {
  return (
    <article className="sc-iteminfo">
      <ItemIcon icon={item.icon} rarity={item.rarity} size="lg" />
      <div className="sc-iteminfo__body">
        <div className="sc-iteminfo__head">
          <h4>{item.name}</h4>
          <Badge size="sm" tone="grey">
            {item.category}
          </Badge>
        </div>
        {item.description && <p>{item.description}</p>}
      </div>
      <div className="sc-iteminfo__side">
        {item.count !== undefined && <span className="sc-iteminfo__count">× {item.count}</span>}
        {action}
      </div>
    </article>
  );
}

/** Taller material or catalyst card with rarity, ownership and description. */
export function ItemCard({ item, action }: { item: ItemData; action?: ReactNode }) {
  return (
    <article className={cx("sc-itemcard", `sc-rarity--${item.rarity}`)}>
      <div className="sc-itemcard__top">
        <ItemIcon icon={item.icon} rarity={item.rarity} size="lg" />
        <div className="sc-itemcard__meta">
          <h4>{item.name}</h4>
          <div className="sc-itemcard__tags">
            <Badge size="sm" tone="grey">
              {item.category}
            </Badge>
            <RarityBadge rarity={item.rarity} size="sm" />
          </div>
          {item.count !== undefined && <span className="sc-itemcard__own">Own: {item.count}</span>}
        </div>
      </div>
      {item.description && <p className="sc-itemcard__desc">{item.description}</p>}
      {action && <div className="sc-itemcard__action">{action}</div>}
    </article>
  );
}

/** Rich item tooltip, themed by rarity. */
export function ItemTooltip({ item }: { item: ItemData }) {
  return (
    <div className={cx("sc-itemtip", `sc-rarity--${item.rarity}`)} role="tooltip">
      <div className="sc-itemtip__head">
        <ItemIcon icon={item.icon} rarity={item.rarity} />
        <div>
          <strong>{item.name}</strong>
          <span>
            {RARITY_LABEL[item.rarity]} {item.category}
          </span>
        </div>
      </div>
      {item.description && <p>{item.description}</p>}
      {(item.source || item.use) && (
        <dl>
          {item.source && (
            <>
              <dt>Source</dt>
              <dd>{item.source}</dd>
            </>
          )}
          {item.use && (
            <>
              <dt>Use</dt>
              <dd>{item.use}</dd>
            </>
          )}
        </dl>
      )}
    </div>
  );
}

/** A row in a list of items grouped by rarity, with an owned count. */
export function RarityRow({ icon: I, rarity, label, count }: { icon: Icon; rarity: Rarity; label?: ReactNode; count: number }) {
  return (
    <div className={cx("sc-rarityrow", `sc-rarity--${rarity}`)}>
      <ItemIcon icon={I} rarity={rarity} size="sm" />
      <span className="sc-rarityrow__label">{label ?? `${RARITY_LABEL[rarity]} Item`}</span>
      <b>{count}</b>
    </div>
  );
}

/** A plain row of small item glyphs, e.g. rewards or recent pickups. */
export function ItemIconRow({ items }: { items: Array<{ icon: Icon; rarity?: Rarity; label: string }> }) {
  return (
    <ul className="sc-iconrow">
      {items.map((it, i) => (
        <li key={i} title={it.label}>
          <ItemIcon icon={it.icon} rarity={it.rarity} size="sm" />
          <span className="sc-visually-hidden">{it.label}</span>
        </li>
      ))}
    </ul>
  );
}
