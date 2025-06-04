// src/components/SideBar.tsx
import React from "react";

const SideBar: React.FC = () => {
  return (
    <aside className="w-full h-full text-white">
      <div className="p-4">
        <nav className="mt-4">{/* <DropDownSelect /> */}</nav>
      </div>
    </aside>
  );
};

export default SideBar;
