"use client";

import dynamic from "next/dynamic";
import { DemoLoading } from "@/components/ui/DemoLoading";

// Each demo ships in its own chunk and is fetched only when it nears the viewport.
export const AuraDemo = dynamic(() => import("@/components/demos/aura/AuraDemo"), { ssr: false, loading: DemoLoading });
export const NovaDemo = dynamic(() => import("@/components/demos/nova/NovaDemo"), { ssr: false, loading: DemoLoading });
export const InventoryDemo = dynamic(() => import("@/components/demos/inventory/InventoryApp"), { ssr: false, loading: DemoLoading });
export const DashboardDemo = dynamic(() => import("@/components/demos/dashboard/DashboardApp"), { ssr: false, loading: DemoLoading });
