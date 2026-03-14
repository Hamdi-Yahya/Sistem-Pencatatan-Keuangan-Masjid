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
        
        // Konversi buffer ke base64
        const base64Image = buffer.toString("base64");
        
        const form = new FormData();
        form.append("image", base64Image);
        
        // Menggunakan API gratis ImgBB (Tanpa perlu auth/login kompleks)
        // API Key ini gratis dan public untuk upload anonim
        const imgbbApiKey = "3887d25166f272c47abfbba28ad02afb"; // Public free token
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
            method: "POST",
            body: form,
        });
        
        const imgbbData = await res.json();
        
        if (imgbbData && imgbbData.success) {
            return NextResponse.json({ success: true, url: imgbbData.data.url });
        } else {
            return NextResponse.json({ error: "Gagal mengupload file ke Cloud Server" }, { status: 500 });
        }
    } catch {
        return NextResponse.json({ error: "Gagal memproses file upload" }, { status: 500 });
    }
}
