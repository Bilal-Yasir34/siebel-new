interface BoxProps {
  className?: string;
}

/** Base pulse block — building block for all skeleton layouts. */
export function SkeletonBox({ className = '' }: BoxProps) {
  return <div className={`skeleton ${className}`} />;
}

/** Matches ProductCard layout: image + title + rating + price. */
export function ProductCardSkeleton() {
  return (
    <div className="product-card">
      <div className="product-card-image">
        <SkeletonBox className="w-full h-full rounded-none" />
      </div>
      <div className="p-2.5 sm:p-4 space-y-2">
        <SkeletonBox className="h-2.5 w-1/3" />
        <SkeletonBox className="h-3.5 w-4/5" />
        <SkeletonBox className="h-3 w-1/2 hidden sm:block" />
        <SkeletonBox className="h-4 w-2/5" />
      </div>
    </div>
  );
}

/** A row of product card skeletons, e.g. for grids/sliders. */
export function ProductGridSkeleton({
  count = 8,
  className = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={`grid gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Matches the category tile layout (square image + label). */
export function CategoryCardSkeleton() {
  return (
    <div>
      <SkeletonBox className="aspect-square rounded-2xl mb-3" />
      <SkeletonBox className="h-4 w-2/3 mx-auto" />
    </div>
  );
}

export function CategoryGridSkeleton({
  count = 6,
  className = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={`grid gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Generic text line skeleton. */
export function SkeletonText({
  lines = 1,
  className = '',
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBox
          key={i}
          className={`h-3.5 ${i === lines - 1 ? 'w-2/3' : 'w-full'} ${className}`}
        />
      ))}
    </div>
  );
}

/** Card-shaped skeleton, e.g. for dashboard stat cards. */
export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <SkeletonBox className="w-10 h-10 rounded-xl" />
        <SkeletonBox className="w-12 h-3" />
      </div>
      <SkeletonBox className="h-6 w-1/2 mb-2" />
      <SkeletonBox className="h-3 w-1/3" />
    </div>
  );
}

/** Table row skeleton — pass column widths for realistic layout. */
export function TableRowSkeleton({
  columns = 4,
}: {
  columns?: number;
}) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <SkeletonBox className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

/** Full table skeleton with header preserved and skeleton rows. */
export function TableSkeleton({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} columns={columns} />
      ))}
    </>
  );
}

/** Simple bordered card-list skeleton, e.g. orders list, profile orders. */
export function ListCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <SkeletonBox className="h-4 w-1/4" />
            <SkeletonBox className="h-5 w-20 rounded-full" />
          </div>
          <SkeletonBox className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

/** Full-page centered spinner — for page-level auth/redirect gates. */
export function PageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-DEFAULT" />
    </div>
  );
}
