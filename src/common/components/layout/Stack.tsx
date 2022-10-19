
import { Spacing } from "@app-src/common/types/style";
import { getSpacingClass } from "@app-src/common/utils/tailwind";
import { ReactNode, useMemo } from "react";

export type IStackProps = {
  spacing: Spacing;
  children?: ReactNode
}

const Stack = ({ spacing, children }: IStackProps) => {
  const spacingClass = useMemo(() => getSpacingClass(spacing, 'row'), [spacing])

  return (
    <div className={`flex flex-col ${spacingClass}`}>{children}</div>
  )
}

export default Stack;