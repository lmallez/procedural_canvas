//
// Made by Louis Mallez
//

let canvas1 = document.getElementById("fibo");
let canvas2 = document.getElementById("fibo_color");
let canvas3 = document.getElementById("fibo_clear");

let ctx1 = canvas1.getContext("2d");
let ctx2 = canvas2.getContext("2d");
let ctx3 = canvas3.getContext("2d");

const rect_size = {x: canvas1.width, y: canvas1.height};

function fibonacci_suit(depth) {
    let value = [1];
    let ex = 0;
    for (let i = 0; i < depth; i++) {
        value.push(value[value.length - 1] + ex);
        ex = value[value.length - 2];
    }
    return value;
}

function gen_entity(value) {
    let size = {
        x: rect_size.x / (value + 2),
        y: rect_size.y / (value + 2)
    };

    size.x = size.x < 1 ? 1 : size.x;
    size.y = size.y < 1 ? 1 : size.y;

    let pos = {
        x: Math.random() * (rect_size.x - size.x),
        y: Math.random() * (rect_size.y - size.y)
    };

    return {
        size: size,
        pos: pos,
        value: value,
        status: 0,
        cooldown: size.x,
        dir: -1,
        color: [
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256)
        ]
    };
}

let entities = [];

function fibo_draw() {
    const suit = fibonacci_suit(13);
    for (let i in suit) {
        for (let j = 0; j < suit[i]; j++)
            entities.push(gen_entity(suit[i]))
    }
    setInterval(drawEntities, 1);
}

const speed = 1;
const max_dir = 100;

function moveEntity(entity) {
    entity.status += 1;
    if (entity.status < entity.cooldown) return;
    entity.status = 0;
    if (entity.dir === -1 || Math.random() * 10 < 1) {
        entity.dir = Math.floor(Math.random() * 4);
    }
    switch (entity.dir) {
        case 0:
            if (entity.pos.x + speed >= rect_size.x - entity.size.x  || entity.pos.x + speed < 0)
                entity.dir = -1;
            else
                entity.pos.x += speed;
            break;
        case 1:
            if (entity.pos.y + speed >= rect_size.y - entity.size.y  || entity.pos.y + speed < 0)
                entity.dir = -1;
            else
                entity.pos.y += speed;
            break;
        case 2:
            if (entity.pos.x - speed >= rect_size.x - entity.size.x  || entity.pos.x - speed < 0)
                entity.dir = -1;
            else
                entity.pos.x -= speed;
            break;
        case 3:
            if (entity.pos.y - speed >= rect_size.y - entity.size.y  || entity.pos.y - speed < 0)
                entity.dir = -1;
            else
                entity.pos.y -= speed;
            break;
    }
}

function drawEntities() {
    ctx1.clearRect(0, 0, rect_size.x, rect_size.y);
    ctx2.clearRect(0, 0, rect_size.x, rect_size.y);

    for (i in entities) {
        moveEntity(entities[i]);
        ctx1.fillRect(entities[i].pos.x, entities[i].pos.y, entities[i].size.x, entities[i].size.y);
        ctx2.fillStyle = 'rgba(' + entities[i].color.join(',') +')';
        ctx2.fillRect(entities[i].pos.x, entities[i].pos.y, entities[i].size.x, entities[i].size.y);
        ctx3.fillStyle = 'rgba(' + entities[i].color.join(',') +')';
        ctx3.fillRect(entities[i].pos.x, entities[i].pos.y, entities[i].size.x, entities[i].size.y);
    }
}

fibo_draw();