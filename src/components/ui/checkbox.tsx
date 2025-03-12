import React from "react";
export function Checkbox({ ...props }: React.HTMLProps<HTMLInputElement>) {
  return <input type="checkbox" {...props} />;
}