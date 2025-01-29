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
interface MovieResult {
    id: string;
    titleNameText: string;
    titleReleaseText: string;
    titlePosterImageUrl: string;
    topCredits: string[];
}
declare class IMDbScraper {
    private baseUrl;
    getReviews(imdbId: string): Promise<IMDbReview[]>;
    searchMovie(title: string): Promise<MovieResult[]>;
}
export declare const imdbScraper: IMDbScraper;
export {};
