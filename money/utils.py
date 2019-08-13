from collections import defaultdict
from datetime import datetime
from math import exp, log
from typing import Any, Dict, List

import requests
import yahoofinancials as yf
from dateutil.relativedelta import relativedelta


# FIXME: relativedelta is possibily broken
class Prices:
    IOF = {
        0: 100,
        1: 96,
        2: 93,
        3: 90,
        4: 86,
        5: 83,
        6: 80,
        7: 76,
        8: 73,
        9: 70,
        10: 66,
        11: 63,
        12: 60,
        13: 56,
        14: 53,
        15: 50,
        16: 46,
        17: 43,
        18: 40,
        19: 36,
        20: 33,
        21: 30,
        22: 26,
        23: 23,
        24: 20,
        25: 16,
        26: 13,
        27: 10,
        28: 6,
        29: 3,
        30: 0
    }

    @staticmethod
    def historical_selic(begin_date: datetime, end_date: datetime, with_taxes: bool = True) -> List[Dict[str, Any]]:
        endpoint = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados"
        params = {
            "formato": "json",
            "dataInicial": begin_date.strftime("%d/%m/%Y"),
            "dataFinal": end_date.strftime("%d/%m/%Y")
        }
        selic_data = requests.get(endpoint, params).json()

        for item in selic_data:
            current_date = datetime.strptime(item['data'], '%d/%m/%Y')
            duration = (current_date.date() - begin_date.date()).days

            if duration <= 30:
                taxes = (100 - 22.5) * (100 - Prices.IOF[duration]) / 100
            elif duration <= 180:
                taxes = 100 - 22.5
            elif duration <= 364:
                taxes = 100 - 20.0
            elif duration <= 720:
                taxes = 100 - 17.5
            else:
                taxes = 100 - 15

            if with_taxes:
                item['valor'] = float(item['valor']) * taxes / 100
            else:
                item['valor'] = float(item['valor'])
            item['data'] = current_date

        # Rendimento começa em 0
        selic_data[0]['valor'] = 0

        return selic_data

    @staticmethod
    def historical_ipca(begin_date: datetime, end_date: datetime) -> List[Dict[str, Any]]:
        interval = abs(relativedelta(end_date, begin_date).months)
        endpoint = f"http://api.sidra.ibge.gov.br/values/t/1419/n1/all/v/63/p/last {interval}/c315/7169"
        params = {
            "formato": "json"
        }

        ipca_data = [
            {
                'valor': float(item['V']),
                'data': datetime.strptime(item['D3C'], '%Y%m')
            }
            for item in requests.get(endpoint, params).json()[1:]
        ]

        return ipca_data

    @staticmethod
    def historical_asset(ticker: str, begin_date: datetime, end_date: datetime) -> List[Dict[str, Any]]:
        ticker = ticker + '.SA'
        asset = yf.YahooFinancials(ticker)
        begin = begin_date.strftime('%Y-%m-%d')
        end = end_date.strftime('%Y-%m-%d')

        history = asset.get_historical_price_data(begin, end, 'daily')
        output = [
            {
                'data': datetime.fromisoformat(item['formatted_date']),
                'valor': round(item['close'], 2)
            }
            for item in history[ticker]['prices']
        ]

        return output

    @staticmethod
    def current_asset(ticker: str) -> float:
        ticker = ticker + '.SA'
        asset = yf.YahooFinancials(ticker)
        return asset.get_current_price()


class HistoricalCalculator:
    @staticmethod
    def percent_change(history: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        previous_value = history[0]['valor']
        result = []

        for item in history[1:]:
            current_value = item['valor']
            pct_change = (current_value - previous_value) / previous_value
            pct_change = round(100 * pct_change, 4)

            result.append({'data': item['data'], 'valor': pct_change})
            previous_value = current_value

        return result

    @staticmethod
    def inflation_correction(history: List[Dict[str, Any]], ipca: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        counts = defaultdict(int)
        result = []
        ipca = {
            item['data'].strftime('%Y%m'): item['valor']
            for item in ipca
        }

        for item in history:
            month = item['data'].strftime('%Y%m')
            counts[month] += 1

        for item in history:
            month = item['data'].strftime('%Y%m')
            if month in ipca:
                local_ipca = exp(log(1 + ipca[month]/100) / counts[month]) - 1
            else:
                local_ipca = 0.0

            record = {
                'data': item['data'],
                'valor': item['valor'] - local_ipca
            }
            result.append(record)

        return result
