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
        padding-right: 20px; 
    }

    .produk { 
        position: relative; 
        display: inline-block; 
        width: 20%; 
        vertical-align: top; 
        margin-right: 2.5%; 
        margin-bottom: 30px; 
        background-color: #f9f9f9; 
        padding: 20px; 
        border-radius: 15px; 
        border: 1px solid #e0e0e0; 
        box-shadow: 0 2px 5px rgba(0,0,0,0.05); 
        text-align: center;
        cursor: pointer;
        transition: background-color 0.2s ease, transform 0.1s ease;
    }
    .produk:hover {
        background-color: #eaeaea;
        transform: translateY(-2px);
        border-color: #007aff;
    }

    .productnamesection {
        display: block;
        text-align: center;
    }

    .productname { 
        margin: 0; 
        font-size: 18px; 
        font-weight: bold; 
        display: block; 
        line-height: 1.2;
        min-height: 45px; 
        margin-bottom: 10px;
    }

    .productnamesection p, .stoksection p {
        margin: 5px 0;
        color: #666;
    }

    .stoksection {
        display: block;
        text-align: center;
    }

    .tombolproduct { 
        display: inline-block; 
        background-color: #e5e5ea;
        padding: 8px 15px;
        border-radius: 30px;
        margin-top: 15px;
    }

    .kurang, .tambah {
        padding: 0;
        width: 30px; 
        height: 30px; 
        line-height: 30px; 
        font-size: 18px; 
        cursor: pointer;
        display: inline-block;
        border-radius: 50%; 
        color: white;
        border: none;
        vertical-align: middle;
        transition: transform 0.1s ease;
    }

    .kurang { 
        background-color: #ff3b30; 
        margin-right: 10px;
    }

    .tambah { 
        background-color: #34c759; 
        margin-left: 10px;
    }

    .kurang:hover, .tambah:hover {
        transform: scale(1.1);
    }

    .quantity {
        display: inline-block;
        font-size: 18px;
        font-weight: bold;
        width: 30px;
        vertical-align: middle;
        background: none;
    }

    .popup { 
        position: fixed; 
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%); 
        background-color: white; 
        padding: 25px; 
        border-radius: 15px; 
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); 
        width: 600px; 
        max-width: 90%;
        display: none; 
        z-index: 1000; 
    }

    .namapopup { 
        display: block;
        overflow: hidden;
        margin-bottom: 20px;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
    }

    .namapopup h2 {
        float: left;
        margin: 0;
        font-size: 20px;
    }

    .closepopup { 
        float: right;
        background-color: transparent; 
        border: none; 
        font-size: 20px; 
        cursor: pointer; 
        font-weight: bold;
        color: #999;
    }
    .closepopup:hover {
        color: #ff3b30; 
    }

    .table-scroll {
        max-height: 300px;
        overflow-y: auto;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
    }

    .history-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
    }

    .history-table th, .history-table td {
        padding: 12px 15px;
        text-align: left;
        border-bottom: 1px solid #f0f0f0;
    }

    .history-table th {
        background-color: #f2f2f7;
        font-weight: bold;
        position: sticky; 
        top: 0;
        z-index: 1;
    }

    .history-table tr:nth-child(even) {
        background-color: #fcfcfc;
    }
    
    .history-table tr:hover {
        background-color: #f0f0f5;
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
                Konfirmasi Transaksi
            </button>
            <button class="btn-header">
                Riwayat Transaksi
            </button>
        </div>
    </div>

    <div class="bawah">
        <div class="produk">
            <div class= "productnamesection">   
                <h3 class="productname"><strong>[Product Name]</strong></h3>
                <p>[Harga]</p>
            </div>
            <div class="stoksection">   
                <p>[Jumlah Stok]</p>
            </div>
            <div class="tombolproduct">   
                <button class="kurang"><strong>-</strong></button>
                <p class= "quantity">[Q]</p>
                <button class="tambah"><strong>+</strong></button>
            </div>
        </div>
    </div>
</div>

<div class="popup">   
    <div class="namapopup">
        <h2><strong>Riwayat Transaksi</strong></h2>
        <button class="closepopup">X</button>
    </div>

    <div class="table-scroll">
        <table class="history-table">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Qty</th>
                    <th>Date Time</th>
                    <th>User</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Gaming Mouse</td>
                    <td>2</td>
                    <td>24-Nov 10:30</td>
                    <td>Admin</td>
                </tr>
                <tr>
                    <td>Keyboard</td>
                    <td>1</td>
                    <td>24-Nov 11:15</td>
                    <td>Staff</td>
                </tr>
                 <tr>
                    <td>Monitor 24"</td>
                    <td>1</td>
                    <td>23-Nov 09:00</td>
                    <td>Admin</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>