import React, { useState } from 'react';
import { useAnimales } from './useAnimales';
import { AnimalesToolbar } from './components/AnimalesToolbar';
import { AnimalesTable } from './components/AnimalesTable';
import { AnimalesPagination } from './components/AnimalesPagination';
import { AnimalesFilterDrawer } from './components/AnimalesFilterDrawer';
import { FichaAnimal360 } from './components/FichaAnimal360';
import { NuevoEventoModal, EventoItem } from '../eventos/components/NuevoEventoModal';
import { Animal } from '../../types/animal';

export const AnimalesView: React.FC = () => {
  const {
    animals,
    allAnimals,
    currentItems,
    selectedAnimals,
    isSelectAll,
    currentPage,
    totalPages,
    pages,
    selectedEspecie,
    setSelectedEspecie,
    selectedSubcategoria,
    setSelectedSubcategoria,
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

  const [selectedAnimalForModal, setSelectedAnimalForModal] = useState<Animal | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  // Quick Event Modal state from Ficha 360
  const [isEventoModalOpen, setIsEventoModalOpen] = useState(false);
  const [eventoAnimalPractico, setEventoAnimalPractico] = useState<string>('');

  const handleSelectAnimal = (animal: Animal) => {
    setSelectedAnimalForModal(animal);
  };

  const handleOpenNuevoEvento = (animalPractico: string) => {
    setEventoAnimalPractico(animalPractico);
    setIsEventoModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      <AnimalesToolbar
        selectedEspecie={selectedEspecie}
        onEspecieChange={setSelectedEspecie}
        selectedSubcategoria={selectedSubcategoria}
        onSubcategoriaChange={setSelectedSubcategoria}
        quickFilter={quickFilter}
        onQuickFilterChange={setQuickFilter}
        onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
        activeFilterCount={activeFilterCount}
        allAnimals={allAnimals}
        onResetFilters={resetAllFilters}
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

      {/* Expediente 360° del Semoviente (Animal 360 & Biometrics Dossier) */}
      <FichaAnimal360
        isOpen={!!selectedAnimalForModal}
        animal={selectedAnimalForModal}
        onClose={() => setSelectedAnimalForModal(null)}
        onOpenNuevoEvento={handleOpenNuevoEvento}
      />

      {/* Modal de Registro de Evento Rápido */}
      {isEventoModalOpen && (
        <NuevoEventoModal
          isOpen={isEventoModalOpen}
          onClose={() => setIsEventoModalOpen(false)}
          tipoInicial="Revisiones"
          categoriaInicial="Reproductivos"
          codigoAnimalInicial={eventoAnimalPractico}
          onSave={(_nuevoEvento: EventoItem) => {
            setIsEventoModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

