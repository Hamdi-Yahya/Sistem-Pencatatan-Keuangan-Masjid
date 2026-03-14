// File: src/app/api/reports/pdf/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getMonthRange, formatRupiah, getCategoryLabel } from "@/lib/utils";

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { start, end, label } = getMonthRange();

        const transactions = await prisma.transaction.findMany({
            where: {
                status: "SUCCESS",
                createdAt: { gte: start, lte: end },
            },
            orderBy: { createdAt: "asc" },
        });

        const incomeTransactions = transactions.filter((t) => t.type === "INCOME");
        const expenseTransactions = transactions.filter((t) => t.type === "EXPENSE");
        const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

        const reportData = {
            period: label,
            generatedAt: new Date().toISOString(),
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense,
            transactions: transactions.map((t) => ({
                date: t.createdAt,
                category: getCategoryLabel(t.category),
                type: t.type === "INCOME" ? "Masuk" : "Keluar",
                amount: t.amount,
                amountFormatted: formatRupiah(t.amount),
                notes: t.notes || "-",
            })),
        };

        return NextResponse.json(reportData);
    } catch {
        return NextResponse.json(
            { error: "Gagal membuat laporan" },
            { status: 500 }
        );
    }
}
