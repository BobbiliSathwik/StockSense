from odoo import models, fields


class StockSenseCategory(models.Model):
    _name = "stocksense.category"
    _description = "StockSense Product Category"
    _order = "name"

    name = fields.Char(
        string="Category Name",
        required=True,
    )

    description = fields.Text(
        string="Description",
    )

    active = fields.Boolean(
        string="Active",
        default=True,
    )
