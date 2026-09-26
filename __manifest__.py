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
        'views/stocksense_app.xml',
    ],

    'assets': {
        'web.assets_backend': [
            'stocksense/static/src/js/stocksense_app.js',
            'stocksense/static/src/js/stocksense_3d.js',
            'stocksense/static/src/xml/stocksense_app.xml',
            'stocksense/static/src/css/stocksense_app.css',
        ],
    },

    'installable': True,
    'application': True,
}