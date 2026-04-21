"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/client";
import { ArrowLeft, CheckCircle2, Mic, ShieldCheck, Video } from "lucide-react";
import { useRouter } from "next/navigation";

const rules = [
  {
    icon: Mic,
    title: "Keep your microphone ready",
    description: "Use a quiet space and confirm your audio input before starting.",
  },
  {
    icon: ShieldCheck,
    title: "Answer without cheating",
    description: "Avoid external help so the feedback reflects your actual preparation.",
  },
  {
    icon: Video,
    title: "Stay present",
    description: "Treat the session like a real interview from start to finish.",
  },
];

export default function InterviewBriefingView({ id }: { id: string }) {
  const router = useRouter();
  const template = api.interview.getById.useQuery({ id });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <Button variant="ghost" className="w-fit" onClick={() => router.push("/")}>
          <ArrowLeft />
          Back to dashboard
        </Button>

        {template.isLoading ? (
          <Card className="bg-card/80">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-5 w-full" />
            </CardHeader>
            <CardContent className="grid gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full" />
              ))}
            </CardContent>
          </Card>
        ) : template.isError ? (
          <Card className="border-destructive/30 bg-destructive/10">
            <CardHeader>
              <CardTitle>Could not load briefing</CardTitle>
              <CardDescription>{template.error.message}</CardDescription>
            </CardHeader>
          </Card>
        ) : !template.data ? (
          <Card className="bg-card/80">
            <CardHeader>
              <CardTitle>Interview not found</CardTitle>
              <CardDescription>
                This template may have been removed or the link is incorrect.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => router.push("/")}>Choose another interview</Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="border-border/70 bg-card/80">
            <CardHeader className="gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                  {template.data.difficulty.charAt(0).toUpperCase() +
                    template.data.difficulty.slice(1)}
                </Badge>
                {template.data.isPremium ? (
                  <Badge>Premium</Badge>
                ) : (
                  <Badge variant="outline">Free</Badge>
                )}
              </div>
              <div>
                <CardTitle className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {template.data.title}
                </CardTitle>
                <CardDescription className="mt-3 text-base leading-7">
                  {template.data.description}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Before you start
                </h2>
                <div className="mt-3 grid gap-3">
                  {rules.map((rule) => {
                    const Icon = rule.icon;

                    return (
                      <div
                        key={rule.title}
                        className="flex gap-3 rounded-2xl border border-border/70 bg-background/40 p-4"
                      >
                        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                          <Icon className="size-4" />
                        </div>
                        <div>
                          <p className="font-medium">{rule.title}</p>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {rule.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex-col items-stretch gap-3 border-t sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4" />
                Starting means you agree to follow the interview rules.
              </div>
              <Button
                size="lg"
                className="sm:min-w-40"
                onClick={() => router.push(`/interview/${id}/room`)}
              >
                Start Interview
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </main>
  );
}
