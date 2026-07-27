import { Hero } from "@/components/hero/Hero";

export const metadata = {
  title: "Pass — kitchen rail order management",
  description: "A real-time kitchen order management system built around the ticket rail metaphor. Customer menu, kitchen rail, and manager dashboard.",
};

export default function Home() {
  return (
    <main className="bg-paper cursor-none">
      <Hero />
    </main>
  );
}