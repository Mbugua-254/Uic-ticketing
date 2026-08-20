import type { Config, Context } from "@netlify/functions";
import { desc } from "drizzle-orm";
import { db } from "../../db/index.js";
import { registrations } from "../../db/schema.js";

const ADMIN_PASSWORD = "12345678";

export default async (req: Request, context: Context) => {
  if (req.method === "POST") {
    const body = await req.json();

    if (!body.full_name || !body.phone || !body.ticket_type) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [saved] = await db
      .insert(registrations)
      .values({
        fullName: body.full_name,
        email: body.email || null,
        phone: body.phone,
        whatsapp: body.whatsapp || null,
        gender: body.gender || null,
        ageGroup: body.age_group || null,
        church: body.church || null,
        churchLocation: body.church_location || null,
        county: body.county || null,
        ticketType: body.ticket_type,
        prayerRequest: body.prayer_request || null,
        instagram: body.instagram || null,
        tiktok: body.tiktok || null,
        member2: body.member2 || null,
        member2Phone: body.member2_phone || null,
        member3: body.member3 || null,
        member3Phone: body.member3_phone || null,
        member4: body.member4 || null,
        member4Phone: body.member4_phone || null,
        member5: body.member5 || null,
        member5Phone: body.member5_phone || null,
      })
      .returning();

    return Response.json({ success: true, registration: saved }, { status: 201 });
  }

  if (req.method === "GET") {
    if (req.headers.get("x-admin-password") !== ADMIN_PASSWORD) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const all = await db.select().from(registrations).orderBy(desc(registrations.registeredAt));
    return Response.json({ registrations: all });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/registrations",
};
