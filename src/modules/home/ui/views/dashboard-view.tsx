"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { api } from "@/trpc/client";
import { ArrowRight, Lock, LogOut, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const difficultyLabel = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
} as const;

export default function DashboardView() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const templates = api.interview.getAll.useQuery();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Sparkles className="size-4" />
              Interview Dashboard
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Choose your next mock interview
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Practice with focused AI interview templates built for technical preparation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right text-sm sm:block">
              <p className="font-medium">{session?.user?.name ?? "Candidate"}</p>
              <p className="text-muted-foreground">{session?.user?.email}</p>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => router.push("/sign-in"),
                  },
                })
              }
            >
              <LogOut />
              Sign out
            </Button>
          </div>
        </header>

        {templates.isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="bg-card/80">
                <CardHeader>
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : templates.isError ? (
          <Card className="border-destructive/30 bg-destructive/10">
            <CardHeader>
              <CardTitle>Could not load interviews</CardTitle>
              <CardDescription>{templates.error.message}</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.data?.map((template) => (
              <Card
                key={template.id}
                role="button"
                tabIndex={0}
                onClick={() => router.push(`/interview/${template.id}/briefing`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    router.push(`/interview/${template.id}/briefing`);
                  }
                }}
                className="cursor-pointer border border-border/70 bg-card/80 transition hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {template.description}
                  </CardDescription>
                  <CardAction>
                    {template.isPremium ? (
                      <Badge variant="secondary">
                        <Lock className="size-3" />
                        Premium
                      </Badge>
                    ) : (
                      <Badge variant="outline">Free</Badge>
                    )}
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {difficultyLabel[template.difficulty]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      AI-guided practice
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="justify-between text-sm text-muted-foreground">
                  View briefing
                  <ArrowRight className="size-4" />
                </CardFooter>
              </Card>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
