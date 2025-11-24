<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchFromGo } from '$lib/api';

    interface Category {
        category_id: string;
        category_name: string;
    }

    let categories = $state<Category[]>([]);
    let isLoading = $state(true);
    
    let currentUsername = $state('Loading...');
    let currentRole = $state('...');

    let showAddPopup = $state(false);
    let showUpdatePopup = $state(false);

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
            
            showAddPopup = false;
            addName = '';
            alert("Kategori berhasil ditambahkan!");
        } catch (e: any) { alert("Gagal tambah: " + e.message); }
    }

    function openUpdate(cat: Category) {
        updateId = cat.category_id;
        updateName = cat.category_name;
        showUpdatePopup = true;
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

            showUpdatePopup = false;
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

    .popupadd, .popupupdate { 
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

    .overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0,0,0,0.5); z-index: 999;
    }

    .namapopup { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  
    .descpopup p, input { margin: 5px 0; font-size: 16px; }
    .descpopup input { border-radius: 5px; border: 1px solid #ccc; padding: 5px; width: 100%; }

    .closepopup { background-color: transparent; border: none; font-size: 20px; cursor: pointer; font-weight: bold; transition: scale 0.2s ease, color 0.1s ease; }
    .closepopup:hover { color: #ff3b30; scale: 125% }

    .save { background-color: transparent; border: none; font-size: 20px; cursor: pointer; font-weight: bold; transition: scale 0.2s ease, color 0.1s ease; }
    .save:hover { color: #44a81d; scale: 125% }
</style>

<div class="selaincategory">
    <div class="atas">
        <div class="ataskiri">  
            <h1 style="margin:0; font-size: 24px;"><strong>WELCOME,</strong> {currentUsername}</h1>
            <h2 style="margin:5px 0 0 0; font-size: 18px; color: gray;"><strong>KAMU ADALAH,</strong> {currentRole}</h2>
        </div>
        <div class="ataskanan">
            <button class="btn-header" onclick={() => showAddPopup = true}>
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

{#if showAddPopup}
    <div class="overlay" onclick={() => showAddPopup = false} role="button" tabindex="0" onkeydown={()=>{}}></div>
    
    <div class="popupadd">   
        <div class="namapopup">
            <button class="closepopup" onclick={() => showAddPopup = false}>X</button>
            <h2><strong>Insert New Category</strong></h2>
            <button class="save" onclick={handleSave}>Save</button>
        </div>
        <div class="descpopup">
            <p>Category Name: </p>
            <input type="text" placeholder="insert name" bind:value={addName}/>
        </div>
    </div>
{/if}

{#if showUpdatePopup}
    <div class="overlay" onclick={() => showUpdatePopup = false} role="button" tabindex="0" onkeydown={()=>{}}></div>
    
    <div class="popupupdate">   
        <div class="namapopup">
            <button class="closepopup" onclick={() => showUpdatePopup = false}>X</button>
            <h2><strong>Category Name</strong></h2>
            <button class="save" onclick={handleUpdate}>Update</button>
        </div>
        <div class="descpopup">
            <p>Category Name: </p>
            <input type="text" placeholder="insert new category" bind:value={updateName}/>
        </div>
    </div>
{/if}