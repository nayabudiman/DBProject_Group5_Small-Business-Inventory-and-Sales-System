<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchFromGo } from '$lib/api';
    import Modal from '$lib/components/Modal.svelte';

    interface Product {
        product_id: string;
        product_name: string;
        purchase_price: string;
        selling_price: string;
        stock_quantity: number;
        category_id: string;
        supplier_id: string;
    }

    interface Category {
        category_id: string;
        category_name: string;
    }

    interface Supplier {
        supplier_id: string;
        supplier_name: string;
    }

    let products = $state<Product[]>([]);
    let categories = $state<Category[]>([]);
    let suppliers = $state<Supplier[]>([]);
    let isLoading = $state(true);
    let successMsg = $state('');
    let currentUsername = $state('Loading...');
    let currentRole = $state('...');
    let showAddModal = $state(false);
    let showUpdateModal = $state(false);

    let formId = $state('');
    let formName = $state('');
    let formPurchase = $state('');
    let formSelling = $state('');
    let formStock = $state('');
    let formCatId = $state('');
    let formSupId = $state('');

    let showDetailPopup = $state(false);
    let detailProduct = $state<Product | null>(null);
    let detailCategoryName = $state('-');
    let detailSupplierName = $state('-');

    onMount(async () => {
        await Promise.all([
            loadProfile(),
            loadCategories(),
            loadSuppliers(),
            loadProducts()
        ]);
        isLoading = false;
    });

    async function loadProfile() {
        try {
            const response = await fetchFromGo('/auth/me');
            const data = response.data || response;
            currentUsername = data.username || "Guest";
            currentRole = data.role || "Unknown";
        } catch (e) { console.error(e); }
    }

    async function loadCategories() {
        try {
            const res = await fetchFromGo('/categories');
            categories = res.data || res;
        } catch (e) { console.error("Err Cats:", e); }
    }

    async function loadSuppliers() {
        try {
            const res = await fetchFromGo('/suppliers');
            suppliers = res.data || res;
        } catch (e) { console.error("Err Sups:", e); }
    }

    async function loadProducts() {
        try {
            const res = await fetchFromGo('/products');
            products = res.data || res;
        } catch (e: any) { alert("Gagal load products: " + e.message); }
    }

    function getCategoryName(id: string) {
        const found = categories.find(c => c.category_id === id);
        return found ? found.category_name : id;
    }

    function getSupplierName(id: string) {
        const found = suppliers.find(s => s.supplier_id === id);
        return found ? found.supplier_name : id;
    }

    function openAddModal() {
        formName = '';
        formPurchase = '';
        formSelling = '';
        formStock = '';
        formCatId = '';
        formSupId = '';
        showAddModal = true;
    }

    async function handleAddSubmit(e: Event) {
        e.preventDefault();
        try {
            const payload = {
                product_name: formName,
                purchase_price: parseFloat(formPurchase),
                selling_price: parseFloat(formSelling),
                stock_quantity: parseInt(formStock),
                category_id: formCatId,
                supplier_id: formSupId
            };

            const res = await fetchFromGo('/products', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            const newProd = res.data || res;
            products = [...products, newProd];

            showAddModal = false;
            showSuccess("Produk berhasil ditambahkan!");
        } catch (e: any) { alert("Gagal tambah: " + e.message); }
    }

    async function handleDetail(id: string) {
        try {
            const res = await fetchFromGo(`/products/${id}`);
            const data = res.data || res;

            detailProduct = data;
            detailCategoryName = getCategoryName(data.category_id);
            detailSupplierName = getSupplierName(data.supplier_id);

            showDetailPopup = true;
        } catch (e: any) { alert("Gagal ambil detail: " + e.message); }
    }

    function openUpdateModal(p: Product) {
        formId = p.product_id;
        formName = p.product_name;
        formPurchase = p.purchase_price;
        formSelling = p.selling_price;
        formStock = p.stock_quantity.toString();
        formCatId = p.category_id;
        formSupId = p.supplier_id;
        showUpdateModal = true;
    }

    async function handleUpdateSubmit(e: Event) {
        e.preventDefault();
        try {
            const payload = {
                product_name: formName,
                purchase_price: parseFloat(formPurchase),
                selling_price: parseFloat(formSelling),
                category_id: formCatId,
                supplier_id: formSupId
            };

            const res = await fetchFromGo(`/products/${formId}`, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });
            const updatedData = res.data || res;

            const idx = products.findIndex(p => p.product_id === formId);
            if (idx !== -1) {
                products[idx] = { ...products[idx], ...updatedData };
            }

            showUpdateModal = false;
            showSuccess("Produk berhasil diupdate!");
        } catch (e: any) { alert("Gagal update: " + e.message); }
    }

    async function handleDelete(id: string) {
        if (!confirm("Yakin hapus produk ini?")) return;
        try {
            await fetchFromGo(`/products/${id}`, { method: 'DELETE' });
            products = products.filter(p => p.product_id !== id);
            showSuccess("Produk dihapus.");
        } catch (e: any) { alert("Gagal hapus: " + e.message); }
    }

    function showSuccess(msg: string) {
        successMsg = msg;
        setTimeout(() => successMsg = '', 3000);
    }
