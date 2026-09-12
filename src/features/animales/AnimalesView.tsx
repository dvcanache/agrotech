import React, { useState } from 'react';
import { useAnimales } from './useAnimales';
import { AnimalesToolbar } from './components/AnimalesToolbar';
import { AnimalesTable } from './components/AnimalesTable';
import { AnimalesPagination } from './components/AnimalesPagination';
import { AnimalesFilterDrawer } from './components/AnimalesFilterDrawer';
import { FichaAnimalModal, AnimalModalData } from '../reportes/animales/components/FichaAnimalModal';
import { Animal } from '../../types/animal';

export const AnimalesView: React.FC = () => {
  const {
    animals,
    currentItems,
    selectedAnimals,
    isSelectAll,
    currentPage,
    totalPages,
    pages,
    quickFilter,
    setQuickFilter,
    advancedFilters,
    setAdvancedFilters,
    activeFilterCount,
    resetAllFilters,
    toggleSelectAll,
    toggleSelect,
    setPage
  } = useAnimales(10);

  const [selectedAnimalForModal, setSelectedAnimalForModal] = useState<AnimalModalData | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const handleSelectAnimal = (animal: Animal) => {
    const modalData: AnimalModalData = {
      practico: animal.practico,
      unico: animal.unico || animal.practico,
      categoria: (['Vaca', 'Novilla', 'Mauta', 'Becerra', 'Toro', 'Maute', 'Becerro', 'Novillo'].includes(animal.categoria)
        ? animal.categoria
        : 'Vaca') as any,
      estatus: animal.estatus === 'Activo' ? 'Activo' : 'Inactivo',
      lote: animal.lote || 'Lote 01',
      raza: animal.composicion ? `${animal.composicion} ${animal.racial || ''}`.trim() : 'Brahman x Pardo',
      estatusReproductivo: animal.categoria === 'Vaca' ? 'Preñada' : 'Vacía',
      estatusProductivo: animal.categoria === 'Vaca' ? 'Ordeño' : 'Seca',
      partos: animal.categoria === 'Vaca' ? 2 : 0,
      ultimoParto: animal.categoria === 'Vaca' ? '2025-08-14' : undefined,
      ultimoServicio: '2025-11-20',
      reproductor: animal.padre || 'SM01 - Toro Supremo',
      fechaProximoParto: animal.categoria === 'Vaca' ? '2026-08-28' : undefined,
      diasParida: animal.categoria === 'Vaca' ? 145 : undefined,
      pesoKg: 465
    };
    setSelectedAnimalForModal(modalData);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      <AnimalesToolbar
        quickFilter={quickFilter}
        onQuickFilterChange={setQuickFilter}
        onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
        activeFilterCount={activeFilterCount}
      />
      <div className="data-table-container">
        <AnimalesTable
          items={currentItems}
          selectedAnimals={selectedAnimals}
          isSelectAll={isSelectAll}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelect={toggleSelect}
          onSelectAnimal={handleSelectAnimal}
        />
        <AnimalesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={animals.length}
          pages={pages}
          onPageChange={setPage}
        />
      </div>

      {/* Filter Drawer */}
      <AnimalesFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={advancedFilters}
        onFilterChange={setAdvancedFilters}
        onReset={resetAllFilters}
      />

      <FichaAnimalModal
        isOpen={!!selectedAnimalForModal}
        animal={selectedAnimalForModal}
        onClose={() => setSelectedAnimalForModal(null)}
      />
    </div>
  );
};

