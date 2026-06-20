const { app } = require('@azure/functions');

app.http('GetMoodInspiration', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const mood = request.query.get('mood');
        
        if (!mood) {
            return { status: 400, jsonBody: { error: "Mood mancante!" } };
        }

        const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const apiKey = process.env.AZURE_OPENAI_API_KEY;
        const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "Phi-4-mini-instruct";

        if (!endpoint || !apiKey) {
            return { 
                jsonBody: { text: `[Test] Ti senti: ${mood}. Configura le chiavi su Azure!` } 
            };
        }

        try {
            // Rimuove eventuali slash finali o percorsi v1 duplicati
            let cleanEndpoint = endpoint.replace(/\/$/, '');
            if (!cleanEndpoint.endsWith('/v1/chat/completions')) {
                cleanEndpoint = `${cleanEndpoint}/v1/chat/completions`;
            }

            const response = await fetch(cleanEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: deploymentName, // Alcuni endpoint serverless richiedono esplicitamente il nome del modello nel body
                    messages: [
                        { role: "system", content: "Sei un assistente empatico. Rispondi in italiano. Se il mood dell'utente è negativo, scrivi una frase motivazionale calda e di supporto. Se è positivo o neutro, scrivi una breve poesia ispiratrice (massimo 4 versi). Rispondi SOLO con il testo richiesto, senza commenti o introduzioni." },
                        { role: "user", content: `Il mio mood è: ${mood}` }
                    ]
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                context.log(`Errore da Azure AI Foundry: ${response.status} - ${errText}`);
                return { status: 500, jsonBody: { error: `Errore servizio AI (${response.status})` } };
            }

            const data = await response.json();
            const aiText = data.choices[0].message.content;

            return { jsonBody: { text: aiText } };

        } catch (error) {
            context.log(`Errore critico backend: ${error.message}`);
            return { status: 500, jsonBody: { error: "Errore durante la generazione." } };
        }
    }
});
