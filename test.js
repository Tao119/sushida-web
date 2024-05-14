import Matter;

let Eg = Matter.Engine,
    Wd = Matter.World,
    Bs = Matter.Bodies,
    Bd = Matter.Body,
    Ev = Matter.Events;

let engine, world;
let ps = [];
let hs = [];
let [tm, lt] = [0, 0];
let lx, ly;
let ss = [];
let h, w;
let [sx, sy] = [0, 0];
const es = 0.1;
const PI = 3.141592;

function setup() {
    createCanvas(400, 400);
    noStroke();
    engine = Eg.create();
    world = engine.world;
    h = height;
    w = width;

    const gd = Bs.rectangle(w / 2, h + 10, w, 20, {
        isStatic: true,
        restitution: 1.2
    });
    Wd.add(world, gd);
    const rw = Bs.rectangle(w + 10, h / 2, 20, h, {
        isStatic: true,
        restitution: 1
    });
    Wd.add(world, rw);
    const lw = Bs.rectangle(-10, h / 2, 20, h, {
        isStatic: true,
        restitution: 1
    });
    Wd.add(world, lw);

    hs.push(new House(-100, 300, 100));

    for (let k = 0; k < 100; k++) {
        ss.push({
            x: random(w),
            y: random(h),
            size: random(1, 3)
        });
    }
    for (let p = 0; p < 10; p++) {
        ss.push({
            x: random(w),
            y: random(h),
            size: random(3, 10)
        });
    }
}

function mouseClicked() {
    if (millis() - lt >= 50) {
        let al = 0;
        ps.push(new Present(sx, sy, random(10, 30), al, random(150, 255), random(200, 255)));
        lt = millis();
    }
}

function mouseDragged() {
    if (millis() - lt >= 100) {
        let al = getMouseAngle();
        ps.push(new Present(sx, sy, random(10, 30), al, random(150, 255), random(200, 255)));
        lt = millis();
    }
}

function getMouseAngle() {
    let dx = mouseX - lx;
    let dy = mouseY - ly;
    let al = atan2(dy, dx) + PI / 2;
    return al;
}

function draw() {
    background(0, 0, 100);

    Eg.update(engine);
    push()
    drawingContext.filter = 'blur(1.5px)';
    noStroke();
    for (let i = 0; i < ss.length; i++) {
        fill(255, random(100, 255));
        ellipse(ss[i].x, ss[i].y, ss[i].size);
    }
    pop()

    for (let i = 0; i < ps.length; i++) {
        ps[i].show();
    }

    for (let i = 0; i < hs.length; i++) {
        hs[i].show()
        hs[i].move(1.5)
    }
    sx = lerp(sx, mouseX, es);
    sy = lerp(sy, mouseY, es);
    let d = (mouseX - sx) >= 0 ? 1 : -1;

    drawSled(sx, sy, d);

    lx = mouseX;
    ly = mouseY;

    Ev.on(engine, 'collisionActive', function (event) {
        let pairs = event.pairs;

        for (let i = 0; i < pairs.length; i++) {
            let pair = pairs[i];

            let hiA = findHouse(pair.bodyA);
            let hiB = findHouse(pair.bodyB);
            let piA = findPresent(pair.bodyA);
            let pieB = findPresent(pair.bodyB);

            if (hiA && piB) {
                hiA.at = true;
                piB.remove();
            }

            if (piA && hiB) {
                hiB.at = true;
                piA.remove();
            }
        }
    });

}


class House {
    constructor(x, y, size) {
        this.body = this.createBody(x, y, size);
        Wd.add(world, this.body);
        this.size = size;
        this.x = x;
        this.y = y;
        this.at = false;
        this.hf = false;
    }

    createBody(x, y, size) {
        let options = {
            isStatic: true,
            friction: 0,
            restitution: 1.2,
            frictionAir: 0,
            gravity: {
                x: 0,
                y: 0
            }
        };

        let body = Bs.rectangle(x, y, size, size, options);
        return body;
    }

    show() {
        let pos = this.body.position;
        let al = this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(al);
        rectMode(CENTER)

        fill(0);
        rect(this.size * 0.7, this.size * 0.5, this.size * 1.4, this.size);
        triangle(this.size * 0.7, -this.size * 0.7, this.size * 1.6, 0, -this.size * 0.2, 0);
        rect(this.size * 1.2, -this.size * 0.5, this.size / 3, this.size);
        let a = this.at ? map(sin(millis() / 500), -1, 1, 0, 200) : 0;
        fill(200, 200, 0, a);
        rect(this.size * 0.7, this.size * 0.4, this.size * 0.6, this.size * 0.6);
        fill(0);
        rect(this.size * 0.7, this.size * 0.4, this.size * 0.1, this.size * 0.6);
        rect(this.size * 0.7, this.size * 0.4, this.size * 0.6, this.size * 0.1);

        pop();

    }

    move(speed) {
        this.x += speed;
        Bd.setPosition(this.body, {
            x: this.x,
            y: this.y
        });
        if (this.x > width) {
            this.remove();
        } else if (this.x > width / 2 && !this.hf) {
            const s = random(30, 100);
            hs.push(new House(-s * 1.2, 400 - s, s));
            this.hf = true;
        }
    }

    remove() {
        Wd.remove(world, this.body);
        let ix = hs.indexOf(this);
        if (ix !== -1) {
            hs.splice(ix, 1);
        }
    }
}

class Present {
    constructor(x, y, size, t, pc, rc) {
        this.body = this.createBody(x, y, size);
        this.size = size;
        Wd.add(world, this.body);
        this.t = t;
        this.pc = pc;
        this.rc = rc;

        // setTimeout(() => {
        // 	this.remove();
        // }, 3000);
    }

    createBody(x, y, size) {
        let options = {
            friction: 0,
            restitution: 1.2,
        };

        let body = Bs.rectangle(x, y, size, size, options);
        return body;
    }

    remove() {
        Wd.remove(world, this.body);
        let ix = ps.indexOf(this);
        if (ix !== -1) {
            ps.splice(ix, 1);
        }
    }

    show() {
        let pos = this.body.position;
        let al = this.body.angle + this.t;
        push();

        let ro = this.size;

        translate(pos.x, pos.y);
        rotate(al);
        rectMode(CENTER);
        fill(0, this.pc, 0);
        rect(0, 0, ro, ro);

        fill(this.rc, 0, 0);
        noStroke();
        let rw = ro / 5;
        let rh = ro * 1;
        rect(0, 0, rw, rh);
        rect(0, 0, ro, rw);

        triangle(0, -ro / 2, -ro / 2, -2 * ro / 3, -ro / 3, -3 * ro / 4);
        triangle(0, -ro / 2, ro / 2, -2 * ro / 3, ro / 3, -3 * ro / 4);

        pop();
    }
}

function drawSled(x, y, d) {
    push();
    translate(x, y);
    scale(d, 1)

    fill(0);
    rectMode(CENTER);
    rect(0, 0, 80, 30);
    rect(-20, -10, 40, 40);
    rect(15, 20, 5, 30);
    rect(-15, 20, 5, 30);
    rect(0, 35, 70, 5);
    arc(35, -10, 50, 50, -PI * 2 / 5, PI / 2)
    stroke(0);
    pop();
}

function findHouse(body) {
    for (let j = 0; j < hs.length; j++) {
        if (hs[j].body === body) {
            return hs[j];
        }
    }
    return null;
}

function findPresent(body) {
    for (let k = 0; k < ps.length; k++) {
        if (ps[k].body === body) {
            return ps[k];
        }
    }
    return null;
}