"use client";

/** Numbered pager with prev/next arrows. Always shows every page (episode counts are small). */
export function Pagination({
  page,
  pageCount,
  onChange
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;

  const buttonClass =
    "grid h-10 w-10 place-items-center border border-line text-sm font-semibold text-ink-secondary transition-colors hover:border-rust hover:text-rust disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink-secondary";

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-2"
      aria-label="Episode pages"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className={buttonClass}
        aria-label="Previous page"
      >
        ‹
      </button>
      {Array.from({ length: pageCount }, (_, index) => index + 1).map(
        (number) => (
          <button
            key={number}
            type="button"
            onClick={() => onChange(number)}
            aria-current={number === page ? "page" : undefined}
            className={
              number === page
                ? "grid h-10 w-10 place-items-center bg-ink text-sm font-semibold text-white"
                : buttonClass
            }
          >
            {number}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pageCount}
        className={buttonClass}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
}
