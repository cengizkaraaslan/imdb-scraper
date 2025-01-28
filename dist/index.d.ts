interface IMDbReview {
    title: string;
    author: string;
    rating: number;
    date: string;
    content: string;
    votes: {
        up: number;
        down: number;
    };
    spoiler: boolean;
}
declare class IMDbScraper {
    private baseUrl;
    getReviews(imdbId: string): Promise<IMDbReview[]>;
}
export declare const imdbScraper: IMDbScraper;
export {};
