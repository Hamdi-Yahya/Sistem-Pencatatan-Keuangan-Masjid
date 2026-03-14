// File: src/app/api/payment/create/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const { amount, category, donorName, notes } = await request.json();

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: "Jumlah pembayaran tidak valid" },
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
                type: "INCOME",
                category,
                status: "PENDING",
                donorName: donorName || null,
                notes: notes || null,
            },
        });

        const MAYAR_API_KEY = process.env.MAYAR_API_KEY;

        if (!MAYAR_API_KEY) {
            return NextResponse.json(
                { error: "Payment gateway belum dikonfigurasi" },
                { status: 500 }
            );
        }

        const mayarResponse = await fetch("https://api.mayar.id/hl/v1/payment/create", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${MAYAR_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: donorName || "Jamaah",
                email: "jamaah@masjid.com",
                amount: Number(amount),
                description: notes || `Pembayaran ${category}`,
                expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                mobile: "081200000000",
            }),
        });

        const mayarData = await mayarResponse.json();

        if (mayarData?.data?.link) {
            await prisma.transaction.update({
                where: { id: transaction.id },
                data: { mayarTrxId: mayarData.data.id?.toString() || transaction.id },
            });

            return NextResponse.json({
                success: true,
                checkoutUrl: mayarData.data.link,
                transactionId: transaction.id,
            });
        }

        return NextResponse.json({
            success: true,
            checkoutUrl: null,
            transactionId: transaction.id,
            message: "Transaksi disimpan, pembayaran manual diperlukan",
            mayarResponse: mayarData,
        });
    } catch (error) {
        console.error("Payment create error:", error);
        return NextResponse.json(
            { error: "Gagal membuat pembayaran" },
            { status: 500 }
        );
    }
}
