/* File: src/app/api/upload/route.ts */

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

/* POST — Upload file gambar (bukti transfer / QR code) */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "File wajib diupload" }, { status: 400 });
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Format file tidak didukung" }, { status: 400 });
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        const uniqueName = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
        const filePath = join(uploadDir, uniqueName);

        await writeFile(filePath, buffer);

        const publicUrl = `/uploads/${uniqueName}`;

        return NextResponse.json({ success: true, url: publicUrl });
    } catch {
        return NextResponse.json({ error: "Gagal mengupload file" }, { status: 500 });
    }
}
