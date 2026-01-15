import React from "react";

type EmptyStateProps = {
  text?: string;
  image?: string;
  height?: number | string; // مثال: 300 أو "300px" أو "40vh"
  fullPage?: boolean;
  className?: string;
  imgClassName?: string;
  children?: React.ReactNode;
};

const EmptyState: React.FC<EmptyStateProps> = ({
  text = "No Data Available",
  image = "/img/others/empty.png",
  height = "300px",
  fullPage = false,
  className = "",
  imgClassName = "mx-auto mb-2 max-w-[150px]",
  children,
}) => {
  const style: React.CSSProperties | undefined = fullPage
    ? undefined
    : { height: typeof height === "number" ? `${height}px` : height };

  return (
    <div
      className={[
        "flex flex-col items-center justify-center gap-2 text-center",
        fullPage ? "min-h-screen" : "",
        className,
      ].join(" ")}
      style={style}
    >
      <img className={imgClassName} src={image} alt="Empty state" />

      <h4 className="text-sm text-primary-700 dark:text-primary-200">
        {text}
      </h4>

      {children ? <div className="mt-2">{children}</div> : null}
    </div>
  );
};

export default EmptyState;
