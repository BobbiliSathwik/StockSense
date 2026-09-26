/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";

export class StockSenseApp extends Component {
    setup() {
        this.navigate = this.navigate.bind(this);

        this.state = useState({
            activePage: "dashboard",
            showProfile: false,
            showNotifications: false,
            modal: null,

            // =====================================================
            // PRODUCT STATE
            // =====================================================

            productForm: {
                id: null,
                name: "",
                sku: "",
                category: "Raw Material",
                unit: "Units",
                stock: 0,
                reserved: 0,
                reorder: 0,
            },

            productView: null,
            productError: "",
            productStockFilter: "All",

            // =====================================================
            // CATEGORY STATE
            // =====================================================

            categoryForm: {
                id: null,
                name: "",
            },

            categoryError: "",
            categorySearch: "",
            categoryView: null,

            // =====================================================
            // GLOBAL FILTERS
            // =====================================================

            search: "",
            statusFilter: "All",
            typeFilter: "All",
            warehouseFilter: "All",
            categoryFilter: "All",

            // =====================================================
            // PRODUCTS
            // =====================================================

            products: [
                {
                    id: 1,
                    name: "Steel Rod",
                    sku: "STL-001",
                    category: "Raw Material",
                    unit: "Kg",
                    stock: 120,
                    reserved: 20,
                    reorder: 50,
                },
                {
                    id: 2,
                    name: "Office Chair",
                    sku: "CHR-001",
                    category: "Furniture",
                    unit: "Units",
                    stock: 18,
                    reserved: 5,
                    reorder: 20,
                },
                {
                    id: 3,
                    name: "Office Desk",
                    sku: "DSK-001",
                    category: "Furniture",
                    unit: "Units",
                    stock: 50,
                    reserved: 4,
                    reorder: 15,
                },
                {
                    id: 4,
                    name: "Laptop",
                    sku: "LAP-001",
                    category: "Electronics",
                    unit: "Units",
                    stock: 12,
                    reserved: 3,
                    reorder: 10,
                },
                {
                    id: 5,
                    name: "Packaging Box",
                    sku: "BOX-001",
                    category: "Packaging",
                    unit: "Units",
                    stock: 8,
                    reserved: 2,
                    reorder: 15,
                },
            ],

            // =====================================================
            // CATEGORIES
            // =====================================================

            categories: [
                {
                    id: 1,
                    name: "Raw Material",
                    products: 24,
                },
                {
                    id: 2,
                    name: "Furniture",
                    products: 18,
                },
                {
                    id: 3,
                    name: "Electronics",
                    products: 12,
                },
                {
                    id: 4,
                    name: "Packaging",
                    products: 9,
                },
            ],

            // =====================================================
            // RECEIPTS
            // =====================================================

            receipts: [
                {
                    id: 1,
                    reference: "WH/IN/0001",
                    from: "ABC Suppliers",
                    to: "Main Warehouse",
                    contact: "Raj Traders",
                    date: "26 Sep 2026",
                    status: "Ready",
                    items: 3,
                },
                {
                    id: 2,
                    reference: "WH/IN/0002",
                    from: "Steel Industries",
                    to: "Main Warehouse",
                    contact: "Steel Industries",
                    date: "27 Sep 2026",
                    status: "Waiting",
                    items: 2,
                },
                {
                    id: 3,
                    reference: "WH/IN/0003",
                    from: "Tech Distributors",
                    to: "Electronics Store",
                    contact: "Tech Distributors",
                    date: "28 Sep 2026",
                    status: "Draft",
                    items: 4,
                },
            ],

            // =====================================================
            // DELIVERIES
            // =====================================================

            deliveries: [
                {
                    id: 1,
                    reference: "WH/OUT/0001",
                    from: "Main Warehouse",
                    to: "Customer",
                    contact: "Acme Corporation",
                    date: "26 Sep 2026",
                    status: "Ready",
                    items: 2,
                },
                {
                    id: 2,
                    reference: "WH/OUT/0002",
                    from: "Main Warehouse",
                    to: "Production Floor",
                    contact: "Production Team",
                    date: "27 Sep 2026",
                    status: "Waiting",
                    items: 3,
                },
                {
                    id: 3,
                    reference: "WH/OUT/0003",
                    from: "Electronics Store",
                    to: "Customer",
                    contact: "Nova Systems",
                    date: "29 Sep 2026",
                    status: "Draft",
                    items: 1,
                },
            ],

            // =====================================================
            // INTERNAL TRANSFERS
            // =====================================================

            transfers: [
                {
                    id: 1,
                    reference: "WH/INT/0001",
                    from: "Main Warehouse",
                    to: "Production Floor",
                    contact: "Internal",
                    date: "26 Sep 2026",
                    status: "Done",
                    items: 2,
                },
                {
                    id: 2,
                    reference: "WH/INT/0002",
                    from: "Rack A",
                    to: "Rack B",
                    contact: "Internal",
                    date: "27 Sep 2026",
                    status: "Ready",
                    items: 4,
                },
                {
                    id: 3,
                    reference: "WH/INT/0003",
                    from: "Warehouse 1",
                    to: "Warehouse 2",
                    contact: "Internal",
                    date: "28 Sep 2026",
                    status: "Draft",
                    items: 1,
                },
            ],

            // =====================================================
            // ADJUSTMENTS
            // =====================================================

            adjustments: [
                {
                    id: 1,
                    reference: "ADJ/0001",
                    product: "Steel Rod",
                    location: "Main Warehouse",
                    recorded: 120,
                    counted: 117,
                    difference: -3,
                    date: "26 Sep 2026",
                    status: "Done",
                },
                {
                    id: 2,
                    reference: "ADJ/0002",
                    product: "Office Chair",
                    location: "Main Warehouse",
                    recorded: 18,
                    counted: 20,
                    difference: 2,
                    date: "25 Sep 2026",
                    status: "Done",
                },
            ],

            // =====================================================
            // MOVE HISTORY
            // =====================================================

            history: [
                {
                    id: 1,
                    reference: "WH/IN/0001",
                    date: "26 Sep 2026",
                    contact: "ABC Suppliers",
                    from: "Vendor",
                    to: "Main Warehouse",
                    quantity: "+120 Kg",
                    status: "Done",
                    direction: "in",
                },
                {
                    id: 2,
                    reference: "WH/INT/0001",
                    date: "26 Sep 2026",
                    contact: "Internal",
                    from: "Main Warehouse",
                    to: "Production Floor",
                    quantity: "30 Kg",
                    status: "Done",
                    direction: "internal",
                },
                {
                    id: 3,
                    reference: "WH/OUT/0001",
                    date: "26 Sep 2026",
                    contact: "Acme Corporation",
                    from: "Main Warehouse",
                    to: "Customer",
                    quantity: "-20 Kg",
                    status: "Done",
                    direction: "out",
                },
                {
                    id: 4,
                    reference: "ADJ/0001",
                    date: "26 Sep 2026",
                    contact: "Inventory",
                    from: "Main Warehouse",
                    to: "Adjustment",
                    quantity: "-3 Kg",
                    status: "Done",
                    direction: "out",
                },
            ],

            // =====================================================
            // WAREHOUSES
            // =====================================================

            warehouses: [
                {
                    id: 1,
                    name: "Main Warehouse",
                    code: "WH01",
                    address: "Hyderabad, Telangana",
                    locations: 6,
                    products: 63,
                },
                {
                    id: 2,
                    name: "Electronics Store",
                    code: "WH02",
                    address: "Banjara Hills, Hyderabad",
                    locations: 4,
                    products: 31,
                },
                {
                    id: 3,
                    name: "Production Warehouse",
                    code: "WH03",
                    address: "Industrial Area, Hyderabad",
                    locations: 5,
                    products: 28,
                },
            ],

            // =====================================================
            // LOCATIONS
            // =====================================================

            locations: [
                {
                    id: 1,
                    name: "Main Warehouse",
                    code: "WH01",
                    warehouse: "Main Warehouse",
                },
                {
                    id: 2,
                    name: "Rack A",
                    code: "R-A",
                    warehouse: "Main Warehouse",
                },
                {
                    id: 3,
                    name: "Rack B",
                    code: "R-B",
                    warehouse: "Main Warehouse",
                },
                {
                    id: 4,
                    name: "Production Floor",
                    code: "PROD",
                    warehouse: "Production Warehouse",
                },
                {
                    id: 5,
                    name: "Electronics Store",
                    code: "ELEC",
                    warehouse: "Electronics Store",
                },
            ],
        });
    }

