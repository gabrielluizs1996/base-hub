import type { OrderSide } from "../types/order.types.js";

const instruments = ["PETR4", "VALE3", "ITUB4", "BBDC4", "ABEV3", "WEGE3", "RENT3", "BBAS3"];

export function randomInstrument() {
  return instruments[Math.floor(Math.random() * instruments.length)];
}

export function randomSide(): OrderSide {
  return Math.random() > 0.5 ? "buy" : "sell";
}

export function randomDate(daysBack: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  d.setHours(
    Math.floor(Math.random() * 8) + 10,
    Math.floor(Math.random() * 60),
    Math.floor(Math.random() * 60)
  );
  return d.toISOString();
}