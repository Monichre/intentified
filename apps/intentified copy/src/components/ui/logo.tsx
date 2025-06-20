import Image from "next/image";
import logoImg from "@/assets/logo-white.png";
import { FileDownIcon } from "lucide-react";

export function Logo() {
  return <Image src={logoImg} height={50} width={30} alt="logo" />;
}

export function NewCultBadge() {
  return (
    <div className="flex flex-col items-center  mx-auto md:py-8 ">
      <div className=" bg-base-900  rounded-[8px] flex flex-row md:flex-col items-center  pt-1  px-1 gap-1 md:pt-2 pb-1 bg-black/70 text-base-300">
        <p className="text-[11px] px-1 leading-2 md:pb-1">
          Want the source code?
        </p>
        <div className="flex gap-2 text-cyan-400/80  bg-base-900 shadow-inner-shadow  items-center py-2 px-2 md:text-base text-[10px] rounded-[7px] ">
          <FileDownIcon className=" h-4 w-4 md:h-5 md:w-5" />{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://newcult.co"
          >
            newcult.co
          </a>
        </div>
      </div>
    </div>
  );
}
