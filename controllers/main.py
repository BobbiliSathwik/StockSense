from odoo import http
from odoo.http import request


class StockSenseAPI(http.Controller):

    @http.route(
        "/stocksense/api/products",
        type="http",
        auth="user",
        methods=["GET"],
    )
    def get_products(self):
        products = request.env["stocksense.product"].search(
            [
                ("active", "=", True),
            ],
            order="name asc",
        )

        data = {
            "status": "success",
            "count": len(products),
            "products": [
                {
                    "id": product.id,
                    "name": product.name,
                    "sku": product.sku,
                    "category_id": (
                        product.category_id.id
                        if product.category_id
                        else None
                    ),
                    "category": (
                        product.category_id.name
                        if product.category_id
                        else None
                    ),
                    "unit": product.unit,
                    "minimum_stock": product.minimum_stock,
                }
                for product in products
            ],
        }

        return request.make_json_response(data)

    @http.route(
        "/stocksense/api/locations/<int:product_id>",
        type="http",
        auth="user",
        methods=["GET"],
    )
    def get_locations(self, product_id):
        inventories = request.env["stocksense.inventory"].search(
            [
                ("product_id", "=", product_id),
                ("active", "=", True),
            ],
            order="location_id",
        )

        locations = []

        for inventory in inventories:
            location = inventory.location_id

            locations.append({
                "id": location.id,
                "name": location.name,
                "code": location.code,
                "warehouse_id": (
                    location.warehouse_id.id
                    if location.warehouse_id
                    else None
                ),
                "warehouse": (
                    location.warehouse_id.name
                    if location.warehouse_id
                    else None
                ),
                "current_stock": inventory.quantity,
                "minimum_stock": inventory.minimum_stock,
                "available_quantity": inventory.available_quantity,
            })

        return request.make_json_response({
            "status": "success",
            "product_id": product_id,
            "count": len(locations),
            "locations": locations,
        })

    @http.route(
        "/stocksense/api/intelligence/<int:product_id>/<int:location_id>",
        type="http",
        auth="user",
        methods=["GET"],
    )
    def get_intelligence(
        self,
        product_id,
        location_id,
    ):
        result = request.env["stocksense.sale"].get_stock_intelligence(
            product_id,
            location_id,
            7,
        )

        return request.make_json_response(result)
