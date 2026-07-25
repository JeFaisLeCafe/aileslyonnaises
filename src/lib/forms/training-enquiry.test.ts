import { describe, expect, it } from "vitest";

import {
  formatTrainingEnquiryText,
  trainingEnquirySchema,
} from "./training-enquiry";

const validEnquiry = {
  name: "Camille Martin",
  email: "camille@example.com",
  ageRange: "25-39",
  goal: "ppl",
  consent: "accepted",
};

describe("trainingEnquirySchema", () => {
  it("normalizes a valid enquiry", () => {
    const result = trainingEnquirySchema.parse(validEnquiry);

    expect(result.experience).toBe("none");
    expect(result.message).toBe("");
    expect(result.website).toBe("");
  });

  it("rejects a missing consent", () => {
    const result = trainingEnquirySchema.safeParse({
      ...validEnquiry,
      consent: undefined,
    });

    expect(result.success).toBe(false);
  });

  it("rejects a populated honeypot", () => {
    const result = trainingEnquirySchema.safeParse({
      ...validEnquiry,
      website: "https://spam.example",
    });

    expect(result.success).toBe(false);
  });
});

describe("formatTrainingEnquiryText", () => {
  it("uses human-readable labels", () => {
    const enquiry = trainingEnquirySchema.parse(validEnquiry);

    expect(formatTrainingEnquiryText(enquiry)).toContain(
      "Projet : Licence PPL",
    );
    expect(formatTrainingEnquiryText(enquiry)).toContain("Âge : 25–39 ans");
  });
});
