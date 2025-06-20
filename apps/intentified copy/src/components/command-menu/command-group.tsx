interface CommandGroupProps {
  title: string;
  children: React.ReactNode;
}

export const CommandGroup: React.FC<CommandGroupProps> = ({
  title,
  children,
}) => {
  return (
    <div className="py-1.5">
      <div className="text-primary-500 flex items-center px-3 py-1.5 text-xs font-medium tracking-wider uppercase">
        <div className="bg-primary-500 mr-2 h-3 w-1 rounded-sm"></div>
        {title}
      </div>
      <div className="mt-1 space-y-1">{children}</div>
    </div>
  );
};
