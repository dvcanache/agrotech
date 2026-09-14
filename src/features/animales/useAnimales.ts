import { useState, useMemo, useEffect } from 'react';
import { Animal, EspecieAnimal, ESPECIES_TAXONOMY } from '../../types/animal';
import { useApp } from '../../context/AppContext';
import { AnimalesFilterValues } from './components/AnimalesFilterDrawer';

export const INITIAL_ANIMALES_FILTERS: AnimalesFilterValues = {
  especies: [],
  categorias: [],
  estatus: [],
  lotes: [],
  raza: 'Todas las razas'
};

export const matchesSubcategoria = (animal: Animal, subcat: string): boolean => {
  if (subcat === 'Todas' || !subcat || subcat === 'Todas las subcategorías') return true;
  if (animal.subcategoria === subcat) return true;
  if (animal.categoria === subcat) return true;

  // Aliases and singular/plural matchers
  if (subcat === 'Vacas') return ['Vaca', 'Vacas'].includes(animal.categoria);
  if (subcat === 'Novillas') return ['Novilla', 'Novillas'].includes(animal.categoria);
  if (subcat === 'Mautas / Mautes') return ['Mauta', 'Maute', 'Mautas / Mautes'].includes(animal.categoria) || ['Mauta', 'Maute', 'Mautas / Mautes'].includes(animal.subcategoria || '');
  if (subcat === 'Becerros / Becerras') return ['Becerra', 'Becerro', 'Becerros / Becerras'].includes(animal.categoria) || ['Becerra', 'Becerro', 'Becerros / Becerras'].includes(animal.subcategoria || '');
  if (subcat === 'Toros') return ['Toro', 'Toros'].includes(animal.categoria);
  if (subcat === 'Búfalas') return ['Búfala', 'Búfalas'].includes(animal.categoria);
  if (subcat === 'Bubillas') return ['Bubilla', 'Bubillas'].includes(animal.categoria);
  if (subcat === 'Bucerros / Bucerras') return ['Bucerro', 'Bucerra', 'Bucerros / Bucerras'].includes(animal.categoria);
  if (subcat === 'Padrotes / Búfalos de Ceba') return ['Padrote', 'Búfalo de Ceba', 'Padrotes / Búfalos de Ceba'].includes(animal.categoria);
  if (subcat === 'Cabras Lecheras') return ['Cabra', 'Cabra Lechera', 'Cabras Lecheras'].includes(animal.categoria);
  if (subcat === 'Cabritonas / Cabritos') return ['Cabritona', 'Cabrito', 'Cabritonas / Cabritos'].includes(animal.categoria);
  if (subcat === 'Chivos Reproductores') return ['Chivo', 'Chivo Reproductor', 'Chivos Reproductores'].includes(animal.categoria);
  if (subcat === 'Caprinos de Ceba') return ['Caprino de Ceba', 'Caprinos de Ceba'].includes(animal.categoria);
  if (subcat === 'Yeguas') return ['Yegua', 'Yeguas'].includes(animal.categoria);
  if (subcat === 'Potros / Potrancas') return ['Potro', 'Potranca', 'Potros / Potrancas'].includes(animal.categoria);
  if (subcat === 'Caballos') return ['Caballo', 'Caballos'].includes(animal.categoria);
  if (subcat === 'Padrillos / Sementales') return ['Padrillo', 'Semental', 'Padrillos / Sementales'].includes(animal.categoria);

  return false;
};

export const matchesEspecie = (animal: Animal, especie: string): boolean => {
  if (especie === 'Todas' || !especie || especie === 'Todas las especies' || especie === 'Todos los animales') return true;
  if (animal.especie === especie) return true;
  
  // Lookup taxonomy subcategories if especie not set directly
  const tax = ESPECIES_TAXONOMY[especie as EspecieAnimal];
  if (tax) {
    if (tax.subcategorias.includes(animal.categoria) || (animal.subcategoria && tax.subcategorias.includes(animal.subcategoria))) {
      return true;
    }
  }
  return false;
};

