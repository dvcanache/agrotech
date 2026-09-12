import { useState, useMemo, useEffect } from 'react';
import { Animal } from '../../types/animal';
import { useApp } from '../../context/AppContext';
import { AnimalesFilterValues } from './components/AnimalesFilterDrawer';

export const INITIAL_ANIMALES_FILTERS: AnimalesFilterValues = {
  categorias: [],
  estatus: [],
  lotes: [],
  raza: 'Todas las razas'
};

export const useAnimales = (itemsPerPage = 10) => {
  const { searchQuery, animals, addAnimal, updateAnimal } = useApp();
  const [selectedAnimals, setSelectedAnimals] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [quickFilter, setQuickFilter] = useState('Todos los animales');
  const [advancedFilters, setAdvancedFilters] = useState<AnimalesFilterValues>(INITIAL_ANIMALES_FILTERS);

  // Filter animals based on search query, quick filter, and advanced drawer filters
  const filteredAnimals = useMemo(() => {
    return animals.filter(animal => {
      // 1. Global / Topbar Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          animal.practico.toLowerCase().includes(q) ||
          animal.unico.toLowerCase().includes(q) ||
          animal.categoria.toLowerCase().includes(q) ||
          animal.lote.toLowerCase().includes(q) ||
          animal.composicion.toLowerCase().includes(q) ||
          animal.descripcion.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // 2. Quick Selector Dropdown
      if (quickFilter !== 'Todos los animales') {
        if (quickFilter === 'Vacas' && animal.categoria !== 'Vaca') return false;
        if (quickFilter === 'Novillas' && animal.categoria !== 'Novilla') return false;
        if (quickFilter === 'Mautas / Mautes' && !['Mauta', 'Maute'].includes(animal.categoria)) return false;
        if (quickFilter === 'Becerros / Becerras' && !['Becerra', 'Becerro'].includes(animal.categoria)) return false;
        if (quickFilter === 'Toros' && animal.categoria !== 'Toro') return false;
        if (quickFilter === 'Activos' && animal.estatus !== 'Activo') return false;
        if (quickFilter === 'Inactivos' && animal.estatus !== 'Inactivo') return false;
      }

      // 3. Advanced Drawer Filters
      if (advancedFilters.categorias.length > 0 && !advancedFilters.categorias.includes(animal.categoria)) {
        return false;
      }

      if (advancedFilters.estatus.length > 0 && !advancedFilters.estatus.includes(animal.estatus)) {
        return false;
      }

      if (advancedFilters.lotes.length > 0 && !advancedFilters.lotes.includes(animal.lote)) {
        return false;
      }

      if (advancedFilters.raza !== 'Todas las razas') {
        const animalRaza = (animal.composicion || '') + ' ' + (animal.racial || '');
        if (!animalRaza.toLowerCase().includes(advancedFilters.raza.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [animals, searchQuery, quickFilter, advancedFilters]);

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, quickFilter, advancedFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredAnimals.length / itemsPerPage));

  // Current page items
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAnimals.slice(start, start + itemsPerPage);
  }, [filteredAnimals, currentPage, itemsPerPage]);

  // Active filters count for badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (quickFilter !== 'Todos los animales') count++;
    if (advancedFilters.categorias.length > 0) count++;
    if (advancedFilters.estatus.length > 0) count++;
    if (advancedFilters.lotes.length > 0) count++;
    if (advancedFilters.raza !== 'Todas las razas') count++;
    return count;
  }, [quickFilter, advancedFilters]);

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

  const resetAllFilters = () => {
    setQuickFilter('Todos los animales');
    setAdvancedFilters(INITIAL_ANIMALES_FILTERS);
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
    quickFilter,
    setQuickFilter,
    advancedFilters,
    setAdvancedFilters,
    activeFilterCount,
    resetAllFilters,
    toggleSelectAll,
    toggleSelect,
    setPage
  };
};
