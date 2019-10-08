from flask import request
from flask_restful import Resource
from scipy.optimize import minimize_scalar

from . import api


# TODO: Add taxes to calculations
# TODO: Add inflation to calculations
@api.resource('/calculator/returns')
class ReturnsCalculator(Resource):
    def post(self):
        body = request.get_json(silent=True)

        if body is None:
            return "Error", 400

        current_value = body['initial_value']
        time = [0]
        returns = [0]
        balance = [current_value]
        total_invested = [current_value]

        for i in range(body['months']):
            current_value *= 1 + body['returns'] / 100
            current_value += body['monthly_income']

            time.append(i + 1)
            balance.append(round(current_value, 2))
            total_invested.append(
                round(body['monthly_income'] + total_invested[-1], 2))

            ret = 1 - total_invested[-1] / balance[-1]
            returns.append(round(ret * 100, 4))

        output = {
            'time': time,
            'balance': balance,
            'total_invested': total_invested,
            'returns': returns
        }

        return output


# TODO: Add taxes to calculations
# TODO: Add inflation to calculations
@api.resource('/calculator/planning')
class PlanCalculator(Resource):
    def post(self):
        body = request.get_json(silent=True)

        if body is None:
            return "Error", 400

        goal = body['goal']

        if 'returns' not in body:
            initial_value = body['initial_value']
            months = body['months']
            monthly_income = body['monthly_income']

            def loss_func(r):
                r = 1 + r / 100
                a1 = initial_value * pow(r, months - 1)

                k = (1 - pow(r, months - 1)) / (1 - r)
                a2 = monthly_income * k

                res = a1 + a2
                return abs(res - goal)

            result = minimize_scalar(loss_func,
                                     bounds=[1e-4, 1000],
                                     method='bounded',
                                     options={'maxiter': 1000})

            if result.success:
                return {'returns': round(result.x, 4)}
            return {'failure': True}

        elif 'months' not in body:
            current_value = body['initial_value']

            if goal <= current_value:
                return {'months': 0}

            months = 1
            while current_value < goal:
                current_value *= 1 + body['returns'] / 100
                current_value += body['monthly_income']
                months += 1
            return {'months': months - 1}

        elif 'monthly_income' not in body:
            returns = 1 + body['returns'] / 100
            months = body['months']

            first_component = body['initial_value'] * pow(returns, months - 1)
            second_component = (1 - pow(returns, months - 1)) / (1 - returns)
            monthly_income = (goal - first_component) / second_component

            return {'monthly_income': round(monthly_income, 2)}

        elif 'initial_value' not in body:
            returns = 1 + body['returns'] / 100
            months = body['months']

            first_component = (1 - pow(returns, months - 1)) / (1 - returns)
            second_component = pow(returns, months - 1)
            third_component = body['monthly_income'] * first_component
            initial_value = (goal - third_component) / second_component

            return {'initial_value': round(initial_value, 2)}

        return "SUCCESS"
