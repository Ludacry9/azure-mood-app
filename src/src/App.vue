<template>
  <!-- Sfondo Universo/Stellato Stile Anime con CSS Stars incorporate -->
  <div class="bg-space text-slate-100 min-h-screen w-full flex items-center justify-center p-4 relative overflow-x-hidden selection:bg-orange-500/30">
    
    <!-- Stelle di sfondo animate (CSS Puro per effetto cielo stellato anime) -->
    <div class="stars"></div>
    <div class="stars2"></div>

    <!-- Nebulose ed effetti di luce soffusa (Mix Blu Profondo e Arancio Panda) -->
    <div class="absolute top-[-20%] left-[-10%] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-cyan-600/10 rounded-full blur-[100px] md:blur-[150px] pointer-events-none"></div>
    <div class="absolute bottom-[-20%] right-[-10%] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-orange-600/10 rounded-full blur-[100px] md:blur-[150px] pointer-events-none"></div>

    <!-- Container Principale (Vite+Vue 3 Glassmorphism Responsive) -->
    <div class="max-w-xl w-full bg-slate-950/40 backdrop-blur-2xl p-6 md:p-8 rounded-[2.5rem] shadow-2xl border border-slate-800/40 text-center relative z-10 my-4">
        
        <!-- Header con la Luna Autonoma e Pulsante (Senza cerchio) -->
        <header class="mb-6 md:mb-8">
            <div class="inline-block mb-4 animate-moon-glow">
              <!-- La Luna è libera da contenitori e si illumina con un filtro drop-shadow nativo -->
              <span class="text-6xl block select-none">🌙</span>
            </div>
            <h1 class="text-4xl font-extrabold bg-gradient-to-r from-cyan-300 via-orange-400 to-amber-200 bg-clip-text text-transparent tracking-tight">
                Moon Mood
            </h1>
            <!-- Narrazione del Panda Rosso Astronauta -->
            <p class="text-slate-400 mt-3 text-xs md:text-sm italic px-4 leading-relaxed">
               🚀 "Un Panda Rosso ha viaggiato tra le galassie per portarti un frammento di Luna reale... Lascia che la sua magia ascolti come ti senti oggi." 🐾
            </p>
        </header>

        <!-- Selettore di Mood Rapidi (3 a rotazione casuale) -->
        <div class="mb-6">
            <div class="flex justify-between items-center mb-3">
                <label class="block text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Idee di Mood</label>
                <button @click="rotateMoods" class="text-xs text-cyan-400 hover:text-orange-400 transition-colors flex items-center gap-1 cursor-pointer font-semibold">
                  <span>🔄</span> Cambia suggerimenti
                </button>
            </div>
            <div class="flex flex-wrap gap-2 justify-start">
                <button v-for="suggestion in activeMoods" :key="suggestion.text"
                    @click="setMood(suggestion.text)"
                    class="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-orange-500/50 hover:bg-slate-800 text-slate-300 transition-all cursor-pointer flex items-center gap-2 transform active:scale-95">
                    <span>{{ suggestion.emoji }}</span> {{ suggestion.text }}
                </button>
            </div>
        </div>

        <!-- Box Input Scritto -->
        <div class="relative mb-6">
            <input type="text" v-model="mood" @keyup.enter="generateInspiration"
                placeholder="Oppure racconta alla Luna come stai..." 
                class="w-full px-5 py-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 transition-all text-sm md:text-base shadow-inner">
        </div>

        <!-- Pulsante "Chiedi alla Luna" -->
        <button @click="generateInspiration" :disabled="loading"
            class="w-full bg-gradient-to-r from-cyan-500 via-violet-600 to-orange-500 hover:opacity-95 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-xl shadow-cyan-950/50 transform active:scale-[0.98] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 cursor-pointer text-sm md:text-base tracking-wide">
            <span v-if="loading" class="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
            <span>🐾</span>
            {{ loading ? 'Il Panda Rosso sta volando sulla Luna...' : 'Chiedi alla Luna 🌌' }}
        </button>

        <!-- Box Risultato del Saggio della Luna -->
        <div v-if="result" class="mt-6 md:mt-8 text-left border-t border-slate-800/30 pt-6">
            <div class="bg-gradient-to-b from-slate-950/70 to-slate-950/20 border border-slate-800/40 p-5 md:p-6 rounded-2xl relative overflow-hidden shadow-2xl">
                <div class="absolute top-3 right-4 text-[9px] font-bold text-orange-400/80 uppercase tracking-widest">
                  🌙 Il Saggio della Luna dice...
                </div>
                <p class="text-base md:text-lg italic text-amber-100/90 leading-relaxed whitespace-pre-line font-light pt-2">
                    {{ result }}
                </p>
            </div>
        </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const mood = ref('');
