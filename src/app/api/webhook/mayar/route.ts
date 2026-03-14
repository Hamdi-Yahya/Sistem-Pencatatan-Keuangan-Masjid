// File: src/app/api/webhook/mayar/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const event = body.event;
        const data = body.data;

        if (event === "payment.success" || event === "payment.received") {
            const mayarTrxId = data?.id?.toString();

            if (!mayarTrxId) {
                return NextResponse.json(
                    { error: "ID transaksi tidak ditemukan" },
                    { status: 400 }
                );
            }

            const existingTransaction = await prisma.transaction.findUnique({
                where: { mayarTrxId },
            });

            if (existingTransaction) {
                await prisma.transaction.update({
                    where: { mayarTrxId },
                    data: { status: "SUCCESS" },
                });
            } else {
                await prisma.transaction.create({
                    data: {
                        amount: Number(data.amount) || 0,
                        type: "INCOME",
                        category: "INFAQ",
                        status: "SUCCESS",
                        donorName: data.name || null,
                        notes: data.description || "Pembayaran via Mayar",
                        mayarTrxId,
                    },
                });
            }

            return NextResponse.json({ success: true });
        }

        if (event === "payment.failed" || event === "payment.expired") {
            const mayarTrxId = data?.id?.toString();

            if (mayarTrxId) {
                const existingTransaction = await prisma.transaction.findUnique({
                    where: { mayarTrxId },
                });

                if (existingTransaction) {
                    await prisma.transaction.update({
                        where: { mayarTrxId },
                        data: { status: "FAILED" },
                    });
                }
            }

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: true, message: "Event diabaikan" });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json(
            { error: "Webhook gagal diproses" },
            { status: 500 }
        );
    }
}
