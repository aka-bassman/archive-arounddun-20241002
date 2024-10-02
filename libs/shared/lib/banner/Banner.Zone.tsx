"use client";
import { Banner, cnst } from "@shared/client";
import { ClientInit, ClientView, DefaultOf } from "@core/base";
import { Data, Load } from "@shared/ui";
import { Image, Link, Swiper } from "@util/ui";
import { ModelsProps } from "@core/client";

export const Admin = ({ sliceName = "banner", init, query }: ModelsProps<cnst.Banner>) => {
  return (
    <Data.ListContainer
      type="list"
      init={init}
      query={query}
      sliceName={sliceName}
      renderItem={Banner.Unit.Card}
      renderDashboard={Banner.Util.Stat}
      renderInsight={Banner.Util.Insight}
      renderTemplate={Banner.Template.General}
      renderTitle={(banner: DefaultOf<cnst.Banner>) => `Banner-${banner.id}`}
      renderView={(banner: cnst.Banner) => <Banner.View.General banner={banner} />}
      columns={["title", "category", "status", "createdAt", "updatedAt"]}
      actions={(banner: cnst.LightBanner, idx) => ["remove", "edit", "view"]}
    />
  );
};

interface CardProps {
  className?: string;
  init: ClientInit<"banner", cnst.LightBanner>;
}
export const Card = ({ className, init }: CardProps) => {
  return (
    <Load.Units
      className={className}
      init={init}
      renderItem={(banner: cnst.Banner) => (
        <Banner.Unit.Card key={banner.id} href={`/banner/${banner.id}`} banner={banner} />
      )}
    />
  );
};

interface ViewProps {
  className?: string;
  view: ClientView<"banner", cnst.Banner>;
}
export const View = ({ view }: ViewProps) => {
  return <Load.View view={view} renderView={(banner) => <Banner.View.General banner={banner} />} />;
};

interface SwiperProps {
  className?: string;
  init: ClientInit<"banner", cnst.LightBanner>;
}
export const Swipe = ({ className, init }: SwiperProps) => {
  return (
    <Load.Units
      className={className}
      init={init}
      renderList={(bannerList: cnst.LightBanner[]) => (
        <Swiper>
          {bannerList.map((banner) => (
            <Swiper.Slide key={banner.id} className="relative isolate h-full">
              <Link href={banner.href} target={banner.target}>
                <Image file={banner.image} className="z-0 w-full object-contain opacity-80" />
                <div className="absolute inset-0 z-[2] flex items-end justify-center p-3 text-white md:p-10">
                  <div className="text-center">
                    <p className="pb-1 text-xl 2xl:text-3xl">{banner.title}</p>
                    <p className="text-lg 2xl:text-[34px]">{banner.content}</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 z-0  size-full h-full bg-gradient-to-t from-black to-transparent" />
              </Link>
            </Swiper.Slide>
          ))}
        </Swiper>
      )}
    />
  );
};
