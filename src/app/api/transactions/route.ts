// File: src/app/api/transactions/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const type = searchParams.get("type");
        const category = searchParams.get("category");

        const where: Record<string, unknown> = { status: "SUCCESS" };
        if (type === "INCOME" || type === "EXPENSE") {
            where.type = type;
        }
        if (category) {
            where.category = category;
        }

        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.transaction.count({ where }),
        ]);

        return NextResponse.json({
            transactions,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch {
        return NextResponse.json(
            { transactions: [], total: 0, page: 1, totalPages: 0 },
            { status: 500 }
        );
    }
}
