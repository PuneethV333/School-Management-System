import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";

export type iconCard = {
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    label: string;
    value: string|number;
    isEmpty?: boolean | undefined;
}

export type sectionCard = {
    title: string;
    children: ReactNode;
    icon: ForwardRefExoticComponent<Omit<LucideProps,"ref">>;
}

export type errorState = {
    message: string;
    title?: string | undefined;
}