const can_height = 1000;
const can_width = 1000;

const divWidth = 500,
    divHeight = 500,
    divPadding = 20;

var a, b, c, d;
var selected;
var oldX, oldY;

const rad = 15;

function main() {
    //var explainerContainer = document.getElementById("ExplainerArea");
    //document.body.removeChild(explainerContainer);
    //explainerContainer.style = "left:" + (can_width - divWidth - divPadding) + "px;up:" + divPadding + "px;height:" + divHeight + "px;width:" + divWidth + "px;position:absolute;"

}

function setup() {

    createCanvas(can_width, can_height);

    background(0);

    oldX = 0;
    oldY = 0;

    a = new Circle(100.0, 500.0);
    b = new Circle(300.0, 200.0);
    c = new Circle(200.0, 500.0);
    d = new Circle(300.0, 300.0);
    textAlign(CENTER, CENTER);
}

class Circle {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    check(x, y, c) {
        return (this.x - x) * (this.x - x) + (this.y - y) * (this.y - y) < c * c;
    }
}


function draw() {
    background(10, 0, 10);
    stroke(255, 255, 255);



    var ax = a.x,
        ay = a.y,
        bx = b.x,
        by = b.y,
        cx = c.x,
        cy = c.y,
        dx = d.x,
        dy = d.y;

    switch (selected) {
        case 0:
            ax += mouseX - oldX;
            ay += mouseY - oldY;
            break;
        case 1:
            bx += mouseX - oldX;
            by += mouseY - oldY;
            break;
        case 2:
            cx += mouseX - oldX;
            cy += mouseY - oldY;
            break;
        case 3:
            dx += mouseX - oldX;
            dy += mouseY - oldY;
            break;
    }
    const gae = computeWeights(ax, ay, bx, by, cx, cy, dx, dy);
    strokeWeight(1);
    text("W1: " + formatNumber(gae.w1, 3), 100, 20);
    text("W2: " + formatNumber(gae.w2, 3), 100, 40);
    text("W1 + W2: " + formatNumber(gae.w1 + gae.w2, 3), 100, 60);

    stroke(255, 255, 255);
    if (gae.w1 + gae.w2 <= 1 && gae.w1 >= 0 && gae.w2 >= 0)
        stroke(0, 255, 0);
    line(ax, ay, bx, by);
    line(ax, ay, cx, cy);
    line(cx, cy, bx, by);

    noFill();
    if (a.check(mouseX, mouseY, rad))
        fill(255, 255, 255);
    circle(ax, ay, rad);
    text("A", ax, ay - rad - 5);
    noFill();
    if (b.check(mouseX, mouseY, rad))
        fill(255, 255, 255);
    circle(bx, by, rad);
    text("B", bx, by - rad - 5);
    noFill();
    if (c.check(mouseX, mouseY, rad))
        fill(255, 255, 255);
    circle(cx, cy, rad);
    text("C", cx, cy - rad - 5);
    noFill();
    if (d.check(mouseX, mouseY, rad))
        fill(255, 255, 255);
    circle(dx, dy, rad);
    text("D", dx, dy - rad - 5);
    noFill();
    if (gae.fuck) {
        stroke(0, 0, 255);
        strokeWeight(5);
        drawParametricLine(ax, ay, cx, cy, gae.w1);
        stroke(255, 0, 0);
        drawParametricLine(ax, ay, bx, by, gae.w2);
    } else {
        stroke(0, 0, 255);
        strokeWeight(5);
        drawParametricLine(ax, ay, bx, by, gae.w1);
        stroke(255, 0, 0);
        drawParametricLine(ax, ay, cx, cy, gae.w2);
    }

    updatePointList(ax, ay, bx, by, cx, cy, dx, dy);

}

function drawParametricLine(startx, starty, endx, endy, t) {
    line(startx, starty, startx * (1 - t) + endx * t, starty * (1 - t) + endy * t);
}

function computeWeights(ax, ay, bx, by, cx, cy, dx, dy) {
    if (bx - ax != 0) {
        const dABX = bx - ax;
        const dABY = by - ay;
        const dACX = cx - ax;
        const dACY = cy - ay;
        dx -= ax;
        dy -= ay;

        const w2 = (dABY * dx - dABX * dy) / (dABY * dACX - dABX * dACY);
        const w1 = (dx - dACX * w2) / dABX;

        return {
            w1: w1,
            w2: w2,
            fuck: false
        }
    } else {
        const dABX = cx - ax;
        const dABY = cy - ay;
        const dACX = bx - ax;
        const dACY = by - ay;
        dx -= ax;
        dy -= ay;

        const w2 = (dABY * dx - dABX * dy) / (dABY * dACX - dABX * dACY);
        const w1 = (dx - dACX * w2) / dABX;

        return {
            w1: w1,
            w2: w2,
            fuck: true
        }
    }

}

function mousePressed() {
    if (a.check(mouseX, mouseY, rad)) {
        selected = 0;
    } else if (b.check(mouseX, mouseY, rad)) {
        selected = 1;
    } else if (c.check(mouseX, mouseY, rad)) {
        selected = 2;
    } else if (d.check(mouseX, mouseY, rad)) {
        selected = 3;
    }
    oldX = mouseX;
    oldY = mouseY;
    return false;
}

function mouseReleased() {

    switch (selected) {
        case 0:
            a.x += mouseX - oldX;
            a.y += mouseY - oldY;
            break;
        case 1:
            b.x += mouseX - oldX;
            b.y += mouseY - oldY;
            break;
        case 2:
            c.x += mouseX - oldX;
            c.y += mouseY - oldY;
            break;
        case 3:
            d.x += mouseX - oldX;
            d.y += mouseY - oldY;
            break;
    }

    selected = -1;

    return false;
}

function formatNumber(num, decimalplaces) {
    return Math.round(num * (10 ** decimalplaces)) / (10 ** decimalplaces);
}

function updatePointList(ax, ay, bx, by, cx, cy, dx, dy) {
    var ae = document.getElementById("Pa");
    var be = document.getElementById("Pb");
    var ce = document.getElementById("Pc");
    var de = document.getElementById("Pd");
    ae.getElementsByClassName("x")[0].innerHTML = "<h3>" + ax + "</h3>";
    ae.getElementsByClassName("y")[0].innerHTML = "<h3>" + ay + "</h3>";
    be.getElementsByClassName("x")[0].innerHTML = "<h3>" + bx + "</h3>";
    be.getElementsByClassName("y")[0].innerHTML = "<h3>" + by + "</h3>";
    ce.getElementsByClassName("x")[0].innerHTML = "<h3>" + cx + "</h3>";
    ce.getElementsByClassName("y")[0].innerHTML = "<h3>" + cy + "</h3>";
    de.getElementsByClassName("x")[0].innerHTML = "<h3>" + dx + "</h3>";
    de.getElementsByClassName("y")[0].innerHTML = "<h3>" + dy + "</h3>";

}

function reset() {
    a = new Circle(100.0, 500.0);
    b = new Circle(300.0, 200.0);
    c = new Circle(200.0, 500.0);
    d = new Circle(300.0, 300.0);
}