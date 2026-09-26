from odoo import models, fields, api


class StockSenseSale(models.Model):
    _name = "stocksense.sale"
    _description = "StockSense Sales Record"
    _order = "date desc"

    product_id = fields.Many2one(
        "stocksense.product",
        string="Product",
        required=True,
        ondelete="cascade",
    )

    location_id = fields.Many2one(
        "stocksense.location",
        string="Location",
        required=True,
        ondelete="cascade",
    )

    date = fields.Date(
        string="Sale Date",
        required=True,
        default=fields.Date.today,
    )

    quantity = fields.Float(
        string="Quantity Sold",
        required=True,
    )

    unit_price = fields.Float(
        string="Unit Price",
        default=0.0,
    )

    total_amount = fields.Float(
        string="Total Amount",
        compute="_compute_total_amount",
        store=True,
    )

    active = fields.Boolean(
        string="Active",
        default=True,
    )

    @api.depends("quantity", "unit_price")
    def _compute_total_amount(self):
        for record in self:
            record.total_amount = record.quantity * record.unit_price

    @api.model
    def get_product_demand(self, product_id, location_id=None):
        domain = [
            ("product_id", "=", product_id),
            ("active", "=", True),
        ]

        if location_id:
            domain.append(("location_id", "=", location_id))

        sales = self.search(domain, order="date asc")

        total_quantity = sum(sales.mapped("quantity"))
        total_revenue = sum(sales.mapped("total_amount"))

        return {
            "product_id": product_id,
            "location_id": location_id,
            "total_quantity": total_quantity,
            "total_revenue": total_revenue,
            "sales_count": len(sales),
            "sales": [
                {
                    "date": sale.date,
                    "quantity": sale.quantity,
                    "unit_price": sale.unit_price,
                    "total_amount": sale.total_amount,
                }
                for sale in sales
            ],
        }

    @api.model
    def get_demand_forecast(self, product_id, location_id=None, days=7):
        domain = [
            ("product_id", "=", product_id),
            ("active", "=", True),
        ]

        if location_id:
            domain.append(("location_id", "=", location_id))

        sales = self.search(domain, order="date asc")

        if not sales:
            return {
                "product_id": product_id,
                "location_id": location_id,
                "historical_days": 0,
                "average_daily_demand": 0.0,
                "forecast": [],
            }

        total_quantity = sum(sales.mapped("quantity"))
        historical_days = len(sales)
        average_daily_demand = total_quantity / historical_days

        forecast = []

        for day in range(1, days + 1):
            forecast.append({
                "day": day,
                "forecast_quantity": round(average_daily_demand, 2),
            })

        return {
            "product_id": product_id,
            "location_id": location_id,
            "historical_days": historical_days,
            "total_historical_demand": total_quantity,
            "average_daily_demand": round(average_daily_demand, 2),
            "forecast": forecast,
        }

    @api.model
    def get_inventory_recommendation(
        self,
        product_id,
        location_id,
        forecast_days=7,
    ):
        product = self.env["stocksense.product"].browse(product_id)

        inventory = self.env["stocksense.inventory"].search(
            [
                ("product_id", "=", product_id),
                ("location_id", "=", location_id),
                ("active", "=", True),
            ],
            limit=1,
        )

        forecast = self.get_demand_forecast(
            product_id,
            location_id,
            forecast_days,
        )

        current_stock = inventory.quantity if inventory else 0.0

        forecast_demand = sum(
            item["forecast_quantity"]
            for item in forecast["forecast"]
        )

        minimum_stock = (
            inventory.minimum_stock
            if inventory
            else product.minimum_stock
        )

        projected_stock = current_stock - forecast_demand

        recommended_order_quantity = max(
            0.0,
            minimum_stock - projected_stock,
        )

        if projected_stock <= 0:
            status = "critical"
        elif projected_stock < minimum_stock:
            status = "reorder"
        else:
            status = "sufficient"

        return {
            "product_id": product_id,
            "location_id": location_id,
            "current_stock": round(current_stock, 2),
            "minimum_stock": round(minimum_stock, 2),
            "forecast_days": forecast_days,
            "forecast_demand": round(forecast_demand, 2),
            "projected_stock": round(projected_stock, 2),
            "recommended_order_quantity": round(
                recommended_order_quantity,
                2,
            ),
            "status": status,
        }

    @api.model
    def create_inventory_alert(
        self,
        product_id,
        location_id,
        forecast_days=7,
    ):
        recommendation = self.get_inventory_recommendation(
            product_id,
            location_id,
            forecast_days,
        )

        status = recommendation["status"]

        if status == "sufficient":
            return False

        product = self.env["stocksense.product"].browse(product_id)
        location = self.env["stocksense.location"].browse(location_id)

        alert_type = status

        if status == "critical":
            name = f"Critical stock: {product.name}"
            message = (
                f"{product.name} at {location.name} is projected "
                f"to run out of stock within {forecast_days} days. "
                f"Current stock: {recommendation['current_stock']}. "
                f"Forecast demand: {recommendation['forecast_demand']}. "
                f"Recommended order: "
                f"{recommendation['recommended_order_quantity']}."
            )

        else:
            name = f"Reorder required: {product.name}"
            message = (
                f"{product.name} at {location.name} is below the "
                f"minimum stock level after forecast demand. "
                f"Current stock: {recommendation['current_stock']}. "
                f"Minimum stock: {recommendation['minimum_stock']}. "
                f"Recommended order: "
                f"{recommendation['recommended_order_quantity']}."
            )

        existing_alert = self.env["stocksense.alert"].search(
            [
                ("product_id", "=", product_id),
                ("location_id", "=", location_id),
                ("alert_type", "=", alert_type),
                ("resolved", "=", False),
                ("active", "=", True),
            ],
            limit=1,
        )

        if existing_alert:
            return existing_alert

        return self.env["stocksense.alert"].create({
            "name": name,
            "product_id": product_id,
            "location_id": location_id,
            "alert_type": alert_type,
            "message": message,
            "current_stock": recommendation["current_stock"],
            "recommended_quantity": recommendation[
                "recommended_order_quantity"
            ],
        })

    @api.model
    def get_demand_trend(self, product_id, location_id=None):
        domain = [
            ("product_id", "=", product_id),
            ("active", "=", True),
        ]

        if location_id:
            domain.append(("location_id", "=", location_id))

        sales = self.search(domain, order="date asc")

        if len(sales) < 2:
            return {
                "product_id": product_id,
                "location_id": location_id,
                "trend": "insufficient_data",
                "trend_percentage": 0.0,
                "historical_days": len(sales),
            }

        quantities = sales.mapped("quantity")

        midpoint = len(quantities) // 2

        first_half = quantities[:midpoint]
        second_half = quantities[midpoint:]

        first_average = sum(first_half) / len(first_half)
        second_average = sum(second_half) / len(second_half)

        if first_average == 0:
            trend_percentage = 0.0
        else:
            trend_percentage = (
                (second_average - first_average)
                / first_average
            ) * 100

        if trend_percentage > 10:
            trend = "increasing"
        elif trend_percentage < -10:
            trend = "decreasing"
        else:
            trend = "stable"

        return {
            "product_id": product_id,
            "location_id": location_id,
            "trend": trend,
            "trend_percentage": round(trend_percentage, 2),
            "historical_days": len(sales),
            "first_period_average": round(first_average, 2),
            "second_period_average": round(second_average, 2),
        }
    @api.model
    def get_demand_anomalies(self, product_id, location_id=None):
        domain = [
            ("product_id", "=", product_id),
            ("active", "=", True),
        ]

        if location_id:
            domain.append(("location_id", "=", location_id))

        sales = self.search(domain, order="date asc")

        if len(sales) < 4:
            return {
                "product_id": product_id,
                "location_id": location_id,
                "anomaly_count": 0,
                "anomalies": [],
                "message": "Insufficient data for anomaly detection.",
            }

        quantities = sales.mapped("quantity")
        sorted_quantities = sorted(quantities)

        n = len(sorted_quantities)

        q1_position = (n - 1) * 0.25
        q3_position = (n - 1) * 0.75

        lower_index = int(q1_position)
        upper_index = int(q3_position)

        q1 = sorted_quantities[lower_index]
        q3 = sorted_quantities[upper_index]

        iqr = q3 - q1

        lower_bound = q1 - (1.5 * iqr)
        upper_bound = q3 + (1.5 * iqr)

        anomalies = []

        for sale in sales:
            if (
                sale.quantity < lower_bound
                or sale.quantity > upper_bound
            ):
                anomalies.append({
                    "date": sale.date,
                    "quantity": sale.quantity,
                    "lower_bound": round(lower_bound, 2),
                    "upper_bound": round(upper_bound, 2),
                })

        return {
            "product_id": product_id,
            "location_id": location_id,
            "anomaly_count": len(anomalies),
            "lower_bound": round(lower_bound, 2),
            "upper_bound": round(upper_bound, 2),
            "anomalies": anomalies,
        }
    @api.model
    def get_demand_seasonality(self, product_id, location_id=None):
        domain = [
            ("product_id", "=", product_id),
            ("active", "=", True),
        ]

        if location_id:
            domain.append(("location_id", "=", location_id))

        sales = self.search(domain, order="date asc")

        if len(sales) < 14:
            return {
                "product_id": product_id,
                "location_id": location_id,
                "seasonality_detected": False,
                "pattern": "insufficient_data",
                "message": "At least 14 days of sales history are recommended.",
            }

        weekday_totals = {}
        weekday_counts = {}

        for sale in sales:
            weekday = sale.date.weekday()

            weekday_totals[weekday] = (
                weekday_totals.get(weekday, 0.0)
                + sale.quantity
            )

            weekday_counts[weekday] = (
                weekday_counts.get(weekday, 0)
                + 1
            )

        weekday_averages = {}

        for weekday in weekday_totals:
            weekday_averages[weekday] = (
                weekday_totals[weekday]
                / weekday_counts[weekday]
            )

        if not weekday_averages:
            return {
                "product_id": product_id,
                "location_id": location_id,
                "seasonality_detected": False,
                "pattern": "none",
                "weekday_averages": {},
            }

        highest_day = max(
            weekday_averages,
            key=weekday_averages.get,
        )

        lowest_day = min(
            weekday_averages,
            key=weekday_averages.get,
        )

        highest_value = weekday_averages[highest_day]
        lowest_value = weekday_averages[lowest_day]

        if lowest_value == 0:
            variation_percentage = 100.0
        else:
            variation_percentage = (
                (highest_value - lowest_value)
                / lowest_value
            ) * 100

        seasonality_detected = variation_percentage >= 30

        weekday_names = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ]

        readable_averages = {
            weekday_names[day]: round(value, 2)
            for day, value in weekday_averages.items()
        }

        return {
            "product_id": product_id,
            "location_id": location_id,
            "seasonality_detected": seasonality_detected,
            "pattern": "weekly" if seasonality_detected else "none",
            "variation_percentage": round(
                variation_percentage,
                2,
            ),
            "highest_demand_day": weekday_names[highest_day],
            "lowest_demand_day": weekday_names[lowest_day],
            "weekday_averages": readable_averages,
        }
    @api.model
    def get_stock_intelligence(
        self,
        product_id,
        location_id,
        forecast_days=7,
    ):
        product = self.env["stocksense.product"].browse(product_id)
        location = self.env["stocksense.location"].browse(location_id)

        demand = self.get_product_demand(
            product_id,
            location_id,
        )

        forecast = self.get_demand_forecast(
            product_id,
            location_id,
            forecast_days,
        )

        trend = self.get_demand_trend(
            product_id,
            location_id,
        )

        anomalies = self.get_demand_anomalies(
            product_id,
            location_id,
        )

        seasonality = self.get_demand_seasonality(
            product_id,
            location_id,
        )

        recommendation = self.get_inventory_recommendation(
            product_id,
            location_id,
            forecast_days,
        )

        alert = self.env["stocksense.alert"].search(
            [
                ("product_id", "=", product_id),
                ("location_id", "=", location_id),
                ("resolved", "=", False),
                ("active", "=", True),
            ],
            order="create_date desc",
            limit=1,
        )

        alert_data = None

        if alert:
            alert_data = {
                "id": alert.id,
                "name": alert.name,
                "type": alert.alert_type,
                "message": alert.message,
                "recommended_quantity": (
                    alert.recommended_quantity
                ),
                "resolved": alert.resolved,
            }
        return {
            "product": {
                "id": product.id,
                "name": product.name,
                "sku": product.sku,
            },
            "location": {
                "id": location.id,
                "name": location.name,
                "code": location.code,
            },
            "demand": demand,
            "forecast": forecast,
            "trend": trend,
            "anomalies": anomalies,
            "seasonality": seasonality,
            "recommendation": recommendation,
            "alert": alert_data,
        }
