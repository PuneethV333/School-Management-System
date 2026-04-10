import { NavLink } from "react-router-dom";


import useIsMobile from "../../hooks/useIsMobile";
import useUi from "../../hooks/useUi";
import { useFetchMe } from "../../hooks/useAuth";
import type {  MenuItem } from "../../types/slideBar.types";
import { menuConfig } from "../../config/menuConfig";



const MenuBar = () => {
  const { setMenuIsOpen } = useUi();
  const isMobile = useIsMobile();
  const { data: userData } = useFetchMe();

  const role: "authority" | "student" | "teacher" | undefined = userData?.role;

  const sections: Record<string, MenuItem[]> = (role && menuConfig[role]) || {};

  return (
    <aside className="w-60 h-screen bg-linear-to-b from-[#0A0F1C] to-[#111827] text-white flex flex-col shadow-lg">
      <div className="flex-1 py-4 overflow-y-auto scrollbar-hide">
        {Object.entries(sections).map(([group, items]) => (
          <div key={group} className="mb-4">
            {group !== "GENERAL" && (
              <p className="px-6 mb-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                {group}
              </p>
            )}

            {items.map((item: MenuItem) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => isMobile && setMenuIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-6 py-3 text-sm font-semibold transition-all rounded-r-md mb-1
                    ${
                      isActive
                        ? "bg-blue-600/20 text-white shadow-inner"
                        : "text-gray-300 hover:bg-blue-500/10 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? "text-white" : "text-blue-400"
                        }`}
                      />
                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-blue-600 text-xs text-gray-400 shrink-0">
        © 2026 School System
      </div>
    </aside>
  );
};

export default MenuBar;
