import { Zap, Info, Hash, Globe, ImageIcon } from "lucide-react";

export const getIcon = (key: string) => {
  switch (key) {
    case "title":
      return <Globe className=" text-blue-light fill-blue-light/20 stroke-1" />;
    case "metaDescription":
      return (
        <Zap className=" text-yellow-light fill-yellow-light/20 stroke-1" />
      );
    case "images":
      return (
        <ImageIcon className=" text-purple-light fill-purple-light/20 stroke-1" />
      );
    case "headings":
      return <Hash className=" text-cyan-light fill-cyan-light/20 stroke-1" />;
    case "keywords":
      return (
        <Info className=" text-orange-light fill-orange-light/20 stroke-1" />
      );
    default:
      return <Info className="" />;
  }
};
