import type { PhotoData } from "../types/PhotoData";

export function getTotalIntegrationSeconds(photo: PhotoData): number {
    if (photo.integrationTimesByDate) {
        return Object.values(photo.integrationTimesByDate).reduce(
            (dateTotal, times) =>
                dateTotal +
                Object.values(times).reduce(
                    (total, time) =>
                        total + (time ? time.numberOfPhotos * time.timePerPhoto : 0),
                    0
                ),
            0
        );
    }

    return Object.values(photo.integrationTimes ?? {}).reduce(
        (total, time) =>
            total + (time ? time.numberOfPhotos * time.timePerPhoto : 0),
        0
    );
}