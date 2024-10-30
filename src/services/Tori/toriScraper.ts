import axios from 'axios';
import * as cheerio from 'cheerio';
import { ToriPrices } from '../../utils/types';

const fetchProductPages = async (link: string): Promise<string [] | {error: string;}> => {
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

const fetchProductDetails = async (links: string[]): Promise<Map<string, number[]> | []>  => {
    let hash = new Map<string, number[]>();
    try {
        for (const link of links) {
            const response = await axios.get(link);
            const $ = cheerio.load(response.data);
            const condition = $('section[aria-label="Lisätietoja"] p:contains("Kunto") b').text();
            const scriptContent = $('#advertising-initial-state').html();
            let price = '';
            let bool = false;
            if (scriptContent) {
                const jsonData = JSON.parse(scriptContent);
                const priceItem = jsonData.config?.adServer?.gam?.targeting?.find(
                    (item: { key: string; value: string[] }) => item.key === 'obj_price'
                );
                if (priceItem?.value[0]) {
                    price =  priceItem.value[0];
                    bool = true;
                }
            }

            if (condition && bool) {
                if (hash.has(condition)) {
                    hash.set(condition, [...(hash.get(condition) || []), parseInt(price)]);
                } else {
                    hash.set(condition, [parseInt(price)]);
                }
            } else if (!condition && bool) {
                if (hash.has('Kunto ei tiedossa')) {
                    hash.set('Kunto ei tiedossa', [...(hash.get('Kunto ei tiedossa') || []), parseInt(price)]);
                } else {
                    hash.set('Kunto ei tiedossa', [parseInt(price)]);
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

const calcAvgPerCondition = (hash: Map<string, number[]>): ToriPrices => {
    let avgHash: ToriPrices = {};
    hash.forEach((value, key) => {
        let sum = 0;
        value.forEach((price) => {
            sum += price;
        });
        avgHash[key] = [Math.round(sum / value.length), value.length];
    });
    return avgHash;
}

// Returns JSON with the average price per condition and the number of products in that condition
const getAvgPricesPerCondition = async (brand: string, model: string): Promise<ToriPrices | { error: string; }>=> {
    try {
        const link = generateToriLink(brand, model);
        const productPages = await fetchProductPages(link);
        if (Array.isArray(productPages)) {
            if (productPages.length === 0) {
                console.error('No products found');
                return { error: 'No products found' };
            }
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

const generateToriLink = (brand: string, model: string): string => {
    let baseUrl = 'https://www.tori.fi/recommerce/forsale/search?';
    let searchQueryParams = [];
    searchQueryParams.push('q=' + encodeURIComponent(brand + ' ' + model));
    searchQueryParams.push('trade_type=1');
    baseUrl += searchQueryParams.join('&');
    return baseUrl;
}

export default getAvgPricesPerCondition;