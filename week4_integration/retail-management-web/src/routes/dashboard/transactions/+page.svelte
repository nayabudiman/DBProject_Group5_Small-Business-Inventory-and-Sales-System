<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchFromGo } from '$lib/api';

    interface User {
        user_id: string;
        username: string;
        role: string;
    }

    interface Product {
        product_id: string;
        product_name: string;
        selling_price: number;
        stock_quantity: number;
        qty_selected: number; 
    }

    interface TransactionItem {
        product_id: string;
        product_name: string;
        quantity: number;
        price: string;      
        sub_total: string;
    }

    interface Transaction {
        transaction_id: string;
        total_amount: string;
        created_at: string;
        items: TransactionItem[];
        username?: string;
    }

    let usersList = $state<User[]>([]);
    let products = $state<Product[]>([]);
    let history = $state<Transaction[]>([]);
    
    let isLoading = $state(true);
    let isProcessing = $state(false);
    
    let showHistoryPopup = $state(false);
    
    let showItemDetailPopup = $state(false);
    let selectedTransaction = $state<Transaction | null>(null);

    let currentUsername = $state('Loading...');
    let currentRole = $state('...');

    onMount(async () => {
        await Promise.all([loadProfile(), loadProducts(), loadUsersLookup()]);
        isLoading = false;
    });

    async function loadProfile() {
        try {
            const res = await fetchFromGo('/auth/me');
            const data = res.data || res;
            currentUsername = data.username || "Guest";
            currentRole = data.role || "Unknown";
        } catch (e) { console.error(e); }
    }

    async function loadProducts() {
        try {
            const res = await fetchFromGo('/products');
            let data = res.data || res;
            products = data.map((p: any) => ({
                ...p,
                selling_price: parseFloat(p.selling_price),
                qty_selected: 0
            }));
        } catch (e: any) { alert("Gagal load inventory: " + e.message); }
    }

    async function loadHistory() {
        try {
            const res = await fetchFromGo('/transactions');
            history = res.data || res; 
        } catch (e: any) { alert("Gagal ambil riwayat: " + e.message); }
    }

    async function loadUsersLookup() {
        try {
            const res = await fetchFromGo('/users');
            usersList = Array.isArray(res) ? res : (res.data || []);
        } catch (e) { console.error("Gagal load users lookup:", e); }
    }

    function getUsernameById(id: string) {
        if (!id) return "-";
        const found = usersList.find(u => u.user_id === id);
        return found ? found.username : id;
    }

    function increaseQty(id: string) {
        const idx = products.findIndex(p => p.product_id === id);
        if (idx !== -1) {
            if (products[idx].qty_selected < products[idx].stock_quantity) {
                products[idx].qty_selected++;
            } else {
                alert("Stok tidak mencukupi!");
            }
        }
    }

    function decreaseQty(id: string) {
        const idx = products.findIndex(p => p.product_id === id);
        if (idx !== -1 && products[idx].qty_selected > 0) {
            products[idx].qty_selected--;
        }
    }

    async function handleConfirmTransaction() {
        const itemsToBuy = products.filter(p => p.qty_selected > 0);
        if (itemsToBuy.length === 0) {
            alert("Pilih minimal satu produk untuk transaksi.");
            return;
        }

        const totalItems = itemsToBuy.reduce((sum, p) => sum + p.qty_selected, 0);
        const totalPrice = itemsToBuy.reduce((sum, p) => sum + (p.qty_selected * p.selling_price), 0);

        if (!confirm(`Konfirmasi Transaksi?\nTotal Item: ${totalItems}\nTotal Harga: Rp ${totalPrice.toLocaleString('id-ID')}`)) {
            return;
        }

        isProcessing = true;
        try {
            const payload = {
                items: itemsToBuy.map(p => ({
                    product_id: p.product_id,
                    quantity: p.qty_selected
                }))
            };
            await fetchFromGo('/transactions', { method: 'POST', body: JSON.stringify(payload) });
            alert("Transaksi Berhasil!");
            await loadProducts(); 
        } catch (e: any) {
            alert("Transaksi Gagal: " + e.message);
        } finally {
            isProcessing = false;
        }
    }


    function openHistory() {
        loadHistory();
        showHistoryPopup = true;
    }

    async function openItemDetails(trx: Transaction) {
        selectedTransaction = trx; 
        showItemDetailPopup = true;
        
        try {
            const res = await fetchFromGo(`/transactions/${trx.transaction_id}`);
            const detailedData = res.data || res;
            
            selectedTransaction = detailedData;
            
            console.log("Detail loaded:", detailedData);
        } catch (e) {
            console.error("Gagal load detail:", e);
            alert("Gagal mengambil detail item transaksi ini.");
        }
    }

    function formatDate(dateStr: string) {
        if (!dateStr) return "-";
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    }
    
    function formatMoney(amount: string | number) {
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return num.toLocaleString('id-ID');
    }
