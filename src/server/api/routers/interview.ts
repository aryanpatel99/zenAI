import { TemplateService } from "@/modules/interview/services/TemplateService";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const interviewRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async () => {
    const templateService = new TemplateService();

    return templateService.getAllTemplates();
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ input }) => {
      const templateService = new TemplateService();

      return templateService.getTemplateById(input.id);
    }),
});
