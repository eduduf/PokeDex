const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ status: "ok", message: "Pokédex API está online" });
});

app.get("/api/pokemon/:pokemon", async (req, res) => {
    const pokemon = req.params.pokemon.trim().toLowerCase();

    if (!pokemon) {
        return res.status(400).json({ error: "Informe o nome ou número do Pokémon." });
    }

    try {
        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokemon)}`
        );

        if (!response.ok) {
            const status = response.status === 404 ? 404 : 502;
            return res.status(status).json({
                error: response.status === 404
                    ? "Pokémon não encontrado."
                    : "Não foi possível consultar a PokéAPI."
            });
        }

        const data = await response.json();
        res.set("Cache-Control", "public, max-age=3600");
        return res.json(data);
    } catch (error) {
        return res.status(502).json({ error: "Erro ao conectar com a PokéAPI." });
    }
});

app.listen(port, () => {
    console.log(`Pokédex API ouvindo na porta ${port}`);
});
