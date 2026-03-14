/* File: src/app/api/donations/route.ts */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* GET — Daftar donasi, bisa difilter berdasarkan campaignId */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const campaignId = searchParams.get("campaignId");
        const status = searchParams.get("status");

        const where: Record<string, string> = {};
        if (campaignId) where.campaignId = campaignId;
        if (status) where.status = status;

        const donations = await prisma.donation.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ donations });
    } catch {
        return NextResponse.json({ error: "Gagal memuat donasi" }, { status: 500 });
    }
}

/* POST — Simpan donasi baru (public, tanpa auth) */
export async function POST(request: NextRequest) {
    try {
        const { campaignId, donorName, phone, message, proofImage, amount } = await request.json();

        if (!campaignId || !donorName || !phone || !amount) {
            return NextResponse.json(
                { error: "Nama, No HP, Jumlah, dan Campaign wajib diisi" },
                { status: 400 }
            );
        }

        const donation = await prisma.donation.create({
            data: {
                campaignId,
                donorName,
                phone,
                message: message || null,
                proofImage: proofImage || null,
                amount: Number(amount),
                status: "PENDING",
            },
        });

        return NextResponse.json({ success: true, donation });
    } catch {
        return NextResponse.json({ error: "Gagal menyimpan donasi" }, { status: 500 });
    }
}
