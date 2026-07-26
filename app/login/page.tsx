import { Ticket } from "@/components/rail/Ticket";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signInWithPassword, signInWithOtp, signInWithGoogle } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <Ticket status="held" rotate={-1} className="w-full max-w-sm">
        <h1 className="font-heading italic text-3xl mb-1">Who's clocking in?</h1>
        <p className="text-xs text-ink-soft mb-6">Pass, kitchen access</p>

        {error && (
          <p className="text-xs text-brick mb-4 border border-brick px-3 py-2">
            {decodeURIComponent(error)}
          </p>
        )}

        <form action={signInWithPassword} className="flex flex-col gap-4 mb-4">
          <Input label="Email" type="email" name="email" required placeholder="you@service.com" />
          <Input label="Password" type="password" name="password" required placeholder="********" />
          <Button type="submit" variant="fire" className="w-full mt-2">
            Fire order &mdash; Sign in
          </Button>
        </form>

        <form action={signInWithOtp} className="flex flex-col gap-3 mb-4">
          <Input label="Or get a one-time code" type="email" name="email" required placeholder="you@service.com" />
          <Button type="submit" variant="hold" className="w-full">
            Send code
          </Button>
        </form>

        <form action={signInWithGoogle}>
          <Button type="submit" variant="bump" className="w-full">
            Continue with Google
          </Button>
        </form>
      </Ticket>
    </main>
  );
}
