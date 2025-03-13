/**
 * Checks if any of the pokemon's types match any of the selected filter types
 *
 * @param pokemonTypes - Array of types that a Pokemon has
 * @param selectedTypes - Array of types that have been selected for filtering
 * @returns boolean - true if there are no selected filter types or if any pokemon type matches any selected filter type
 */
export const matchesSelectedTypes = (
  pokemonTypes: string[],
  selectedTypes: string[],
): boolean => {
  if (selectedTypes.length === 0) return true;
  return selectedTypes.some((type) => pokemonTypes.includes(type));
};

/**
 * Converts a Pokemon name to display format (capitalize first letter)
 *
 * @param name - The original pokemon name
 * @returns string - The formatted name with first letter capitalized
 */
export const formatPokemonName = (name: string): string => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1);
};
