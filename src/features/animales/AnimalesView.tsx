import React, { useState } from 'react';
import { useAnimales } from './useAnimales';
import { AnimalesToolbar } from './components/AnimalesToolbar';
import { AnimalesTable } from './components/AnimalesTable';
import { AnimalesPagination } from './components/AnimalesPagination';
import { AnimalesFilterDrawer } from './components/AnimalesFilterDrawer';
import { FichaAnimal360 } from './components/FichaAnimal360';
import { NuevoAnimalModal } from './components/NuevoAnimalModal';
import { NuevoEventoModal, EventoItem } from '../eventos/components/NuevoEventoModal';
import { Animal } from '../../types/animal';
import { useApp } from '../../context/AppContext';
import { exportToCSV } from '../reportes/utils/exportUtils';

export const AnimalesView: React.FC = () => {
  const { addAnimal } = useApp();
  const {
    animals,
    allAnimals,
    currentItems,
    selectedAnimals,
    selectedCount,
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
    setPage,
    deleteSelectedAnimals
  } = useAnimales(10);

  const [selectedAnimalForModal, setSelectedAnimalForModal] = useState<Animal | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isNuevoAnimalModalOpen, setIsNuevoAnimalModalOpen] = useState(false);
  
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

  const handleExport = () => {
    const headers = ['Práctico', 'Único', 'Especie', 'Categoría', 'Estatus', 'Lote', 'Raza / Composición', 'Edad', 'Peso (kg)', 'Padre', 'Madre'];
    const rows = animals.map(a => [
      a.practico,
      a.unico,
      a.especie || 'Bovinos',
      a.subcategoria || a.categoria,
      a.estatus,
      a.lote,
      `${a.composicion} ${a.racial || ''}`.trim(),
      a.edad,
      a.pesoKg || '',
      a.padre,
      a.madre
    ]);
    exportToCSV('inventario_animales', headers, rows);
  };

  const handleDeleteSelected = () => {
    if (selectedCount === 0) return;
    const confirmDelete = window.confirm(`¿Está seguro de que desea eliminar ${selectedCount} semoviente(s) seleccionado(s)? Esta acción actualizará el inventario.`);
    if (confirmDelete) {
      deleteSelectedAnimals();
    }
  };

  const handleSaveNuevoAnimal = (nuevo: Animal) => {
    addAnimal(nuevo);
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
        selectedCount={selectedCount}
        onDeleteSelected={handleDeleteSelected}
        onOpenNuevoAnimalModal={() => setIsNuevoAnimalModalOpen(true)}
        onExport={handleExport}
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

      {/* Modal para Registrar Nuevo Semoviente */}
      <NuevoAnimalModal
        isOpen={isNuevoAnimalModalOpen}
        onClose={() => setIsNuevoAnimalModalOpen(false)}
        onSave={handleSaveNuevoAnimal}
        defaultEspecie={selectedEspecie}
        defaultSubcategoria={selectedSubcategoria}
      />
    </div>
  );
};

