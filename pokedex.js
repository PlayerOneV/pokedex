$(document).ready(function () {
    var inicio = false;

    var search = document.getElementById("search");
    var next = document.getElementById("next");
    var previous = document.getElementById("previous");

    //Declaramos el fondo sobre el cual cambiaremos el background dependiendo del tipo de pokemon
    const bg_tipo = document.getElementById("fondo_Tipo");
    //Declaramos los elementos que contienen el nombre y el número de pokemon (dos veces para recuperlarlo mas facilmente)
    const nombre = document.getElementById("name_Pokemon");
    const numero = document.getElementById("id_Pokemon");
    const PokeId = document.getElementById("ID");
    
    //Declaramos un array que contendra los diferentes tipos de pokemon, sera utilizado posteriormente para cambiar el color de fondo
    const TIPOS = [
        'normal', 'fighting', 'flying', 'poison', 'ground',
        'rock', 'bug', 'ghost', 'steel', 'fire', 'water',
        'grass', 'electric', 'psychic', 'ice', 'dragon',
        'dark', 'fairy'
    ];
    
    if(!inicio){
        Pokemon("pikachu");
        inicio = true;
    }

    search.addEventListener("click", function () {
        let pokename = document.getElementById("pokeSearch").value.toLowerCase();
        Pokemon(pokename);
    });

    next.addEventListener("click", function () {
        let nextPokemon = parseInt(PokeId.textContent);
        nextPokemon = nextPokemon + 1;
        Pokemon(nextPokemon);
    });

    previous.addEventListener("click", function () {
        if(PokeId.textContent == 1){
            alert("No hay pokemon con un menor número");
        }else{
            Pokemon(PokeId.textContent - 1);
        }
    });

    function Pokemon(id) {
        const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

        fetch(url).then((respuesta) => {
            if(respuesta.status != "200"){
                alert("Pokemon no encotrado, intente de nuevo.");
            }else{
                return respuesta.json();
            }
        }).then((info) => {

            //Obtenemos el nombre y número de pokemon
            let name = info.name;
            let numero = info.id;

            //Obtenemos las img
            let img_Front = info.sprites.front_default;
            let img_Back = info.sprites.back_default;

            //Obtenemos el tipo de pokemon que puede ser (max 2), primero obtenemos el array de tipos
            let type = info.types;
            let type1 = type[0]["type"]["name"];//Guardamos el primer tipo        

            //Obtenemos la información de las estadisticas del pokemon
            let stats = info.stats;

            //Obtenemos los movimientos del pokemon
            let movements = info.moves;


            pokeImg(img_Front, img_Back);
            pokeInfo(name, numero);
            //Comprobamos si el pokemon tiene un segundo tipo
            if (type[1]) { //Si el pokemon tiene un segundo tipo lo guardamos y enviamos como parametro para que se muestre
                let type2 = type[1]["type"]["name"];
                pokeType(type1, type2);

            } else { //Si el pokemon no tiene un segundo tipo solamente enviamos el primero
                pokeType(type1);
            }
            pokeStats(stats);
            pokeMoves(movements);
        });
    }


    function pokeImg(front, back) {
        const img_Front = document.getElementById("img_Front");
        const img_Back = document.getElementById("img_Back");

        img_Front.src = front;
        img_Back.src = back;
    }

    function pokeInfo(name, id) {
        nombre.textContent = name;
        numero.textContent = '#' + id.toString().padStart(3, '0');
        PokeId.textContent = id;
    }

    const pokeType = (type1, type2 = "") => {
        const tipo1 = document.getElementById("TypeOne");
        const tipo2 = document.getElementById("TypeTwo");

        if (type2 == "") {
            tipo2.classList.add('hide');
        } else {
            tipo2.classList.remove('hide');
        }

        tipo1.textContent = type1;
        tipo2.textContent = type2;

        //Cambiamos el color del background
        resetBackground();
        bg_tipo.classList.add(type1);
    }

    const pokeStats = (stats) => {
        const hp = document.getElementById("stat_hp");
        const attactk = document.getElementById("stat_attack");
        const defense = document.getElementById("stat_defense");
        const specialAt = document.getElementById("stat_specialAttack");
        const specialDe = document.getElementById("stat_specialDefense");
        const speed = document.getElementById("stat_speed");

        for (i = 0; i < 6; i++) {
            switch (i) {
                case 0:
                    hp.textContent = `${stats[i]["stat"]["name"]} ${stats[i]["base_stat"]}`;
                    break;
                case 1:
                    attactk.textContent = `${stats[i]["stat"]["name"]} ${stats[i]["base_stat"]}`;
                    break;
                case 2:
                    defense.textContent = `${stats[i]["stat"]["name"]} ${stats[i]["base_stat"]}`;
                    break;
                case 3:
                    specialAt.textContent = `${stats[i]["stat"]["name"]} ${stats[i]["base_stat"]}`;
                    break;
                case 4:
                    specialDe.textContent = `${stats[i]["stat"]["name"]} ${stats[i]["base_stat"]}`;
                    break;
                case 5:
                    speed.textContent = `${stats[i]["stat"]["name"]} ${stats[i]["base_stat"]}`;
                    break;
                default:
                    break;
            }
        }
    }

    function pokeMoves(moves) {
        let pokeMoves = document.getElementById("pokeMovimientos");

        $('#pokeMovimientos div').remove();

        for (i in moves) {
            const node = document.createElement("div");
            const textnode = document.createTextNode(moves[i]["move"]["name"]);
            node.appendChild(textnode);
            node.classList.add("moves-pokemon");
            pokeMoves.appendChild(node);
        }

    }

    const resetBackground = () => {
        //Recorremos nuestro array de tipos para quitarlos de la clase y evitar que los background se sobrepongan
        for (const tipo of TIPOS) {
            bg_tipo.classList.remove(tipo);
        }
    }
});