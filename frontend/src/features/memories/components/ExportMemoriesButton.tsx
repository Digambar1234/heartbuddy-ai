import { Download } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { memoryService } from "../memoryService";

export function ExportMemoriesButton() {
  async function exportMemories() {
    const data = await memoryService.export();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `heartbuddy-memories-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return <Button variant="secondary" icon={<Download className="h-4 w-4" />} onClick={() => void exportMemories()}>Export memories</Button>;
}
