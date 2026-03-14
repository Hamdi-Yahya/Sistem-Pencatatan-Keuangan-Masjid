/* File: src/app/api/transactions/expense/route.ts */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/* POST — Tambah pengeluaran manual oleh admin */
export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized — silakan login terlebih dahulu" },
                { status: 401 }
            );
        }

        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Format data tidak valid" },
                { status: 400 }
            );
        }

        const { amount, category, notes } = body;

        if (!amount || Number(amount) <= 0) {
            return NextResponse.json(
                { error: "Jumlah pengeluaran tidak valid" },
                { status: 400 }
            );
        }

        if (!category) {
            return NextResponse.json(
                { error: "Kategori wajib diisi" },
                { status: 400 }
            );
        }

        const transaction = await prisma.transaction.create({
            data: {
                amount: Number(amount),
                type: "EXPENSE",
                category,
                status: "SUCCESS",
                donorName: null,
                notes: notes || null,
            },
        });

        return NextResponse.json({ success: true, transaction });
    } catch (error) {
        console.error("Expense creation error:", error);
        return NextResponse.json(
            { error: "Gagal menyimpan pengeluaran. Periksa koneksi database." },
            { status: 500 }
        );
    }
}
