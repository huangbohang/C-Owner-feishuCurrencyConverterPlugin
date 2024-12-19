"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExchangeRate = getExchangeRate;
async function getExchangeRate(context, base, target, apiKey) {
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`;
    try {
        let data = null;
        const response = await context.fetch(url);
        data = (await response.json());
        if (data.result !== "success") {
            return { code: data["error-type"], result: null };
        }
        const rate = data.conversion_rates[target];
        return { code: "SUCCESS", result: rate };
    }
    catch (error) {
        console.error(`Error fetching exchange rate: ${error.message}`);
        return { code: "FETCH_ERROR", result: null };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhjaGFuZ2UtYXBpLWJhay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9leGNoYW5nZS1hcGktYmFrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBaUJFLDBDQXdCQztBQXhCTSxLQUFLLFVBQVUsZUFBZSxDQUNuQyxPQUFZLEVBQ1osSUFBWSxFQUNaLE1BQWMsRUFDZCxNQUFjO0lBRWQsTUFBTSxHQUFHLEdBQUcsc0NBQXNDLE1BQU0sV0FBVyxJQUFJLEVBQUUsQ0FBQztJQUUxRSxJQUFJLENBQUM7UUFDSCxJQUFJLElBQUksR0FBMEIsSUFBSSxDQUFDO1FBRXZDLE1BQU0sUUFBUSxHQUFHLE1BQU0sT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBMEIsQ0FBQztRQUN4RCxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDOUIsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO1FBQ3BELENBQUM7UUFFRCxNQUFNLElBQUksR0FBSSxJQUFnQyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXhFLE9BQU8sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUMzQyxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUNBQWlDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ2hFLE9BQU8sRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUMvQyxDQUFDO0FBQ0gsQ0FBQyJ9