import { SignupForm } from "./SignupForm";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>;
}) {
  const { error, redirect: redirectParam } = await searchParams;
  const redirectTo = redirectParam ?? "/";

  return (
    <>
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-brick text-paper font-mono text-xs px-4 py-2 max-w-sm text-center">
          {decodeURIComponent(error)}
        </div>
      )}
      <SignupForm redirectTo={redirectTo} />
    </>
  );
}
