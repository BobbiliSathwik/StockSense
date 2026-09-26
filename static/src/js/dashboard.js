/** @odoo-module **/

import { Component } from "@odoo/owl";
import { registry } from "@web/core/registry";

export class StockSenseDashboard extends Component {
    static template = "stocksense.StockSenseDashboard";

    setup() {
        this.kpis = {
            products: 120,
            lowStock: 8,
            receipts: 4,
            deliveries: 6,
            transfers: 3,
        };
    }
}

registry.category("actions").add(
    "stocksense_dashboard",
    StockSenseDashboard
);
