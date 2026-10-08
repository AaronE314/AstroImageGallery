import { useState } from "react";
import type { PhotoData } from "../types/PhotoData";
import equipment from "../data/equipment.json";
import styles from "../styles/AdminPhotoForm.module.css";

type FilterType = "OSC" | "L" | "R" | "G" | "B" | "Sii" | "Ha" | "Oiii";
type Filters =
  | "OSC"
  | "Luminance"
  | "Red"
  | "Green"
  | "Blue"
  | "Sii"
  | "Ha"
  | "Oiii";

export default function AdminPhotoForm() {
  const [formData, setFormData] = useState<Partial<PhotoData>>({
    integrationTimes: {},
    equipment: {
      telescope: equipment.telescope[0] || "",
      camera: equipment.camera[0] || "",
      mount: equipment.mount[0] || "",
      filters: [],
    },
  });

  const [selectedFilters, setSelectedFilters] = useState<Set<Filters>>(
    new Set()
  );
  const [variants, setVariants] = useState([{ label: "Original", fileName: "" }]);
  const [captureDates, setCaptureDates] = useState([""]);
  const [integrationTimesByDate, setIntegrationTimesByDate] = useState<
    NonNullable<PhotoData["integrationTimesByDate"]>
  >({});

  const availableFilters: Filters[] = [
    "OSC",
    "Luminance",
    "Red",
    "Green",
    "Blue",
    "Sii",
    "Ha",
    "Oiii",
  ];
  const filterTypes: FilterType[] = [
    "OSC",
    "L",
    "R",
    "G",
    "B",
    "Sii",
    "Ha",
    "Oiii",
  ];

  const handleFilterChange = (filter: Filters) => {
    const newFilters = new Set(selectedFilters);
    if (newFilters.has(filter)) {
      newFilters.delete(filter);
    } else {
      newFilters.add(filter);
    }
    setSelectedFilters(newFilters);
    setFormData((prev) => ({
      ...prev,
      equipment: {
        telescope: prev.equipment?.telescope ?? "",
        camera: prev.equipment?.camera ?? "",
        mount: prev.equipment?.mount ?? "",
        filters: Array.from(newFilters),
      },
    }));
  };

  const filterTypeByFilter: Record<Filters, FilterType> = {
    OSC: "OSC",
    Luminance: "L",
    Red: "R",
    Green: "G",
    Blue: "B",
    Sii: "Sii",
    Ha: "Ha",
    Oiii: "Oiii",
  };

  const selectedIntegrationFilters = filterTypes.filter((filter) =>
    Array.from(selectedFilters).some(
      (selectedFilter) => filterTypeByFilter[selectedFilter] === filter
    )
  );

  const handleIntegrationTimeChange = (
    date: string,
    filter: FilterType,
    field: "numberOfPhotos" | "timePerPhoto",
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    setIntegrationTimesByDate((previousTimes) => ({
      ...previousTimes,
      [date]: {
        ...previousTimes[date],
        [filter]: {
          ...(previousTimes[date]?.[filter] || {
            numberOfPhotos: 0,
            timePerPhoto: 0,
          }),
          [field]: numValue,
        },
      },
    }));
  };

  const generateJSON = () => {
    const dates = Array.from(new Set(captureDates.filter(Boolean))).sort();
    const defaultDate = new Date().toISOString().split("T")[0];
    const photoDates = dates.length > 0 ? dates : [defaultDate];
    const photoIntegrationTimesByDate = Object.fromEntries(
      dates.map((date) => [
        date,
        Object.fromEntries(
          selectedIntegrationFilters.flatMap((filter) => {
            const time = integrationTimesByDate[date]?.[filter];
            return time ? [[filter, time]] : [];
          })
        ),
      ])
    );
    const photoVariants = variants
      .filter((variant) => variant.fileName.trim())
      .map((variant, index) => ({
        ...variant,
        label: variant.label.trim() || `Variant ${index + 1}`,
      }));
    const photoData: PhotoData = {
      id: new Date().getTime().toString(),
      title: formData.objectName || "",
      fileName: photoVariants[0]?.fileName ?? "",
      variants: photoVariants,
      objectName: formData.objectName || "",
      date: photoDates[0],
      dates: photoDates,
      type: formData.type || "DSO",
      integrationTimesByDate: photoIntegrationTimesByDate,
      equipment: formData.equipment || {
        telescope: "",
        camera: "",
        mount: "",
        filters: Array.from(selectedFilters),
      },
    };

    const jsonOutput = JSON.stringify(photoData, null, 2);
    return jsonOutput;
  };

  const [generatedJSON, setGeneratedJSON] = useState("");

  return (
    <div className={styles.formContainer}>
      <h2>Add New Photo</h2>

      <div className={styles.formSection}>
        <label>
          Object Name:
          <input
            type="text"
            value={formData.objectName || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, objectName: e.target.value }))
            }
            placeholder="e.g., M31 - Andromeda Galaxy"
          />
        </label>

        <div className={styles.photoVariants}>
          <h3>Image Variants</h3>
          {variants.map((variant, index) => (
            <div className={styles.variantRow} key={index}>
              <label>
                Variant name:
                <input
                  type="text"
                  value={variant.label}
                  placeholder="e.g., HOO"
                  onChange={(event) =>
                    setVariants((previousVariants) =>
                      previousVariants.map((previousVariant, variantIndex) =>
                        variantIndex === index
                          ? { ...previousVariant, label: event.target.value }
                          : previousVariant
                      )
                    )
                  }
                />
              </label>
              <label>
                File name:
                <input
                  type="text"
                  value={variant.fileName}
                  placeholder="e.g., m31-hoo.jpg"
                  onChange={(event) =>
                    setVariants((previousVariants) =>
                      previousVariants.map((previousVariant, variantIndex) =>
                        variantIndex === index
                          ? { ...previousVariant, fileName: event.target.value }
                          : previousVariant
                      )
                    )
                  }
                />
              </label>
              {variants.length > 1 && (
                <button
                  type="button"
                  className={styles.removeDateButton}
                  aria-label={`Remove image variant ${index + 1}`}
                  onClick={() =>
                    setVariants((previousVariants) =>
                      previousVariants.filter((_, variantIndex) => variantIndex !== index)
                    )
                  }
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className={styles.addDateButton}
            onClick={() =>
              setVariants((previousVariants) => [
                ...previousVariants,
                { label: `Variant ${previousVariants.length + 1}`, fileName: "" },
              ])
            }
          >
            Add another variant
          </button>
        </div>

        <div className={styles.captureDates}>
          <h3>Capture Days</h3>
          {captureDates.map((date, index) => (
            <div className={styles.captureDateRow} key={index}>
              <label>
                Day {index + 1}:
                <input
                  type="date"
                  value={date}
                  onChange={(event) =>
                    setCaptureDates((previousDates) =>
                      previousDates.map((previousDate, dateIndex) =>
                        dateIndex === index ? event.target.value : previousDate
                      )
                    )
                  }
                />
              </label>
              {captureDates.length > 1 && (
                <button
                  type="button"
                  className={styles.removeDateButton}
                  aria-label={`Remove capture day ${index + 1}`}
                  onClick={() =>
                    setCaptureDates((previousDates) =>
                      previousDates.filter((_, dateIndex) => dateIndex !== index)
                    )
                  }
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className={styles.addDateButton}
            onClick={() => setCaptureDates((previousDates) => [...previousDates, ""])}
          >
            Add another day
          </button>
        </div>

        <label>
          Object Type:
          <select
            value={formData.type || "DSO"}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                type: e.target.value as
                  | "DSO"
                  | "Planetary"
                  | "Lunar"
                  | "Solar"
                  | "Other",
              }))
            }
          >
            <option value="DSO">DSO</option>
            <option value="Planetary">Planetary</option>
            <option value="Lunar">Lunar</option>
            <option value="Solar">Solar</option>
            <option value="Other">Other</option>
          </select>
        </label>
      </div>

      <div className={styles.formSection}>
        <h3>Filters</h3>
        <div className={styles.filterGrid}>
          {availableFilters.map((filter) => (
            <label key={filter} className={styles.filterCheckbox}>
              <input
                type="checkbox"
                checked={selectedFilters.has(filter)}
                onChange={() => handleFilterChange(filter)}
              />
              {filter}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.formSection}>
        <h3>Integration Times</h3>
        {selectedIntegrationFilters.length === 0 ? (
          <p>Select one or more filters to enter integration times.</p>
        ) : (
          Array.from(new Set(captureDates.filter(Boolean))).map((date) => (
            <div className={styles.dateIntegrationGroup} key={date}>
              <h4>{new Date(`${date}T00:00:00`).toLocaleDateString()}</h4>
              <div className={styles.integrationGrid}>
                {selectedIntegrationFilters.map((filter) => (
                  <div key={filter} className={styles.integrationTime}>
                    <h4>{filter}</h4>
                    <input
                      type="number"
                      min="0"
                      placeholder="Number of photos"
                      value={
                        integrationTimesByDate[date]?.[filter]?.numberOfPhotos || ""
                      }
                      onChange={(event) =>
                        handleIntegrationTimeChange(
                          date,
                          filter,
                          "numberOfPhotos",
                          event.target.value
                        )
                      }
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Seconds per photo"
                      value={
                        integrationTimesByDate[date]?.[filter]?.timePerPhoto || ""
                      }
                      onChange={(event) =>
                        handleIntegrationTimeChange(
                          date,
                          filter,
                          "timePerPhoto",
                          event.target.value
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.formSection}>
        <h3>Equipment</h3>
        <label>
          Telescope:
          {/* <input
            type="text"
            value={formData.equipment?.telescope || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                equipment: { ...prev.equipment!, telescope: e.target.value },
              }))
            }
          /> */}
          <select
            value={formData.equipment?.telescope || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                equipment: { ...prev.equipment!, telescope: e.target.value },
              }))
            }
          >
            {equipment.telescope.map((telescope) => (
              <option key={telescope} value={telescope}>
                {telescope}
              </option>
            ))}
          </select>
        </label>

        <label>
          Camera:
          {/* <input
            type="text"
            value={formData.equipment?.camera || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                equipment: { ...prev.equipment!, camera: e.target.value },
              }))
            }
          /> */}
          <select
            value={formData.equipment?.camera || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                equipment: { ...prev.equipment!, camera: e.target.value },
              }))
            }
          >
            {equipment.camera.map((camera) => (
              <option key={camera} value={camera}>
                {camera}
              </option>
            ))}
          </select>
        </label>

        <label>
          Mount:
          {/* <input
            type="text"
            value={formData.equipment?.mount || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                equipment: { ...prev.equipment!, mount: e.target.value },
              }))
            }
          /> */}
          <select
            value={formData.equipment?.mount || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                equipment: { ...prev.equipment!, mount: e.target.value },
              }))
            }
          >
            {equipment.mount.map((mount) => (
              <option key={mount} value={mount}>
                {mount}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        className={styles.generateButton}
        onClick={() => setGeneratedJSON(generateJSON())}
      >
        Generate JSON
      </button>

      {generatedJSON && (
        <div className={styles.jsonOutput}>
          <h3>Generated JSON</h3>
          <p>Copy this JSON and add it to your photos.json file:</p>
          <pre>{generatedJSON}</pre>
          <button
            onClick={() => navigator.clipboard.writeText(generatedJSON)}
            className={styles.copyButton}
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
