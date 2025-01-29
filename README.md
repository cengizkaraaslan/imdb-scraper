# IMDb Scraper

Bu proje, IMDb filmleri için yorumları çekmek ve analiz etmek amacıyla bir scraper (veri kazıyıcı) içerir. IMDb'nin web sitesinden film yorumlarını alır ve bu yorumları bir formatta döker.

## Özellikler
- IMDb sayfasından film yorumlarını çeker.
- Yorum başlığı, yazar, derecelendirme, tarih, içerik ve oylama bilgilerini toplar.
- JSON formatında verileri işler ve çıktı olarak döker.

projeyi çalıstırmak için
npm i 
npm run build
npm testreview
npm testsearch


```bash
npm install @speed_of/imdbscraper



import { imdbScraper } from '@speed_of/imdbscraper';

const imdbId = 'tt0111161'; // Örnek film ID'si
imdbScraper.getReviews(imdbId)
    .then(reviews => {
        console.log('Film İncelemeleri:', reviews);
    })
    .catch(error => {
        console.error('Hata:', error.message);
    });

 

İnceleme Formatı
Dönen inceleme verileri aşağıdaki şekilde olacaktır:
[
    {
        "title": "Simply amazing. The best film of the 90's.",
        "author": "John Doe",
        "rating": 10,
        "date": "2000-09-06",
        "content": "The Shawshank Redemption is without a doubt one of the most brilliant movies...",
        "votes": {
            "up": 150,
            "down": 10
        },
        "spoiler": true
    },
    ...
]



const movieTitle = 'The Shawshank Redemption'; // Example movie title
imdbScraper.searchMovie(movieTitle)
    .then(movies => {
        console.log('Bulunan Filmler:', movies);
    })
    .catch(error => {
        console.error('Hata:', error.message);
    });


İnceleme Formatı
Dönen inceleme verileri aşağıdaki şekilde olacaktır:
[
    {
        "id": "tt0111161",
        "titleNameText": "The Shawshank Redemption",
        "titleReleaseText": "1994",
        "titlePosterImageUrl": "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZjRiZi00ZjMwLTkzYzktNzVmNzc3YjgyNjQ4XkEyXkFqcGc@._V1_.jpg",
        "topCredits": ["Tim Robbins", "Morgan Freeman"]
    },
    ...
]


 

Hata Yönetimi
Eğer bir hata ile karşılaşırsanız, hata mesajı konsolda görünür. Örneğin, eğer geçersiz bir IMDb ID'si sağlarsanız, hata mesajı alırsınız.
Hata: Failed to fetch reviews: IMDb ID not found
