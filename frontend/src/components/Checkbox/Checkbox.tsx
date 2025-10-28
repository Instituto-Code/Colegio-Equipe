// components/ui/MultiSelectContent.tsx (ou onde você o definir)

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area"; // 👈 Import necessário

interface IItem {
  id: string;
  nome: string;
}

interface MultiSelectContentProps {
  items: IItem[];
  // 💡 Callback para notificar o componente pai sobre as seleções
  onSelectionChange: (selectedIds: string[]) => void; 
  initialSelection?: string[]; // Para preencher seleções existentes
}

export function MultiSelectContent({ 
    items, 
    onSelectionChange,
    initialSelection = []
}: MultiSelectContentProps) {
  
  // 1. Estado local para rastrear as disciplinas selecionadas
  const [selectedItems, setSelectedItems] = useState<string[]>(initialSelection);

  // 2. Função para alternar a seleção de um item
  const handleToggle = (itemId: string, isChecked: boolean) => {
    let newSelection: string[];
    
    if (isChecked) {
      newSelection = [...selectedItems, itemId];
    } else {
      newSelection = selectedItems.filter((id) => id !== itemId);
    }

    // Atualiza o estado local
    setSelectedItems(newSelection);
    
    // 3. Notifica o componente pai sobre a mudança
    onSelectionChange(newSelection);
  };

  return (
    <ScrollArea className="h-[200px] w-full p-4"> {/* Envolve em ScrollArea para listas longas */}
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <Checkbox 
              id={item.id}
              checked={selectedItems.includes(item.id)}
              onCheckedChange={(checked) => {
                // O checked pode vir como boolean ou 'indeterminate'
                handleToggle(item.id, checked === true);
              }}
            />
            <Label htmlFor={item.id} className="text-sm cursor-pointer">
                {item.nome}
            </Label>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}