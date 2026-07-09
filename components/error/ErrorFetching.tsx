interface ErrorFetchingProps {
  error: {
    status: number;
    data: {
      error: string;
      success: boolean;
    };
  };
  onRetry: () => void;
  title?: string;
}

export default function ErrorFetching({
  error,
  onRetry,
  title = 'Failed to Load Board',
}: ErrorFetchingProps) {
  if (!error) return null;
  if (error.status === 403) console.log('error 403');
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
        {/* Warning Icon Anchor */}
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h3 className="mb-1 text-lg font-semibold text-red-900">{title}</h3>
        <p className="mb-5 text-sm text-red-700">{error.data.error}</p>

        {/* Retry Control Trigger */}
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-800 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
