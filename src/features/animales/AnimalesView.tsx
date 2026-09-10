import React from 'react';
import { useAnimales } from './useAnimales';
import { AnimalesToolbar } from './components/AnimalesToolbar';
import { AnimalesTable } from './components/AnimalesTable';
import { AnimalesPagination } from './components/AnimalesPagination';

export const AnimalesView: React.FC = () => {
  const {
    animals,
    currentItems,
    selectedAnimals,
    isSelectAll,
    currentPage,
    totalPages,
    pages,
    toggleSelectAll,
    toggleSelect,
    setPage
  } = useAnimales(10);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      <AnimalesToolbar />
      <div className="data-table-container">
        <AnimalesTable
          items={currentItems}
          selectedAnimals={selectedAnimals}
          isSelectAll={isSelectAll}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelect={toggleSelect}
        />
        <AnimalesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={animals.length}
          pages={pages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};
