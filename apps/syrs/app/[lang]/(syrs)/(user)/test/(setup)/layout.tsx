export default function Layout({ children }: any) {
  return (
    <div className="bg-syrs-bg w-full h-full">
      <div className=" text-syrs-brown font-gilda text-4xl mt-12">Skin Consultation</div>
      {children}
    </div>
  );
}
