// test/test.js
const { imdbScraper } = require('../dist/index');

async function testScraper() {
    try {
        console.log('Test başlıyor...\n');
        
        const movieId = 'tt0111161';
        console.log(`Film ID: ${movieId} için veriler getiriliyor...\n`);
        
        const reviews = await imdbScraper.getReviews(movieId);
        
        if (!reviews || reviews.length === 0) {
            console.log('Review bulunamadı.');
            return;
        }

        console.log(`${reviews.length} adet review bulundu.\n`);
        
        // İlk review'u detaylı göster
        const firstReview = reviews[0];
        console.log('İlk Review Detayları:');
        console.log('-----------------');
        Object.entries(firstReview).forEach(([key, value]) => {
            if (key === 'content') {
                console.log(`${key}: ${value.substring(0, 100)}...`);
            } else if (key === 'votes') {
                console.log(`${key}: up=${value.up}, down=${value.down}`);
            } else {
                console.log(`${key}: ${value}`);
            }
        });

        // Debug dosyası oluştur
        const fs = require('fs');
        const debugData = {
            totalReviews: reviews.length,
            firstReview: reviews[0],
            lastReview: reviews[reviews.length - 1],
            timestamp: new Date().toISOString()
        };
        
        fs.writeFileSync('debug-output.json', JSON.stringify(debugData, null, 2));
        console.log('\nDebug bilgileri debug-output.json dosyasına kaydedildi.');

    } catch (error) {
        console.error('\nHata oluştu:', error);
        console.error('\nHata detayları:', error.stack);
    }
}

testScraper();