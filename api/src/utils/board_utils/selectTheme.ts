export function selectTheme(): string[] {
    const Themes = {
        tech_1: ["backend", "frontend", "database", "software", "hardware"],
        tech_2: ["python", "typescript", "flutter", "nodejs", "java"],

        fruits_1: ["banana", "laranja", "abacaxi", "cereja", "ameixa"],
        fruits_2: ["manga", "amora", "acerola", "pera", "caqui"],

        cities_1: ["lisboa", "paris", "roma", "tokyo", "londres"],
        cities_2: ["berlim", "miami", "toronto", "oslo", "madrid"],

        animals_1: ["gato", "cachorro", "coelho", "macaco", "panda"],
        animals_2: ["tigre", "urso", "raposa", "cobra", "foca"],

        colors_1: ["vermelho", "azul", "amarelo", "roxo", "preto"],
        colors_2: ["branco", "verde", "rosa", "cinza", "bege"],

        sports_1: ["futebol", "basquete", "tenis", "golfe", "boxe"],
        sports_2: ["volei", "rugby", "surfe", "skate", "judo"],

        foods_1: ["pizza", "pasta", "sopa", "carne", "queijo"],
        foods_2: ["arroz", "feijao", "pao", "bolo", "batata"],

        jobs_1: ["medico", "professor", "advogado", "piloto", "ator"],
        jobs_2: ["engenheiro", "designer", "soldado", "chefe", "motorista"],

        nature_1: ["floresta", "oceano", "deserto", "rio", "montanha"],
        nature_2: ["lago", "ilha", "caverna", "vales", "gramado"],

        space_1: ["terra", "venus", "marte", "saturno", "urano"],
        space_2: ["plutao", "jupiter", "netuno", "mercurio", "lua"]
    };


    const themes = Object.values(Themes);
    const index = Math.floor(Math.random() * themes.length);

    if (themes[index]) return themes[index];
    
    return ["backend", "frontend", "database", "software", "hardware"];
}