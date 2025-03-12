import React from "react";
export function Card({ children, ...props }: React.HTMLProps<HTMLDivElement>) {
  return <div {...props} className={"rounded border shadow " + props.className}>{children}</div>;
}
export function CardContent({ children, ...props }: React.HTMLProps<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
}