interface ExchangeRatesResponseOk {
  conversion_rates: {
    [key: string]: number;
  };
  result: string;
  base_code: string;
}
interface ExchangeRatesResponseError {
  result: string;
  'error-type': string;
}
const DEFAULT_API_KEY = 'a78b34595eae459d43df4ba3'

type ExchangeRatesResponse = ExchangeRatesResponseOk | ExchangeRatesResponseError;

const rateCache: { [base: string]: ExchangeRatesResponseOk } = {};

export async function getExchangeRate(
  context: any,
  base: string,
  target: string,
  apiKey: string
): Promise<{ code: string; result: number | null }> {
  const url = `https://v6.exchangerate-api.com/v6/${apiKey || DEFAULT_API_KEY}/latest/${base}`;

  try {
    let data: ExchangeRatesResponse = rateCache[base] || null;

    if (!data) {
      const response = await context.fetch(url);
      data = (await response.json()) as ExchangeRatesResponse;
      if (data.result !== 'success') {
        return { code: data['error-type'], result: null };
      }
      rateCache[base] = data as ExchangeRatesResponseOk; // 存储整个ExchangeRatesResponseOk对象到缓存
    }

    const rate = (data as ExchangeRatesResponseOk).conversion_rates[target];

    return { code: 'SUCCESS', result: rate };
  } catch (error) {
    console.error(`Error fetching exchange rate: ${error.message}`);
    return { code: 'FETCH_ERROR', result: null };
  }
}