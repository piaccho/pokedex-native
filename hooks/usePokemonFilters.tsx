/* eslint-disable import/no-unresolved */
import { useState, useCallback, useMemo } from "react";

import { SortDirection } from "@/components/index/ItemSortFilter";
import { PokemonResult } from "@/types/Pokemon.types";
import { matchesSelectedTypes } from "@/utils/pokemonUtils";

interface UsePokemonFiltersProps {
  pokemons: PokemonResult[];
}

export const usePokemonFilters = ({ pokemons }: UsePokemonFiltersProps) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.NONE,
  );
  const [pokemonTypesMap, setPokemonTypesMap] = useState<
    Record<string, string[]>
  >({});

  const handleTypeSelect = useCallback((type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }, []);

  const handleSortDirectionChange = useCallback((direction: SortDirection) => {
    setSortDirection(direction);
  }, []);

  const handleApplyFilters = useCallback((types: string[]) => {
    setSelectedTypes(types);
  }, []);

  const handlePokemonTypesLoaded = useCallback(
    (url: string, types: string[]) => {
      setPokemonTypesMap((prev) => {
        const newMap = { ...prev, [url]: types };
        // Limit cache size to prevent memory issues
        const entries = Object.entries(newMap);
        if (entries.length > 100) {
          return Object.fromEntries(entries.slice(-100));
        }
        return newMap;
      });
    },
    [],
  );

  const filteredAndSortedPokemons = useMemo(() => {
    let result = [...pokemons];

    if (selectedTypes.length > 0) {
      result = result.filter((pokemon) => {
        const url = pokemon.url;
        if (pokemonTypesMap[url]) {
          return matchesSelectedTypes(pokemonTypesMap[url], selectedTypes);
        }
        return true;
      });
    }

    if (sortDirection !== SortDirection.NONE) {
      result = [...result].sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return sortDirection === SortDirection.ASC
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
    }

    return result;
  }, [pokemons, sortDirection, selectedTypes, pokemonTypesMap]);

  return {
    selectedTypes,
    sortDirection,
    pokemonTypesMap,
    filteredAndSortedPokemons,
    handleTypeSelect,
    handleSortDirectionChange,
    handleApplyFilters,
    handlePokemonTypesLoaded,
  };
};