export const useAnimales = (itemsPerPage = 10) => {
  const { searchQuery, animals, addAnimal, updateAnimal, deleteAnimalsBatch } = useApp();
  const [selectedAnimals, setSelectedAnimals] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEspecie, setSelectedEspecie] = useState<string>('Todas');
  const [selectedSubcategoria, setSelectedSubcategoria] = useState<string>('Todas');
  const [quickFilter, setQuickFilter] = useState('Todos los animales');
  const [advancedFilters, setAdvancedFilters] = useState<AnimalesFilterValues>(INITIAL_ANIMALES_FILTERS);

  // Sync quickFilter with species & subcategory
  const handleSetEspecie = (esp: string) => {
    setSelectedEspecie(esp);
    setSelectedSubcategoria('Todas');
    setQuickFilter(esp === 'Todas' ? 'Todos los animales' : esp);
  };

  const handleSetSubcategoria = (subcat: string) => {
    setSelectedSubcategoria(subcat);
    if (subcat !== 'Todas' && subcat !== 'Todas las subcategorías') {
      setQuickFilter(subcat);
      // Auto-detect species if not set or set to 'Todas'
      if (selectedEspecie === 'Todas') {
        for (const [espKey, tax] of Object.entries(ESPECIES_TAXONOMY)) {
          if (tax.subcategorias.includes(subcat)) {
            setSelectedEspecie(espKey);
            break;
          }
        }
      }
    } else {
      setQuickFilter(selectedEspecie === 'Todas' ? 'Todos los animales' : selectedEspecie);
    }
  };

  const handleSetQuickFilter = (opt: string) => {
    setQuickFilter(opt);
    if (opt === 'Todos los animales') {
      setSelectedEspecie('Todas');
      setSelectedSubcategoria('Todas');
    } else if (Object.keys(ESPECIES_TAXONOMY).includes(opt)) {
      setSelectedEspecie(opt);
      setSelectedSubcategoria('Todas');
    } else if (['Activos', 'Inactivos'].includes(opt)) {
      // Keep especie as is, just quick filter status
    } else {
      // It might be a subcategory
      setSelectedSubcategoria(opt);
      for (const [espKey, tax] of Object.entries(ESPECIES_TAXONOMY)) {
        if (tax.subcategorias.includes(opt)) {
          setSelectedEspecie(espKey);
          break;
        }
      }
    }
  };

  // Filter animals based on search query, species, subcategory, quick filter, and advanced drawer filters
  const filteredAnimals = useMemo(() => {
    return animals.filter(animal => {
      // 1. Global / Topbar Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          animal.practico.toLowerCase().includes(q) ||
          animal.unico.toLowerCase().includes(q) ||
          animal.categoria.toLowerCase().includes(q) ||
          (animal.especie && animal.especie.toLowerCase().includes(q)) ||
          (animal.subcategoria && animal.subcategoria.toLowerCase().includes(q)) ||
          animal.lote.toLowerCase().includes(q) ||
          animal.composicion.toLowerCase().includes(q) ||
          animal.descripcion.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // 2. Species Filter
      if (selectedEspecie !== 'Todas' && selectedEspecie !== 'Todas las especies') {
        if (!matchesEspecie(animal, selectedEspecie)) return false;
      }

      // 3. Subcategory Filter
      if (selectedSubcategoria !== 'Todas' && selectedSubcategoria !== 'Todas las subcategorías') {
        if (!matchesSubcategoria(animal, selectedSubcategoria)) return false;
      }

      // 4. Quick Filter for Status
      if (quickFilter === 'Activos' && animal.estatus !== 'Activo') return false;
      if (quickFilter === 'Inactivos' && animal.estatus !== 'Inactivo') return false;

      // 5. Advanced Drawer Filters
      if (advancedFilters.especies && advancedFilters.especies.length > 0) {
        const espMatch = animal.especie ? advancedFilters.especies.includes(animal.especie) : false;
        if (!espMatch) return false;
      }

      if (advancedFilters.categorias.length > 0) {
        const catMatch = advancedFilters.categorias.some(cat => 
          matchesSubcategoria(animal, cat) || animal.categoria === cat
        );
        if (!catMatch) return false;
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
  }, [animals, searchQuery, selectedEspecie, selectedSubcategoria, quickFilter, advancedFilters]);

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
    setSelectedEspecie('Todas');
    setSelectedSubcategoria('Todas');
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

  const selectedCount = useMemo(() => {
    return Object.values(selectedAnimals).filter(Boolean).length;
  }, [selectedAnimals]);

  const deleteSelectedAnimals = () => {
    const selectedPracticos = Object.entries(selectedAnimals)
      .filter(([_, isSel]) => isSel)
      .map(([practico]) => practico);
    if (selectedPracticos.length === 0) return;
    deleteAnimalsBatch(selectedPracticos);
    setSelectedAnimals({});
  };

  return {
    animals: filteredAnimals,
    allAnimals: animals,
    currentItems,
    selectedAnimals,
    selectedCount,
    isSelectAll,
    currentPage,
    totalPages,
    pages,
    itemsPerPage,
    selectedEspecie,
    setSelectedEspecie: handleSetEspecie,
    selectedSubcategoria,
    setSelectedSubcategoria: handleSetSubcategoria,
    quickFilter,
    setQuickFilter: handleSetQuickFilter,
    advancedFilters,
    setAdvancedFilters,
    activeFilterCount,
    resetAllFilters,
    toggleSelectAll,
    toggleSelect,
    setPage,
    deleteSelectedAnimals
  };
};
