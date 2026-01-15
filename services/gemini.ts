
import { GoogleGenAI, Type } from "@google/genai";
import { AuditResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const AUDIT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    techStack: {
      type: Type.OBJECT,
      properties: {
        os: { type: Type.STRING },
        webServer: { type: Type.STRING },
        database: { type: Type.STRING },
        frontend: { type: Type.STRING },
        backend: { type: Type.STRING },
      },
      required: ["os", "webServer", "database", "frontend", "backend"],
    },
    threatModel: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          vector: { type: Type.STRING },
          severity: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["vector", "severity", "description"],
      },
    },
    reconPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          tool: { type: Type.STRING },
          command: { type: Type.STRING },
          objective: { type: Type.STRING },
        },
        required: ["tool", "command", "objective"],
      },
    },
    vulnerabilityLogic: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          feature: { type: Type.STRING },
          weakness: { type: Type.STRING },
          mitigation: { type: Type.STRING },
        },
        required: ["feature", "weakness", "mitigation"],
      },
    },
    bugBountyReports: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          vulnerabilityType: { type: Type.STRING },
          impact: { type: Type.STRING },
          stepsToReproduce: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          validationPayload: { type: Type.STRING },
        },
        required: ["title", "vulnerabilityType", "impact", "stepsToReproduce", "validationPayload"],
      },
    },
    summary: { type: Type.STRING },
  },
  required: ["techStack", "threatModel", "reconPlan", "vulnerabilityLogic", "bugBountyReports", "summary"],
};

export async function analyzeWebsite(description: string): Promise<AuditResponse> {
  const model = "gemini-3-pro-preview";
  const systemInstruction = `You are a world-class Cybersecurity Penetration Tester and Web Security Auditor. 
Your objective is to perform a detailed technical analysis and generate SUBMISSION-READY Bug Bounty reports.

RULES:
1. Tone: Clinical, professional, and report-oriented.
2. Bug Bounty Reports: For each major vulnerability, provide a report formatted for platforms like HackerOne. 
3. Steps to Reproduce: Must be clear, numbered, and technically accurate.
4. Validation Payload: Provide a specific CURL command, Python snippet, or Burp Suite request that proves the vulnerability.
5. Impact: Focus on the business and technical risk (e.g., Data Exfiltration, Account Takeover).

DISCLAIMER: This report is for educational and authorized auditing purposes only.`;

  const response = await ai.models.generateContent({
    model,
    contents: `Conduct a full security audit and generate bug bounty reports for: ${description}`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: AUDIT_SCHEMA,
    },
  });

  if (!response.text) {
    throw new Error("Audit generation failed: No content returned.");
  }

  return JSON.parse(response.text) as AuditResponse;
}
