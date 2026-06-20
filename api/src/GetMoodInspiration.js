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

        if (!endpoint || !apiKey) {
            return { 
                jsonBody: { text: `[Modalità Test] Ti senti: ${mood}. (Configura le chiavi su Azure!)` } 
            };
        }

        try {
            // I modelli Serverless in Azure Foundry usano le API standard di chat/completions
            // Puliamo l'endpoint se inserito con la parte finale di OpenAI
            let cleanEndpoint = endpoint.split('/v1')[0];
            if (!cleanEndpoint.endsWith('/v1/chat/completions')) {
                cleanEndpoint = `${cleanEndpoint.replace(/\/$/, '')}/v1/chat/completions`;
            }

            const response = await fetch(cleanEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: "Sei un assistente empatico. L'utente ti dirà il suo mood. Se è negativo, rispondi con una frase motivazionale forte ma calorosa. Se è positivo o neutro, rispondi con una breve poesia ispiratrice (max 4 versi) in italiano. Rispondi SOLO con la frase o la poesia, senza altri commenti." },
                        { role: "user", content: `Il mio mood oggi è: ${mood}` }
                    ],
                    max_tokens: 150,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                context.log(`Errore HTTP da Azure AI: ${response.status} - ${errText}`);
                return { status: 500, jsonBody: { error: `Errore servizio AI (${response.status})` } };
            }

            const data = await response.json();
            const aiText = data.choices[0].message.content;

            return { jsonBody: { text: aiText } };

        } catch (error) {
            context.log(`Errore critico: ${error.message}`);
            return { status: 500, jsonBody: { error: "Errore durante la generazione." } };
        }
    }
});
