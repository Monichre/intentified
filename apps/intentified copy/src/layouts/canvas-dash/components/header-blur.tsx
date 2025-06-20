export const HeaderBlur = () => {
  // Create 10 blur elements with decreasing blur values from 10px to 1px
  const blurItems = Array.from({ length: 10 }, (_, i) => ({
    blur: 10 - i,
    top: i * 12,
  }));

  return (
    <div className="fixed z-[1005] inset-x-0 top-0 pointer-events-none group">
      {blurItems.map((item, index) => (
        <div
          key={index}
          id="blur"
          className="absolute inset-0 bg-neutral-900/5 pointer-events-none"
          style={{
            backdropFilter: `blur(${item.blur}px)`,
            height: "12px",
            top: `${item.top}px`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default HeaderBlur;
