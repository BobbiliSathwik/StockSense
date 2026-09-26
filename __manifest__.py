{
    'name': 'StockSense',
    'version': '1.0.0',
    'summary': 'Modular Inventory Management System',
    'description': """
        StockSense - Inventory Management System
        for products, warehouses, receipts, deliveries,
        transfers, adjustments and stock history.
    """,
    'category': 'Inventory',
    'author': 'StockSense Team',
    'license': 'LGPL-3',

    'depends': [
        'base',
    ],

    'data': [
        'security/ir.model.access.csv',

        # Frontend Views
        'views/product_views.xml',
        'views/warehouse_views.xml',
        'views/category_views.xml',
    ],

    'installable': True,
    'application': True,
}