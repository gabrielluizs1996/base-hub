import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge inteligente de classes Tailwind com suporte a condições.
 * Garante consistência entre apps (host/remotes).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}