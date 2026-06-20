const { app } = require('@azure/functions');
const { AzureKeyCredential, OpenAIClient } = require('@azure/openai');

app.http('GetMoodInspiration', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        // 1. Recupera il mood dai parametri della URL (es. ?mood=triste)
        const mood = request.query.get('mood');
        
        if (!mood) {
            return { status: 400, jsonBody: { error: "Mood mancante!" } };
        }

        // 2. Recupera le credenziali AI dalle variabili d'ambiente di Azure
        const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const apiKey = process.env.AZURE_OPENAI_API_KEY;
        const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o-mini";

        // Se non configurate (es. in locale), restituisce un testo di fallback per non rompersi
        if (!endpoint || !apiKey) {
            return { 
                jsonBody: { text: `[Modalità Test] Ti senti: ${mood}. (Configura le chiavi su Azure per l'AI reale!)` } 
            };
        }

        try {
            const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));
            
            // 3. Chiamata al modello AI
            const messages = [
                { role: "system", content: "Sei un assistente empatico. L'utente ti dirà il suo mood. Se è negativo, rispondi con una frase motivazionale forte ma calorosa. Se è positivo o neutro, rispondi con una breve poesia ispiratrice (max 4 versi). Rispondi SOLO con la frase o la poesia, senza altri commenti." },
                { role: "user", content: `Il mio mood oggi è: ${mood}` }
            ];

            const result = await client.getChatCompletions(deploymentName, messages, { maxTokens: 150, temperature: 0.7 });
            const aiText = result.choices[0].message.content;

            return { jsonBody: { text: aiText } };

        } catch (error) {
            context.log(`Errore AI: ${error.message}`);
            return { status: 500, jsonBody: { error: "Errore durante la generazione." } };
        }
    }
});