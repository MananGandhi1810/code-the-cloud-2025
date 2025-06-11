import React from "react";
import clsx from "clsx";

export default function Badge({ label, color }) {
    const base = "px-3 py-1 text-xs font-medium rounded-full";
    const variants = {
        green: "bg-green-100 text-green-800",
        yellow: "bg-yellow-100 text-yellow-800",
        red: "bg-red-100 text-red-800",
        blue: "bg-blue-100 text-blue-800",
        purple: "bg-purple-100 text-purple-800",
        orange: "bg-orange-100 text-orange-800",
    };
    return <span className={clsx(base, variants[color])}>{label}</span>;
}
