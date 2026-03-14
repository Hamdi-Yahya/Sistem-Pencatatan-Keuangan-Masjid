// File: src/app/api/dashboard/stats/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMonthRange } from "@/lib/utils";

export async function GET() {
    try {
        const { start, end, label } = getMonthRange();

        const incomeResult = await prisma.transaction.aggregate({
            where: {
                type: "INCOME",
                status: "SUCCESS",
                createdAt: { gte: start, lte: end },
            },
            _sum: { amount: true },
        });

        const expenseResult = await prisma.transaction.aggregate({
            where: {
                type: "EXPENSE",
                status: "SUCCESS",
                createdAt: { gte: start, lte: end },
            },
            _sum: { amount: true },
        });

        const allIncomeResult = await prisma.transaction.aggregate({
            where: { type: "INCOME", status: "SUCCESS" },
            _sum: { amount: true },
        });

        const allExpenseResult = await prisma.transaction.aggregate({
            where: { type: "EXPENSE", status: "SUCCESS" },
            _sum: { amount: true },
        });

        const totalIncome = incomeResult._sum.amount || 0;
        const totalExpense = expenseResult._sum.amount || 0;
        const allIncome = allIncomeResult._sum.amount || 0;
        const allExpense = allExpenseResult._sum.amount || 0;
        const totalBalance = allIncome - allExpense;

        return NextResponse.json({
            totalBalance,
            totalIncome,
            totalExpense,
            periodLabel: label,
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json(
            { totalBalance: 0, totalIncome: 0, totalExpense: 0, periodLabel: "" },
            { status: 500 }
        );
    }
}
