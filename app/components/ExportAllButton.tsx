'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Loader2, Download } from 'lucide-react';

export default function ExportAllButton() {
  const [isExporting, setIsExporting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const downloadFilename = 'all_contacts.vcf';

  const handleExportAllClick = async () => {
    setIsExporting(true);
    const toastId = toast.loading('Preparing all contacts for export...');
    try {
      const response = await fetch('/api/export-all-vcf');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to export contacts.' }));
        throw new Error(errorData.error || 'Failed to export contacts.');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      setDownloadUrl(url);
      setModalOpen(true);
      toast.success('Your file is ready to download!', { id: toastId });

    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Could not export contacts.';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  const closeModal = () => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    setModalOpen(false);
    setDownloadUrl(null);
  };

  return (
    <>
      <button
        onClick={handleExportAllClick}
        disabled={isExporting}
        className="flex-1 text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-800 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isExporting ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Exporting...
          </>
        ) : (
          'Export All Contacts'
        )}
      </button>

      {modalOpen && downloadUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-800 rounded-lg p-6 w-full max-w-sm text-center shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-2">Export All Ready</h3>
            <p className="text-gray-300 mb-6">Your contacts file is ready to be saved.</p>
            <a
              href={downloadUrl}
              download={downloadFilename}
              onClick={() => setTimeout(closeModal, 500)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-bold"
            >
              <Download size={20} />
              Save to Device
            </a>
            <button
              onClick={closeModal}
              className="w-full mt-3 px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}