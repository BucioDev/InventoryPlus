import { useState } from "react";
import { BRAND_OPTIONS } from "../constants/brand-options";

interface TagInputProps {
  name: string;
  defaultValue?: string[];
  placeholder?: string;
}

export function TagListInput({
  name,
  defaultValue = [],
  placeholder,
}: TagInputProps) {

  const [tags, setTags] = useState<string[]>(defaultValue);
  const [selected, setSelected] = useState("");

  const addTag = () => {
    if (selected && !tags.includes(selected)) {
      setTags([...tags, selected]);
      setSelected("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 border rounded p-2 mb-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-gray-200 px-2 py-1 rounded flex items-center"
          >
            {tag}

            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-2 text-red-500"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="border rounded px-2 py-1 flex-1"
        >
          <option value="">
            {placeholder ?? "Selecciona una marca"}
          </option>

          {BRAND_OPTIONS.map((option) => (
            <option
              key={option}
              value={option}
              disabled={tags.includes(option)}
            >
              {option}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={addTag}
          className="bg-black text-white px-4 py-1 rounded"
        >
          Agregar
        </button>
      </div>

      <input
        type="hidden"
        name={name}
        value={JSON.stringify(tags)}
      />
    </div>
  );
}