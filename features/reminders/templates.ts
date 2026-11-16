import type { DueDeadline, DueHearing } from "./queries";

export type ReminderEmail = { subject: string; html: string; text: string };

// User-written text goes inside HTML, so it must always be escaped
const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Collapse newlines: user text must never be able to break an email subject
const oneLine = (value: string) => value.replace(/\s+/g, " ").trim();

function caseUrl(caseId: string): string {
  const base = (process.env.BETTER_AUTH_URL ?? "").replace(/\/+$/, "");
  return `${base}/dashboard/cases/${caseId}`;
}

// Arabic month/day names with Latin digits, matching the rest of the app
const LOCALE = "ar-EG-u-nu-latn";

function formatHearing(iso: string, timeZone: string) {
  const date = new Date(iso);
  const day = new Intl.DateTimeFormat(LOCALE, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone,
  }).format(date);
  const time = new Intl.DateTimeFormat(LOCALE, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
  }).format(date);
  return { day, time };
}

// due_date is a plain calendar date: format it in UTC so it never shifts a day
function formatDueDate(isoDate: string) {
  return new Intl.DateTimeFormat(LOCALE, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

// Shared layout: same look as the auth emails (RTL, green button)
function layout(o: { heading: string; lines: string[]; url: string }) {
  const rows = o.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
  const url = escapeHtml(o.url);

  const html = `
    <div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;line-height:1.8">
      <h2>${escapeHtml(o.heading)}</h2>
      ${rows}
      <p>
        <a href="${url}"
           style="background:#087a5b;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">
          فتح القضية
        </a>
      </p>
      <p style="color:#666;font-size:13px">
        تصلك هذه الرسالة لأنك فعّلت التذكيرات في إعدادات حسابك في «وكيل».
        يمكنك تغيير ذلك من صفحة الإعدادات.
      </p>
    </div>
  `;

  const text = `${o.heading}\n\n${o.lines.join("\n")}\n\nفتح القضية: ${o.url}\n`;
  return { html, text };
}

export function hearingReminderEmail(h: DueHearing): ReminderEmail {
  const { day, time } = formatHearing(h.hearingAt, h.timeZone);
  const caseNumber = oneLine(h.caseNumber);

  const { html, text } = layout({
    heading: "تذكير بجلسة قادمة",
    lines: [
      `القضية رقم: ${caseNumber}`,
      `المحكمة: ${oneLine(h.courtName)}`,
      `الموعد: ${day}، الساعة ${time}`,
    ],
    url: caseUrl(h.caseId),
  });

  return { subject: `تذكير بجلسة القضية رقم ${caseNumber}`, html, text };
}

export function deadlineReminderEmail(d: DueDeadline): ReminderEmail {
  const title = oneLine(d.title);

  const { html, text } = layout({
    heading: "تذكير بموعد نهائي",
    lines: [
      `الموعد: ${title}`,
      `تاريخ الاستحقاق: ${formatDueDate(d.dueDate)}`,
      `القضية رقم: ${oneLine(d.caseNumber)}`,
      `المحكمة: ${oneLine(d.courtName)}`,
    ],
    url: caseUrl(d.caseId),
  });

  return { subject: `تذكير بموعد نهائي: ${title}`, html, text };
}