/**
 * PhotoUpload component for uploading plant photos
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export interface PhotoUploadData {
  file: File;
  caption?: string;
}

interface PhotoUploadProps {
  onSubmit: (data: PhotoUploadData) => void;
  onCancel: () => void;
  isUploading?: boolean;
}

export function PhotoUpload({ onSubmit, onCancel, isUploading }: PhotoUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    onSubmit({
      file,
      caption: caption.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* File Input */}
      <div className="space-y-2">
        <Label htmlFor="photo">Photo *</Label>
        <Input
          id="photo"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
          disabled={isUploading}
        />
      </div>

      {/* Preview */}
      {preview && (
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="border rounded-lg p-2">
            <img
              src={preview}
              alt="Preview"
              className="max-w-full h-auto max-h-64 mx-auto"
            />
          </div>
        </div>
      )}

      {/* Caption */}
      <div className="space-y-2">
        <Label htmlFor="caption">Caption</Label>
        <Textarea
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption for this photo..."
          rows={3}
          disabled={isUploading}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isUploading}>
          Cancel
        </Button>
        <Button type="submit" disabled={!file || isUploading}>
          {isUploading ? 'Uploading...' : 'Upload Photo'}
        </Button>
      </div>
    </form>
  );
}
