"use client";

import {usePathname} from "next/navigation";
import {Link} from "@/navigation";
import {locales} from "@/navigation";

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const current = pathname?.split("/")[1] as (typeof locales)[number] | undefined;
  const other = current === "ne" ? "en" : "ne";

  const restPath = pathname?.split("/").slice(2).join("/") || "";
  const target = `/${other}/${restPath}`.replace(/\/$/, "");

  return (
    <div className="text-sm">
      <Link href={target} className="underline">
        {other === "ne" ? "नेपाली" : "English"}
      </Link>
    </div>
  );
}
