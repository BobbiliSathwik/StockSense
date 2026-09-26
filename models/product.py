from odoo import models, fields


class StockSenseProduct(models.Model):
    _name = "stocksense.product"
    _description = "StockSense Product"
    _order = "name"

    name = fields.Char(
        string="Product Name",
        required=True,
    )

    sku = fields.Char(
        string="SKU / Code",
        required=True,
        copy=False,
        index=True,
    )

    # Existing frontend-compatible field
    category = fields.Char(
        string="Category",
    )

    # Backend relational category
    category_id = fields.Many2one(
        "stocksense.category",
        string="Category",
        ondelete="restrict",
    )

    # Existing frontend-compatible field
    unit_of_measure = fields.Char(
        string="Unit of Measure",
        default="Units",
    )

    # Backend API-compatible alias/data field
    unit = fields.Char(
        string="Unit",
    )

    initial_stock = fields.Float(
        string="Initial Stock",
        default=0.0,
    )

    current_stock = fields.Float(
        string="Current Stock",
        default=0.0,
    )

    low_stock_threshold = fields.Float(
        string="Low Stock Threshold",
        default=0.0,
    )

    minimum_stock = fields.Float(
        string="Minimum Stock",
        default=0.0,
    )

    description = fields.Text(
        string="Description",
    )

    active = fields.Boolean(
        string="Active",
        default=True,
    )
