import { useEffect, useCallback, useState } from "react";
import type { PhotoData, IntegrationTime } from "../types/PhotoData";
import styles from "../styles/PhotoViewer.module.css";
import { getTotalIntegrationSeconds } from "../utils/integrationTime";

interface PhotoViewerProps {
  photos: PhotoData[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

interface IntegrationDetail {
  date?: string;
  time: IntegrationTime;
}

const PhotoViewer = ({
  photos,
  currentIndex,
  onClose,
  onNavigate,
}: PhotoViewerProps) => {
  const currentPhoto = photos[currentIndex];
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const imageVariants = currentPhoto.variants?.length
    ? currentPhoto.variants
    : [{ label: "Original", fileName: currentPhoto.fileName }];
  const selectedVariant = imageVariants[selectedVariantIndex] ?? imageVariants[0];

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
    window.open(`./images/${selectedVariant.fileName}`, "_blank");
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

  useEffect(() => {
    setSelectedVariantIndex(0);
  }, [currentPhoto.id]);

  const formatIntegrationTime = (time: IntegrationTime) => {
    const totalSeconds = time.numberOfPhotos * time.timePerPhoto;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${time.numberOfPhotos}x${time.timePerPhoto}s (${hours}h ${minutes}min)`;
  };
  const captureDates = currentPhoto.dates?.length
    ? currentPhoto.dates
    : [currentPhoto.date];
  const totalIntegrationSeconds = getTotalIntegrationSeconds(currentPhoto);
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}min`;
  };
  const integrationTotalsByDate = currentPhoto.integrationTimesByDate
    ? Array.from(
      new Set([
        ...captureDates,
        ...Object.keys(currentPhoto.integrationTimesByDate),
      ]),
      (date) => ({
        date,
        totalSeconds: Object.values(
          currentPhoto.integrationTimesByDate?.[date] ?? {}
        ).reduce(
          (total, time) =>
            total + (time ? time.numberOfPhotos * time.timePerPhoto : 0),
          0
        ),
      })
    )
    : currentPhoto.integrationTimes
      ? [{ date: currentPhoto.date, totalSeconds: totalIntegrationSeconds }]
      : [];
  const integrationDetailsByFilter = new Map<string, IntegrationDetail[]>();

  if (currentPhoto.integrationTimesByDate) {
    Object.entries(currentPhoto.integrationTimesByDate).forEach(([date, times]) => {
      Object.entries(times).forEach(([filter, time]) => {
        if (!time) return;
        const details = integrationDetailsByFilter.get(filter) ?? [];
        details.push({ date, time });
        integrationDetailsByFilter.set(filter, details);
      });
    });
  } else {
    Object.entries(currentPhoto.integrationTimes ?? {}).forEach(([filter, time]) => {
      if (time) integrationDetailsByFilter.set(filter, [{ time }]);
    });
  }

  const integrationSummaries = Array.from(
    integrationDetailsByFilter,
    ([filter, details]) => ({
      filter,
      details,
      totalSeconds: details.reduce(
        (total, detail) =>
          total + detail.time.numberOfPhotos * detail.time.timePerPhoto,
        0
      ),
    })
  );

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
            className={`${styles.navButton} ${styles.navButtonLeft} ${currentIndex <= 0 ? styles.hidden : ""
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
                src={`./images/${selectedVariant.fileName}`}
                alt={`${currentPhoto.objectName} - ${selectedVariant.label}`}
              />
            </div>

          </div>
          <button
            className={`${styles.navButton} ${styles.navButtonRight} ${currentIndex >= photos.length - 1 ? styles.hidden : ""
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
            {imageVariants.length > 1 && (
              <label className={styles.variantSelector}>
                Image variant
                <select
                  value={selectedVariantIndex}
                  onChange={(event) =>
                    setSelectedVariantIndex(Number(event.target.value))
                  }
                >
                  {imageVariants.map((variant, index) => (
                    <option key={`${variant.fileName}-${index}`} value={index}>
                      {variant.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <p>
              {captureDates.length > 1 ? "Dates" : "Date"}: {captureDates
                .map((date) => new Date(date).toLocaleDateString())
                .join(", ")}
            </p>
            <p>Filters: {currentPhoto.equipment.filters.join(", ")}</p>

            {integrationSummaries.length > 0 ||
              currentPhoto.integrationTimesByDate ||
              currentPhoto.integrationTimes ? (
              <div className={styles.integrationTimes}>
                <h3>Integration Times:</h3>
                {integrationSummaries.map(({ filter, details, totalSeconds }) => (
                  <details className={styles.integrationFilter} key={filter}>
                    <summary>
                      <span>{filter}</span>
                      <strong>{formatDuration(totalSeconds)}</strong>
                    </summary>
                    <div className={styles.integrationBreakdown}>
                      {details.map(({ date, time }, index) => (
                        <p key={`${date ?? "legacy"}-${index}`}>
                          {date
                            ? `${new Date(`${date}T00:00:00`).toLocaleDateString()}: `
                            : ""}
                          {formatIntegrationTime(time)}
                        </p>
                      ))}
                    </div>
                  </details>
                ))}
                <details className={styles.integrationFilter}>
                  <summary>
                    <span>Total integration time</span>
                    <strong>{formatDuration(totalIntegrationSeconds)}</strong>
                  </summary>
                  <div className={styles.integrationBreakdown}>
                    {integrationTotalsByDate.map(({ date, totalSeconds }) => (
                      <p key={date}>
                        {new Date(`${date}T00:00:00`).toLocaleDateString()}: {formatDuration(totalSeconds)}
                      </p>
                    ))}
                  </div>
                </details>
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
                href={`./images/${selectedVariant.fileName}`}
                download={selectedVariant.fileName}
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
