import { useState, useEffect, useCallback, useRef } from "react";

import { PokemonResult } from "@/types/Pokemon.types";

const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon";

const initialPokemonData = {
  pokemons: [] as PokemonResult[],
  totalResult: 0,
  status: true,
  pageNo: 0,
  totalPages: 1,
};

const usePokemonData = () => {
  // TODO: remove it later
  const renderAfterCalled = useRef(false);

  const [initialLoader, setInitialLoader] = useState(true);
  const [pokemons, setPokemons] = useState<PokemonResult[]>(
    initialPokemonData.pokemons,
  );
  const [totalResult, setTotalResult] = useState(
    initialPokemonData.totalResult,
  );
  const [pageNo, setPageNo] = useState(initialPokemonData.pageNo);
  const [totalPages, setTotalPages] = useState(initialPokemonData.totalPages);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchData = async (page: number, perPage: number = 6) => {
    try {
      console.log(
        "Fetching data... URL: ",
        `${POKE_API_URL}?limit=${perPage}&offset=${page * perPage}`,
      );
      const response = await fetch(
        `${POKE_API_URL}?limit=${perPage}&offset=${page * perPage}`,
      );
      const resultOld = await response.json();

      const result = {
        pokemons: resultOld?.results,
        totalResult: resultOld?.count,
        status: true,
        pageNo: page,
        totalPages: Math.ceil(resultOld?.count / perPage) || 10,
      };

      if (result.status) {
        setPokemons(
          page === 0 ? result.pokemons : [...pokemons, ...result.pokemons],
        );
        setTotalResult(result.totalResult);
        setPageNo(result.pageNo);
        setTotalPages(result.totalPages);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
      setInitialLoader(false);
    }
  };

  useEffect(() => {
    if (!renderAfterCalled.current) {
      // your API call func
      console.log("usePokemonData fetching data...");
      fetchData(pageNo);
      console.log(
        `usePokemonData fetched data:\n\tPokemons: ${pokemons.length}\n\tTotal Result: ${totalResult}\n\tPage No: ${pageNo}\n\tTotal Pages: ${totalPages}`,
      );
    }

    renderAfterCalled.current = true;
  }, []);

  // Pull-to-refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData(0); // Refresh from the first page
  }, []);

  // Load more data
  const loadMore = () => {
    if (!loadingMore && pageNo < totalPages) {
      setLoadingMore(true);
      fetchData(pageNo + 1);
    }
  };

  return {
    pokemons,
    totalResult,
    refreshing,
    loadingMore,
    handleRefresh,
    loadMore,
    initialLoader,
  };
};

export default usePokemonData;
