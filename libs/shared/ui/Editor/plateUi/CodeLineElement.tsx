"use client";

import { PlateElement } from "@udecode/plate-common";
import { withRef } from "@udecode/cn";
import React from "react";

export const CodeLineElement = withRef<typeof PlateElement>((props, ref) => <PlateElement ref={ref} {...props} />);
