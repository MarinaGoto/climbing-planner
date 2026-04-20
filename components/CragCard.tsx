import type { Crag, Result } from "@/types/climb";
import type { FunctionComponent, PropsWithChildren } from "react";

type Props = Crag & Result;

const CragCard: FunctionComponent<PropsWithChildren<Props>> = ({
  children,
  ...props
}) => {
  return (
    <article className="mb-5 border border-gray-200 rounded-md p-4 text-sm">
      <div className="text-base font-semibold text-[#2f2f2f]">
        <a
          href={props.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2f2f2f] hover:underline"
        >
          {props.name}
        </a>
      </div>
      <div className="text-sm text-[#2f2f2f] mt-1">
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
