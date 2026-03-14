/* File: src/app/api/wishlist/[id]/route.ts */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/* PATCH — Update status rencana pembelian */
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
        const body = await request.json();

        const wishlist = await prisma.wishlist.update({
            where: { id },
            data: body,
        });

        return NextResponse.json({ success: true, wishlist });
    } catch {
        return NextResponse.json({ error: "Gagal memperbarui" }, { status: 500 });
    }
}

/* DELETE — Hapus rencana pembelian */
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await prisma.wishlist.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Gagal menghapus" }, { status: 500 });
    }
}
