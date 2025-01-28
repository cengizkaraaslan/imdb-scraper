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
            return reviews.map((review: any) => {
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

        } catch (error: any) {
            // Hata durumunda JSON verisini kaydet
            if (error.response?.data) {
                const fs = require('fs');
                fs.writeFileSync('error-data.json', JSON.stringify(error.response.data, null, 2));
                console.log('Error data saved to error-data.json');
            }

            console.error('Error details:', {
                message: error.message,
                status: error.response?.status
            });

            throw new Error(`Failed to fetch reviews: ${error.message}`);
        }
    }
}

export const imdbScraper = new IMDbScraper();
