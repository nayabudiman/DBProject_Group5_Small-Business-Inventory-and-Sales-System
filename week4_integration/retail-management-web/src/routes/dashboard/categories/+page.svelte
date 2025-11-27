<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchFromGo } from '$lib/api';
    import Modal from '$lib/components/Modal.svelte';

    interface Category {
        category_id: string;
        category_name: string;
    }

    let categories = $state<Category[]>([]);
    let isLoading = $state(true);
    
    let currentUsername = $state('Loading...');
    let currentRole = $state('...');

    let showAddModal = $state(false);
    let showUpdateModal = $state(false);

    let addName = $state('');
    
    let updateId = $state('');
    let updateName = $state('');

    onMount(async () => {
        await Promise.all([loadProfile(), loadCategories()]);
    });

    async function loadProfile() {
        try {
            const res = await fetchFromGo('/auth/me');
            const data = res.data || res;
            currentUsername = data.username || "Guest";
            currentRole = data.role || "Unknown";
        } catch (e) { console.error(e); }
    }

    async function loadCategories() {
        try {
            const res = await fetchFromGo('/categories');
            categories = res.data || res;
        } catch (e: any) { alert("Gagal load categories: " + e.message); }
        finally { isLoading = false; }
    }

    async function handleSave() {
        if (!addName) return alert("Nama kategori tidak boleh kosong");
        
        try {
            const res = await fetchFromGo('/categories', {
                method: 'POST',
                body: JSON.stringify({ category_name: addName })
            });

            const newCat = res.data || res;
            categories = [...categories, newCat];
            
            showAddModal = false;
            addName = '';
            alert("Kategori berhasil ditambahkan!");
        } catch (e: any) { alert("Gagal tambah: " + e.message); }
    }

    function openUpdate(cat: Category) {
        updateId = cat.category_id;
        updateName = cat.category_name;
        showUpdateModal = true;
    }

    async function handleUpdate() {
        if (!updateName) return alert("Nama kategori tidak boleh kosong");

        try {
            const res = await fetchFromGo(`/categories/${updateId}`, {
                method: 'PUT',
                body: JSON.stringify({ category_name: updateName })
            });
            
            const updatedCat = res.data || res;

            const index = categories.findIndex(c => c.category_id === updateId);
            if (index !== -1) {
                categories[index] = updatedCat;
            }

            showUpdateModal = false;
            alert("Kategori berhasil diupdate!");
        } catch (e: any) { alert("Gagal update: " + e.message); }
    }

    async function handleDelete(id: string) {
        if (!confirm("Yakin hapus kategori ini?")) return;

        try {
            await fetchFromGo(`/categories/${id}`, { method: 'DELETE' });
            categories = categories.filter(c => c.category_id !== id);
        } catch (e: any) { alert("Gagal hapus: " + e.message); }
    }
</script>

<style>
    * { box-sizing: border-box; }
    :global(body) { margin: 0; font-family: Arial, Helvetica, sans-serif; }
    
    .selaincategory {background-color: #ffffff; min-height: 100vh; }

    .atas { width: 100%; overflow: hidden; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
    .ataskiri { float: left; width: 50%; }
    .ataskanan { float: right; width: 50%; text-align: right; padding-top: 20px; }

    .btn-header { display: inline-block; background-color: #007aff; color: white; padding: 10px 20px; border: none; border-radius: 20px; cursor: pointer; font-weight: bold; margin-left: 10px; text-decoration: none; font-size: 14px; transition: background-color 0.1s ease; }
    .btn-header:hover { background-color: #00509f; }
    
    .bawah { display: block; }
    .produk { position: relative; display: block; background-color: #f9f9f9; padding: 20px; border-radius: 15px; margin-bottom: 15px; border: 1px solid #e0e0e0; }
    .productname { margin: 0; font-size: 18px; font-weight: bold; display: inline-block; line-height: 35px; }
    .tombolproduct { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); }
    
    .delete, .update { padding: 8px 15px; border: none; border-radius: 20px; margin-left: 5px; cursor: pointer; font-size: 14px; transition: scale 0.1s ease; }
    .delete { background-color: #ff3b30; color: white; }
    .update { background-color: #34c759; color: white; }
    .update:hover{ scale: 110%; }
    .delete:hover{ scale: 110%; }

    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; font-size: 14px; color: #666; }
    .form-group input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 14px; }
    
    .btn-submit { width: 100%; background-color: #007aff; color: white; padding: 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 10px; }
    .btn-submit:hover { background-color: #0056b3; }
</style>

<div class="selaincategory">
    <div class="atas">
        <div class="ataskiri">  
            <h1 style="margin:0; font-size: 24px;"><strong>WELCOME,</strong> {currentUsername}</h1>
            <h2 style="margin:5px 0 0 0; font-size: 18px; color: gray;"><strong>KAMU ADALAH,</strong> {currentRole}</h2>
        </div>
        <div class="ataskanan">
            <button class="btn-header" onclick={() => showAddModal = true}>
                + Tambah Category
            </button>
        </div>
    </div>

    <div class="bawah">
        {#if isLoading}
            <p style="text-align:center; padding:20px;">Loading categories...</p>
        {:else}
            {#each categories as cat}
                <div class="produk">
                    <p class="productname">{cat.category_name}</p>
                    <div class="tombolproduct">    
                        <button class="update" onclick={() => openUpdate(cat)}>Update</button>
                        <button class="delete" onclick={() => handleDelete(cat.category_id)}>Delete</button>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>


<Modal show={showAddModal} title="Tambah Category Baru" onClose={() => showAddModal = false}>
    <div class="form-group">
        <label for="add-category-name">Nama Category</label>
        <input id="add-category-name" type="text" bind:value={addName} placeholder="contoh: makanan" required>
    </div>

    <button class="btn-submit" onclick={handleSave}>Simpan Category</button>
</Modal>


<Modal show={showUpdateModal} title="Update Category" onClose={() => showUpdateModal = false}>
    <div class="form-group">
        <label for="update-category-name">Nama Category</label>
        <input id="update-category-name" type="text" bind:value={updateName} required>
    </div>

    <button class="btn-submit" onclick={handleUpdate}>Update Category</button>
</Modal>
