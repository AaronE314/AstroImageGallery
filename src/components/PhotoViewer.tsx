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
    [currentIndex, photos.length, onClose, onNavigate]
  );

  const handleTouchArea = (
    e: React.MouseEvent,
    direction: "left" | "right"
  ) => {
    e.stopPropagation();
    if (direction === "left" && currentIndex > 0) {
      onNavigate(currentIndex - 1);
    } else if (direction === "right" && currentIndex < photos.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

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
        <button className={styles.closeButton}>&times;</button>

        <div className={styles.contentWrapper}>
          <div className={styles.navigation}>
            <button
              className={`${styles.navButton} ${
                currentIndex <= 0 ? styles.hidden : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (currentIndex > 0) onNavigate(currentIndex - 1);
              }}
            >
              &lt;
            </button>

            <div
              className={styles.photoContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={styles.touchAreaLeft}
                onClick={(e) => handleTouchArea(e, "left")}
              />
              <img
                src={`./images/${currentPhoto.fileName}`}
                alt={currentPhoto.objectName}
              />
              <div
                className={styles.touchAreaRight}
                onClick={(e) => handleTouchArea(e, "right")}
              />
            </div>

            <button
              className={`${styles.navButton} ${
                currentIndex >= photos.length - 1 ? styles.hidden : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (currentIndex < photos.length - 1)
                  onNavigate(currentIndex + 1);
              }}
            >
              &gt;
            </button>
          </div>

          <div className={styles.photoDetails}>
            <h2>{currentPhoto.objectName}</h2>
            <p>Date: {new Date(currentPhoto.date).toLocaleDateString()}</p>
            <p>Filters: {currentPhoto.equipment.filters.join(", ")}</p>

            {currentPhoto.integrationTimes ? (
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
            ) : null}

            <div className={styles.equipment}>
              <h3>Equipment:</h3>
              <p>Telescope: {currentPhoto.equipment.telescope}</p>
              <p>Camera: {currentPhoto.equipment.camera}</p>
              <p>Mount: {currentPhoto.equipment.mount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoViewer;