    // =========================================================
    // PAGE TITLE
    // =========================================================

    get pageTitle() {
        const titles = {
            dashboard: "Dashboard",
            products: "Products",
            categories: "Categories",
            receipts: "Receipts",
            deliveries: "Delivery Orders",
            transfers: "Internal Transfers",
            adjustments: "Inventory Adjustments",
            history: "Move History",
            warehouses: "Warehouses",
            locations: "Locations",
        };

        return titles[this.state.activePage] || "StockSense";
    }

    // =========================================================
    // DASHBOARD KPIs
    // =========================================================

    get totalProducts() {
        return this.state.products.length;
    }

    get lowStockProducts() {
        return this.state.products.filter(
            (product) =>
                product.stock > 0 &&
                product.stock <= product.reorder
        ).length;
    }

    get outOfStockProducts() {
        return this.state.products.filter(
            (product) => product.stock <= 0
        ).length;
    }

    get pendingReceipts() {
        return this.state.receipts.filter(
            (receipt) =>
                receipt.status !== "Done" &&
                receipt.status !== "Canceled"
        ).length;
    }

    get pendingDeliveries() {
        return this.state.deliveries.filter(
            (delivery) =>
                delivery.status !== "Done" &&
                delivery.status !== "Canceled"
        ).length;
    }

