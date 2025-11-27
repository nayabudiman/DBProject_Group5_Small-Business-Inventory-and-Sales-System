<script>
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    let { children } = $props();

    // @ts-ignore
    function handleLogout(event) {
        event.preventDefault();
        document.cookie = "session_token=; path=/; max-age=0; SameSite=Lax";
        goto('/auth');
    }
</script>

<style>
    :global(body) { margin: 0; font-family: Arial, Helvetica, sans-serif; }
    :global(*) { box-sizing: border-box; }
    
    .category { 
        float: left; 
        width: 250px; 
        background-color: #f2f2f7; 
        height: 100vh; 
        padding: 20px; 
        border-right: 1px solid #ccc; 
        position: fixed;
        top: 0;
        left: 0;
    }

    .catbutton { 
        display: block; 
        width: 100%; 
        background-color: #dadade; 
        padding: 15px; 
        margin-bottom: 15px; 
        border: none; 
        border-radius: 10px; 
        cursor: pointer; 
        text-align: center; 
        font-weight: bold; 
        text-decoration: none; 
        color: black;         
        transition: scale 0.1s ease;
    }
    .catbutton:hover { 
        background-color: #c5c5c9; 
        scale: 105% 
    }
    .catbutton_logout { 
        color: white;
        display: block; 
        width: 100%; 
        background-color: #fb3636; 
        padding: 15px; 
        margin-bottom: 15px; 
        border: none; 
        border-radius: 10px; 
        cursor: pointer; 
        text-align: center; 
        font-weight: bold; 
        text-decoration: none;       
        transition: scale 0.1s ease;    
    }
    .catbutton_logout:hover { 
        background-color: rgb(254, 0, 0); 
        scale: 105% 
    }

    .selaincategory { 
        margin-left: 250px; 
        padding: 40px; 
        background-color: #ffffff; 
        min-height: 100vh; 
    }

    .active {
        background-color: #007aff;
        color: white;
    }
</style>

<div class="category">
    <a href="/dashboard/users" class="catbutton" class:active={$page.url.pathname.includes('/users')}>User Management</a>
    <a href="/dashboard/categories" class="catbutton">Categories</a>
    <a href="/dashboard/suppliers" class="catbutton">Suppliers</a>
    <a href="/dashboard/products" class="catbutton">Products</a>
    <a href="/dashboard/inventory" class="catbutton">Inventory</a>
    <a href="/dashboard/transactions" class="catbutton">Transactions</a>
    <a href="/auth" onclick={handleLogout} class="catbutton_logout">Logout</a>
</div>

<div class="selaincategory">
    {@render children()} 
</div>