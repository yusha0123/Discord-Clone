import NavigationSideBar from "@/components/navigation/NavigationSideBar";

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full z-10 flex-col fixed inset-y-0 w-[72px]">
        <NavigationSideBar />
      </div>
      <main className="md:pl-[72px] h-full">{children}</main>
    </div>
  );
};

export default layout;
