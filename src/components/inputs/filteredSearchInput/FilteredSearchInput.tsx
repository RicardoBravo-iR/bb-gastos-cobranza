// filteredSearchInput.tsx
import React, { useState, useEffect, useMemo, useRef, KeyboardEvent } from 'react';
import { Wrapper, InputGroup, Label, Input, Dropdown, Item, NoResults} from './FilteredSearchInput.styles';
import { getClientesAExcluir, ClienteAExcluir } from '@/api/get-clientes-excluir';

interface FilteredSearchInputProps {
  label?: string;
  placeholder?: string;
  onSelect?: (cliente: ClienteAExcluir) => void;
  refreshKey?: number;
  /** campo por el que filtrar: 'identificacion' | 'cliente_id' | ambos */
  filterBy?: 'identificacion' | 'cliente_id' | 'both';
  minCharsToSearch?: number;
}

export const FilteredSearchInput: React.FC<FilteredSearchInputProps> = ({
  label = 'Buscar cliente a excluir',
  placeholder = 'Escribe identificación o ID...',
  onSelect,
  refreshKey = 0,
  filterBy = 'both',
  minCharsToSearch = 1,
}) => {
  const { data: clientes, loading, error } = getClientesAExcluir(refreshKey);
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Debounce manual
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 200);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo<ClienteAExcluir[]>(() => {
    if (debouncedQuery.length < minCharsToSearch) return [];
    const lower = debouncedQuery.toLowerCase();
    return clientes.filter((c) => {
      const byId =
        (filterBy === 'cliente_id' || filterBy === 'both') &&
        c.cliente_id?.toLowerCase().includes(lower);
      const byIdent =
        (filterBy === 'identificacion' || filterBy === 'both') &&
        c.identificacion?.toLowerCase().includes(lower);
      return Boolean(byId || byIdent);
    });
  }, [debouncedQuery, clientes, filterBy, minCharsToSearch]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setVisible(false);
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!visible) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
        selectCliente(filtered[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setVisible(false);
      setHighlightedIndex(-1);
    }
  };

  const selectCliente = (cliente: ClienteAExcluir) => {
    setQuery(
      cliente.identificacion
        ? `${cliente.identificacion}`
        : cliente.cliente_id
    );
    setVisible(false);
    setHighlightedIndex(-1);
    if (onSelect) onSelect(cliente);
  };

  useEffect(() => {
    if (debouncedQuery.length >= minCharsToSearch && filtered.length > 0) {
      setVisible(true);
    } else {
      setVisible(false);
    }
    setHighlightedIndex(-1);
  }, [debouncedQuery, filtered]);

  return (
    <Wrapper ref={containerRef}>
      <InputGroup>
        <Label htmlFor="filtered-search-input">{label}</Label>
        <div style={{ position: 'relative', flex: 1 }}>
          <Input
            id="filtered-search-input"
            ref={inputRef}
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            onFocus={() => {
              if (filtered.length > 0) setVisible(true);
            }}
            onKeyDown={handleKeyDown}
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
                filtered.map((c, idx) => (
                  <Item
                    key={`${c.cliente_id}-${idx}`}
                    id={`filtered-item-${idx}`}
                    highlighted={idx === highlightedIndex}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onMouseDown={(e) => {
                      e.preventDefault(); // evita que el blur ocurra antes del click
                    }}
                    onClick={() => selectCliente(c)}
                  >
                    <div>
                      <strong>{c.identificacion || c.cliente_id}</strong>
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

export default FilteredSearchInput;
