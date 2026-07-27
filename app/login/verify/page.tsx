import { Ticket } from "@/components/rail/Ticket";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { verifyOtp } from "../actions";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; error?: string; redirect?: string }>;
}) {
  const { email, error, redirect: redirectParam } = await searchParams;
  const redirectTo = redirectParam ?? "/";

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <Ticket status="fired" rotate={1} className="w-full max-w-sm">
        <h1 className="font-heading italic text-3xl mb-1">Check your line</h1>
        <p className="text-xs text-ink-soft mb-6">
          A code was sent to {email ?? "your email"}
        </p>

        {error && (
          <p className="text-xs text-brick mb-4 border border-brick px-3 py-2">
            {decodeURIComponent(error)}
          </p>
        )}

        <form action={verifyOtp} className="flex flex-col gap-4">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <Input
            label="the code"
            type="text"
            name="token"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            placeholder="your code"
          />
          <Button type="submit" variant="fire" className="w-full mt-2">
            Confirm and enter
          </Button>
        </form>
      </Ticket>
    </main>
  );
}