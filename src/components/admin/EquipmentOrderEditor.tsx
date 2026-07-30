import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react";
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

export type EditableEquipmentItem = {
  reference: string;
  designation: string;
  quantity: number;
  unit_price: number | null;
  color?: string | null;
  thickness?: string | null;
  handle?: string | null;
  size?: string | null;
  shoe_size?: string | null;
  option?: string | null;
  discount_rate?: number | null;
  supplier_order_number?: string | null;
  supplier_total?: number | null;
};

export type EditableEquipmentOrder = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  items: EditableEquipmentItem[];
  notes: string | null;
};

type EquipmentOrderEditorProps = {
  order: EditableEquipmentOrder;
  onSaved: (order: EditableEquipmentOrder) => void;
};

type EquipmentOrderDraft = Omit<EditableEquipmentOrder, "notes"> & {
  notes: string;
};

const emptyItem: EditableEquipmentItem = {
  reference: "",
  designation: "",
  quantity: 1,
  unit_price: null,
  color: null,
  thickness: null,
  handle: null,
  size: null,
  shoe_size: null,
  option: null,
  discount_rate: 20,
};

const createDraft = (order: EditableEquipmentOrder): EquipmentOrderDraft => ({
  ...order,
  notes: order.notes ?? "",
  items: order.items.map((item) => ({ ...item })),
});

const optionalValue = (value: string) => value.trim() || null;

