<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchFromGo } from '$lib/api';
    
    import Modal from '$lib/components/Modal.svelte';

    interface User {
        user_id: string;
        username: string;
        role: string;
    }

    let users = $state<User[]>([]);
    let isLoading = $state(true);
    let errorMsg = $state('');
    let successMsg = $state('');

    let showAddModal = $state(false);
    let formUsername = $state('');
    let formPassword = $state('');
    let formRole = $state('cashier');

    onMount(async () => {
        await loadUsers();
    });

    async function loadUsers() {
        try {
            const response = await fetchFromGo('/users');
            
            console.log("Data User dari API:", response); 

            users = response.data || response; 
        } catch (error: any) {
            errorMsg = error.message;
        } finally {
            isLoading = false;
        }
    }

    function closeModal() {
        showAddModal = false;
        formUsername = '';
        formPassword = '';
        formRole = 'cashier';
        errorMsg = '';
    }

    async function handleGetRoles() {
        try {
            const response = await fetchFromGo('/roles');
            const rolesData = response.data || response;
            alert("Daftar Role:\n" + JSON.stringify(rolesData, null, 2));
        } catch (error: any) {
            alert("Gagal ambil role: " + error.message);
        }
    }

    async function handleAddUserSubmit(e: Event) {
        e.preventDefault();
        
        try {
            const newUser = await fetchFromGo('/users', {
                method: 'POST',
                body: JSON.stringify({ 
                    username: formUsername, 
                    password: formPassword, 
                    role: formRole 
                })
            });

            const addedUser = newUser.data || newUser;
            users = [...users, addedUser]; 
            
            closeModal();
            successMsg = "Berhasil menambahkan user baru!";
            
            setTimeout(() => successMsg = '', 3000);

        } catch (error: any) {
            alert("Gagal: " + error.message); 
        }
    }

    async function handleDelete(user_id: string) {
        if (!confirm("Apakah Anda yakin ingin menghapus user ini?")) return;

        try {
            await fetchFromGo(`/users/${user_id}`, {
                method: 'DELETE'
            });

            users = users.filter(u => u.user_id !== user_id);
            
        } catch (error: any) {
            alert("Gagal menghapus: " + error.message);
        }
    }
</script>

<style>
    .atas { width: 100%; overflow: hidden; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
    .ataskiri { float: left; width: 50%; }
    .ataskanan { float: right; width: 50%; text-align: right; padding-top: 20px; }
    .btn-header { display: inline-block; background-color: #007aff; color: white; padding: 10px 20px; border: none; border-radius: 20px; cursor: pointer; font-weight: bold; margin-left: 10px; text-decoration: none; font-size: 14px; transition: background-color 0.1s ease; }
    .btn-header:hover { background-color: #00509f; }
    .bawah { display: block; }
    .produk { position: relative; display: block; background-color: #f9f9f9; padding: 20px; border-radius: 15px; margin-bottom: 15px; border: 1px solid #e0e0e0; }
    .username { margin: 0; font-size: 18px; font-weight: bold; display: inline-block; line-height: 35px; }
    .role-label { color: gray; font-size: 14px; margin-left: 10px; font-weight: normal; }
    .tomboluser { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); }
    .delete, .update { padding: 8px 15px; border: none; border-radius: 20px; margin-left: 5px; cursor: pointer; font-size: 14px; transition: scale 0.1s ease; }
    .delete { background-color: #ff3b30; color: white; }
    .update { background-color: #34c759; color: white; }
    .update:hover{ scale: 110%; }
    .delete:hover{ scale: 110%; }

    .form-group { margin-bottom: 15px; }
    .form-group label { display: block; margin-bottom: 5px; font-size: 14px; color: #666; }
    .form-group input, .form-group select {
        width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 14px;
    }
    .btn-submit {
        width: 100%; background-color: #007aff; color: white; padding: 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 10px;
    }
    .btn-submit:hover { background-color: #0056b3; }

    .success-banner {
        background-color: #d4edda; color: #155724; padding: 15px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #c3e6cb; text-align: center;
    }
</style>

<div class="atas">
    <div class="ataskiri">  
        <h1 style="margin:0; font-size: 24px;"><strong>WELCOME,</strong> Admin</h1>
    </div>
    <div class="ataskanan">
        <button class="btn-header" onclick={() => showAddModal = true}>
            + Tambah Pengguna
        </button>
        <button class="btn-header">Dapatkan Semua Role</button>
    </div>
</div>

<div class="bawah">
    {#if successMsg}
        <div class="success-banner">{successMsg}</div>
    {/if}

    {#if isLoading}
        <div class="produk" style="text-align: center;">Loading data...</div>
    {:else}
        {#each users as user}
            <div class="produk">
                <p class="username">
                    {user.username} 
                    <span class="role-label">({user.role})</span>
                </p>
                <div class="tomboluser">    
                    <button class="update">Update</button>
                    
                    <button class="delete" onclick={() => handleDelete(user.user_id)}>
                        Delete
                    </button>
                </div>
                </div>
        {/each}
    {/if}
</div>

<Modal 
    show={showAddModal} 
    title="Tambah User Baru" 
    onClose={closeModal}
>
    <form onsubmit={handleAddUserSubmit}>
        <div class="form-group">
            <label for="uname">Username</label>
            <input type="text" id="uname" bind:value={formUsername} required placeholder="Contoh: cashier_budi">
        </div>

        <div class="form-group">
            <label for="pass">Password</label>
            <input type="password" id="pass" bind:value={formPassword} required placeholder="******">
        </div>

        <div class="form-group">
            <label for="role">Role</label>
            <select id="role" bind:value={formRole}>
                <option value="cashier">Cashier</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
            </select>
        </div>

        <button type="submit" class="btn-submit">Simpan User</button>
    </form>
</Modal>