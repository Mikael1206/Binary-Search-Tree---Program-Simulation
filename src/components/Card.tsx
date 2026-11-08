import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  headerTitle?: string;
  headerColorClass?: string;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  headerTitle,
  headerColorClass = 'bg-accent-lime',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-card rounded-card border-3 border-ink shadow-pop overflow-hidden flex flex-col ${className}`}
      {...props}
    >
      {headerTitle && (
        <div
          className={`h-16 px-6 flex items-center border-b-3 border-ink flex-shrink-0 ${headerColorClass}`}
        >
          <h2 className="font-sans font-extrabold text-ink text-[13px] tracking-[0.22em] uppercase select-none">
            {headerTitle}
          </h2>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;

