import React, { ReactNode } from "react";

interface DashboardTitleProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

const DashboardTitle: React.FC<DashboardTitleProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="mb-4 flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold lg:text-3xl">{title}</h1>
        {subtitle && (
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        )}
      </div>

      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
};

export default DashboardTitle;
