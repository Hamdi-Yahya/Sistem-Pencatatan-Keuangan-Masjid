// File: src/lib/auth.ts

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
    process.env.NEXTAUTH_SECRET || "fallback-secret-key"
);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@masjid.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function verifyCredentials(email: string, password: string): Promise<boolean> {
    return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export async function createToken(email: string): Promise<string> {
    const token = await new SignJWT({ email, role: "admin" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(JWT_SECRET);
    return token;
}

export async function verifyToken(token: string): Promise<{ email: string; role: string } | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as { email: string; role: string };
    } catch {
        return null;
    }
}

export async function getSession(): Promise<{ email: string; role: string } | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    return verifyToken(token);
}
