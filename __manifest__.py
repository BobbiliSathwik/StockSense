{
    'name': 'StockSense',
    'version': '1.0.0',
    'summary': 'Modular Inventory Management System',
    'description': '''
StockSense - Inventory Management System for products,
warehouses, receipts, deliveries, transfers,
adjustments and stock history.
    ''',
    'category': 'Inventory',
    'author': 'StockSense Team',
    'license': 'LGPL-3',

    'depends': [
        'base',
        'web',
    ],

    'data': [
        'security/ir.model.access.csv',

        'views/category_views.xml',
        'views/product_views.xml',
        'views/warehouse_views.xml',
        'views/stocksense_app.xml',
        'views/dashboard_views.xml',
    ],

    'assets': {
        'web.assets_backend': [
            'static/src/js/stocksense_app.js',
            'static/src/js/stocksense_3d.js',
            'static/src/xml/stocksense_app.xml',
            'static/src/css/stocksense_app.css',
        ],
    },

    'installable': True,
    'application': True,
}
