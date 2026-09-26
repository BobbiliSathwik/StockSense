from odoo import models, fields


class StockSenseAlert(models.Model):
    _name = "stocksense.alert"
    _description = "StockSense Inventory Alert"
    _order = "create_date desc"

    name = fields.Char(
        string="Alert",
        required=True,
    )

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

    alert_type = fields.Selection(
        [
            ("critical", "Critical Stock"),
            ("reorder", "Reorder Required"),
            ("overstock", "Overstock"),
            ("anomaly", "Demand Anomaly"),
        ],
        string="Alert Type",
        required=True,
    )

    message = fields.Text(
        string="Message",
        required=True,
    )

    current_stock = fields.Float(
        string="Current Stock",
        default=0.0,
    )

    recommended_quantity = fields.Float(
        string="Recommended Quantity",
        default=0.0,
    )

    active = fields.Boolean(
        string="Active",
        default=True,
    )

    resolved = fields.Boolean(
        string="Resolved",
        default=False,
    )
