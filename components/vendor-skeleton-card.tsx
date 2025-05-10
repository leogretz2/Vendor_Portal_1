// components/vendor-skeleton-card.tsx
'use client';
import cx from 'classnames';

export function VendorSkeletonCard() {
  return (
    <div
      className={cx(
        'flex items-start gap-3 rounded-[28px] px-6 py-[20px] w-full max-w-[1000px]',
        'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] border border-black/3',
        'animate-pulse' // Tailwind's pulse animation
      )}
    >
      <div className="flex-1 flex gap-5">
        {/* Left Column Skeleton */}
        <div className="left flex flex-col gap-2 max-w-72 w-1/3">
          <div className="title mb-1">
            <div className="h-5 bg-slate-200 rounded w-3/4 mb-1"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
          <div className="section flex flex-col gap-1 mt-3">
            <div className="h-3 bg-slate-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-slate-200 rounded w-full mb-1"></div>
            <div className="h-3 bg-slate-200 rounded w-5/6 mb-1"></div>
            <div className="h-3 bg-slate-200 rounded w-full mb-1"></div>
            <div className="h-3 bg-slate-200 rounded w-4/5"></div>
          </div>
          <div className="section flex flex-col gap-1 mt-3">
            <div className="h-3 bg-slate-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-slate-200 rounded w-full"></div>
          </div>
          <div className="section flex flex-col gap-1 mt-3">
            <div className="h-3 bg-slate-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-slate-200 rounded w-full"></div>
          </div>
        </div>

        <div className="w-[1px] bg-slate-100 shrink-0"/>

        {/* Center Column Skeleton */}
        <div className="center flex-1 flex flex-col gap-4 w-1/3">
          <div>
            <div className="h-3 bg-slate-200 rounded w-1/4 mb-2"></div>
            <div className="h-2 bg-slate-200 rounded w-full mb-1"></div>
            <div className="h-2 bg-slate-200 rounded w-5/6 mb-1"></div>
            <div className="h-2 bg-slate-200 rounded w-full mb-1"></div>
          </div>
          <div className="section mt-3">
            <div className="h-3 bg-slate-200 rounded w-1/4 mb-2"></div>
            <div className="grid grid-cols-2 gap-1">
              <div className="h-2 bg-slate-200 rounded"></div>
              <div className="h-2 bg-slate-200 rounded"></div>
              <div className="h-2 bg-slate-200 rounded"></div>
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Right Column (VendorData3) Skeleton - Simplified */}
        <div className="flex flex-col justify-between w-1/3" style={{ width: "220px" }}>
            <div className="flex w-full justify-end gap-2 mb-4">
                <div className="h-12 w-16 bg-slate-200 rounded-lg"></div>
                <div className="h-12 w-16 bg-slate-200 rounded-lg"></div>
                <div className="h-12 w-16 bg-slate-200 rounded-lg"></div>
            </div>
            <div className="h-3 bg-slate-200 rounded w-1/3 mb-2"></div>
            <div className="flex flex-row gap-1 w-full mb-4">
                <div className="h-[75px] w-[45px] bg-slate-200 rounded"></div>
                <div className="h-[75px] w-[45px] bg-slate-200 rounded"></div>
                <div className="h-[75px] w-[45px] bg-slate-200 rounded"></div>
                <div className="h-[75px] w-[45px] bg-slate-200 rounded"></div>
            </div>
            <div className="h-8 bg-slate-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}