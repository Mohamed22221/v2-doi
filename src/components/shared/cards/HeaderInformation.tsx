import React from "react";

type HeaderInformationProps = {
  title: string;
  icon?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
};

const HeaderInformation: React.FC<HeaderInformationProps> = ({
  title,
  icon,
  rightSlot,
  className = "",
}) => {
  return (
    <div className={`w-full ${className} py-2`}>
      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          {icon ? (
            <span className="inline-flex h-7 w-7 items-center justify-center">
              {icon}
            </span>
          ) : null}

          <h2 className="text-[20px] font-semibold text-primary-500 dark:text-neutral-50">
            {title}
          </h2>
        </div>

        {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
      </div>

      <div className="mt-5 h-px w-full bg-neutral-100 dark:bg-neutral-800" />
    </div>
  );
};

export default HeaderInformation;
