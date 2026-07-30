import { useEffect, useState } from "react";
import { Loader2, Pencil, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

export type EditableShirtOrder = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  product_name: string;
  size: string;
  quantity: number;
  notes: string | null;
};

type ShirtOrderEditorProps = {
  order: EditableShirtOrder;
  onSaved: (order: EditableShirtOrder) => void;
};

type ShirtOrderDraft = Omit<EditableShirtOrder, "notes"> & {
  notes: string;
};

const createDraft = (order: EditableShirtOrder): ShirtOrderDraft => ({
  ...order,
  notes: order.notes ?? "",
});

const ShirtOrderEditor = ({ order, onSaved }: ShirtOrderEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draft, setDraft] = useState<ShirtOrderDraft>(() => createDraft(order));

  useEffect(() => {
    if (!isOpen) setDraft(createDraft(order));
  }, [isOpen, order]);

  const updateField = <K extends keyof ShirtOrderDraft>(field: K, value: ShirtOrderDraft[K]) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const saveOrder = async () => {
    const firstName = draft.first_name.trim();
    const lastName = draft.last_name.trim();
    const email = draft.email.trim();
    const phone = draft.phone.trim();
    const productName = draft.product_name.trim();
    const size = draft.size.trim();
    const notes = draft.notes.trim();

    if (!firstName || !lastName || !email || phone.length < 6) {
      toast.error("Complétez correctement le nom, l’e-mail et le téléphone.");
      return;
    }

    if (!productName || !size || !Number.isInteger(draft.quantity) || draft.quantity < 1 || draft.quantity > 10) {
      toast.error("Indiquez un produit, une taille et une quantité comprise entre 1 et 10.");
      return;
    }

    if (notes.length > 500) {
      toast.error("La remarque ne doit pas dépasser 500 caractères.");
      return;
    }

    const updatedOrder: EditableShirtOrder = {
      id: order.id,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      product_name: productName,
      size,
      quantity: draft.quantity,
      notes: notes || null,
    };

    setIsSaving(true);
    const { error } = await supabase
      .from("shop_preorders")
      .update({
        first_name: updatedOrder.first_name,
        last_name: updatedOrder.last_name,
        email: updatedOrder.email,
        phone: updatedOrder.phone,
        product_name: updatedOrder.product_name,
        size: updatedOrder.size,
        quantity: updatedOrder.quantity,
        notes: updatedOrder.notes,
      })
      .eq("id", order.id);

    if (error) {
      console.error(error);
      toast.error("La commande de maillot n’a pas pu être modifiée.");
    } else {
      onSaved(updatedOrder);
      setIsOpen(false);
      toast.success("Commande de maillot modifiée.");
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="font-bold">
          <Pencil className="mr-2 h-4 w-4" /> Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Modifier la commande de maillot</DialogTitle>
          <DialogDescription>
            Les changements sont enregistrés dans Supabase et repris automatiquement dans le bordereau des maillots.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-bold">
            Prénom
            <Input value={draft.first_name} onChange={(event) => updateField("first_name", event.target.value)} maxLength={80} />
          </label>
          <label className="space-y-2 text-sm font-bold">
            Nom
            <Input value={draft.last_name} onChange={(event) => updateField("last_name", event.target.value)} maxLength={80} />
          </label>
          <label className="space-y-2 text-sm font-bold">
            E-mail
            <Input type="email" value={draft.email} onChange={(event) => updateField("email", event.target.value)} maxLength={254} />
          </label>
          <label className="space-y-2 text-sm font-bold">
            Téléphone
            <Input type="tel" value={draft.phone} onChange={(event) => updateField("phone", event.target.value)} maxLength={30} />
          </label>
          <label className="space-y-2 text-sm font-bold sm:col-span-2">
            Produit
            <Input value={draft.product_name} onChange={(event) => updateField("product_name", event.target.value)} />
          </label>
          <label className="space-y-2 text-sm font-bold">
            Taille
            <Input value={draft.size} onChange={(event) => updateField("size", event.target.value)} placeholder="Ex. M, XL ou 12 ans" />
          </label>
          <label className="space-y-2 text-sm font-bold">
            Quantité
            <Input type="number" min={1} max={10} value={draft.quantity} onChange={(event) => updateField("quantity", Number(event.target.value))} />
          </label>
          <label className="space-y-2 text-sm font-bold sm:col-span-2">
            Remarque
            <Textarea value={draft.notes} onChange={(event) => updateField("notes", event.target.value)} maxLength={500} rows={4} />
            <span className="block text-right text-xs font-normal text-muted-foreground">{draft.notes.length}/500</span>
          </label>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSaving}>Annuler</Button>
          <Button type="button" onClick={saveOrder} disabled={isSaving} className="bg-clubPrimary font-bold">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Enregistrer les modifications
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShirtOrderEditor;