</script>

<style>
    * {
        box-sizing: border-box;
    }

    .selaincategory {
        background-color: #ffffff;
        min-height: 100vh;
    }

    .atas {
        width: 100%;
        overflow: hidden;
        margin-bottom: 40px;
        border-bottom: 2px solid #eee;
        padding-bottom: 20px;
    }

    .ataskiri {
        float: left;
        width: 50%;
    }

    .ataskanan {
        float: right;
        width: 50%;
        text-align: right;
        padding-top: 20px;
    }

    .btn-header {
        display: inline-block;
        background-color: #007aff;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-weight: bold;
        margin-left: 10px;
        text-decoration: none;
        font-size: 14px;
        transition: background-color 0.1s ease;
    }

    .btn-header:hover {
        background-color: #00509f;
    }

    .bawah {
        display: block;
    }

    .produk {
        position: relative;
        display: block;
        background-color: #f9f9f9;
        padding: 20px;
        border-radius: 15px;
        margin-bottom: 15px;
        border: 1px solid #e0e0e0;
    }

    .productname {
        margin: 0;
        font-size: 18px;
        font-weight: bold;
        display: inline-block;
        line-height: 35px;
    }

    .tombolproduct {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
    }

    .details,
    .delete,
    .update {
        padding: 8px 15px;
        border: none;
        border-radius: 20px;
        margin-left: 5px;
        cursor: pointer;
        font-size: 14px;
        transition: scale 0.1s ease;
    }

    .details {
        background-color: rgb(62, 48, 255);
        color: white;
    }

    .delete {
        background-color: #ff3b30;
        color: white;
    }

    .update {
        background-color: #34c759;
        color: white;
    }

    .update:hover,
    .delete:hover,
    .details:hover {
        scale: 110%;
    }

    .popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
    }

    .popup {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        width: 400px;
        z-index: 1000;
    }

    .namapopup {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .descpopup p {
        margin: 5px 0;
        font-size: 16px;
        border-bottom: 1px dashed #eee;
        padding-bottom: 5px;
    }

    .closepopup {
        background-color: transparent;
        border: none;
        font-size: 20px;
        cursor: pointer;
        font-weight: bold;
        transition: scale 0.2s ease, color 0.1s ease;
    }

    .closepopup:hover {
        color: #ff3b30;
        scale: 125%;
    }

    .success-banner {
        background-color: #d4edda;
        color: #155724;
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 20px;
        border: 1px solid #c3e6cb;
        text-align: center;
    }

    .form-group {
        margin-bottom: 15px;
    }

    .form-group label {
        display: block;
        margin-bottom: 5px;
        font-size: 14px;
        color: #666;
    }

    .form-group input,
    .form-group select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 14px;
    }

    .btn-submit {
        width: 100%;
        background-color: #007aff;
        color: white;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        margin-top: 10px;
    }
</style>

