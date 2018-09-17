//
// Made by Louis Mallez
//


var canvas = document.getElementById("three");
var ctx = canvas.getContext("2d");

canvas.height = document.documentElement.clientHeight;
canvas.width = document.documentElement.clientWidth;

console.log(canvas.height, canvas.width);

var rect_size = {x: 5, y: 5};

var size = {x: parseInt(canvas.height / rect_size.x), y: parseInt(canvas.height / rect_size.y)};

var chunk = {
    "dirt": {
        top: ["grass", "dirt"],
        side: ["grass", "dirt", "sky"],
        topside: ["grass", "dirt", "sky"],
        bot: ["dirt", "sky", "grass", "trunk", "leaf"],
        color: "brown"
    },

    "grass": {
        top: ["sky", "trunk"],
        side: ["dirt", "sky", "grass", "trunk", "leaf"], //["sky", "dirt", "grass", "trunk"],
        topside: ["dirt", "sky", "grass", "trunk", "leaf"], //["sky", "grass", "dirt", "trunk"],
        bot: ["dirt", "sky", "grass", "trunk", "leaf"], //["dirt"],
        color: "green"
    },

    "sky": {
        top: ["sky"],
        side: ["dirt", "sky", "grass", "trunk", "leaf"], //["sky", "grass", "dirt", "leaf", "trunk"],
        topside: ["dirt", "sky", "grass", "trunk", "leaf"], //["sky", "grass", "leaf", "trunk"],
        bot: ["dirt", "sky", "grass", "trunk", "leaf"], //["sky", "grass", "trunk"],
        color: "blue"
    },

    "trunk": {
        top: ["leaf", "trunk"],
        side: ["sky", "leaf", "grass", "dirt", "trunk"],
        topside: ["sky", "grass", "dirt", "leaf"],
        bot: ["dirt", "sky", "grass", "trunk", "leaf"], //["grass"],
        color: "yellow"
    },

    "leaf": {
        top: ["sky", "leaf"],
        side: ["dirt", "sky", "grass", "trunk", "leaf"], //["sky", "leaf"],
        topside: ["dirt", "sky", "grass", "trunk", "leaf"], //["sky"],
        bot: ["dirt", "sky", "grass", "trunk", "leaf"], //["trunk"],
        color: "violet"
    }
};


function draw_tile(pos, color)
{
    ctx.beginPath();
    ctx.lineWidth="10";
    ctx.fillStyle= color;
    ctx.fillRect(pos.x * rect_size.x, pos.y * rect_size.y, rect_size.x, rect_size.y);
    ctx.stroke();
}

function gen_chunk(map, pos) {
    ok = ["dirt", "sky", "grass", "trunk", "leaf"];
    chk = [];

    if (map[pos.y + 1] && map[pos.y + 1][pos.x])
        chk[0] = map[pos.y + 1] && map[pos.y + 1][pos.x].top;
    if (map[pos.y][pos.x - 1])
        chk[1] = map[pos.y] && map[pos.y][pos.x - 1].side;
    if (map[pos.y][pos.x + 1])
        chk[2] = map[pos.y] && map[pos.y][pos.x + 1].side;
    if (map[pos.y - 1] && map[pos.y - 1][pos.x])
        chk[3] = map[pos.y - 1] && map[pos.y - 1][pos.x].bot;
    if (map[pos.y + 1] && map[pos.y + 1][pos.x - 1])
        chk[4] = map[pos.y + 1] && map[pos.y + 1][pos.x - 1].topside;
    if (map[pos.y + 1] && map[pos.y + 1][pos.x + 1])
        chk[5] = map[pos.y + 1] && map[pos.y + 1][pos.x + 1].topside;

    var real = [];
    for (var i = 0; i < ok.length; i++) {
        aled = true;
        for (var j = 0; j < chk.length; j++) {
            if (!chk[j]) continue;
            if (!(chk[j].length === 0 || chk[j].indexOf(ok[i]) >= 0))
                aled = false;
        }
        if (aled)
            real.push(ok[i]);
    }


    return chunk[real[parseInt(Math.random()*real.length)]]
}

function init_map()
{
    tab = Array(size.y);
    for (var i = 0; i < size.y; i++) {
        tab[i] = Array(size.x)
    }
    return tab;
}

function aled() {
    map = init_map();
    for (var i = 0; i < size.x; i++) {
        map[size.y - 1][i] = chunk["dirt"];
        map[0][i] = chunk["sky"];
    }
    nbIsland = 100;
    for (var j = 0; j <= nbIsland; j++)
        map[parseInt(Math.random() * size.y)][parseInt(Math.random() * size.x)] = chunk["dirt"]
    for (var y = size.y - 1; y >= 0; y--) {
        for (var x = size.x - 1; x >= 0; x--) {
            if (!map[y][x])
                map[y][x] = gen_chunk(map, {x: x, y: y});
            draw_tile({x: x, y: y}, (map[y][x] ? map[y][x].color : "black"));
        }
    }
}

aled();