export interface IntegrationTime {
    numberOfPhotos: number;
    timePerPhoto: number; // in seconds
}

export interface PhotoVariant {
    label: string;
    fileName: string;
    thumbnailFileName?: string;
}

export interface PhotoData {
    id: string;
    title: string;
    fileName: string;
    thumbnailFileName?: string;
    variants?: PhotoVariant[];
    objectName: string;
    date: string;
    dates?: string[];
    type: 'DSO' | 'Planetary' | 'Lunar' | 'Solar' | 'Other';
    integrationTimes?: {
        OSC?: IntegrationTime;
        L?: IntegrationTime;
        R?: IntegrationTime;
        G?: IntegrationTime;
        B?: IntegrationTime;
        Sii?: IntegrationTime;
        Ha?: IntegrationTime;
        Oiii?: IntegrationTime;
    };
    integrationTimesByDate?: Record<string, Partial<Record<'OSC' | 'L' | 'R' | 'G' | 'B' | 'Sii' | 'Ha' | 'Oiii', IntegrationTime>>>;
    equipment: {
        telescope: string;
        camera: string;
        mount: string;
        filters: ('OSC' | 'Luminance' | 'Red' | 'Green' | 'Blue' | 'Ha' | 'Oiii' | 'Sii')[];
    };
}