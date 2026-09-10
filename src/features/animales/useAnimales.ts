import { useState, useMemo } from 'react';
import { Animal } from '../../types/animal';
import { generateAnimals } from './animalesData';
import { useApp } from '../../context/AppContext';

export const useAnimales = (itemsPerPage = 10) => {
  const { searchQuery } = useApp();
  const [animals] = useState<Animal[]>(() => generateAnimals(49));
  const [selectedAnimals, setSelectedAnimals] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);

  // Filter animals based on search query
  const filteredAnimals = useMemo(() => {
    if (!searchQuery.trim()) return animals;
    const q = searchQuery.toLowerCase().trim();
    return animals.filter(
      animal =>
        animal.practico.toLowerCase().includes(q) ||
        animal.unico.toLowerCase().includes(q) ||
        animal.categoria.toLowerCase().includes(q) ||
        animal.lote.toLowerCase().includes(q) ||
        animal.composicion.toLowerCase().includes(q) ||
        animal.descripcion.toLowerCase().includes(q)
    );
  }, [animals, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredAnimals.length / itemsPerPage));

  // Current page items
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAnimals.slice(start, start + itemsPerPage);
  }, [filteredAnimals, currentPage, itemsPerPage]);

  // Is all current page items selected?
  const isSelectAll = useMemo(() => {
    if (currentItems.length === 0) return false;
    return currentItems.every(a => !!selectedAnimals[a.practico]);
  }, [currentItems, selectedAnimals]);

  const toggleSelectAll = () => {
    const nextState = !isSelectAll;
    setSelectedAnimals(prev => {
      const updated = { ...prev };
      currentItems.forEach(item => {
        updated[item.practico] = nextState;
      });
      return updated;
    });
  };

  const toggleSelect = (practico: string) => {
    setSelectedAnimals(prev => ({
      ...prev,
      [practico]: !prev[practico]
    }));
  };

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const pages = useMemo(() => {
    const list: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      list.push(i);
    }
    return list;
  }, [totalPages]);

  return {
    animals: filteredAnimals,
    currentItems,
    selectedAnimals,
    isSelectAll,
    currentPage,
    totalPages,
    pages,
    itemsPerPage,
    toggleSelectAll,
    toggleSelect,
    setPage
  };
};
