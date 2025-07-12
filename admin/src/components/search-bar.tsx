import { Search } from "lucide-react";
import { FC } from "react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  placeholder = "Search...",
}) => (
  <div className="relative mb-6">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
    <input
      type="text"
      placeholder={placeholder}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);
