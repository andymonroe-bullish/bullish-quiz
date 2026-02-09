import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, result, answers } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // GoHighLevel webhook integration
    // Set GHL_WEBHOOK_URL in your Vercel environment variables
    // to connect this to your GoHighLevel workflow.
    const webhookUrl = process.env.GHL_WEBHOOK_URL;

    if (webhookUrl) {
      const payload = {
        name: name || "",
        email,
        event_model: result?.primaryModel || "unknown",
        secondary_models: (result?.secondaryModels || []).join(", "),
        urgency: result?.urgency || "COOL",
        qualified: result?.qualified ? "yes" : "no",
        scores_ascension: result?.scores?.ascension || 0,
        scores_fulfillment: result?.scores?.fulfillment || 0,
        scores_mastermind: result?.scores?.mastermind || 0,
        scores_affinity: result?.scores?.affinity || 0,
        // Flatten answers for GHL custom fields
        ...Object.fromEntries(
          Object.entries(answers || {}).map(([key, value]) => [
            `answer_${key}`,
            Array.isArray(value) ? value.join(", ") : value,
          ])
        ),
      };

      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!webhookResponse.ok) {
        console.error("GHL webhook failed:", webhookResponse.status);
      }
    } else {
      // No webhook configured - log for debugging
      console.log("Quiz submission (no GHL_WEBHOOK_URL configured):", {
        email,
        name,
        model: result?.primaryModel,
        urgency: result?.urgency,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}
