import React, { useState } from 'react';
import { Button } from '@keystone-ui/button';
import { PlusIcon } from '@keystone-ui/icons/icons/PlusIcon';
import { List } from '@keystone-6/core/admin-ui/components';
import AddPaperModal from './AddPaperModal';

// This is a custom component for the Papers list
export function CustomPapersList() {
  const [isAddPaperModalOpen, setIsAddPaperModalOpen] = useState(false);

  const handleAddPaperSuccess = () => {
    // Refresh the list after adding a paper
    window.location.reload();
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3>Papers</h3>
        <Button
          size="small"
          tone="positive"
          weight="bold"
          onClick={() => setIsAddPaperModalOpen(true)}
        >
          <PlusIcon size="small" style={{ marginRight: '6px' }} />
          Add from ArXiv
        </Button>
      </div>
      
      <List.CardContainer>
        {/* The default list content */}
        <List.InlineCreate />
      </List.CardContainer>
      
      {isAddPaperModalOpen && (
        <AddPaperModal
          isOpen={isAddPaperModalOpen}
          onClose={() => setIsAddPaperModalOpen(false)}
          onSuccess={handleAddPaperSuccess}
        />
      )}
    </>
  );
}

export default CustomPapersList; 