import { memo } from "react";
import type { PhotoData } from "../types/PhotoData";
import styles from "../styles/Gallery.module.css";
import { getTotalIntegrationSeconds } from "../utils/integrationTime";

// --- Memoized integration time calculation ---
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
      src={`./images/thumbnails/${photo.variants?.[0]?.thumbnailFileName || photo.thumbnailFileName || photo.variants?.[0]?.fileName || photo.fileName}`}
      alt={photo.objectName}
      loading="lazy"
    />
    <div className={styles.photoInfo}>
      <h3>{photo.objectName}</h3>
      <p>{formatIntegrationTime(getTotalIntegrationSeconds(photo))}</p>
      <p>{photo.equipment.filters.join(", ")}</p>
    </div>
  </div>
));

export default PhotoCard;
