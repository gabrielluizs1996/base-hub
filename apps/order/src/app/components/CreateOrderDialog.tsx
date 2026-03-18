import { useState } from "react";
import { OrderSide, useOrderStore } from "@base-hub/domain";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Button, Input, Label } from "@base-hub/ui";
import { cn } from "@base-hub/ui";
import { toast } from "sonner";

const instruments = ["PETR4", "VALE3", "ITUB4", "BBDC4", "ABEV3", "WEGE3", "RENT3", "BBAS3"];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateOrderDialog({ open, onClose }: Props) {
  const { createOrder } = useOrderStore();
  const [side, setSide] = useState<OrderSide>("buy");
  const [instrument, setInstrument] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!instrument) errs.instrument = "Selecione um instrumento";
    const p = parseFloat(price);
    if (!price || isNaN(p) || p <= 0) errs.price = "Preço deve ser maior que 0";
    const q = parseInt(quantity);
    if (!quantity || isNaN(q) || q <= 0 || !Number.isInteger(q)) errs.quantity = "Quantidade deve ser um inteiro positivo";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    createOrder(instrument, side, parseFloat(price), parseInt(quantity));
    toast.success("Ordem criada com sucesso!", { description: `${side === "buy" ? "Compra" : "Venda"} de ${quantity}x ${instrument} @ R$ ${parseFloat(price).toFixed(2)}` });
    setInstrument("");
    setPrice("");
    setQuantity("");
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Ordem</DialogTitle>
          <DialogDescription>Preencha os dados para criar uma nova ordem</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Side toggle */}
          <div className="flex rounded-lg border p-1 gap-1">
            <button
              type="button"
              onClick={() => setSide("buy")}
              className={cn("flex-1 py-2 text-sm font-semibold rounded transition-colors duration-150", side === "buy" ? "bg-success text-success-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              Compra
            </button>
            <button
              type="button"
              onClick={() => setSide("sell")}
              className={cn("flex-1 py-2 text-sm font-semibold rounded transition-colors duration-150", side === "sell" ? "bg-destructive text-destructive-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              Venda
            </button>
          </div>

          <div className="space-y-1.5">
            <Label>Instrumento</Label>
            <Select value={instrument} onValueChange={setInstrument}>
              <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>
                {instruments.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.instrument && <p className="text-xs text-destructive">{errors.instrument}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Preço (R$)</Label>
              <Input type="number" step="0.01" min="0.01" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} className="font-mono-data" />
              {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Quantidade</Label>
              <Input type="number" step="1" min="1" placeholder="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="font-mono-data" />
              {errors.quantity && <p className="text-xs text-destructive">{errors.quantity}</p>}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant={side === "buy" ? "buy" : "sell"} onClick={handleSubmit}>
            {side === "buy" ? "Enviar Compra" : "Enviar Venda"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
