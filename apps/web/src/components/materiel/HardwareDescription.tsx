import { Fragment, type ReactNode } from "react";

type Props = {
  value: string;
};

function parseRestrictedMarkdown(value: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let key = 0;

  while (cursor < value.length) {
    const opening = value.indexOf("**", cursor);
    if (opening === -1) {
      nodes.push(<Fragment key={key++}>{value.slice(cursor)}</Fragment>);
      break;
    }
    if (opening > cursor) {
      nodes.push(
        <Fragment key={key++}>{value.slice(cursor, opening)}</Fragment>
      );
    }

    const closing = value.indexOf("**", opening + 2);
    if (closing === -1) {
      nodes.push(<Fragment key={key++}>{value.slice(opening)}</Fragment>);
      break;
    }

    nodes.push(
      <strong key={key++}>{value.slice(opening + 2, closing)}</strong>
    );
    cursor = closing + 2;
  }

  return nodes;
}

export default function HardwareDescription({ value }: Props) {
  return <>{parseRestrictedMarkdown(value)}</>;
}
