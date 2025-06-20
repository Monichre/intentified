export const GridBackgroundWithBlur = ({
  noBlur = false,
}: {
  noBlur?: boolean;
}) => {
  return (
    <>
      <div
        className="w-frull bg-blur-2xl pointer-events-none absolute top-0 left-0 z-0 h-full max-h-500 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:12px_12px]"
        aria-hidden="true"
        style={{
          zIndex: "0",
          pointerEvents: "none",
        }}
      />
      {noBlur ? null : (
        <div
          className="absolute top-[30%] right-[40%] z-[-10px] h-[400px] w-[400px] rounded-full bg-[turquoise]/40 blur-2xl"
          aria-hidden="true"
        />
      )}
      <div
        className="bg-primary/90 absolute bottom-16 left-0 -z-10 h-36 w-36 rounded-full blur-2xl"
        aria-hidden="true"
      />
    </>
  );
};
