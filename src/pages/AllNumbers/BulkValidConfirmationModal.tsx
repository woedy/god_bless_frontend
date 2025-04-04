import React from 'react';

const BulkValidConfirmationModal = ({ isOpen, onConfirm, onCancel, itemId, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg dark:bg-black">
        <h2 className="text-lg font-semibold mb-4">Confirm Bulk Validation</h2>
        <p>Are you sure you want to validate generated numbers? </p>
        <p>This is a background process. Periodically refresh the page to see results. </p>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={() => onConfirm(itemId)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
           {loading ? 'Validating...' : 'Confirm (B)'}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkValidConfirmationModal;
