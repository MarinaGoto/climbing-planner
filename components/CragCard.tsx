import type { Crag, Result } from "@/types/climb";
import type { FunctionComponent, PropsWithChildren } from "react";

type Props = Crag & Result;

const CragCard: FunctionComponent<PropsWithChildren<Props>> = ({
  children,
  ...props
}) => {
  return (
    <article className="mb-5">
      <div className="text-lg font-semibold text-[#2f2f2f]">{props.name}</div>
      <div className="text-base text-[#2f2f2f] mt-1">
        {props.score} — {props.label}
      </div>

      <ul className="text-[#2f2f2f] mt-2 pl-5">
        {props.breakdown.map((b, i) => (
          <li key={i}>
            {b.value > 0 ? "+" : ""}
            {b.value} — {b.reason}
          </li>
        ))}
      </ul>

      {children}
    </article>
  );
};

export default CragCard;
