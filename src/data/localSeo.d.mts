export const localPagePath: string;
export const localTowns: string[];
export const clubAddress: string;
export const localHeading: string;
export const localIntro: string;
export const localFaqs: { question: string; answer: string }[];
export const localMetadata: Record<string, { title: string; description: string }>;
export const directionsFrom: (town: string) => string;
export const clubStructuredData: Record<string, unknown>;
