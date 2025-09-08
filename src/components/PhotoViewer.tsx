import { useEffect, useCallback } from "react";
import type { PhotoData, IntegrationTime } from "../types/PhotoData";
import styles from "../styles/PhotoViewer.module.css";

interface PhotoViewerProps {
  photos: PhotoData[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const PhotoViewer = ({
  photos,
  currentIndex,
  onClose,
  onNavigate,
}: PhotoViewerProps) => {
  const currentPhoto = photos[currentIndex];

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowRight") {
        if (currentIndex < photos.length - 1) {
          onNavigate(currentIndex + 1);
        }
      } else if (event.key === "ArrowLeft") {
        if (currentIndex > 0) {
          onNavigate(currentIndex - 1);
        }
      }
    },
    [currentIndex, onClose, onNavigate, photos.length]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const formatIntegrationTime = (time: IntegrationTime) => {
    const totalSeconds = time.numberOfPhotos * time.timePerPhoto;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${time.numberOfPhotos}x${time.timePerPhoto}s (${hours}h ${minutes}min)`;
  };

  return (
    <div className={styles.viewer}>
      <div className={styles.overlay} onClick={onClose}>
        <button className={styles.closeButton}>×</button>

        <div className={styles.navigation}>
          {currentIndex > 0 && (
            <button
              className={styles.navButton}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(currentIndex - 1);
              }}
            >
              &lt;
            </button>
          )}

          <div
            className={styles.photoContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`/images/${currentPhoto.fileName}`}
              alt={currentPhoto.objectName}
            />
            <div className={styles.photoDetails}>
              <h2>{currentPhoto.objectName}</h2>
              <p>Date: {new Date(currentPhoto.date).toLocaleDateString()}</p>
              <p>Filters: {currentPhoto.equipment.filters.join(", ")}</p>

              <div className={styles.integrationTimes}>
                <h3>Integration Times:</h3>
                {Object.entries(currentPhoto.integrationTimes).map(
                  ([filter, time]) =>
                    time && (
                      <p key={filter}>
                        {filter}: {formatIntegrationTime(time)}
                      </p>
                    )
                )}
              </div>

              <div className={styles.equipment}>
                <h3>Equipment:</h3>
                <p>Telescope: {currentPhoto.equipment.telescope}</p>
                <p>Camera: {currentPhoto.equipment.camera}</p>
                <p>Mount: {currentPhoto.equipment.mount}</p>
              </div>
            </div>
          </div>

          {currentIndex < photos.length - 1 && (
            <button
              className={styles.navButton}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(currentIndex + 1);
              }}
            >
              &gt;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoViewer;
