
let canvas = document.getElementById("carcassonne");
let ctx = canvas.getContext("2d");

const rect_size = {x: 50, y: 50};
const size = {x: parseInt(canvas.width / rect_size.x), y: parseInt(canvas.height / rect_size.y)};

let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
        tiles = JSON.parse(this.responseText);
        gen_map();
    }
};
xmlhttp.open("GET", "tiles.json", true);
xmlhttp.send();

function print_img(url, rot, x, y, l, h)
{
    let img = new Image;
    img.src = "./assets/" + url;
    img.onload = function(){
        switch (rot) {
            case "top":
                ctx.drawImage(img, x, y, l, h);
                break;
            case "right":
                ctx.rotate(Math.PI / 2);
                ctx.drawImage(img, y, -x, h, -l);

                ctx.rotate(-Math.PI / 2);
                break;
            case "bot":
                ctx.rotate(Math.PI);
                ctx.drawImage(img, -x, -y, -l, -h);


                ctx.rotate(-Math.PI);
                break;
            case "left":
                ctx.rotate(3 * Math.PI / 2);
                ctx.drawImage(img, -y, x, -h, l);
                ctx.rotate(-3 * Math.PI / 2);
                break;
            default:
        }
    };
}

function print_tile(pos, tile, tile_list)
{
    ctx.beginPath();
    if (tile.length > 0) {
        let larg = Math.ceil(Math.sqrt(tile.length));
        let spos = {x: 0, y: 0};
        print_img(
            tile_list[tile[0]].img,
            tile_list[tile[0]].rot,
            pos.x * rect_size.x,
            pos.y * rect_size.y,
            rect_size.x,
            rect_size.y
        );
    }
    ctx.stroke();
}

function print_map(map, tile_list) {
    for (let y = 0; y < size.y; y++) {
        for (let x = 0; x < size.x; x++) {
            print_tile({x: x, y: y}, map[y][x], tile_list)
        }
    }
}

function init_map(tiles) {
    map = Array(size.y);
    for (let i = 0; i < size.y; i++)
    {
        map[i] = Array(size.x);
        for (let j = 0; j < size.x; j++) {
            map[i][j] = [];
            for (let a = 0; a < tiles.length; a++) {
                map[i][j].push(a)
            }
        }
    }
    return map
}


function isConnection(tile_a, tile_b, dir) {
    switch (dir) {
        case "top":
            return tile_a.top === tile_b.bot;
        case "bot":
            return tile_a.bot === tile_b.top;
        case "left":
            return tile_a.left === tile_b.right;
        case "right":
            return tile_a.right === tile_b.left;
        default:
            return false;
    }
}

function find_connector(tiles_a, map, pos, dir, list, tiles)
{
    for (let j = 0; j < map[pos.y][pos.x].length; j++) {
        connect = false;
        for (let i = 0; i < tiles_a.length; i++) {
            if (isConnection(tiles[tiles_a[i]], tiles[map[pos.y][pos.x][j]], dir))
                connect = true;
        }
        if (!connect) {
            delete_item(map, pos, map[pos.y][pos.x][j], list, tiles);
            j--;
        }
    }
}

function recurPoint(map, pos, list, tiles, dir)
{
    if (list.indexOf(pos) >= 0 || pos.x < 0 || pos.x >= size.x || pos.y < 0 || pos.y >= size.y)
        return;
    find_connector(map[list[0].y][list[0].x], map, pos, dir, list, tiles);
}

function recur(map, pos, list, tiles)
{
    list = [pos].concat(list);
    recurPoint(map, {x: pos.x - 1, y: pos.y}, list, tiles, "left");
    recurPoint(map, {x: pos.x + 1, y: pos.y}, list, tiles, "right");
    recurPoint(map, {x: pos.x, y: pos.y - 1}, list, tiles, "top");
    recurPoint(map, {x: pos.x, y: pos.y + 1}, list, tiles, "bot");
}

function delete_item(map, pos, id, list, tiles)
{
    let index = map[pos.y][pos.x].indexOf(id);
    if (index >= 0) {
        map[pos.y][pos.x].splice(index, 1);
        recur(map, pos, list, tiles);
    }
}

function end_gen(map) {
    for (let i = 0; i < size.y; i++)
    {
        for (let j = 0; j < size.x; j++) {
            if (map[i][j].length > 1)
                return false;
        }
    }
    return true;
}

function gen(map, tiles)
{
    ptn_not_set = [];
    for (let i = 0; i < size.x; i++)
    {
        for (let j = 0; j < size.y; j++) {
            recur(map, {x: i, y: j}, [], tiles);
            ptn_not_set.push({x: i, y: j});
        }
    }
    while (ptn_not_set.length > 0) {
        pos = ptn_not_set[parseInt(Math.random() * ptn_not_set.length)];
        if (map[pos.y][pos.x].length > 1) {
            id = map[pos.y][pos.x][parseInt(Math.random() * map[pos.y][pos.x].length)];
            map[pos.y][pos.x] = [id];
            recur(map, pos, [], tiles);
        }
        for (let i = 0; i < ptn_not_set.length; i++) {
            if (map[ptn_not_set[i].y][ptn_not_set[i].x].length <= 1) {
                ptn_not_set.splice(i, 1);
                i--;
            }
        }
    }
}

let map = null;
let tiles = null;

function tiles_rot_left(tiles)
{
    return {
        "img": tiles.img,
        "top": tiles.right,
        "left": tiles.top,
        "bot": tiles.left,
        "right": tiles.bot,
        "rot": "left"
    }
}

function tiles_rot_right(tiles)
{
    return {
        "img": tiles.img,
        "top": tiles.left,
        "left": tiles.bot,
        "bot": tiles.right,
        "right": tiles.top,
        "rot": "right"
    }
}

function tiles_rot_180(tiles) {
    return {
        "img": tiles.img,
        "top": tiles.bot,
        "left": tiles.right,
        "bot": tiles.top,
        "right": tiles.left,
        "rot": "bot"
    }
}

function tiles_rotate(tiles)
{
    let j = tiles.length;
    for (let i = 0; i < j; i++) {
        tiles[i].rot = "top";
        tiles.push(tiles_rot_left(tiles[i]));
        tiles.push(tiles_rot_right(tiles[i]));
        tiles.push(tiles_rot_180(tiles[i]));
    }
}

function gen_map()
{
    tiles_rotate(tiles);
    map = init_map(tiles);
    console.log(map);
    gen(map, tiles);
    print_map(map, tiles);
}