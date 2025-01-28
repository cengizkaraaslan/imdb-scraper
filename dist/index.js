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
            // __NEXT_DATA__ scriptini bul
            const scriptMatch = response.data.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
            if (!scriptMatch) {
                throw new Error('JSON data not found');
            }
            // JSON verisini parse et
            const jsonData = JSON.parse(scriptMatch[1]);
            // Raw data'yı kaydet
            const fs = require('fs');
            fs.writeFileSync('raw-data.json', JSON.stringify(jsonData, null, 2));
            // Reviews verisini çıkart
            const reviews = jsonData.props.pageProps.contentData.reviews;
            console.log('Reviews:', reviews);
            // Review'ları formatla
            return reviews.map((review) => {
                return {
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
            });
        }
        catch (error) {
            // Hata durumunda JSON verisini kaydet
            if ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) {
                const fs = require('fs');
                fs.writeFileSync('error-data.json', JSON.stringify(error.response.data, null, 2));
                console.log('Error data saved to error-data.json');
            }
            console.error('Error details:', {
                message: error.message,
                status: (_b = error.response) === null || _b === void 0 ? void 0 : _b.status
            });
            throw new Error(`Failed to fetch reviews: ${error.message}`);
        }
    }
}
exports.imdbScraper = new IMDbScraper();
