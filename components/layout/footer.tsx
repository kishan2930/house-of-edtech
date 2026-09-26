export function Footer() {
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <p>Developer name</p>
          <p className="text-xs">
            Update your name and profile links in{' '}
            <code className="rounded bg-muted px-1 py-0.5 text-[0.75rem]">
              components/layout/footer.tsx
            </code>{' '}
            before submission.
          </p>
        </div>
        <div className="flex flex-col gap-1 text-xs sm:items-end">
          <p>GitHub profile URL — set before submission</p>
          <p>LinkedIn profile URL — set before submission</p>
        </div>
      </div>
    </footer>
  );
}
