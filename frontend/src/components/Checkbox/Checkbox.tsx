// components/ui/MultiSelectContent.tsx

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IItem {
  id: string;      // ID da disciplina ou item
  nome: string;    // Nome que será exibido
}

interface MultiSelectContentProps {
  items: IItem[];
  onSelectionChange: (selectedIds: string[]) => void; 
  initialSelection?: string[];
}

export function MultiSelectContent({ 
  items, 
  onSelectionChange,
  initialSelection = []
}: MultiSelectContentProps) {
  
  // Estado local para rastrear os IDs selecionados
  const [selectedItems, setSelectedItems] = useState<string[]>(initialSelection);

  // Alterna a seleção de um item
  const handleToggle = (itemId: string, isChecked: boolean) => {
    let newSelection: string[];

    if (isChecked) {
      newSelection = [...selectedItems, itemId];
    } else {
      newSelection = selectedItems.filter((id) => id !== itemId);
    }

    setSelectedItems(newSelection);
    onSelectionChange(newSelection); // Notifica o pai
  };

  return (
    <ScrollArea className="h-[200px] w-full p-4">
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <Checkbox 
              id={item.id}
              checked={selectedItems.includes(item.id)} // ✅ Corrigido: compara com ID
              onCheckedChange={(checked) => handleToggle(item.id, checked === true)}
            />
            <Label htmlFor={item.id} className="text-sm cursor-pointer">
              {item.nome}  {/* Apenas exibição */}
            </Label>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
