/* File: src/app/api/settings/route.ts */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/* GET — Ambil semua settings */
export async function GET() {
    try {
        const settings = await prisma.setting.findMany();
        const settingsMap: Record<string, string> = {};
        settings.forEach((s) => { settingsMap[s.key] = s.value; });
        return NextResponse.json({ settings: settingsMap });
    } catch {
        return NextResponse.json({ settings: {} }, { status: 500 });
    }
}

/* POST — Simpan/update setting (auth protected) */
export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { key, value } = await request.json();

        if (!key || !value) {
            return NextResponse.json({ error: "Key dan value wajib diisi" }, { status: 400 });
        }

        const setting = await prisma.setting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });

        return NextResponse.json({ success: true, setting });
    } catch {
        return NextResponse.json({ error: "Gagal menyimpan pengaturan" }, { status: 500 });
    }
}
