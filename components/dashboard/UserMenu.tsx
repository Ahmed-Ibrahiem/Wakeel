import LogoutForm from "../forms/LogoutForm";

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join(" ");
}

export function UserMenu({ name }: { name: string }) {
  return (
    <div className="flex-start gap-3 border-t border-white/15 pt-4">
      <div className="flex-center size-10 shrink-0  rounded-full bg-white/20 text-sm font-bold">
        {initials(name)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-white">{name}</p>
        <p className="text-xs text-white/70">محامي</p>
      </div>
      <LogoutForm />
    </div>
  );
}
