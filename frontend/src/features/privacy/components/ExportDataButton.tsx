import { Download } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { privacyService } from "../privacyService";

export function ExportDataButton() {
  async function exportData() {
    const data = await privacyService.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `heartbuddy-data-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
  return <Button icon={<Download className="h-4 w-4" />} onClick={() => void exportData()}>Export my data</Button>;
}
