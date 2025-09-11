import { memo } from "react";
import type { PhotoData } from "../types/PhotoData";
import styles from "../styles/Gallery.module.css";

// --- Memoized integration time calculation ---
const integrationTimeCache = new WeakMap<PhotoData, number>();
const calculateTotalIntegrationTime = (photo: PhotoData) => {
  if (integrationTimeCache.has(photo)) return integrationTimeCache.get(photo)!;
  if (!photo.integrationTimes) return 0;
  const total = Object.values(photo.integrationTimes).reduce((sum, time) => {
    if (time) return sum + time.numberOfPhotos * time.timePerPhoto;
    return sum;
  }, 0);
  integrationTimeCache.set(photo, total);
  return total;
};

const formatIntegrationTime = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  return `${hours}h ${minutes}min`;
};

// --- Memoized PhotoCard component ---
interface PhotoCardProps {
  photo: PhotoData;
  onClick: () => void;
}
const PhotoCard = memo(({ photo, onClick }: PhotoCardProps) => (
  <div className={styles.photoCard} onClick={onClick}>
    <img
      src={`./images/thumbnails/${photo.thumbnailFileName || photo.fileName}`}
      alt={photo.objectName}
      loading="lazy"
    />
    <div className={styles.photoInfo}>
      <h3>{photo.objectName}</h3>
      <p>{formatIntegrationTime(calculateTotalIntegrationTime(photo))}</p>
      <p>{photo.equipment.filters.join(", ")}</p>
    </div>
  </div>
));

export default PhotoCard;
