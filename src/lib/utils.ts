// File: src/lib/utils.ts

export function formatRupiah(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatDate(date: Date | string): string {
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(date));
}

export function formatDateShort(date: Date | string): string {
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
}

export function getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
        ZAKAT_FITRAH: "Zakat Fitrah",
        ZAKAT_MAAL: "Zakat Maal",
        QURBAN: "Qurban",
        INFAQ: "Infaq",
        OPERASIONAL: "Operasional",
        PENYALURAN: "Penyaluran",
    };
    return labels[category] || category;
}

export function getMonthRange(): { start: Date; end: Date; label: string } {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const monthName = new Intl.DateTimeFormat("id-ID", { month: "long" }).format(now);
    const year = now.getFullYear();
    return { start, end, label: `${monthName} ${year}` };
}
