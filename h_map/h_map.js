let canvas = document.getElementById("h_map");
let ctx = canvas.getContext("2d");

let square_init = [
    [Math.round(Math.random() * 20 - 10), Math.round(Math.random() * 20 - 10)],
    [Math.round(Math.random() * 20 - 10), Math.round(Math.random() * 20 - 10)]
];

const color_list = [
    "#0000ff", "#0600f9", "#0d00f2",
    "#1300ec", "#1a00e6", "#2000df",
    "#2600d9", "#2d00d2", "#3300cc",
    "#3900c6", "#4000bf", "#4600b9",
    "#4d00b3", "#5300ac", "#5900a6",
    "#60009f", "#660099", "#6c0093",
    "#73008c", "#790086", "#800080",
    "#860079", "#8c0073", "#93006c",
    "#990066", "#9f0060", "#a60059",
    "#ac0053", "#b3004d", "#b90046",
    "#bf0040", "#c60039", "#cc0033",
    "#d2002d", "#d90026", "#df0020",
    "#e6001a", "#ec0013", "#f2000d"
];


function losange(square) {
    var losange = [];
    var state = square.length - 1;
    for (var x = 0; x < state; x++) {
        losange[x] = [];
        for (var y = 0; y < state; y++) {
            losange[x][y] = (square[x][y] + square[x + 1][y] + square[x][y + 1] + square[x + 1][y + 1]) / 4 + (Math.round(Math.random()) * 2 - 1);
        }
    }
    return losange;
}

function diamond(square, losange) {
    var diamond = [];
    var temp = [];
    var state = losange.length + square.length;

    for (var x = 0; x < state; x++) {
        diamond[x] = [];
        for (var y = 0; y < state; y++) {
            if (x % 2 === 0 && y % 2 === 0) {
                diamond[x][y] = square[x / 2][y / 2];
            } else if (x % 2 === 0 || y % 2 === 0) {
                if (x % 2 === 0) {
                    temp = [];
                    square[x / 2] && square[x / 2][(y - 1) / 2] ? temp.push(square[x / 2][(y - 1) / 2]) : null;
                    square[x / 2] && square[x / 2][(y + 1) / 2] ? temp.push(square[x / 2][(y + 1) / 2]) : null;
                    losange[(x - 1 - 1) / 2] && losange[(x - 1 - 1) / 2][(y - 1) / 2] ? temp.push(losange[(x - 1 - 1) / 2][(y - 1) / 2]) : null;
                    losange[(x + 1 - 1) / 2] && losange[(x + 1 - 1) / 2][(y - 1) / 2] ? temp.push(losange[(x + 1 - 1) / 2][(y - 1) / 2]) : null;
                } else {
                    temp = [];
                    square[(x - 1) / 2] && square[(x - 1) / 2][y / 2] ? temp.push(square[(x - 1) / 2][y / 2]) : null;
                    square[(x + 1) / 2] && square[(x + 1) / 2][y / 2] ? temp.push(square[(x + 1) / 2][y / 2]) : null;
                    losange[(x - 1) / 2] && losange[(x - 1) / 2][(y - 1 - 1) / 2] ? temp.push(losange[(x - 1) / 2][(y - 1 - 1) / 2]) : null;
                    losange[(x - 1) / 2] && losange[(x - 1) / 2][(y + 1 - 1) / 2] ? temp.push(losange[(x - 1) / 2][(y + 1 - 1) / 2]) : null;
                }
                diamond[x][y] = Math.round(temp.reduce(function(memo, val) {return memo + val;}) / temp.length + (Math.round(Math.random()) * 2 - 1));
            } else {
                diamond[x][y] = losange[(x - 1) / 2][(y - 1) / 2];
            }
        }
    }
    return diamond;
}

function exec(square, step) {
    for (var i = 0; i < step; i++)
        square = diamond(square, losange(square, i), i);
    display_diamond(square);
    wireframe_iso(square);
    wireframe_para(square, 1.8);
}



function display_diamond(diamond) {
    angle = 30 * Math.PI / 180;
    for (var x = 0; x < diamond.length; x++) {
        for (var y = 0; y < diamond[x].length; y++) {
            ctx.fillStyle = color_list[diamond[x][y] + 18];
            ctx.fillRect(x, y, 1, 1);
        }
    }
}


const iso = {x: canvas.width / 4, y: 100, l: 4, h: 4};
function iso_coord(x, y, z) {
    var angle = 30 * Math.PI / 180;
    return {x: (x * Math.cos(angle) - y * Math.cos(angle)) * iso.l + iso.x, y: (y * Math.sin(angle) + x * Math.sin(angle) - z) * iso.h + iso.y};
}

const para = {x: 3 * canvas.width / 5, y: 100, l: 4, h: 4};
function para_coord(x, y, z, angle) {
    return {x: (x + y * Math.cos(angle)) * para.l + para.x, y: (z + y * Math.sin(angle)) * para.h + para.y};
}

function wireframe_iso(diamond) {
    for (var x = 0; x < diamond.length - 1; x++) {
        for (var y = 0; y < diamond[x].length - 1; y++) {
            var a = iso_coord(x, y, diamond[x][y]);
            var b = iso_coord(x + 1, y, diamond[x + 1][y]);
            var c = iso_coord(x + 1, y + 1, diamond[x + 1][y + 1]);
            var d = iso_coord(x, y + 1, diamond[x][y + 1]);
            ctx.beginPath();
            ctx.fillStyle = color_list[diamond[x][y] + 18];
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.lineTo(c.x, c.y);
            ctx.lineTo(d.x, d.y);
            ctx.fill();
            ctx.closePath();
        }
    }
}

function wireframe_para(diamond, angle) {
    for (var x = 0; x < diamond.length - 1; x++) {
        for (var y = 0; y < diamond[x].length - 1; y++) {
            var a = para_coord(x, y, diamond[x][y], angle);
            var b = para_coord(x + 1, y, diamond[x + 1][y], angle);
            var c = para_coord(x + 1, y + 1, diamond[x + 1][y + 1], angle);
            var d = para_coord(x, y + 1, diamond[x][y + 1], angle);
            ctx.beginPath();
            ctx.fillStyle = color_list[diamond[x][y] + 18];
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.lineTo(c.x, c.y);
            ctx.lineTo(d.x, d.y);
            ctx.fill();
            ctx.closePath();
        }
    }
}

exec(square_init, 7);