const EquipmentOrderEditor = ({ order, onSaved }: EquipmentOrderEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draft, setDraft] = useState<EquipmentOrderDraft>(() => createDraft(order));

  useEffect(() => {
    if (!isOpen) setDraft(createDraft(order));
  }, [isOpen, order]);

  const updateField = (field: "first_name" | "last_name" | "email" | "phone" | "notes", value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const updateItem = <K extends keyof EditableEquipmentItem>(
    index: number,
    field: K,
    value: EditableEquipmentItem[K],
  ) => {
    setDraft((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
    }));
  };

  const removeItem = (index: number) => {
    if (draft.items.length === 1) {
      toast.info("Une commande doit contenir au moins un article.");
      return;
    }
    setDraft((current) => ({ ...current, items: current.items.filter((_, itemIndex) => itemIndex !== index) }));
  };

  const saveOrder = async () => {
    const firstName = draft.first_name.trim();
    const lastName = draft.last_name.trim();
    const email = draft.email.trim();
    const phone = draft.phone.trim();

    if (!firstName || !lastName || !email || phone.length < 6) {
      toast.error("Complétez correctement le nom, l’e-mail et le téléphone.");
      return;
    }

    if (draft.notes.length > 1000) {
      toast.error("La remarque ne doit pas dépasser 1 000 caractères.");
      return;
    }

    const invalidItem = draft.items.some((item) => (
      !item.reference.trim()
      || !item.designation.trim()
      || !Number.isInteger(item.quantity)
      || item.quantity < 1
      || (item.unit_price !== null && (!Number.isFinite(item.unit_price) || item.unit_price < 0))
    ));

    if (invalidItem) {
      toast.error("Chaque article doit avoir une référence, une désignation, une quantité valide et un prix positif.");
      return;
    }

    const items = draft.items.map((item) => ({
      reference: item.reference.trim(),
      designation: item.designation.trim(),
      quantity: item.quantity,
      unit_price: item.unit_price,
      color: optionalValue(item.color ?? ""),
      thickness: optionalValue(item.thickness ?? ""),
      handle: optionalValue(item.handle ?? ""),
      size: optionalValue(item.size ?? ""),
      shoe_size: optionalValue(item.shoe_size ?? ""),
      option: optionalValue(item.option ?? ""),
      discount_rate: item.discount_rate ?? 20,
      supplier_order_number: item.supplier_order_number ?? null,
      supplier_total: item.supplier_total ?? null,
    }));

    const updatedOrder: EditableEquipmentOrder = {
      id: order.id,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      items,
      notes: optionalValue(draft.notes),
    };

    setIsSaving(true);
    const { error } = await supabase
      .from("equipment_orders")
      .update({
        first_name: updatedOrder.first_name,
        last_name: updatedOrder.last_name,
        email: updatedOrder.email,
        phone: updatedOrder.phone,
        items: updatedOrder.items,
        notes: updatedOrder.notes,
      })
      .eq("id", order.id);

    if (error) {
      console.error(error);
      toast.error("La commande n’a pas pu être modifiée.");
    } else {
      onSaved(updatedOrder);
      setIsOpen(false);
      toast.success("Commande matériel modifiée.");
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
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Modifier la commande matériel</DialogTitle>
          <DialogDescription>
            Les changements sont enregistrés dans Supabase et repris automatiquement dans les bordereaux.
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
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-black">Articles commandés</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => setDraft((current) => ({ ...current, items: [...current.items, { ...emptyItem }] }))}>
              <Plus className="mr-2 h-4 w-4" /> Ajouter un article
            </Button>
          </div>

          {draft.items.map((item, index) => (
            <section key={`${order.id}-edit-${index}`} className="rounded-xl border bg-clubSection/20 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-black">Article {index + 1}</h4>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)} className="text-destructive hover:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Retirer
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <label className="space-y-2 text-sm font-bold">Référence<Input value={item.reference} onChange={(event) => updateItem(index, "reference", event.target.value)} /></label>
                <label className="space-y-2 text-sm font-bold sm:col-span-2">Désignation<Input value={item.designation} onChange={(event) => updateItem(index, "designation", event.target.value)} /></label>
                <label className="space-y-2 text-sm font-bold">Quantité<Input type="number" min={1} max={99} value={item.quantity} onChange={(event) => updateItem(index, "quantity", Number(event.target.value))} /></label>
                <label className="space-y-2 text-sm font-bold">Prix unitaire (€)<Input type="number" min={0} step="0.01" value={item.unit_price ?? ""} onChange={(event) => updateItem(index, "unit_price", event.target.value === "" ? null : Number(event.target.value))} /></label><label className="flex items-center gap-3 rounded-lg border p-3 text-sm font-bold"><input type="checkbox" checked={(item.discount_rate ?? 20) === 20} onChange={(event) => updateItem(index, "discount_rate", event.target.checked ? 20 : 0)} className="h-4 w-4 accent-clubPrimary" /> Remise club de 20 %</label>
                <label className="space-y-2 text-sm font-bold">Couleur<Input value={item.color ?? ""} onChange={(event) => updateItem(index, "color", event.target.value)} /></label>
                <label className="space-y-2 text-sm font-bold">Épaisseur<Input value={item.thickness ?? ""} onChange={(event) => updateItem(index, "thickness", event.target.value)} /></label>
                <label className="space-y-2 text-sm font-bold">Manche<Input value={item.handle ?? ""} onChange={(event) => updateItem(index, "handle", event.target.value)} /></label>
                <label className="space-y-2 text-sm font-bold">Taille<Input value={item.size ?? ""} onChange={(event) => updateItem(index, "size", event.target.value)} /></label>
                <label className="space-y-2 text-sm font-bold">Pointure<Input value={item.shoe_size ?? ""} onChange={(event) => updateItem(index, "shoe_size", event.target.value)} /></label>
                <label className="space-y-2 text-sm font-bold sm:col-span-2">Autre option<Input value={item.option ?? ""} onChange={(event) => updateItem(index, "option", event.target.value)} /></label>
              </div>
            </section>
          ))}
        </div>

        <label className="space-y-2 text-sm font-bold">
          Remarque
          <Textarea value={draft.notes} onChange={(event) => updateField("notes", event.target.value)} maxLength={1000} rows={4} />
          <span className="block text-right text-xs font-normal text-muted-foreground">{draft.notes.length}/1000</span>
        </label>

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

export default EquipmentOrderEditor;
