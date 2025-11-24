<script lang="ts">
import { onMount } from 'svelte';
import { fetchFromGo } from '$lib/api';
import Modal from '$lib/components/Modal.svelte';

interface Product {
    product_id: string;
    product_name: string;
    stock_quantity: number;
}

let products = $state<Product[]>([]);
let isLoading = $state(true);

let currentUsername = $state("Loading...");
let currentRole = $state("...");
let currentUserId = $state("");

let showUpdateModal = $state(false);
let updateId = $state('');
let updateName = $state('');
let updateQuantity = $state<number | ''>('');
let updateReason = $state('');
let isIncrease = $state(true); 

onMount(async () => {
    await Promise.all([loadProfile(), loadProducts()]);
});

async function loadProfile() {
    try {
        const res = await fetchFromGo("/auth/me");
        const data = res.data || res;
        currentUsername = data.username || "Guest";
        currentRole = data.role || "Unknown";
        currentUserId = data.user_id || "";
    } catch (e) { console.error(e); }
}

async function loadProducts() {
    try {
        const res = await fetchFromGo("/products");
        products = res.data || res;
    } catch (e: any) {
        alert("Gagal load products: " + e.message);
    } finally {
        isLoading = false;
    }
}

function openUpdate(product: Product) {
    updateId = product.product_id;
    updateName = product.product_name;
    updateQuantity = 0;
    updateReason = '';
    isIncrease = true;
    showUpdateModal = true;
}

async function handleUpdate() {
    if (updateQuantity === '' || updateQuantity === 0) {
        return alert("Masukkan jumlah stock (lebih besar dari 0)");
    }
    if (!updateReason) return alert("Masukkan alasan perubahan stock");

    const changeQuantity = isIncrease ? Number(updateQuantity) : -Number(updateQuantity);

    try {
        const res = await fetchFromGo("/inventory/adjust", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_id: updateId,
                user_id: currentUserId,
                change_quantity: changeQuantity,
                reason: updateReason
            })
        });

        // Update stock lokal
        products = products.map(p =>
            p.product_id === updateId
                ? { ...p, stock_quantity: p.stock_quantity + changeQuantity }
                : p
        );

        showUpdateModal = false;
        alert("Stock berhasil diupdate!");
    } catch (e: any) {
        alert("Gagal update stock: " + e.message);
    }
}
</script>

<style>
* { box-sizing: border-box; }

.selaincategory { background-color: #ffffff; min-height: 100vh; padding: 20px; }

.atas {
    width: 100%;
    overflow: hidden;
    margin-bottom: 20px;
    border-bottom: 2px solid #eee;
    padding-bottom: 20px;
}

.ataskiri { float: left; width: 50%; }
.ataskanan { float: right; width: 50%; text-align: right; padding-top: 20px; }

.bawah { display: block; }
.produk {
    position: relative;
    display: block;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 15px;
    margin-bottom: 15px;
    border: 1px solid #e0e0e0;
}
.productname { margin: 0; font-size: 18px; font-weight: bold; line-height: 35px; }
.tombolproduct { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); }
.quantity, .update {
    padding: 8px 15px;
    border: none;
    border-radius: 20px;
    margin-left: 5px;
    font-size: 14px;
    display: inline-block;
    transition: scale 0.1s ease;
}
.quantity { background-color: #6f85ff; color: white; }
.update { background-color: #34c759; color: white; cursor: pointer; }
.update:hover { scale: 110%; }

.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-size: 14px; color: #666; }
.form-group input, .form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
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
.btn-submit:hover { background-color: #0056b3; }
</style>

<div class="selaincategory">
    <div class="atas">
        <div class="ataskiri">
            <h1 style="margin:0; font-size: 24px;"><strong>WELCOME,</strong> {currentUsername}</h1>
            <h2 style="margin:5px 0 0 0; font-size: 18px; color: gray;"><strong>KAMU ADALAH,</strong> {currentRole}</h2>
        </div>
        <div class="ataskanan"></div>
    </div>

    <div class="bawah">
        {#if isLoading}
            <p style="text-align:center; padding:20px;">Loading products...</p>
        {:else}
            {#each products as p}
                <div class="produk">
                    <p class="productname">{p.product_name}</p>
                    <div class="tombolproduct">
                        <p class="quantity">{p.stock_quantity}</p>
                        <button class="update" on:click={() => openUpdate(p)}>Update</button>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>

<Modal show={showUpdateModal} title="Update Product" onClose={() => showUpdateModal = false}>
    <div class="form-group">
        <label>Action:</label>
        <select bind:value={isIncrease}>
            <option value={true}>Tambah Stock</option>
            <option value={false}>Kurangi Stock</option>
        </select>
    </div>

    <div class="form-group">
        <label>Jumlah Stock:</label>
        <input type="number" bind:value={updateQuantity} placeholder="Jumlah stock"/>
    </div>

    <div class="form-group">
        <label>Alasan:</label>
        <input type="text" bind:value={updateReason} placeholder="Masukkan alasan"/>
    </div>

    <button class="btn-submit" on:click={handleUpdate}>Update Stock</button>
</Modal>
