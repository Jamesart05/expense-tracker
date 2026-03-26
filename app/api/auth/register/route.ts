import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/user";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const firstError =
        Object.values(fieldErrors).flat().find(Boolean) || "Invalid registration details.";

      return NextResponse.json(
        { error: firstError },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existing = await User.findOne({ email: parsed.data.email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

    const user = await User.create({
      ...parsed.data,
      email: parsed.data.email.toLowerCase(),
      currency: parsed.data.currency.toUpperCase(),
      password: hashedPassword
    });

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email
        }
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Unable to register user." }, { status: 500 });
  }
}
