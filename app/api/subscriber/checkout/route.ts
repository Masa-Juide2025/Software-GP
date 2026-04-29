import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore
  apiVersion: "2023-10-16", 
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount } = body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "ils",
            product_data: {
              name: "تفعيل اشتراك NutriSync AI",
              description: "الخدمات المختارة: مدرب رياضي / أخصائي تغذية",
            },
            unit_amount: amount * 100, // تحويل الشيكل لسنات
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/subscriber/subscriptions?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/subscriber/subscriptions?canceled=true`,
    });

    // نرسل الـ url مباشرة للفرونت إند
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}