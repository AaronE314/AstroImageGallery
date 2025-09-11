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
  const [fileName, setFileName] = useState("");

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

  const handleIntegrationTimeChange = (
    filter: FilterType,
    field: "numberOfPhotos" | "timePerPhoto",
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    setFormData((prev) => ({
      ...prev,
      integrationTimes: {
        ...prev.integrationTimes,
        [filter]: {
          ...(prev.integrationTimes?.[filter] || {}),
          [field]: numValue,
        },
      },
    }));
  };

  const generateJSON = () => {
    const photoData: PhotoData = {
      id: new Date().getTime().toString(),
      title: formData.objectName || "",
      fileName,
      objectName: formData.objectName || "",
      date: formData.date || new Date().toISOString().split("T")[0],
      type: formData.type || "DSO",
      integrationTimes: formData.integrationTimes || {},
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

        <label>
          File Name:
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="e.g., m31.jpg"
          />
        </label>

        <label>
          Date:
          <input
            type="date"
            value={formData.date || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, date: e.target.value }))
            }
          />
        </label>

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
        <div className={styles.integrationGrid}>
          {filterTypes.map((filter) => (
            <div key={filter} className={styles.integrationTime}>
              <h4>{filter}</h4>
              <input
                type="number"
                placeholder="Number of photos"
                value={
                  formData.integrationTimes?.[filter]?.numberOfPhotos || ""
                }
                onChange={(e) =>
                  handleIntegrationTimeChange(
                    filter,
                    "numberOfPhotos",
                    e.target.value
                  )
                }
              />
              <input
                type="number"
                placeholder="Seconds per photo"
                value={formData.integrationTimes?.[filter]?.timePerPhoto || ""}
                onChange={(e) =>
                  handleIntegrationTimeChange(
                    filter,
                    "timePerPhoto",
                    e.target.value
                  )
                }
              />
            </div>
          ))}
        </div>
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
