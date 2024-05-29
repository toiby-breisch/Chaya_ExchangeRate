const port = 8000

export const GetExchangesByCurrency = async (currency: string): Promise<{ [key: string]: number }> => {
    try {
        debugger
        const result = await fetch(`http://localhost:${port}/exchange_rates/${currency}`);
        return result.json();
    } catch (err) {
        console.log(err);
        return {}; // You may want to handle errors more appropriately
    }
}


export const FetchAvailableCurrencies = async () => {
    try {
        const result = await fetch(`http://localhost:${port}/currencies`);
        return result.json();
    }
    catch (err) {
        console.log(err);
    }
}