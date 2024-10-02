import { bootCsr } from "@core/next";

void bootCsr(require.context("./", true, /\.tsx$/), "./[lang]/layout.tsx");
