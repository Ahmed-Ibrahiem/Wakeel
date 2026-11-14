import { requireSession } from "@/lib/session";
import { getUserSettings } from "@/lib/userSettings";
import { todayIn } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { listCaseDeadlines } from "../queries";
import { groupDeadlines } from "../group";
import { DEADLINE_STATUS_LABELS, DEADLINE_STATUS_STYLES } from "../labels";
import type { DeadlineFormValues } from "../schemas";
import { AddDeadlineButton } from "./AddDeadlineButton";
import { DeadlineRowActions } from "./DeadlineRowActions";

type Row = Awaited<ReturnType<typeof listCaseDeadlines>>[number];

function DeadlineItem({ d }: { d: Row }) {
  // Plain strings only: these cross the server -> client boundary
  const initialValues: DeadlineFormValues = {
    title: d.title,
    dueDate: d.dueDate,
    notes: d.notes ?? "",
  };

  return (
    <li className="space-y-2 rounded-lg border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-1">
          <p
            className={cn(
              "font-medium wrap-break-word",
              d.status === "done" && "text-muted-foreground line-through",
            )}
          >
            {d.title}
          </p>
          <p className="text-sm text-muted-foreground" >
            {d.dueDate}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              DEADLINE_STATUS_STYLES[d.status],
            )}
          >
            {DEADLINE_STATUS_LABELS[d.status]}
          </span>
          <DeadlineRowActions
            id={d.id}
            caseId={d.caseId}
            status={d.status}
            title={d.title}
            initialValues={initialValues}
          />
        </div>
      </div>
      {d.notes && (
        <p className="text-sm whitespace-pre-wrap text-muted-foreground">
          {d.notes}
        </p>
      )}
    </li>
  );
}

function Group({
  title,
  items,
  tone,
}: {
  title: string;
  items: Row[];
  tone?: "danger";
}) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-2">
      <h3
        className={cn(
          "text-sm font-semibold",
          tone === "danger" && "text-red-700",
        )}
      >
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((d) => (
          <DeadlineItem key={d.id} d={d} />
        ))}
      </ul>
    </div>
  );
}

export async function DeadlinesSection({ caseId }: { caseId: string }) {
  const { user } = await requireSession();

  const [list, { timeZone }] = await Promise.all([
    listCaseDeadlines(caseId),
    getUserSettings(user.id),
  ]);
  const { overdue, upcoming, done } = groupDeadlines(list, todayIn(timeZone));

  return (
    <section className="space-y-4 rounded-xl border bg-background p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">المواعيد النهائية</h2>
        <AddDeadlineButton caseId={caseId} />
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          لا يوجد مواعيد نهائية لهذه القضية حتي الأن..
        </p>
      ) : (
        <div className="space-y-6">
          <Group title="متأخرة" items={overdue} tone="danger" />
          <Group title="القادمة" items={upcoming} />
          <Group title="المنتهية" items={done} />
        </div>
      )}
    </section>
  );
}
