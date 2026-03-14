/* File: src/app/api/wishlist/route.ts */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/* GET — Daftar semua rencana pembelian */
export async function GET() {
    try {
        const wishlists = await prisma.wishlist.findMany({
            orderBy: { createdAt: "desc" },
        });

        const totalPlanned = wishlists
            .filter((w) => w.status === "PLANNED")
            .reduce((sum, w) => sum + w.amount, 0);

        return NextResponse.json({ wishlists, totalPlanned });
    } catch {
        return NextResponse.json({ error: "Gagal memuat data" }, { status: 500 });
    }
}

/* POST — Tambah rencana pembelian baru (auth protected) */
export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, description, amount, priority } = await request.json();

        if (!name || !amount || amount <= 0) {
            return NextResponse.json({ error: "Nama dan jumlah wajib diisi" }, { status: 400 });
        }

        const wishlist = await prisma.wishlist.create({
            data: {
                name,
                description: description || null,
                amount: Number(amount),
                priority: priority || "MEDIUM",
                status: "PLANNED",
            },
        });

        return NextResponse.json({ success: true, wishlist });
    } catch {
        return NextResponse.json({ error: "Gagal menyimpan" }, { status: 500 });
    }
}
