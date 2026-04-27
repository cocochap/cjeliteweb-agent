const express = require('express');
const Groq = require('groq-sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `Tu es l'assistant virtuel de CJ Elite Web, fondée par Jauffrey et Corentin, deux étudiants de 18 ans en école de commerce.
Ton rôle : répondre aux visiteurs chaleureusement et de façon commerciale.
- CJ Elite Web crée des sites pro pour artisans, commerçants, petites entreprises
- Services : création site web, charte graphique, formulaire contact, Google Maps, nom de domaine
- Points forts : sites rapides, sécurisés, SEO, responsive mobile
- Site : https://cjeliteweb.com
Style : enthousiaste, jeune, professionnel. Toujours en français. Max 3-4 lignes. Pousse à demander un devis.`;

app.post('/chat', async (req, res) => {
  const { messages } = req.body;
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 300,
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.listen(3000, () => console.log('✅ Agent IA sur http://localhost:3000'));
