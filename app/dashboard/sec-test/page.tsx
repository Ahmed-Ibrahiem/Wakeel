import { requireSession } from "@/lib/session";
import { getClient } from "@/features/clients/queries";
import { listClientCases } from "@/features/cases/queries";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// TEMPORARY: delete this folder after the test
export default async function SecTest({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { user } = await requireSession();
  const raw = (await searchParams).clientId;
  const clientId = (Array.isArray(raw) ? raw[0] : raw) ?? "";

  const client = await getClient(clientId);
  const cases = await listClientCases(clientId);

  return (
    <pre dir="ltr" className="p-6 text-sm">
      {JSON.stringify(
        {
          loggedInAs: user.email,
          clientId,
          clientFound: client !== null,
          casesReturned: cases.length,
        },
        null,
        2,
      )}
    </pre>
  );
}