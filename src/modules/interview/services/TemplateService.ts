import { db } from "@/db";
import { interviewTemplate } from "@/db/schema";
import { eq } from "drizzle-orm";

export class TemplateService {
  async getAllTemplates() {
    return db.select().from(interviewTemplate);
  }

  async getTemplateById(id: string) {
    const [template] = await db
      .select()
      .from(interviewTemplate)
      .where(eq(interviewTemplate.id, id))
      .limit(1);

    return template ?? null;
  }
}
