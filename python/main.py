from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import requests
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ניתן לשנות את זה לרשימת המקורות מורשים שלך
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

available_currencies = ['USD', 'EUR', 'GBP', 'CNY', 'ILS']

async def fetch_exchange_rates(base_currency):
    api_key = '652a0435d6b79a984259a3f4'
    url = f'https://v6.exchangerate-api.com/v6/{api_key}/latest/{base_currency}'
    response = requests.get(url, verify=False)
    
    if response.status_code == 200:
        data = response.json()
        exchange_rate = {}
        
        for target_currency in available_currencies:
            if target_currency != base_currency:
                currency_rate = data['conversion_rates'].get(target_currency)
                exchange_rate[target_currency] = currency_rate
        
        if exchange_rate:
            return exchange_rate
        else:
            return f"Exchange rates for {base_currency} not found."
    else:
        return f"Failed to retrieve data. Status code: {response.status_code}"


@app.get("/currencies")
async def get_available_currencies():
    return available_currencies



@app.get("/exchange_rates/{currency}")
async def get_exchange_rates(currency: str):
    if currency in available_currencies:
        return await fetch_exchange_rates(currency)
    else:
        return f"Currency {currency} not found in available currencies."

if __name__ == '__main__':
  uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, access_log=True)