<div class="selaincategory">
    <div class="atas">
        <div class="ataskiri">
            <h1 style="margin:0; font-size: 24px;">
                <strong>WELCOME,</strong> {currentUsername}
            </h1>
            <h2 style="margin:5px 0 0 0; font-size: 18px; color: gray;">
                <strong>KAMU ADALAH,</strong> {currentRole}
            </h2>
        </div>
        <div class="ataskanan">
            <button class="btn-header" onclick={openAddModal}>
                + Tambah Products
            </button>
        </div>
    </div>

    <div class="bawah">
        {#if successMsg}
            <div class="success-banner">{successMsg}</div>
        {/if}

        {#if isLoading}
            <div class="produk" style="text-align: center;">Loading products...</div>
        {:else}
            {#each products as product}
                <div class="produk">
                    <p class="productname">{product.product_name}</p>
                    <div class="tombolproduct">
                        <button class="details" onclick={() => handleDetail(product.product_id)}>Details</button>
                        <button class="update" onclick={() => openUpdateModal(product)}>Update</button>
                        <button class="delete" onclick={() => handleDelete(product.product_id)}>Delete</button>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>

{#if showDetailPopup && detailProduct}
    <div class="popup-overlay" onclick={() => showDetailPopup = false} role="button" tabindex="0" onkeydown={() => {}}></div>
    <div class="popup">
        <div class="namapopup">
            <h2><strong>{detailProduct.product_name}</strong></h2>
            <button class="closepopup" onclick={() => showDetailPopup = false}>X</button>
        </div>
        <div class="descpopup">
            <p><strong>Stock:</strong> {detailProduct.stock_quantity}</p>
            <p><strong>Purchase:</strong> Rp {detailProduct.purchase_price}</p>
            <p><strong>Selling:</strong> Rp {detailProduct.selling_price}</p>
            <p><strong>Supplier:</strong> {detailSupplierName}</p>
            <p><strong>Category:</strong> {detailCategoryName}</p>
        </div>
    </div>
{/if}

<Modal show={showAddModal} title="Tambah Produk" onClose={() => showAddModal = false}>
    <form onsubmit={handleAddSubmit}>
        <div class="form-group">
            <label for="p_name">Nama Produk</label>
            <input type="text" id="p_name" bind:value={formName} required>
        </div>
        <div class="form-group">
            <label for="p_buy">Harga Beli</label>
            <input type="number" step="0.01" id="p_buy" bind:value={formPurchase} required>
        </div>
        <div class="form-group">
            <label for="p_sell">Harga Jual</label>
            <input type="number" step="0.01" id="p_sell" bind:value={formSelling} required>
        </div>
        <div class="form-group">
            <label for="p_stock">Stok Awal</label>
            <input type="number" id="p_stock" bind:value={formStock} required>
        </div>
        <div class="form-group">
            <label for="p_cat">Kategori</label>
            <select id="p_cat" bind:value={formCatId} required>
                <option value="">-- Pilih Kategori --</option>
                {#each categories as c}
                    <option value={c.category_id}>{c.category_name}</option>
                {/each}
            </select>
        </div>
        <div class="form-group">
            <label for="p_sup">Supplier</label>
            <select id="p_sup" bind:value={formSupId} required>
                <option value="">-- Pilih Supplier --</option>
                {#each suppliers as s}
                    <option value={s.supplier_id}>{s.supplier_name}</option>
                {/each}
            </select>
        </div>
        <button type="submit" class="btn-submit">Simpan Produk</button>
    </form>
</Modal>

<Modal show={showUpdateModal} title="Update Produk" onClose={() => showUpdateModal = false}>
    <form onsubmit={handleUpdateSubmit}>
        <div class="form-group">
            <label for="u_name">Nama Produk</label>
            <input type="text" id="u_name" bind:value={formName} required>
        </div>
        <div class="form-group">
            <label for="u_buy">Harga Beli</label>
            <input type="number" step="0.01" id="u_buy" bind:value={formPurchase} required>
        </div>
        <div class="form-group">
            <label for="u_sell">Harga Jual</label>
            <input type="number" step="0.01" id="u_sell" bind:value={formSelling} required>
        </div>
        <div class="form-group">
            <label for="u_cat">Kategori</label>
            <select id="u_cat" bind:value={formCatId} required>
                {#each categories as c}
                    <option value={c.category_id}>{c.category_name}</option>
                {/each}
            </select>
        </div>
        <div class="form-group">
            <label for="u_sup">Supplier</label>
            <select id="u_sup" bind:value={formSupId} required>
                {#each suppliers as s}
                    <option value={s.supplier_id}>{s.supplier_name}</option>
                {/each}
            </select>
        </div>
        <button type="submit" class="btn-submit">Update Perubahan</button>
    </form>
</Modal>>