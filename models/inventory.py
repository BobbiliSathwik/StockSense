from odoo import models, fields, api


class StockSenseInventory(models.Model):
    _name = "stocksense.inventory"
    _description = "StockSense Inventory"
    _order = "product_id, location_id"

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

    quantity = fields.Float(
        string="Current Stock",
        required=True,
        default=0.0,
    )

    minimum_stock = fields.Float(
        string="Minimum Stock",
        required=True,
        default=0.0,
    )

    available_quantity = fields.Float(
        string="Available Quantity",
        compute="_compute_available_quantity",
        store=True,
    )

    active = fields.Boolean(
        string="Active",
        default=True,
    )

    @api.depends("quantity")
    def _compute_available_quantity(self):
        for record in self:
            record.available_quantity = record.quantity
