import { useState, useMemo } from "react";
import type { PhotoData } from "../types/PhotoData";
import PhotoViewer from "./PhotoViewer";
import styles from "../styles/Gallery.module.css";
import PhotoCard from "./PhotoCard";

interface GalleryProps {
  photos: PhotoData[];
}

type SortOption = "date" | "name" | "integrationTime" | "equipment";

const Gallery = ({ photos }: GalleryProps) => {
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );

  const sortedPhotos: PhotoData[] = useMemo(() => {
    return [...photos].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "name":
          return a.objectName.localeCompare(b.objectName);
        case "integrationTime":
          return (
            calulateTotalIntegrationTime(b) - calulateTotalIntegrationTime(a)
          );
        case "equipment":
          return a.equipment.camera.localeCompare(b.equipment.camera);
        default:
          return 0;
      }
    });
  }, [photos, sortBy]);

  const calulateTotalIntegrationTime = (photo: PhotoData) => {
    if (!photo.integrationTimes) return 0;

    return Object.values(photo.integrationTimes).reduce((total, time) => {
      if (time) {
        return total + time.numberOfPhotos * time.timePerPhoto;
      }
      return total;
    }, 0);
  };

  return (
    <div className={styles.gallery}>
      <div className={styles.controls}>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className={styles.sortSelect}
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="integrationTime">Sort by Integration Time</option>
          <option value="equipment">Sort by Equipment</option>
        </select>
      </div>

      <div className={styles.grid}>
        {sortedPhotos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onClick={() => setSelectedPhotoIndex(index)}
          />
        ))}
      </div>

      {selectedPhotoIndex !== null && (
        <PhotoViewer
          photos={sortedPhotos}
          currentIndex={selectedPhotoIndex}
          onClose={() => setSelectedPhotoIndex(null)}
          onNavigate={setSelectedPhotoIndex}
        />
      )}
    </div>
  );
};

export default Gallery;
