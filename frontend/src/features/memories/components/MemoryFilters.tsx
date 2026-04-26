import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { memoryTypeOptions } from "../memoryTypes";

export function MemoryFilters({
  search,
  memoryType,
  activeOnly,
  onChange,
}: {
  search: string;
  memoryType: string;
  activeOnly: boolean;
  onChange: (filters: { search?: string; memoryType?: string; activeOnly?: boolean }) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_220px_180px]">
      <Input label="Search memories" value={search} onChange={(e) => onChange({ search: e.target.value })} placeholder="Search what HeartBuddy remembers..." />
      <Select
        label="Memory type"
        value={memoryType}
        onChange={(e) => onChange({ memoryType: e.target.value })}
        options={[{ value: "", label: "All types" }, ...memoryTypeOptions.map((value) => ({ value, label: value.replace(/_/g, " ") }))]}
      />
      <Select
        label="Status"
        value={activeOnly ? "active" : "all"}
        onChange={(e) => onChange({ activeOnly: e.target.value === "active" })}
        options={[
          { value: "active", label: "Active only" },
          { value: "all", label: "Active and inactive" },
        ]}
      />
    </div>
  );
}
