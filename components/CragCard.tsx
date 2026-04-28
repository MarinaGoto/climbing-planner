import type { ClimbabilityResult, Crag } from "@/types/climb";
import type { Weather } from "@/types/climb";
import { getWindInteractionLabel } from "@/utils/windDirectionLabel";
import type { FunctionComponent, PropsWithChildren, MouseEvent } from "react";
import { useState, useRef, useEffect } from "react";

type Props = Crag & ClimbabilityResult & { weather?: Weather };

const CragCard: FunctionComponent<PropsWithChildren<Props>> = ({
  children,
  ...props
}) => {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleToggle = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a")) return;
    setExpanded((v) => !v);
  };

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (expanded) {
      el.style.maxHeight = el.scrollHeight + "px";
      el.style.opacity = "1";
    } else {
      el.style.maxHeight = "0px";
      el.style.opacity = "0";
    }
  }, [expanded]);

  return (
    <div
      className="crag-card relative mb-3.5 border border-[#e5e5e5] rounded-xl py-4 px-4.5 bg-[#fafafa] hover:bg-[#f5f5f5] transition-colors duration-200 text-sm cursor-pointer"
      onClick={handleToggle}
    >
      <div className="crag-header flex justify-between items-baseline">
        <h3 className="text-base font-semibold m-0 text-[#2f2f2f]">
          <a
            href={props.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2f2f2f] hover:underline"
          >
            {props.name}
          </a>
        </h3>
      </div>

      <div
        ref={contentRef}
        className="mt-2 text-sm text-[#374151] overflow-hidden"
        style={{
          maxHeight: "0px",
          transition: "max-height 280ms ease, opacity 220ms ease",
          opacity: 0,
        }}
        aria-hidden={!expanded}
      >
        <div className="py-1">{props.description}</div>
      </div>

      <div className="summary mt-1.5 text-sm text-[#374151]">
        {props.reason}

        {(() => {
          const rawWind =
            props.weather?.windDirection ??
            (props as any).windDirection ??
            null;
          if (!rawWind) return null;
          const windDir = String(rawWind).toUpperCase();
          const label = getWindInteractionLabel(
            windDir as any,
            props.orientation as any,
          );
          // debug: log wind inputs and computed label
          // remove or guard this in production
          // eslint-disable-next-line no-console
          console.log(
            "getWindInteractionLabel:",
            windDir,
            props.orientation,
            "->",
            label,
          );
          return <p className="text-xs text-muted-foreground mt-1">{label}</p>;
        })()}
      </div>

      <div className="details mt-1.5 text-[13px] text-[#9ca3af]">
        {props.rockType.charAt(0).toUpperCase() + props.rockType.slice(1)} ·{" "}
        {props.style} · faces {props.orientation} · {props.altitude}m a.s.l.
        {props.special ? ` · ${props.special.split("_").join(" ")}` : ""}
      </div>

      {children}

      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 12,
          bottom: 10,
          width: 18,
          height: 18,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 220ms ease",
          transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          color: "#6b7280",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>
  );
};

export default CragCard;
