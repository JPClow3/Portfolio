import React from 'react';

/**
 * Reusable skeleton loading components
 */

export const SectionSkeleton = () => (
    <div className="py-24 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Title skeleton */}
            <div className="h-10 w-64 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded-lg animate-pulse mx-auto"></div>
            {/* Content skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-48 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded-xl animate-pulse"></div>
                ))}
            </div>
        </div>
    </div>
);

export const CardSkeleton = () => (
    <div className="p-6 rounded-xl bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-pulse">
        <div className="h-6 w-3/4 bg-slate-400 dark:bg-slate-500 rounded mb-4"></div>
        <div className="h-4 w-full bg-slate-400 dark:bg-slate-500 rounded mb-2"></div>
        <div className="h-4 w-5/6 bg-slate-400 dark:bg-slate-500 rounded"></div>
    </div>
);

export const TextSkeleton = ({lines = 3, className = ''}) => (
    <div className={`space-y-2 ${className}`}>
        {[...Array(lines)].map((_, i) => (
            <div
                key={i}
                className={`h-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded animate-pulse ${
                    i === lines - 1 ? 'w-3/4' : 'w-full'
                }`}
            />
        ))}
    </div>
);

export const ButtonSkeleton = () => (
    <div className="h-10 w-32 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded-lg animate-pulse"></div>
);

export default SectionSkeleton;

