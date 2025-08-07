import React, { useState, useEffect, useMemo, useRef, KeyboardEvent } from "react";
import { Wrapper, InputGroup, Label, Input, Dropdown, Item, NoResults } from "./FilteredSearchEstatusInput.styles";
import {
  getEstatusCuentaExcluir,
  EstatusCuentaExcluir,
} from "@/api/get-estatus-cuenta-excluir";

interface FilteredSearchEstatusInputProps {
  label?: string;
  placeholder?: string;
  onSelect?: (estatus: EstatusCuentaExcluir) => void;
  onClear?: () => void;
  onInputChange?: (value: string) => void; // ✅ nuevo prop
  refreshKey?: number;
  filterBy?: "estatusCta" | "status_id" | "both";
  minCharsToSearch?: number;
}

export const FilteredSearchEstatusInput: React.FC<FilteredSearchEstatusInputProps> = ({
  label = "Buscar estatus de cuenta",
  placeholder = "Escribe el estatus o ID...",
  onSelect,
  onClear,
  onInputChange, // ✅ agregado
  refreshKey = 0,
  filterBy = "both",
  minCharsToSearch = 1,
}) => {
  const { data: estatusList, loading, error } = getEstatusCuentaExcluir(refreshKey);
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 200);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo<EstatusCuentaExcluir[]>(() => {
    if (debouncedQuery.length < minCharsToSearch) return [];

    const lower = debouncedQuery.toLowerCase();
    return estatusList
      .filter((e) => {
        const byStatus =
          (filterBy === "estatusCta" || filterBy === "both") &&
          e.estatusCta?.toLowerCase().includes(lower);
        const byId =
          (filterBy === "status_id" || filterBy === "both") &&
          e.status_id?.toLowerCase().includes(lower);
        return Boolean(byStatus || byId);
      })
      .sort((a, b) => {
        const aText = (a.estatusCta || a.status_id || "").toLowerCase();
        const bText = (b.estatusCta || b.status_id || "").toLowerCase();
        return aText.localeCompare(bText);
      });
  }, [debouncedQuery, estatusList, filterBy, minCharsToSearch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setVisible(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!visible) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
        selectEstatus(filtered[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setVisible(false);
      setHighlightedIndex(-1);
      setQuery("");
      onClear?.();
    }
  };

  const selectEstatus = (estatus: EstatusCuentaExcluir) => {
    setQuery(estatus.estatusCta || estatus.status_id);
    setVisible(false);
    setHighlightedIndex(-1);
    onSelect?.(estatus);
  };

  useEffect(() => {
    if (debouncedQuery.length >= minCharsToSearch && filtered.length > 0) {
      setVisible(true);
    } else {
      setVisible(false);
    }
    setHighlightedIndex(-1);
  }, [debouncedQuery, filtered, minCharsToSearch]);

const handleBlur = () => {
  const match = estatusList.find(
    (e) =>
      (e.estatusCta || "").toLowerCase() === query.trim().toLowerCase()
  );
  if (match) {
    selectEstatus(match);
  } else {
    setVisible(false);
    setHighlightedIndex(-1);
    onClear?.();
  }
};

  return (
    <Wrapper ref={containerRef}>
      <InputGroup>
        <Label htmlFor="filtered-estatus-input">{label}</Label>
        <div style={{ position: "relative", flex: 1 }}>
          <Input
            id="filtered-estatus-input"
            ref={inputRef}
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              const val = e.target.value;
              setQuery(val);
              onInputChange?.(val); // ✅ Notificamos al padre
              if (val.trim() === "") {
                onClear?.();
              }
            }}
            onFocus={() => {
              if (filtered.length > 0) setVisible(true);
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={visible}
            aria-activedescendant={
              highlightedIndex >= 0 ? `filtered-item-${highlightedIndex}` : undefined
            }
          />
          {visible && (
            <Dropdown role="listbox">
              {loading && <NoResults>Cargando...</NoResults>}
              {error && <NoResults>Error cargando: {error}</NoResults>}
              {!loading && !error && filtered.length === 0 && (
                <NoResults>No se encontraron resultados</NoResults>
              )}
              {!loading &&
                !error &&
                filtered.map((e, idx) => (
                  <Item
                    key={`${e.status_id}-${idx}`}
                    id={`filtered-item-${idx}`}
                    highlighted={idx === highlightedIndex}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectEstatus(e)}
                  >
                    <div>
                      <strong>{e.estatusCta || e.status_id}</strong>
                    </div>
                  </Item>
                ))}
            </Dropdown>
          )}
        </div>
      </InputGroup>
    </Wrapper>
  );
};

export default FilteredSearchEstatusInput;
