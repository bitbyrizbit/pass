import { VerifyForm } from "./VerifyForm";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; error?: string; redirect?: string }>;
}) {
  const { email, error, redirect: redirectParam } = await searchParams;
  const redirectTo = redirectParam ?? "/";

  return (
    <VerifyForm
      email={email ?? ""}
      redirectTo={redirectTo}
      error={error}
    />
  );
}