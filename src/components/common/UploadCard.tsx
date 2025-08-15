"use client";

import { UploadCloud, Upload } from "lucide-react";
import Button from "@/components/ui/Button";

interface UploadCardProps {
  onFilesSelected?: (files: FileList) => void;
}

export default function UploadCard({ onFilesSelected }: UploadCardProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onFilesSelected) onFilesSelected(e.target.files);
  };

  return (
    <div className="bg-gray-50 rounded-xl p-8">
      <div className="border-2 border-dashed border-green-500 rounded-lg p-10 text-center">
        <div className="mx-auto w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-4">
          <UploadCloud className="w-5 h-5 text-green-600" />
        </div>

        <a href="#" className="text-black-900 text-lg block mb-4">
          Upload a file to run a quick scan
        </a>

        <Button
          variant="primary"
          size="md"
          icon={Upload}
          asLabel={true}
          className="mb-4"
        >
          Add Files
          <input type="file" className="hidden" onChange={handleChange} />
        </Button>

        <p className="text-sm text-gray-600">
          To upload multiple files, create a project
        </p>
      </div>
    </div>
  );
}
