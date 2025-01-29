import axios from 'axios';

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

class IMDbScraper {
    private baseUrl = 'https://www.imdb.com/title';

    async getReviews(imdbId: string): Promise<IMDbReview[]> {
        try {
            console.log('Fetching reviews for:', imdbId);

            const response = await axios.get(`${this.baseUrl}/${imdbId}/reviews`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'text/html,application/xhtml+xml'
                }
            });

            const scriptMatch = response.data.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
            if (!scriptMatch) {
                console.error('JSON data not found in response');
                throw new Error('JSON data not found');
            }

            const jsonData = JSON.parse(scriptMatch[1]);
            const reviews = jsonData.props.pageProps.contentData.reviews;
            console.log(`Found ${reviews.length} reviews`);

            return reviews.map((review: any) => {
                const formattedReview = {
                    title: review.reviewSummary || 'No summary',
                    author: review.author ? review.author.name : 'Anonymous',
                    rating: review.authorRating || 0,
                    date: review.submissionDate || 'Unknown date',
                    content: review.reviewText || 'No content',
                    votes: {
                        up: review.helpfulnessVotes ? review.helpfulnessVotes.up : 0,
                        down: review.helpfulnessVotes ? review.helpfulnessVotes.down : 0
                    },
                    spoiler: review.spoiler || false
                };
                console.log(`Processed review by ${formattedReview.author}`);
                return formattedReview;
            });

        } catch (error: any) {
            console.error('Error fetching reviews:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data ? 'Response data available' : 'No response data'
            });
            throw new Error(`Failed to fetch reviews: ${error.message}`);
        }
    }

    async searchMovie(title: string): Promise<MovieResult[]> {
        try {
            console.log('Searching for movies with title:', title);

            const response = await axios.get(`https://www.imdb.com/find?q=${encodeURIComponent(title)}&ref_=nv_sr_sm`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'text/html,application/xhtml+xml'
                }
            });

            const scriptMatch = response.data.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
            if (!scriptMatch) {
                console.error('JSON data not found in search response');
                throw new Error('JSON data not found');
            }

            const jsonData = JSON.parse(scriptMatch[1]);
            const movieResults = jsonData.props.pageProps.titleResults.results;
            console.log(`Found ${movieResults.length} movies`);

            return movieResults.map((movie: any) => {
                const formattedMovie = {
                    id: movie.id,
                    titleNameText: movie.titleNameText,
                    titleReleaseText: movie.titleReleaseText,
                    titlePosterImageUrl: movie.titlePosterImageModel.url,
                    topCredits: movie.topCredits
                };
                console.log(`Processed movie: ${formattedMovie.titleNameText}`);
                return formattedMovie;
            });
            
        } catch (error: any) {
            console.error('Error searching movies:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data ? 'Response data available' : 'No response data'
            });
            throw new Error(`Failed to search for movies: ${error.message}`);
        }
    }
}

export const imdbScraper = new IMDbScraper();