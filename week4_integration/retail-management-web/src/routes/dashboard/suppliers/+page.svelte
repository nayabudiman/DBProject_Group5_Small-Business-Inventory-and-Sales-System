<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchFromGo } from '$lib/api';
    import Modal from '$lib/components/Modal.svelte';

    interface Supplier {
        supplier_id: string;
        supplier_name: string;
        phone: string;
        email: string;
    }

    let suppliers = $state<Supplier[]>([]);
    let isLoading = $state(true);

    let currentUsername = $state("Loading...");
    let currentRole = $state("...");


    let showAddModal = $state(false);
    let showUpdateModal = $state(false);


    let newName = $state('');
    let newPhone = $state('');
    let newEmail = $state('');

    let updateId = $state('');
    let updateName = $state('');
    let updatePhone = $state('');
    let updateEmail = $state('');

    onMount(async () => {
        await Promise.all([loadProfile(), loadSuppliers()]);
    });

    async function loadProfile() {
        try {
            const res = await fetchFromGo("/auth/me");
            const data = res.data || res;
            currentUsername = data.username || "Guest";
            currentRole = data.role || "Unknown";
        } catch {}
    }

    async function loadSuppliers() {
        try {
            const res = await fetchFromGo("/suppliers");
            suppliers = res.data || res;
        } catch (e: any) {
            alert("Gagal load suppliers: " + e.message);
        } finally {
            isLoading = false;
        }
    }

    async function handleSave() {
        if (!newName) return alert("Nama supplier tidak boleh kosong");

        try {
            const res = await fetchFromGo("/suppliers", {
                method: "POST",
                body: JSON.stringify({
                    supplier_name: newName,
                    phone: newPhone,
                    email: newEmail
                })
            });

            suppliers = [...suppliers, res.data || res];

            // Reset
            newName = '';
            newPhone = '';
            newEmail = '';
            showAddModal = false;
        } catch (e: any) {
            alert("Gagal tambah supplier: " + e.message);
        }
    }

    function openUpdate(s: Supplier) {
        updateId = s.supplier_id;
        updateName = s.supplier_name;
        updatePhone = s.phone;
        updateEmail = s.email;

        showUpdateModal = true;
    }

    async function handleUpdate() {
        if (!updateName) return alert("Nama supplier harus diisi");

        try {
            const res = await fetchFromGo(`/suppliers/${updateId}`, {
                method: "PUT",
                body: JSON.stringify({
                    supplier_name: updateName,
                    phone: updatePhone,
                    email: updateEmail
                })
            });

            const updated = res.data || res;

            suppliers = suppliers.map(s =>
                s.supplier_id === updateId ? updated : s
            );

            showUpdateModal = false;
        } catch (e: any) {
            alert("Gagal update supplier: " + e.message);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Yakin hapus supplier ini?")) return;

        try {
            await fetchFromGo(`/suppliers/${id}`, { method: "DELETE" });
            suppliers = suppliers.filter(s => s.supplier_id !== id);
        } catch (e: any) {
            alert("Gagal hapus: " + e.message);
        }
    }
</script>

<style>
    * { box-sizing: border-box; }

    .selaincategory { background-color: #ffffff; min-height: 100vh; }

    .atas {
        width: 100%;
        overflow: hidden;
        margin-bottom: 40px;
        border-bottom: 2px solid #eee;
        padding-bottom: 20px;
    }

    .ataskiri { float: left; width: 50%; }
    .ataskanan { float: right; width: 50%; text-align: right; padding-top: 20px; }

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
    .btn-header:hover { background-color: #00509f; }

    .produk {
        position: relative;
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

    .delete, .update {
        padding: 8px 15px;
        border: none;
        border-radius: 20px;
        margin-left: 5px;
        cursor: pointer;
        font-size: 14px;
        transition: scale 0.1s ease;
        color: white;
    }
    .delete { background-color: #ff3b30; }
    .update { background-color: #34c759; }
    .delete:hover, .update:hover { scale: 110%; }

    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; font-size: 14px; color: #666; }
    .form-group input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; }
    
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
            <h2 style="margin:5px 0 0 0; font-size: 18px; color: gray;">
                <strong>KAMU ADALAH,</strong> {currentRole}
            </h2>
        </div>
        <div class="ataskanan">
            <button class="btn-header" onclick={() => showAddModal = true}>
                + Tambah Supplier
            </button>
        </div>
    </div>

    {#if isLoading}
        <p style="text-align:center; padding:20px;">Loading suppliers...</p>
    {:else}
        {#each suppliers as s}
            <div class="produk">
                <p class="productname">{s.supplier_name}</p>
                <div class="tombolproduct">    
                    <button class="update" onclick={() => openUpdate(s)}>Update</button>
                    <button class="delete" onclick={() => handleDelete(s.supplier_id)}>Delete</button>
                </div>
            </div>
        {/each}
    {/if}
</div>


<Modal show={showAddModal} title="Tambah Supplier Baru" onClose={() => showAddModal = false}>
    
    <div class="form-group">
        <label>Nama Supplier</label>
        <input bind:value={newName} placeholder="nama" />
    </div>

    <div class="form-group">
        <label>Nomor Telepon</label>
        <input bind:value={newPhone} placeholder="contoh: 08123456789" />
    </div>

    <div class="form-group">
        <label>Email</label>
        <input bind:value={newEmail} placeholder="contoh: supplier@mail.com" />
    </div>

    <button class="btn-submit" onclick={handleSave}>Simpan Supplier</button>
</Modal>



<Modal show={showUpdateModal} title="Update Supplier" onClose={() => showUpdateModal = false}>
    
    <div class="form-group">
        <label>Nama Supplier</label>
        <input bind:value={updateName} />
    </div>

    <div class="form-group">
        <label>Nomor Telepon</label>
        <input bind:value={updatePhone} />
    </div>

    <div class="form-group">
        <label>Email</label>
        <input bind:value={updateEmail} />
    </div>

    <button class="btn-submit" onclick={handleUpdate}>Update Supplier</button>
</Modal>
