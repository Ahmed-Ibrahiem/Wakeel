import { getUserSettings } from "@/lib/userSettings"; // same import as in cases/actions.ts
import { toZonedParts } from "@/lib/zoned-time";
import { cn } from "@/lib/utils";
import { listCaseHearings } from "../queries";
import { groupHearings } from "../group";
import {
  HEARING_STATUS_LABELS,
  HEARING_STATUS_STYLES,
  HEARING_TYPE_LABELS,
} from "../labels";
import { requireSession } from "@/lib/session";
import { AddHearingButton } from "./AddHearingButton";
import type { HearingFormValues } from "../schemas";
import { HearingRowActions } from "./HearingRowActions";

type Row = Awaited<ReturnType<typeof listCaseHearings>>[number];

function HearingItem({ h, timeZone }: { h: Row; timeZone: string }) {
  const { date, time } = toZonedParts(h.hearingAt, timeZone);

  // Plain strings only: these cross the server -> client boundary
  const initialValues: HearingFormValues = {
    hearingDate: date,
    hearingTime: time,
    type: h.type,
    location: h.location ?? "",
    notes: h.notes ?? "",
  };

  return (
    <li className="space-y-2 rounded-sm border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium" dir="ltr">
            {date} · {time}
          </span>
          <span className="text-xs text-muted-foreground">
            {HEARING_TYPE_LABELS[h.type]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              HEARING_STATUS_STYLES[h.status],
            )}
          >
            {HEARING_STATUS_LABELS[h.status]}
          </span>
          <HearingRowActions
            id={h.id}
            caseId={h.caseId}
            status={h.status}
            label={`${date} ${time}`}
            initialValues={initialValues}
          />
        </div>
      </div>

      {h.location && (
        <p className="text-sm text-muted-foreground">المكان: {h.location}</p>
      )}
      {h.outcome && (
        <p className="text-sm whitespace-pre-wrap">القرار: {h.outcome}</p>
      )}
      {h.notes && (
        <p className="text-sm whitespace-pre-wrap text-muted-foreground">
          {h.notes}
        </p>
      )}
    </li>
  );
}

function Group({
  title,
  items,
  timeZone,
  tone,
}: {
  title: string;
  items: Row[];
  timeZone: string;
  tone?: "warning";
}) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-2">
      <h3
        className={cn(
          "text-sm font-semibold",
          tone === "warning" && "text-amber-700",
        )}
      >
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((h) => (
          <HearingItem key={h.id} h={h} timeZone={timeZone} />
        ))}
      </ul>
    </div>
  );
}

export async function HearingsSection({ caseId }: { caseId: string }) {
  const { user } = await requireSession();

  const [list, { timeZone }] = await Promise.all([
    listCaseHearings(caseId),
    getUserSettings(user.id),
  ]);
  const { upcoming, overdue, past } = groupHearings(list);

  return (
    <section className="space-y-4 rounded-sm border bg-background p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">الجلسات</h2>
        <AddHearingButton caseId={caseId} />
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          لا يوجد جلسات لهذه القضية حتي الأن.
        </p>
      ) : (
        <div className="space-y-6">
          <Group
            title="جلسات فات ميعادها ولم يتم تحديد قرار لها"
            items={overdue}
            timeZone={timeZone}
            tone="warning"
          />
          <Group title="القادمة" items={upcoming} timeZone={timeZone} />
          <Group title="السابقة" items={past} timeZone={timeZone} />
        </div>
      )}
    </section>
  );
}
