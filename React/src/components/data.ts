import { GetExchangesByCurrency } from './fetches'

export type ExchangeData = {
  base: string
  target: string
  exchangeRate: number
}

export function makeData(selected) {
  const makeDataLevel = async (depth = 0): Promise<ExchangeData[]> => {
    const exchangeRates: { [key: string]: number } = await GetExchangesByCurrency(selected);
    return Object.keys(exchangeRates).map((target) => {
      return {
        base: selected,
        target: target,
        exchangeRate: exchangeRates[target],
      };
    });
  };
  return makeDataLevel();
}


// const selected = "GBP"
// const getExchange1 = async (selected)=>{
//   return await GetExchangesByCurrency(selected);
// }
  