</script>

<style>
    * { box-sizing: border-box; }
    
    .selaincategory {background-color: #ffffff; min-height: 100vh; }
    .atas { width: 100%; overflow: hidden; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
    .ataskiri { float: left; width: 50%; }
    .ataskanan { float: right; width: 50%; text-align: right; padding-top: 20px; }

    .btn-header { display: inline-block; background-color: #007aff; color: white; padding: 10px 20px; border: none; border-radius: 20px; cursor: pointer; font-weight: bold; margin-left: 10px; text-decoration: none; font-size: 14px; transition: background-color 0.1s ease; }
    .btn-header:hover { background-color: #00509f; }
    
    .bawah { display: block; padding-right: 20px; }

    .produk { 
        position: relative; display: inline-block; width: 30%; vertical-align: top; margin-right: 2.5%; margin-bottom: 30px; 
        background-color: #f9f9f9; padding: 20px; border-radius: 15px; border: 1px solid #e0e0e0; 
        box-shadow: 0 2px 5px rgba(0,0,0,0.05); text-align: center; transition: transform 0.1s ease, border-color 0.1s ease;
    }
    .produk.active { border: 2px solid #007aff; background-color: #f0f8ff; }
    .produk:hover { background-color: #eaeaea; transform: translateY(-2px); }
    
    .productname { margin: 0; font-size: 18px; font-weight: bold; display: block; line-height: 1.2; min-height: 45px; margin-bottom: 10px; }
    .productnamesection p, .stoksection p { margin: 5px 0; color: #666; }
    .tombolproduct { display: inline-block; background-color: #e5e5ea; padding: 8px 15px; border-radius: 30px; margin-top: 15px; }
    .kurang, .tambah { padding: 0; width: 30px; height: 30px; line-height: 30px; font-size: 18px; cursor: pointer; display: inline-block; border-radius: 50%; color: white; border: none; vertical-align: middle; transition: transform 0.1s ease; }
    .kurang { background-color: #ff3b30; margin-right: 10px; }
    .tambah { background-color: #34c759; margin-left: 10px; }
    .kurang:hover, .tambah:hover { transform: scale(1.1); }
    .quantity { display: inline-block; font-size: 18px; font-weight: bold; width: 30px; vertical-align: middle; background: none; }

    .popup-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 999; }
    
    .popup { 
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
        background-color: white; padding: 25px; border-radius: 15px; 
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); width: 700px; max-width: 90%; 
        z-index: 1000; 
    }

    .popup-nested-overlay { z-index: 2000; }
    .popup-nested { z-index: 2001; width: 600px; }

    .namapopup { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
    .namapopup h2 { margin: 0; font-size: 20px; }

    .closepopup { background-color: transparent; border: none; font-size: 20px; cursor: pointer; font-weight: bold; color: #999; }
    .closepopup:hover { color: #ff3b30; }

    .table-scroll { max-height: 400px; overflow-y: auto; border: 1px solid #e0e0e0; border-radius: 8px; }
    .history-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .history-table th, .history-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #f0f0f0; }
    .history-table th { background-color: #f2f2f7; font-weight: bold; position: sticky; top: 0; }
    .history-table tr:nth-child(even) { background-color: #fcfcfc; }
    
    .history-table th:first-child, .history-table td:first-child { white-space: nowrap; width: 25%; }
    .history-table td:nth-child(2) { text-align: left; font-family: 'Courier New', Courier, monospace; font-weight: bold; }

    .btn-detail {
        background-color: #5856d6; color: white; border: none; padding: 6px 12px; 
        border-radius: 15px; cursor: pointer; font-size: 12px; font-weight: bold;
    }
    .btn-detail:hover { background-color: #4b49b6; }
</style>

<div class="selaincategory">
    <div class="atas">
        <div class="ataskiri">  
            <h1 style="margin:0; font-size: 24px;"><strong>WELCOME,</strong> {currentUsername}</h1>
            <h2 style="margin:5px 0 0 0; font-size: 18px; color: gray;"><strong>KAMU ADALAH,</strong> {currentRole}</h2>
        </div>
        <div class="ataskanan">
            <button class="btn-header" onclick={handleConfirmTransaction} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Konfirmasi Transaksi'}
            </button>
            <button class="btn-header" onclick={openHistory}>
                Riwayat Transaksi
            </button>
        </div>
    </div>

    <div class="bawah">
        {#if isLoading}
            <div style="text-align: center; padding: 40px; color: gray;">
                <h3>Memuat Produk...</h3>
            </div>
        {:else}
            {#each products as product}
                <div class="produk {product.qty_selected > 0 ? 'active' : ''}">
                    <div class="productnamesection">   
                        <h3 class="productname">{product.product_name}</h3>
                        <p>Rp {product.selling_price.toLocaleString('id-ID')}</p>
                    </div>
                    <div class="stoksection">   
                        <p>Stok: {product.stock_quantity}</p>
                    </div>
                    <div class="tombolproduct">   
                        <button class="kurang" onclick={() => decreaseQty(product.product_id)}><strong>-</strong></button>
                        <p class="quantity">{product.qty_selected}</p>
                        <button class="tambah" onclick={() => increaseQty(product.product_id)}><strong>+</strong></button>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>

{#if showHistoryPopup}
    <div class="popup-overlay" onclick={() => showHistoryPopup = false} role="button" tabindex="0" onkeydown={()=>{}}></div>
    
    <div class="popup">   
        <div class="namapopup">
            <h2><strong>Riwayat Transaksi</strong></h2>
            <button class="closepopup" onclick={() => showHistoryPopup = false}>X</button>
        </div>

        <div class="table-scroll">
            <table class="history-table">
                <thead>
                    <tr>
                        <th>Date Time</th>
                        <th>Total Amount</th>
                        <th>User</th>
                        <th>Action</th> </tr>
                </thead>
                <tbody>
                    {#each history as trx}
                        <tr>
                            <td>{formatDate(trx.created_at)}</td>
                            <td>Rp {formatMoney(trx.total_amount)}</td>
                            <td>{getUsernameById(trx.user_id)}</td>
                            <td style="text-align: center;">
                                <button class="btn-detail" onclick={() => openItemDetails(trx)}>
                                    Details
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
{/if}

{#if showItemDetailPopup && selectedTransaction}
    <div class="popup-overlay popup-nested-overlay" onclick={() => showItemDetailPopup = false} role="button" tabindex="0" onkeydown={()=>{}}></div>
    
    <div class="popup popup-nested">   
        <div class="namapopup">
            <div>
                <h2><strong>Transaction Details</strong></h2>
                <p style="margin:0; font-size: 12px; color: gray;">ID: {selectedTransaction.transaction_id}</p>
            </div>
            <button class="closepopup" onclick={() => showItemDetailPopup = false}>X</button>
        </div>

        <div class="table-scroll">
            <table class="history-table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th style="text-align: center;">Qty</th>
                        <th style="text-align: right;">Price</th>
                        <th style="text-align: right;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {#if selectedTransaction.items && selectedTransaction.items.length > 0}
                        {#each selectedTransaction.items as item}
                            <tr>
                                <td>{item.product_name}</td>
                                <td style="text-align: center;">{item.quantity}</td>
                                <td style="text-align: right;">Rp {formatMoney(item.price)}</td>
                                <td style="text-align: right;">Rp {formatMoney(item.sub_total)}</td>
                            </tr>
                        {/each}
                        <tr style="background-color: #eef7ff; font-weight: bold;">
                            <td colspan="3" style="text-align: right;">Total Amount:</td>
                            <td style="text-align: right;">Rp {formatMoney(selectedTransaction.total_amount)}</td>
                        </tr>
                    {:else}
                        <tr><td colspan="4" style="text-align:center;">No items found.</td></tr>
                    {/if}
                </tbody>
            </table>
        </div>
    </div>
{/if}