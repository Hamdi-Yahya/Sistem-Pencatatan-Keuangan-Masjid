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
        
        // Konversi buffer ke base64 Data URI agar bisa disimpan langsung ke text database
        const base64DataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
        
        // Return Base64 URL ke client untuk disimpan melalui endpoint lain
        return NextResponse.json({ success: true, url: base64DataUri });
    } catch {
        return NextResponse.json({ error: "Gagal memproses file upload" }, { status: 500 });
    }
}
