"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExchangeRate = getExchangeRate;
const DEFAULT_API_KEY = 'a78b34595eae459d43df4ba3';
const rateCache = {};
async function getExchangeRate(context, base, target, apiKey) {
    const url = `https://v6.exchangerate-api.com/v6/${apiKey || DEFAULT_API_KEY}/latest/${base}`;
    try {
        let data = rateCache[base] || null;
        if (!data) {
            const response = await context.fetch(url);
            data = (await response.json());
            if (data.result !== 'success') {
                return { code: data['error-type'], result: null };
            }
            rateCache[base] = data; // 存储整个ExchangeRatesResponseOk对象到缓存
        }
        const rate = data.conversion_rates[target];
        return { code: 'SUCCESS', result: rate };
    }
    catch (error) {
        console.error(`Error fetching exchange rate: ${error.message}`);
        return { code: 'FETCH_ERROR', result: null };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhjaGFuZ2UtYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2V4Y2hhbmdlLWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQWlCQSwwQ0EyQkM7QUFqQ0QsTUFBTSxlQUFlLEdBQUcsMEJBQTBCLENBQUE7QUFJbEQsTUFBTSxTQUFTLEdBQWdELEVBQUUsQ0FBQztBQUUzRCxLQUFLLFVBQVUsZUFBZSxDQUNuQyxPQUFZLEVBQ1osSUFBWSxFQUNaLE1BQWMsRUFDZCxNQUFjO0lBRWQsTUFBTSxHQUFHLEdBQUcsc0NBQXNDLE1BQU0sSUFBSSxlQUFlLFdBQVcsSUFBSSxFQUFFLENBQUM7SUFFN0YsSUFBSSxDQUFDO1FBQ0gsSUFBSSxJQUFJLEdBQTBCLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUM7UUFFMUQsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ1YsTUFBTSxRQUFRLEdBQUcsTUFBTSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzFDLElBQUksR0FBRyxDQUFDLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUEwQixDQUFDO1lBQ3hELElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUUsQ0FBQztnQkFDOUIsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO1lBQ3BELENBQUM7WUFDRCxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBK0IsQ0FBQyxDQUFDLG1DQUFtQztRQUN4RixDQUFDO1FBRUQsTUFBTSxJQUFJLEdBQUksSUFBZ0MsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV4RSxPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDM0MsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLENBQUMsS0FBSyxDQUFDLGlDQUFpQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUNoRSxPQUFPLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDL0MsQ0FBQztBQUNILENBQUMifQ==