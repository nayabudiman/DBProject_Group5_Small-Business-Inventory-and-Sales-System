<script lang="ts">
    import { goto } from '$app/navigation';
    import { env } from '$env/dynamic/public';

    let showPassword = $state(false);
    let username = $state('');
    let password = $state('');
    let errorMessage = $state('');
    let isLoading = $state(false);

    async function handleLogin(event: SubmitEvent) {
        event.preventDefault();
        isLoading = true;
        errorMessage = '';

        try {
            const response = await fetch(`${env.PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Gagal login');
            }

            document.cookie = `session_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;

            goto('/dashboard/users');

        } catch (err: any) {
            errorMessage = err.message;
        } finally {
            isLoading = false;
        }
    }
</script>

{#if errorMessage}
    <div class="mb-4 p-3 bg-red-500/20 text-red-200 rounded-lg text-sm text-center border border-red-500/50">
        {errorMessage}
    </div>
{/if}

<div class="min-h-screen w-full bg-zinc-950 flex items-center justify-center p-4">
    
    <div class="bg-zinc-800 w-full max-w-md p-8 rounded-2xl shadow-xl flex flex-col gap-6">
        
        <div class="text-center">
            <h1 class="text-3xl font-bold text-white">Welcome Back</h1>
            <p class="text-zinc-400 mt-2">Please sign in to your retail account</p>
        </div>

        <form onsubmit={handleLogin} class="flex flex-col gap-4">
            
            <div class="flex flex-col gap-1">
                <label for="username" class="text-sm font-medium text-zinc-300">Username</label>
                <input 
                    id="username"
                    type="text"
                    bind:value={username}
                    placeholder="Masukkan username"
                    class="w-full rounded-xl border-none bg-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 py-3 px-4 transition-all"
                />
            </div>

            <div class="flex flex-col gap-1 relative">
                <label for="password" class="text-sm font-medium text-zinc-300">Password</label>
                <div class="relative">
                    <input 
                        id="password"
                        type={showPassword ? "text" : "password"}
                        bind:value={password}
                        placeholder="Masukkan password"
                        class="w-full rounded-xl border-none bg-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 py-3 px-4 pr-12 transition-all"
                    />
                    
                    <button 
                        type="button"
                        onclick={() => showPassword = !showPassword}
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-sm"
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>
            </div>

            <button 
                type="submit"
                class="mt-2 w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-900/20"
            >
                Login
            </button>
        </form>

    </div>
</div>