import { z } from "zod";

interface Env {
  ANALYTICS?: AnalyticsEngineDataset;
}

const eventSchema = z.object({
  name: z.enum([
    "training_form_start",
    "training_form_submit",
    "aerogest_outbound_click",
  ]),
  path: z.string().startsWith("/").max(200),
});

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const contentType = context.request.headers.get("Content-Type") ?? "";
  if (!contentType.includes("application/json")) {
    return new Response(null, { status: 415 });
  }

  const payload: unknown = await context.request.json();
  const result = eventSchema.safeParse(payload);
  if (!result.success) return new Response(null, { status: 400 });

  context.env.ANALYTICS?.writeDataPoint({
    blobs: [result.data.name, result.data.path],
    indexes: [result.data.name],
  });

  return new Response(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
};

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method !== "POST") {
    return new Response(null, {
      status: 405,
      headers: { Allow: "POST" },
    });
  }
  return onRequestPost(context);
};
