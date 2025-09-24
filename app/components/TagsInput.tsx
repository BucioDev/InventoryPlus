import { useState } from "react";

interface TagInputProps {
    name: string;
    defaultValue?: string[]; 
    placeholder?: string;
  }
  
  export function TagInput({ name, defaultValue = [], placeholder }: TagInputProps) {
    const [tags, setTags] = useState<string[]>(defaultValue);
    const [input, setInput] = useState("");
  
    const addTag = () => {
      const newTag = input.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setInput("");
      }
    };
  
    const removeTag = (tag: string) => {
      setTags(tags.filter((t) => t !== tag));
    };
  
    return (
      <div>
        <div className="flex flex-wrap gap-2 border rounded p-2">
          {tags.map((tag) => (
            <span key={tag} className="bg-gray-200 px-2 py-1 rounded flex items-center">
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
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTag();
              }
            }}
            className="flex-1 min-w-[100px] outline-none"
            placeholder={placeholder ?? "Escribe una marca y presiona enter"}
          />
        </div>
  
        {/* Hidden input integrates with Conform */}
        <input type="hidden" name={name} value={JSON.stringify(tags)} />
      </div>
    );
  }
  