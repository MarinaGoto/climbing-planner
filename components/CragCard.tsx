import type { ClimbabilityResult, Crag } from "@/types/climb";
import type { FunctionComponent, PropsWithChildren } from "react";

type Props = Crag & ClimbabilityResult;

const getScoreColor = (score: number | string) => {
  const s = Number(score) || 0;
  if (s > 70) return "#20974d"; // green
  if (s > 40) return "#92400e"; // amber
  return "#7f1d1d"; // red
};

const CragCard: FunctionComponent<PropsWithChildren<Props>> = ({
  children,
  ...props
}) => {
  const scoreColor = getScoreColor(props.score);

  return (
    <div className="crag-card mb-3.5 border border-[#e5e5e5] rounded-xl py-4 px-4.5 bg-[#fafafa] hover:bg-[#f5f5f5] transition-colors duration-200 text-sm">
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

        <div
          className="score text-[22px] font-semibold"
          style={{ color: scoreColor }}
        >
          {props.score}
        </div>
      </div>

      <div className="summary mt-1.5 text-sm text-[#374151]">
        {props.reason}
      </div>

      <div className="details mt-1.5 text-[13px] text-[#9ca3af]">
        {props.rockType.charAt(0).toUpperCase() + props.rockType.slice(1)} ·{" "}
        {props.style} · faces {props.orientation}
        {props.exposure === "high" && " · exposed"}
      </div>

      {children}
    </div>
  );
};

export default CragCard;
