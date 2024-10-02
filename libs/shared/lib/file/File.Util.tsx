"use client";
import { Data } from "@shared/ui";
import { Image } from "@util/ui";
import { ModelDashboardProps, ModelInsightProps, clsx } from "@core/client";
import { cnst, st } from "@shared/client";
import { downloadFile } from "@shared/next";
import { getQueryMap } from "@core/base";
import { lazy } from "@core/next";
import { useState } from "react";
const ImageViewer = lazy(() => import("react-simple-image-viewer"), { ssr: false });

export const Stat = ({
  summary,
  sliceName = "file",
  queryMap = getQueryMap(cnst.FileSummary),
  hidePresents,
}: ModelDashboardProps<cnst.Summary>) => {
  return (
    <Data.Dashboard
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalFile"]}
      hidePresents={hidePresents}
    />
  );
};
export const Insight = ({ className, insight, sliceName = "file" }: ModelInsightProps<cnst.FileInsight>) => {
  return <Data.Insight className={className} insight={insight} sliceName={sliceName} columns={["count"]} />;
};

interface FileZoneImageGalleryProps {
  srcs: string[];
}
export const ImageGallery = ({ srcs }: FileZoneImageGalleryProps) => {
  const fileModal = st.use.fileModal();
  const [imgIdx, setImgIdx] = useState(0);
  return (
    <>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
        {srcs.map((src, idx) => (
          <Image
            key={idx}
            className="h-32 w-44 cursor-pointer object-cover"
            onClick={() => {
              setImgIdx(idx);
              st.do.setFileModal("imageGallery");
            }}
            src={src}
            width={176}
            height={128}
            placeholder="blur"
            blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
          />
        ))}
      </div>
      {fileModal === "imageGallery" && (
        <ImageViewer
          src={srcs}
          currentIndex={imgIdx}
          onClose={() => { st.do.setFileModal(null); }}
          disableScroll={false}
          backgroundStyle={{ backgroundColor: "rgba(0,0,0,0.9)", zIndex: 1000 }}
          closeOnClickOutside={true}
        />
      )}
    </>
  );
};

interface Download {
  className?: string;
  url: string;
  filename: string;
  onClick?: () => void;
  children?: any;
}
export const Download = ({ className, onClick, url, filename, children }: Download) => {
  return (
    <div
      onClick={async () => {
        onClick?.();
        await downloadFile(url, filename);
      }}
      className={clsx("w-fit cursor-pointer", className)}
    >
      {children}
    </div>
  );
};