    get pendingTransfers() {
        return this.state.transfers.filter(
            (transfer) =>
                transfer.status !== "Done" &&
                transfer.status !== "Canceled"
        ).length;
    }

    // =========================================================
    // PRODUCT FILTERING
    // =========================================================

    get filteredProducts() {
        const search =
            this.state.search.toLowerCase().trim();

        return this.state.products.filter((product) => {
            const matchesSearch =
                !search ||
                product.name
                    .toLowerCase()
                    .includes(search) ||
                product.sku
                    .toLowerCase()
                    .includes(search) ||
                product.category
                    .toLowerCase()
                    .includes(search);

            const matchesCategory =
                this.state.categoryFilter === "All" ||
                product.category ===
                    this.state.categoryFilter;

            const stockStatus =
                this.getProductStockStatus(product);

            const matchesStock =
                this.state.productStockFilter === "All" ||
                stockStatus ===
                    this.state.productStockFilter;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesStock
            );
        });
    }

    // =========================================================
    // CATEGORY FILTERING
    // =========================================================

    get filteredCategories() {
        const search =
            this.state.categorySearch
                .toLowerCase()
                .trim();

        return this.state.categories.filter(
            (category) => {
                if (!search) {
                    return true;
                }

                return category.name
                    .toLowerCase()
                    .includes(search);
            }
        );
    }

    // =========================================================
    // OPERATION FILTERING
    // =========================================================

    get filteredReceipts() {
        return this.filterOperations(
            this.state.receipts
        );
    }

    get filteredDeliveries() {
        return this.filterOperations(
            this.state.deliveries
        );
    }

    get filteredTransfers() {
        return this.filterOperations(
            this.state.transfers
        );
    }

    get filteredAdjustments() {
        const search =
            this.state.search.toLowerCase();

        return this.state.adjustments.filter(
            (item) => {
                const matchesSearch =
                    !search ||
                    item.reference
                        .toLowerCase()
                        .includes(search) ||
                    item.product
                        .toLowerCase()
                        .includes(search) ||
                    item.location
                        .toLowerCase()
                        .includes(search);

                const matchesStatus =
                    this.state.statusFilter ===
                        "All" ||
                    item.status ===
                        this.state.statusFilter;

                return (
                    matchesSearch &&
                    matchesStatus
                );
            }
        );
    }

    get filteredHistory() {
        const search =
            this.state.search.toLowerCase();

        return this.state.history.filter(
            (item) => {
                return (
                    !search ||
                    item.reference
                        .toLowerCase()
                        .includes(search) ||
                    item.contact
                        .toLowerCase()
                        .includes(search) ||
                    item.from
                        .toLowerCase()
                        .includes(search) ||
                    item.to
                        .toLowerCase()
                        .includes(search)
                );
            }
        );
    }

    filterOperations(items) {
        const search =
            this.state.search.toLowerCase();

        return items.filter((item) => {
            const matchesSearch =
                !search ||
                item.reference
                    .toLowerCase()
                    .includes(search) ||
                item.from
                    .toLowerCase()
                    .includes(search) ||
                item.to
                    .toLowerCase()
                    .includes(search) ||
                item.contact
                    .toLowerCase()
                    .includes(search);

            const matchesStatus =
                this.state.statusFilter ===
                    "All" ||
                item.status ===
                    this.state.statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }

    // =========================================================
    // NAVIGATION
    // =========================================================

    navigate(page) {
        this.state.activePage = page;

        this.state.search = "";

        this.state.statusFilter = "All";

        this.state.categoryFilter = "All";

        this.state.productStockFilter = "All";

        this.state.categorySearch = "";

        this.state.showProfile = false;

        this.state.showNotifications = false;

        this.state.modal = null;

        this.state.productView = null;

        this.state.categoryView = null;

        this.state.productError = "";

        this.state.categoryError = "";
    }

    // =========================================================
    // MODALS
    // =========================================================

    openModal(type) {
        this.state.modal = type;

        this.state.productError = "";

        this.state.categoryError = "";

        if (type === "product") {
            this.resetProductForm();
        }

        if (type === "category") {
            this.resetCategoryForm();
        }
    }

    closeModal() {
        this.state.modal = null;

        this.state.productView = null;

        this.state.categoryView = null;

        this.state.productError = "";

        this.state.categoryError = "";
    }

    // =========================================================
    // PRODUCT MANAGEMENT
    // =========================================================

    resetProductForm() {
        this.state.productForm = {
            id: null,
            name: "",
            sku: "",
            category:
                this.state.categories[0]?.name ||
                "Raw Material",
            unit: "Units",
            stock: 0,
            reserved: 0,
            reorder: 0,
        };

        this.state.productError = "";

        this.state.productView = null;
    }

    editProduct(product) {
        this.state.modal = "product-edit";

        this.state.productForm = {
            id: product.id,
            name: product.name,
            sku: product.sku,
            category: product.category,
            unit: product.unit,
            stock: product.stock,
            reserved: product.reserved,
            reorder: product.reorder,
        };

        this.state.productError = "";

        this.state.productView = null;
    }

    viewProduct(product) {
        this.state.productView = product;

        this.state.modal = "product-view";

        this.state.productError = "";
    }

    deleteProduct(product) {
        const confirmed = window.confirm(
            `Delete "${product.name}"?`
        );

        if (!confirmed) {
            return;
        }

        this.state.products =
            this.state.products.filter(
                (item) =>
                    item.id !== product.id
            );

        this.state.productView = null;

        this.state.modal = null;
    }

    getProductStockStatus(product) {
        if (product.stock <= 0) {
            return "Out of Stock";
        }

        if (product.stock <= product.reorder) {
            return "Low Stock";
        }

        return "In Stock";
    }

    saveProduct() {
        const form =
            this.state.productForm;

        const name =
            String(form.name || "").trim();

        const sku =
            String(form.sku || "").trim();

        if (!name) {
            this.state.productError =
                "Product name is required.";

            return;
        }

        if (!sku) {
            this.state.productError =
                "SKU / Code is required.";

            return;
        }

        const duplicateSku =
            this.state.products.some(
                (product) =>
                    product.sku
                        .toLowerCase() ===
                        sku.toLowerCase() &&
                    product.id !== form.id
            );

        if (duplicateSku) {
            this.state.productError =
                "This SKU already exists.";

            return;
        }

        const stock = Math.max(
            Number(form.stock) || 0,
            0
        );

        const reserved = Math.min(
            Math.max(
                Number(form.reserved) || 0,
                0
            ),
            stock
        );

        const reorder = Math.max(
            Number(form.reorder) || 0,
            0
        );

        if (form.id) {
            const index =
                this.state.products.findIndex(
                    (product) =>
                        product.id === form.id
                );

            if (index !== -1) {
                this.state.products.splice(
                    index,
                    1,
                    {
                        ...this.state.products[index],
                        name,
                        sku,
                        category:
                            form.category,
                        unit:
                            form.unit,
                        stock,
                        reserved,
                        reorder,
                    }
                );
            }
        } else {
            const nextId =
                this.state.products.length
                    ? Math.max(
                        ...this.state.products.map(
                            (product) =>
                                product.id
                        )
                    ) + 1
                    : 1;

            this.state.products.push({
                id: nextId,
                name,
                sku,
                category:
                    form.category,
                unit:
                    form.unit,
                stock,
                reserved,
                reorder,
            });
        }

        this.state.modal = null;

        this.state.productError = "";

        this.state.productView = null;
    }

    // =========================================================
    // CATEGORY MANAGEMENT
    // =========================================================

    resetCategoryForm() {
        this.state.categoryForm = {
            id: null,
            name: "",
        };

        this.state.categoryError = "";

        this.state.categoryView = null;
    }

    openCategoryModal() {
        this.state.modal = "category";

        this.resetCategoryForm();
    }

    editCategory(category) {
        this.state.modal = "category-edit";

        this.state.categoryForm = {
            id: category.id,
            name: category.name,
        };

        this.state.categoryError = "";

        this.state.categoryView = null;
    }

    viewCategory(category) {
        this.state.categoryView = category;

        this.state.modal = "category-view";

        this.state.categoryError = "";
    }

    deleteCategory(category) {
        const productCount =
            this.getCategoryProductCount(
                category
            );

        if (productCount > 0) {
            this.state.categoryError =
                `Cannot delete "${category.name}" because ${productCount} product(s) use this category.`;

            this.state.modal =
                "category-view";

            return;
        }

        const confirmed = window.confirm(
            `Delete "${category.name}"?`
        );

        if (!confirmed) {
            return;
        }

        this.state.categories =
            this.state.categories.filter(
                (item) =>
                    item.id !== category.id
            );

        this.state.categoryView = null;

        this.state.modal = null;

        this.state.categoryError = "";
    }

    saveCategory() {
        const form =
            this.state.categoryForm;

        const name =
            String(form.name || "").trim();

        if (!name) {
            this.state.categoryError =
                "Category name is required.";

            return;
        }

        const duplicate =
            this.state.categories.some(
                (category) =>
                    category.name
                        .toLowerCase() ===
                        name.toLowerCase() &&
                    category.id !== form.id
            );

        if (duplicate) {
            this.state.categoryError =
                "This category already exists.";

            return;
        }

        if (form.id) {
            const index =
                this.state.categories.findIndex(
                    (category) =>
                        category.id === form.id
                );

            if (index !== -1) {
                const oldName =
                    this.state.categories[index]
                        .name;

                this.state.categories.splice(
                    index,
                    1,
                    {
                        ...this.state.categories[index],
                        name,
                    }
                );

                this.state.products =
                    this.state.products.map(
                        (product) => {
                            if (
                                product.category ===
                                oldName
                            ) {
                                return {
                                    ...product,
                                    category:
                                        name,
                                };
                            }

                            return product;
                        }
                    );
            }
        } else {
            const nextId =
                this.state.categories.length
                    ? Math.max(
                        ...this.state.categories.map(
                            (category) =>
                                category.id
                        )
                    ) + 1
                    : 1;

            this.state.categories.push({
                id: nextId,
                name,
                products: 0,
            });
        }

        this.state.modal = null;

        this.state.categoryError = "";

        this.state.categoryView = null;
    }

    getCategoryProductCount(category) {
        return this.state.products.filter(
            (product) =>
                product.category ===
                category.name
        ).length;
    }

    // =========================================================
    // PROFILE / NOTIFICATIONS
    // =========================================================

    toggleProfile() {
        this.state.showProfile =
            !this.state.showProfile;

        this.state.showNotifications = false;
    }

    toggleNotifications() {
        this.state.showNotifications =
            !this.state.showNotifications;

        this.state.showProfile = false;
    }

    // =========================================================
    // STATUS HELPERS
    // =========================================================

    getStatusClass(status) {
        const statusMap = {
            Draft: "status-draft",
            Waiting: "status-waiting",
            Ready: "status-ready",
            Done: "status-done",
            Canceled: "status-canceled",
        };

        return (
            statusMap[status] ||
            "status-draft"
        );
    }

    getStockClass(product) {
        if (product.stock <= 0) {
            return "stock-out";
        }

        if (
            product.stock <=
            product.reorder
        ) {
            return "stock-low";
        }

        return "stock-good";
    }

    getFreeStock(product) {
        return Math.max(
            product.stock -
                product.reserved,
            0
        );
    }

    // =========================================================
    // GENERAL HELPERS
    // =========================================================

    formatNumber(value) {
        return new Intl.NumberFormat(
            "en-IN"
        ).format(value);
    }

    clearFilters() {
        this.state.search = "";

        this.state.statusFilter = "All";

        this.state.categoryFilter = "All";

        this.state.warehouseFilter = "All";

        this.state.typeFilter = "All";

        this.state.productStockFilter =
            "All";

        this.state.categorySearch = "";
    }

    getPageCount(items) {
        return items
            ? items.length
            : 0;
    }

    getToday() {
        return "26 Sep 2026";
    }

    // =========================================================
    // FORM SUBMISSION
    // =========================================================

    onSubmitForm(event) {
        event.preventDefault();

        if (
            this.state.modal ===
                "product" ||
            this.state.modal ===
                "product-edit"
        ) {
            this.saveProduct();

            return;
        }

        if (
            this.state.modal ===
                "category" ||
            this.state.modal ===
                "category-edit"
        ) {
            this.saveCategory();

            return;
        }

        this.closeModal();
    }
}

// =============================================================
// TEMPLATE
// =============================================================

StockSenseApp.template =
    "stocksense.StockSenseApp";

// =============================================================
// ODOO ACTION REGISTRATION
// =============================================================

registry
    .category("actions")
    .add(
        "stocksense.dashboard",
        StockSenseApp
    );