/* File: src/app/api/donations/[id]/route.ts */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/* PATCH — Verifikasi donasi oleh admin */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { status } = await request.json();

        if (!["VERIFIED", "REJECTED"].includes(status)) {
            return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
        }

        const donation = await prisma.donation.update({
            where: { id },
            data: { status },
        });

        /* Jika donasi diverifikasi, buat transaksi INCOME otomatis */
        if (status === "VERIFIED") {
            const categoryMap: Record<string, string> = {
                "zakat-fitrah": "ZAKAT_FITRAH",
                "qurban": "QURBAN",
                "sedekah-jumat": "INFAQ",
            };

            await prisma.transaction.create({
                data: {
                    amount: donation.amount,
                    type: "INCOME",
                    category: (categoryMap[donation.campaignId] || "INFAQ") as "ZAKAT_FITRAH" | "ZAKAT_MAAL" | "QURBAN" | "INFAQ" | "OPERASIONAL" | "PENYALURAN",
                    status: "SUCCESS",
                    donorName: donation.donorName,
                    notes: `Donasi ${donation.campaignId} — ${donation.message || ""}`.trim(),
                },
            });
        }

        return NextResponse.json({ success: true, donation });
    } catch {
        return NextResponse.json({ error: "Gagal memperbarui donasi" }, { status: 500 });
    }
}
