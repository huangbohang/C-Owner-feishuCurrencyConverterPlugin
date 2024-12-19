//无缓存
interface ExchangeRatesResponseOk {
    conversion_rates: {
      [key: string]: number;
    };
    result: string;
    base_code: string;
  }
  interface ExchangeRatesResponseError {
    result: string;
    "error-type": string;
  }
  
  type ExchangeRatesResponse =
    | ExchangeRatesResponseOk
    | ExchangeRatesResponseError;
  
  export async function getExchangeRate(
    context: any,
    base: string,
    target: string,
    apiKey: string
  ): Promise<{ code: string; result: number | null }> {
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`;
  
    try {
      let data: ExchangeRatesResponse = null;
  
      const response = await context.fetch(url);
      data = (await response.json()) as ExchangeRatesResponse;
      if (data.result !== "success") {
        return { code: data["error-type"], result: null };
      }
  
      const rate = (data as ExchangeRatesResponseOk).conversion_rates[target];
  
      return { code: "SUCCESS", result: rate };
    } catch (error) {
      console.error(`Error fetching exchange rate: ${error.message}`);
      return { code: "FETCH_ERROR", result: null };
    }
  }
  