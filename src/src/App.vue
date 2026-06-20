<template>
  <div class="bg-[#0b0f19] text-slate-100 min-h-screen w-full flex items-center justify-center p-4 relative overflow-x-hidden selection:bg-cyan-500/30">
    
    <!-- Sfondi sfumati decorativi (Glow effect) -->
    <div class="absolute top-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-cyan-500/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-violet-500/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>

    <!-- Container Principale (Mobile First: max-w-xl lo tiene compatto su PC, w-full lo allarga su smartphone) -->
    <div class="max-w-xl w-full bg-slate-900/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-800/80 text-center relative z-10 my-4">
        
        <!-- Header -->
        <header class="mb-6 md:mb-8">
            <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 shadow-lg shadow-cyan-500/20 mb-4">
              <span class="text-2xl text-white">✨</span>
            </div>
            <h1 class="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-teal-300 to-violet-400 bg-clip-text text-transparent tracking-tight">
                Mood AI Oasis
            </h1>
            <p class="text-slate-400 mt-2 text-sm md:text-base">Esprimi le tue emozioni, l'AI scriverà per te.</p>
        </header>

        <!-- Selettore di Mood Rapidi (Responsive: flessibile su mobile) -->
        <div class="mb-6">
            <label class="block text-left text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Scegli un mood al volo</label>
            <div class="flex flex-wrap gap-2 justify-start">
                <button v-for="suggestion in quickMoods" :key="suggestion.text"
                    @click="setMood(suggestion.text)"
                    class="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-300 transition-all cursor-pointer flex items-center gap-2 transform active:scale-95">
                    <span>{{ suggestion.emoji }}</span> {{ suggestion.text }}
                </button>
            </div>
        </div>

        <!-- Box Input Scritto -->
        <div class="relative mb-6">
            <input type="text" v-model="mood" @keyup.enter="generateInspiration"
                placeholder="Oppure descrivi qui come ti senti..." 
                class="w-full px-4 py-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm md:text-base shadow-inner">
        </div>

        <!-- Pulsante Genera -->
        <button @click="generateInspiration" :disabled="loading"
            class="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:opacity-95 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-xl shadow-cyan-950/50 transform active:scale-[0.98] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 cursor-pointer text-sm md:text-base tracking-wide">
            <span v-if="loading" class="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
            {{ loading ? 'Sto interrogando le costellazioni...' : 'Genera Ispirazione ✨' }}
        </button>

        <!-- Box Risultato dell'AI -->
        <div v-if="result" class="mt-6 md:mt-8 text-left border-t border-slate-800/60 pt-6">
            <div class="bg-gradient-to-b from-slate-950/50 to-slate-950/10 border border-slate-800/50 p-5 md:p-6 rounded-2xl relative overflow-hidden shadow-2xl">
                <div class="absolute top-3 right-4 text-[10px] font-semibold text-cyan-500/40 uppercase tracking-widest">Phi-4 Response</div>
                <p class="text-base md:text-lg italic text-cyan-100/90 leading-relaxed whitespace-pre-line font-light">
                    {{ result }}
                </p>
            </div>
        </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const mood = ref('');
const result = ref('');
const loading = ref(false);

const quickMoods = [
    { text: 'Carico di energia', emoji: '🚀' },
    { text: 'Un po\' malinconico', emoji: '🌧️' },
    { text: 'Stressato dal codice', emoji: '💻' },
    { text: 'In cerca di pace', emoji: '☕' },
    { text: 'Felice ed euforico', emoji: '☀️' }
];

const setMood = (text) => {
    mood.value = text;
};

const generateInspiration = async () => {
    if (!mood.value.trim()) return alert("Inserisci il tuo stato d'animo!");
    
    loading.value = true;
    result.value = '';

    try {
        // Chiamata alla Azure Function integrata nelle Static Web Apps
        const response = await fetch(`/api/GetMoodInspiration?mood=${encodeURIComponent(mood.value)}`);
        const data = await response.json();
        
        if (data.error) {
            result.value = `⚠️ Errore: ${data.error}`;
        } else {
            result.value = data.text;
        }
    } catch (error) {
        console.error(error);
        result.value = "❌ Impossibile connettersi alle API del backend Azure.";
    } finally {
        loading.value = false;
    }
};
</script>
