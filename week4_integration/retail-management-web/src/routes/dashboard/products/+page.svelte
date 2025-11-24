<style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; }
    
    .selaincategory {background-color: #ffffff; min-height: 100vh; }

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
    .details, .delete, .update { 
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
    .update:hover{
        scale: 110%;
    }
    .delete:hover{
        scale: 110%;
    }
    .details:hover{
        scale: 110%;
    }

    .popupdetail{ 
        position: fixed; 
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%); 
        background-color: white; 
        padding: 30px; 
        border-radius: 15px; 
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
        width: 400px; 
        display: none; 
        z-index: 1000; 
    }

    .popupadd{ 
        position: fixed; 
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%); 
        background-color: white; 
        padding: 30px; 
        border-radius: 15px; 
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
        width: 400px; 
        display: none; 
        z-index: 1000; 
    }

    .popupupdate{ 
        position: fixed; 
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%); 
        background-color: white; 
        padding: 30px; 
        border-radius: 15px; 
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
        width: 400px; 
        display: none; 
        z-index: 1000; 
    }

    .namapopup { 
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        margin-bottom: 20px; 
    }

    .gambarpopup { 
        width: 100%; 
        height: 200px; 
        background-color: #e0e0e0; 
        margin-bottom: 20px; 
        border-radius: 10px; 
    }   
    .descpopup p, input { 
        margin: 5px 0; 
        font-size: 16px; 
    }

    .descpopup input {
        border-radius: 5px;
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
        scale: 125%
    }

    .save{ 
        background-color: transparent; 
        border: none; 
        font-size: 20px; 
        cursor: pointer; 
        font-weight: bold;
        transition: scale 0.2s ease, color 0.1s ease;
    }

    .save:hover{ 
        color: #44a81d; 
        scale: 125%
    }


</style>

<div class="selaincategory">
    <div class="atas">
        <div class="ataskiri">  
            <h1 style="margin:0; font-size: 24px;"><strong>WELCOME,</strong> [username]</h1>
            <h2 style="margin:5px 0 0 0; font-size: 18px; color: gray;"><strong>KAMU ADALAH,</strong> [roles]</h2>
        </div>
        <div class="ataskanan">
            <button class="btn-header">
                + Tambah Products
            </button>
        </div>
    </div>

    <div class="bawah">
        <div class="produk">
            <p class="productname">Product Name</p>
            <div class="tombolproduct">    
                <button class="details">Details</button>
                <button class="update">Update</button>
                <button class="delete">Delete</button>
            </div>
        </div>
    </div>
</div>

<div class="popupdetail">   
    <div class="namapopup">
        <button class="closepopup">X</button>
        <h2><strong>Product Name</strong></h2>
    </div>
    <div class="gambarpopup"></div>
    <div class="descpopup">
        <p>In Stock: [stock]</p>
        <p>Purchasing Price: [purchase_price]</p>
        <p>Selling Price: [selling_price]</p>
        <p>Supplier: [supplier]</p>
        <p>Category [category]</p>
    </div>
</div>

<div class="popupadd">   
    <div class="namapopup">
        <button class="closepopup">X</button>
        <h2><strong>Product Name</strong></h2>
        <button class="save">Save</button>
    </div>
    <div class="gambarpopup"></div>
    <div class="descpopup">
        <p>Product Name: </p>
        <input type= "text" placeholder="insert name"/>
        <p>Purchasing Price: </p>
        <input type="text" placeholder="insert purchase price"/>
        <p>Selling Price: </p>
        <input type="text" placeholder="insert sell price"/>
        <p>Supplier: </p>
        <input type="text" placeholder="insert supplier"/>
        <p>Category</p>
         <input type="text" placeholder="insert category"/>
    </div>
</div>

<div class="popupupdate">   
    <div class="namapopup">
        <button class="closepopup">X</button>
        <h2><strong>Product Name</strong></h2>
        <button class="save">Update</button>
    </div>
    <div class="gambarpopup"></div>
    <div class="descpopup">
        <p>In Stock: </p>
        <input type= "text" placeholder="insert stock"/>
        <p>Purchasing Price: </p>
        <input type="text" placeholder="insert purchase price"/>
        <p>Selling Price: </p>
        <input type="text" placeholder="insert sell price"/>
        <p>Supplier: </p>
        <input type="text" placeholder="insert supplier"/>
        <p>Category</p>
         <input type="text" placeholder="insert category"/>
    </div>
</div>