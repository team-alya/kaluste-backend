import axios from 'axios';
import * as cheerio from 'cheerio';

const toriScraper = async () => {
    try {
        const response = await axios.get('https://www.tori.fi/recommerce/forsale/search?product_category=2.78.5196.215&q=herman+miller&trade_type=1');
        const $ = cheerio.load(response.data);
        const prices: string[] = [];
        $('div.flex.justify-between.sm\\:mt-8.text-m.space-x-12.font-bold.whitespace-nowrap > span').each((_, element) => {
            const priceText = $(element).text().trim();
            prices.push(priceText);
        });
        console.log(prices);
        return prices;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        } else {
            return { error: 'An unknown error occurred' };
        }
    }
};

console.log('toriScraper');
toriScraper();

export default toriScraper;