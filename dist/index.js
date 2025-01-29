"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imdbScraper = void 0;
const axios_1 = __importDefault(require("axios"));
class IMDbScraper {
    constructor() {
        this.baseUrl = 'https://www.imdb.com/title';
    }
    cleanHtmlContent(text) {
        if (!text)
            return '';
        return text
            // Replace BR tags with newlines
            .replace(/<br\s*\/?>/gi, '\n')
            // Remove all HTML tags
            .replace(/<[^>]*>/g, '')
            // Replace common HTML entities
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&#39;/g, "'")
            .replace(/&ndash;/g, '-')
            .replace(/&mdash;/g, '--')
            .replace(/&nbsp;/g, ' ')
            .replace(/&lsquo;/g, "'")
            .replace(/&rsquo;/g, "'")
            .replace(/&ldquo;/g, '"')
            .replace(/&rdquo;/g, '"')
            // Clean up multiple newlines
            .replace(/\n\s*\n/g, '\n\n')
            // Clean up extra spaces
            .replace(/\s+/g, ' ')
            .trim();
    }
    async getReviews(imdbId) {
        var _a, _b;
        try {
            console.log('Fetching reviews for:', imdbId);
            const response = await axios_1.default.get(`${this.baseUrl}/${imdbId}/reviews`, {
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
            // console.log(`Found ${reviews.length} reviews`);
            return reviews.map((review) => {
                const formattedReview = {
                    title: this.cleanHtmlContent(review.reviewSummary || 'No summary'),
                    author: this.cleanHtmlContent(review.review.author ? review.review.author.nickName : 'Anonymous'),
                    rating: review.review.authorRating || 0,
                    date: review.review.submissionDate || 'Unknown date',
                    content: this.cleanHtmlContent(review.review.reviewText || 'No content'),
                    votes: {
                        up: review.review.helpfulnessVotes ? review.review.helpfulnessVotes.upVotes : 0,
                        down: review.review.helpfulnessVotes ? review.review.helpfulnessVotes.downVotes : 0
                    },
                    spoiler: review.review.spoiler || false,
                    reviewId: review.review.reviewId || 0,
                };
                return formattedReview;
            });
        }
        catch (error) {
            console.error('Error fetching reviews:', {
                message: error.message,
                status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
                data: ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) ? 'Response data available' : 'No response data'
            });
            throw new Error(`Failed to fetch reviews: ${error.message}`);
        }
    }
    async searchMovie(title) {
        var _a, _b;
        try {
            // console.log('Searching for movies with title:', title);
            const response = await axios_1.default.get(`https://www.imdb.com/find?q=${encodeURIComponent(title)}&ref_=nv_sr_sm`, {
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
            //console.log(`Found ${movieResults.length} movies`);
            return movieResults.map((movie) => {
                const formattedMovie = {
                    id: movie.id,
                    titleNameText: this.cleanHtmlContent(movie.titleNameText),
                    titleReleaseText: this.cleanHtmlContent(movie.titleReleaseText),
                    titlePosterImageUrl: movie.titlePosterImageModel.url,
                    topCredits: movie.topCredits.map((credit) => this.cleanHtmlContent(credit))
                };
                // console.log(`Processed movie: ${formattedMovie.titleNameText}`);
                return formattedMovie;
            });
        }
        catch (error) {
            console.error('Error searching movies:', {
                message: error.message,
                status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
                data: ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) ? 'Response data available' : 'No response data'
            });
            throw new Error(`Failed to search for movies: ${error.message}`);
        }
    }
    getReviewUrl(id) {
        return 'https://www.imdb.com/review/' + id + '/?ref_=tturv_perm_1';
    }
}
exports.imdbScraper = new IMDbScraper();
