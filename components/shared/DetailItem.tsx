// Small "label above value" block used on the details pages
export function DetailItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-1 text-sm font-medium wrap-break-word">{children}</div>
    </div>
  );
}