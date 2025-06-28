import { FC } from "react";
import { MoonFilledIcon } from "@/components/icons";

export const ThemeSwitch: FC = () => {
  return (
    <div
      className="w-6 h-6 flex items-center justify-center text-default-500"
      aria-label="Modo escuro ativado"
    >
      <MoonFilledIcon size={22} />
    </div>
  );
};
