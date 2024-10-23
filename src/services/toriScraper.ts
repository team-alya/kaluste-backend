import axios from 'axios';
import * as cheerio from 'cheerio';

const fetchProductPages = async (link: string) => {
    try {
        const response = await axios.get(link);
        const $ = cheerio.load(response.data);
        const productPages: string[] = [];
        $('a.sf-search-ad-link').each((_, element) => {
            const link = $(element).attr('href');
            if (link) {
                productPages.push(link);
            }
        });
        return productPages;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            return { error: error.message };
        } else {
            console.error('An unknown error occurred');
            return { error: 'An unknown error occurred' };
        }
    }
};

const fetchProductDetails = async (links: string[]) => {
    let hash = new Map<string, number[]>();
    try {
        for (const link of links) {
            const response = await axios.get(link);
            const $ = cheerio.load(response.data);
            const condition = $('section[aria-label="Lisätietoja"] p:contains("Kunto") b').text();
            const scriptContent = $('#advertising-initial-state').html();
            let price = '';
            if (scriptContent) {
                const jsonData = JSON.parse(scriptContent);
                price = jsonData.config?.adServer?.gam?.targeting?.find(
                    (item: { key: string; value: string[] }) => item.key === 'obj_price'
                )?.value[0];
            }

            if (condition && price.length > 0) {
                if (hash.has(condition)) {
                    hash.set(condition, [...(hash.get(condition) || []), parseInt(price)]);
                } else {
                    hash.set(condition, [parseInt(price)]);
                }
            }
        }
        return hash;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            return [];
        } else {
            console.error('An unknown error occurred');
            return [];
        }
    }
}

const calcAvgPerCondition = (hash: Map<string, number[]>) => {
    let avgHash = new Map<string, number>();
    hash.forEach((value, key) => {
        let sum = 0;
        value.forEach((price) => {
            sum += price;
        });
        avgHash.set(key, sum / value.length);
    });
    return avgHash;
}

const getAvgPricesPerCondition = async (link: string) => {
    try {
        const productPages = await fetchProductPages(link);
        if (Array.isArray(productPages)) {
            const pricesPerCodition = await fetchProductDetails(productPages);
            if (pricesPerCodition instanceof Map && pricesPerCodition.size > 0) { 
                return calcAvgPerCondition(pricesPerCodition);
            } else {
                console.error('No prices found');
                return { error: 'No prices found' };
            }
        } else {
            console.error(productPages.error);
            return { error: productPages.error };
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            return { error: error.message };
        } else {
            console.error('An unknown error occurred');
            return { error: 'An unknown error occurred' };
        }
    }
}

async function test() {
    console.log('toriScraper');
    const testLink = 'https://www.tori.fi/recommerce/forsale/search?product_category=2.78.5196.215&q=herman+miller&trade_type=1';
    const response = await getAvgPricesPerCondition(testLink);
    console.log(response);
}
test();

export default fetchProductPages;