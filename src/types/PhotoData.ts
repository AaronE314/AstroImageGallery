export interface IntegrationTime {
    numberOfPhotos: number;
    timePerPhoto: number; // in seconds
}

export interface PhotoData {
    id: string;
    title: string;
    fileName: string;
    objectName: string;
    date: string;
    integrationTimes: {
        OSC?: IntegrationTime;
        L?: IntegrationTime;
        R?: IntegrationTime;
        G?: IntegrationTime;
        B?: IntegrationTime;
        Sii?: IntegrationTime;
        Ha?: IntegrationTime;
        Oiii?: IntegrationTime;
    };
    equipment: {
        telescope: string;
        camera: string;
        mount: string;
        filters: ('OSC' | 'Luminance' | 'Red' | 'Green' | 'Blue' | 'Ha' | 'Oiii' | 'Sii')[];
    };
}