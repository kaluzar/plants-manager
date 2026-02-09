/**
 * PhotoGallery component for displaying plant photos
 */

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import type { Photo } from '@/types/photo';
import { photoService } from '@/services/photoService';

interface PhotoGalleryProps {
  photos: Photo[];
  onDelete?: (photoId: string) => void;
}

export function PhotoGallery({ photos, onDelete }: PhotoGalleryProps) {
  if (photos.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        <p>No photos uploaded yet.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <Card key={photo.id} className="overflow-hidden">
          <div className="aspect-square relative">
            <img
              src={photoService.getPhotoUrl(photo.id, true)}
              alt={photo.caption || photo.original_filename}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-3 space-y-2">
            {photo.caption && (
              <p className="text-sm line-clamp-2">{photo.caption}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {format(new Date(photo.created_at), 'MMM d, yyyy')}
            </p>
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(photo.id)}
                className="w-full"
              >
                Delete
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
