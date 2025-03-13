export interface PokemonResult {
  name: string;
  url: string;
}

export interface PokemonResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonResult[];
}

interface PokemonType {
  name: string;
  url: string;
}

interface PokemonTypeSlot {
  slot: number;
  type: PokemonType;
}

interface PokemonStat {
  name: string;
  url: string;
}

interface PokemonStatSlot {
  base_stat: number;
  effort: number;
  stat: PokemonStat;
}

export interface PokemonDetail {
  id: number;
  sprites: {
    front_default: string;
    other: {
      dream_world: {
        front_default: string;
      };
    };
  };
  name: string;
  types: PokemonTypeSlot[];
  weight: number;
  stats: PokemonStatSlot[];
}
