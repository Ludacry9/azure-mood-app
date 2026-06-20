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
            // Struttura corretta dell'URL per la chiamata REST nativa ad Azure OpenAI
            const cleanEndpoint = endpoint.replace(/\/$/, '');
            const apiVersion = "2024-02-15-preview"; // Versione API standard stabile
            const targetUrl = `${cleanEndpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;

            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': apiKey // Header nativo richiesto da Azure OpenAI
                },
                body: JSON.stringify({
                    messages: [
                        { 
                            role: "system", 
                            content: "Sei il Saggio della Luna, un assistente empatico che parla a nome di un Panda Rosso astronauta. Rispondi RIGOROSAMENTE in italiano. Se il mood dell'utente è negativo o triste, scrivi una frase motivazionale calda, rassicurante e poetica. Se è positivo, felice o neutro, scrivi una vera e propria breve poesia ispiratrice (massimo 4 versi). RECOLA TASSATIVA: Non aggiungere mai saluti iniziali o cortesia. Non concludere MAI la risposta con una domanda, con punti di domanda o chiedendo 'come posso aiutarti'. Fornisci SOLO ed esclusivamente la frase o la poesia finita." 
                        },
                        { 
                            role: "user", 
                            content: `Il mio mood oggi è: ${mood}` 
                        }
                    ],
                    max_tokens: 150,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                context.log(`Errore Azure OpenAI REST: ${response.status} - ${errText}`);
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
