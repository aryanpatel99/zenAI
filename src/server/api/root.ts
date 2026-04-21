import { interviewRouter } from "@/server/api/routers/interview";
import { createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  interview: interviewRouter,
});

export type AppRouter = typeof appRouter;
