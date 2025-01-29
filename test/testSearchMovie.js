// test/testSearchMovie.js
const { imdbScraper } = require('../dist/index');

async function testSearchMovie() {
    try {
        console.log('Test başlıyor...\n');
        
        const movieTitle = 'Recep Ivedik';
        console.log(`"${movieTitle}" için film araması yapılıyor...\n`);
        
        const movies = await imdbScraper.searchMovie(movieTitle);
        
        if (!movies || movies.length === 0) {
            console.log('Film bulunamadı.');
            return;
        }

        console.log(`${movies.length} adet film bulundu.\n`);
        
        // İlk filmi detaylı göster
        const firstMovie = movies[0];
        console.log('İlk Film Detayları:');
        console.log('-----------------');
        Object.entries(firstMovie).forEach(([key, value]) => {
            if (key === 'topCredits') {
                console.log(`${key}: ${value.join(', ')}`);
            } else {
                console.log(`${key}: ${value}`);
            }
        });

        // Debug dosyası oluştur
        const fs = require('fs');
        const debugData = {
            totalMovies: movies.length,
            firstMovie: movies[0],
            lastMovie: movies[movies.length - 1],
            timestamp: new Date().toISOString()
        };
        
        fs.writeFileSync('debug-search-output.json', JSON.stringify(debugData, null, 2));
        console.log('\nDebug bilgileri debug-search-output.json dosyasına kaydedildi.');

    } catch (error) {
        console.error('\nHata oluştu:', error);
        console.error('\nHata detayları:', error.stack);
    }
}

testSearchMovie();
