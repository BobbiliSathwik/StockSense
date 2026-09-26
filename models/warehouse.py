from odoo import models, fields


class StockSenseWarehouse(models.Model):
    _name = "stocksense.warehouse"
    _description = "StockSense Warehouse"
    _order = "name"

    name = fields.Char(
        string="Warehouse Name",
        required=True,
    )

    code = fields.Char(
        string="Short Code",
        required=True,
        copy=False,
        index=True,
    )

    address = fields.Text(
        string="Address",
    )

    active = fields.Boolean(
        string="Active",
        default=True,
    )

    location_ids = fields.One2many(
        "stocksense.location",
        "warehouse_id",
        string="Locations",
    )


class StockSenseLocation(models.Model):
    _name = "stocksense.location"
    _description = "StockSense Warehouse Location"
    _order = "name"

    name = fields.Char(
        string="Location Name",
        required=True,
    )

    code = fields.Char(
        string="Short Code",
        required=True,
        copy=False,
        index=True,
    )

    warehouse_id = fields.Many2one(
        "stocksense.warehouse",
        string="Warehouse",
        required=True,
        ondelete="cascade",
    )

    description = fields.Text(
        string="Description",
    )

    active = fields.Boolean(
        string="Active",
        default=True,
    )
