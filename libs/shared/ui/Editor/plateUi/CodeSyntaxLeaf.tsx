"use client";

import { PlateLeaf } from "@udecode/plate-common";
import { useCodeSyntaxLeaf } from "@udecode/plate-code-block";
import { withRef } from "@udecode/cn";
import React from "react";

export const CodeSyntaxLeaf = withRef<typeof PlateLeaf>(({ children, ...props }, ref) => {
  const { leaf } = props;

  const { tokenProps } = useCodeSyntaxLeaf({ leaf });

  return (
    <PlateLeaf ref={ref} {...props}>
      <span {...tokenProps}>{children}</span>
    </PlateLeaf>
  );
});
