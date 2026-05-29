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

  const openFullResImage = () => {
    window.open(`./images/${currentPhoto.fileName}`, "_blank");
  };

  const handleOverlayClick = () => {
    const isMobile = window.matchMedia("(max-width: 1024px)").matches;
    if (!isMobile) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    // Prevent scrolling on background
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "";
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
      <div className={styles.overlay} onClick={handleOverlayClick}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <button className={styles.mobileCloseButton} onClick={onClose}>
          Close
        </button>
        <button className={styles.fullResButton} onClick={openFullResImage}>
          ⛶
        </button>

        <div
          className={styles.screenTouchAreaLeft}
          onClick={(e) => handleTouchArea(e, "left")}
        />
        <div
          className={styles.screenTouchAreaRight}
          onClick={(e) => handleTouchArea(e, "right")}
        />

        <div className={styles.contentWrapper}>
          <button
            className={`${styles.navButton} ${styles.navButtonLeft} ${
              currentIndex <= 0 ? styles.hidden : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (currentIndex > 0) onNavigate(currentIndex - 1);
            }}
          >
            &lt;
          </button>
          <div className={styles.navigation}>

            <div
              className={styles.photoContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`./images/${currentPhoto.fileName}`}
                alt={currentPhoto.objectName}
              />
            </div>

          </div>
          <button
            className={`${styles.navButton} ${styles.navButtonRight} ${
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

          <div className={styles.photoDetails} onClick={(e) => e.stopPropagation()}>
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

            <div className={styles.downloadSection}>
              <a
                href={`./images/${currentPhoto.fileName}`}
                download={currentPhoto.fileName}
                className={styles.downloadLink}
              >
                Download Full Resolution
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoViewer;
