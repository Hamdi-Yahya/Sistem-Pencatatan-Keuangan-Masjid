// File: src/middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.NEXTAUTH_SECRET || "fallback-secret-key"
);

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.next();
    } catch {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.set("auth_token", "", { maxAge: 0, path: "/" });
        return response;
    }
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
