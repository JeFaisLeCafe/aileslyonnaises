import { Resend } from "resend";
import {
  formatTrainingEnquiryText,
  trainingEnquiryLabels,
  trainingEnquirySchema,
} from "../../src/lib/forms/training-enquiry";

interface Env {
  RESEND_API_KEY?: string;
  TRAINING_RECIPIENT_EMAIL?: string;
  TRAINING_SENDER_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
}

interface TurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
}

interface RateLimitEntry {
  count: number;
  expiresAt: number;
}

const rateLimits = new Map<string, RateLimitEntry>();
const json = (message: string, status: number) =>
  Response.json(
    { message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "Content-Security-Policy": "default-src 'none'",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const isRateLimited = (key: string) => {
  const now = Date.now();
  const current = rateLimits.get(key);

  if (!current || current.expiresAt <= now) {
    rateLimits.set(key, { count: 1, expiresAt: now + 15 * 60 * 1000 });
    return false;
  }

  current.count += 1;
  return current.count > 5;
};

const verifyTurnstile = async (
  secret: string,
  token: string,
  remoteIp: string,
) => {
  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: remoteIp,
  });
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body },
  );
  if (!response.ok) return false;
  const result: TurnstileResponse = await response.json();
  return result.success;
};

const optionalText = (value: FormDataEntryValue | null) =>
  typeof value === "string" && value.length > 0 ? value : undefined;

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const request = context.request;
  const remoteIp = request.headers.get("CF-Connecting-IP") ?? "unknown";

  if (isRateLimited(remoteIp)) {
    return json(
      "Trop de demandes ont été envoyées. Réessayez dans quelques minutes.",
      429,
    );
  }

  const formData = await request.formData();
  const result = trainingEnquirySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: optionalText(formData.get("phone")),
    ageRange: formData.get("ageRange"),
    goal: formData.get("goal"),
    experience: optionalText(formData.get("experience")),
    availability: optionalText(formData.get("availability")),
    message: optionalText(formData.get("message")),
    consent: formData.get("consent"),
    website: optionalText(formData.get("website")),
    turnstileToken: optionalText(formData.get("cf-turnstile-response")),
  });

  if (!result.success) {
    return json("Vérifiez les champs du formulaire.", 400);
  }

  const { data } = result;
  if (data.website) return json("Demande refusée.", 400);

  if (!context.env.TURNSTILE_SECRET_KEY || !data.turnstileToken) {
    return json("La protection anti-spam n’est pas configurée.", 503);
  }

  const isHuman = await verifyTurnstile(
    context.env.TURNSTILE_SECRET_KEY,
    data.turnstileToken,
    remoteIp,
  );
  if (!isHuman) return json("La vérification anti-spam a échoué.", 400);

  const recipient = context.env.TRAINING_RECIPIENT_EMAIL;
  const sender = context.env.TRAINING_SENDER_EMAIL;
  if (!context.env.RESEND_API_KEY || !recipient || !sender) {
    return json("L’envoi d’email n’est pas encore configuré.", 503);
  }

  const resend = new Resend(context.env.RESEND_API_KEY);
  const safe = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, escapeHtml(value)]),
  ) as Record<keyof typeof data, string>;

  const { error } = await resend.emails.send({
    from: `Site des Ailes Lyonnaises <${sender}>`,
    to: recipient,
    replyTo: data.email,
    subject: `Projet de formation — ${data.name}`,
    text: formatTrainingEnquiryText(data),
    html: `
      <h1>Nouveau projet de formation</h1>
      <p><strong>Nom :</strong> ${safe.name}</p>
      <p><strong>Email :</strong> ${safe.email}</p>
      <p><strong>Téléphone :</strong> ${safe.phone || "Non renseigné"}</p>
      <p><strong>Âge :</strong> ${trainingEnquiryLabels.ageRange[data.ageRange]}</p>
      <p><strong>Projet :</strong> ${trainingEnquiryLabels.goal[data.goal]}</p>
      <p><strong>Expérience :</strong> ${trainingEnquiryLabels.experience[data.experience]}</p>
      <p><strong>Disponibilités :</strong> ${safe.availability || "Non renseignées"}</p>
      <p><strong>Message :</strong><br>${safe.message.replaceAll("\n", "<br>") || "Aucun message complémentaire."}</p>
    `,
  });

  if (error) {
    console.error("Training enquiry email failed", error);
    return json("L’envoi a échoué. Contactez le club par téléphone.", 502);
  }

  return json("Demande envoyée.", 200);
};

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method !== "POST") {
    return json("Méthode non autorisée.", 405);
  }
  return onRequestPost(context);
};
