import { AppSidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { useDark } from "@/hooks/useDark";

import { Moon, Sun } from "lucide-react";
import { Outlet } from "react-router";

function Layout() {
  const { setisDark } = useDark();
  const { user, logout } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex flex-col">
        {user?.role === "preview" && (
          <div className="w-full text-lg font-semibold text-center py-3 bg-indigo-800">
            👋 Data mutations (create, update, delete) are deactivated for this
            user
          </div>
        )}
        <main className="min-h-screen w-screen grid grid-cols-11">
          <AppSidebar />
          <div className="dark:bg-tuna-1000/50 col-span-9 py-5 px-10 flex flex-col items-start gap-y-1 dark:text-white bg-gray-400 text-black">
            <div className="self-end flex items-center gap-3">
              <div className="flex items-center space-x-2">
                <Label htmlFor="dark-mode">
                  <Moon />
                </Label>
                <Switch
                  id="dark-mode"
                  className="dark:data-[state=unchecked]:bg-indigo-500 dark:data-[state=checked]:bg-gray-500"
                  onCheckedChange={() => setisDark((pre) => !pre)}
                />
                <Label htmlFor="dark-mode">
                  <Sun />
                </Label>
              </div>

              <Button
                variant={"secondary"}
                onClick={logout}
                className="cursor-pointer"
              >
                Logout
              </Button>
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default Layout;
