from odoo import fields, models


class StockSenseProduct(models.Model):
    _name = 'stocksense.product'
    _description = 'StockSense Product'
    _order = 'name'

    name = fields.Char(
        string='Product Name',
        required=True,
    )

    sku = fields.Char(
        string='SKU / Code',
        required=True,
        copy=False,
    )

    category = fields.Char(
        string='Category',
        required=True,
    )

    unit_of_measure = fields.Char(
        string='Unit of Measure',
        required=True,
        default='Units',
    )

    initial_stock = fields.Float(
        string='Initial Stock',
        default=0.0,
    )

    current_stock = fields.Float(
        string='Current Stock',
        default=0.0,
    )

    low_stock_threshold = fields.Float(
        string='Low Stock Threshold',
        default=0.0,
    )

    active = fields.Boolean(
        string='Active',
        default=True,
    )
