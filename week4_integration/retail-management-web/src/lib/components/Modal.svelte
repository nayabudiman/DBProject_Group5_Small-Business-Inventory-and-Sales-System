<script lang="ts">
    let { show, title, onClose, children } = $props();

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
            onClose();
        }
    }
</script>

{#if show}
    <div 
        class="backdrop" 
        role="button" 
        tabindex="0" 
        onclick={onClose} 
        onkeydown={handleKeydown}
    >
        <div 
            class="modal-content" 
            role="document" 
            onclick={(e) => e.stopPropagation()} 
            onkeydown={(e) => e.stopPropagation()}
            tabindex="-1"
        >
            <div class="modal-header">
                <h3>{title}</h3>
                <button class="close-btn" onclick={onClose}>&times;</button>
            </div>
            
            <div class="modal-body">
                {@render children()}
            </div>
        </div>
    </div>
{/if}

<style>
    .backdrop {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.2s;
        cursor: pointer;
    }

    .modal-content {
        background: white;
        padding: 20px;
        border-radius: 12px;
        width: 400px;
        max-width: 90%;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        animation: slideUp 0.2s;
        cursor: default;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
    }

    .modal-header h3 { margin: 0; color: #333; }

    .close-btn {
        background: none; border: none; font-size: 24px; cursor: pointer; color: #999;
    }
    .close-btn:hover { color: #333; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); } to { transform: translateY(0); } }
</style>