const result = ref('');
const loading = ref(false);
const activeMoods = ref([]);

const allMoods = [
    { text: 'Carico di energia', emoji: '🚀' },
    { text: 'Un po\' malinconico', emoji: '🌧️' },
    { text: 'Stressato dal codice', emoji: '💻' },
    { text: 'In cerca di pace', emoji: '☕' },
    { text: 'Felice ed euforico', emoji: '☀️' },
    { text: 'Stanco morto', emoji: '😴' },
    { text: 'Nostalgico', emoji: '🍂' },
    { text: 'Ansioso per qualcosa', emoji: '💭' },
    { text: 'Pronto a spaccare il mondo', emoji: '💥' },
    { text: 'Rilassato sul divano', emoji: '🧘' }
];

const rotateMoods = () => {
    const shuffled = [...allMoods].sort(() => 0.5 - Math.random());
    activeMoods.value = shuffled.slice(0, 3);
};

onMounted(() => {
    rotateMoods();
});

const setMood = (text) => {
    mood.value = text;
};

const generateInspiration = async () => {
    if (!mood.value.trim()) return alert("Sussurra alla luna come ti senti prima!");
    
    loading.value = true;
    result.value = '';

    try {
        const response = await fetch(`/api/GetMoodInspiration?mood=${encodeURIComponent(mood.value)}`);
        const data = await response.json();
        
        if (data.error) {
            result.value = `⚠️ La Luna è coperta da nuvole: ${data.error}`;
        } else {
            result.value = data.text;
        }
    } catch (error) {
        console.error(error);
        result.value = "❌ Il Panda Rosso ha perso la connessione con la Terra.";
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
/* Sfondo stile cielo profondo / anime cosmico */
.bg-space {
  background: radial-gradient(circle at 50% 50%, #0d162d 0%, #060a14 100%);
  position: relative;
}

/* Animazione del bagliore (glow) sulla Luna nativa */
@keyframes moonGlow {
  0%, 100% {
    filter: drop-shadow(0 0 10px rgba(254, 240, 138, 0.3)) drop-shadow(0 0 25px rgba(6, 182, 212, 0.2));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 22px rgba(254, 240, 138, 0.7)) drop-shadow(0 0 40px rgba(6, 182, 212, 0.4));
    transform: scale(1.04);
  }
}
.animate-moon-glow {
  animation: moonGlow 4s infinite ease-in-out;
}

/* Generazione stelle di sfondo stile anime */
.stars, .stars2 {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100%; height: 100%;
  display: block;
  pointer-events: none;
}
.stars {
  background-image: 
    radial-gradient(1px 1px at 20px 30px, #fff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 40px 70px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 50px 160px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 90px 40px, rgba(254, 240, 138, 0.8), rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 130px 80px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 160px 120px, #fff, rgba(0,0,0,0));
  background-size: 200px 200px;
  opacity: 0.4;
}
.stars2 {
  background-image: 
    radial-gradient(1px 1px at 15px 15px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 75px 130px, rgba(165, 243, 252, 0.8), rgba(0,0,0,0)),
    radial-gradient(1px 1px at 110px 60px, #fff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 190px 170px, #fff, rgba(0,0,0,0));
  background-size: 300px 300px;
  opacity: 0.6;
}
</style>
