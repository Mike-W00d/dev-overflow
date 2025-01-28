import { NextResponse } from "next/server";

import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";

export async function GET() {
  try {
    await dbConnect();

    const users = await User.find();

    return NextResponse.json(
      {
        sucsess: true,
        data: users,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
// Create User
export async function POST(request: Request) {
  try {
    // connect to DB
    await dbConnect();
    // Parse the request body as JSON
    const body = await request.json();
    // Validate the request body against the UserSchema
    const validatedData = UserSchema.safeParse(body);
    // If the request body is invalid, throw a ValidationError
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { email, username } = validatedData.data;
    // checking if the email is already in use
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const existingUsername = await User.findOne({ username });
    // checking if the username is already in use
    if (existingUsername) {
      throw new Error("Username already exists");
    }
    // create a new user
    const newUser = await User.create(validatedData.data);
    // sending success response to the client
    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
