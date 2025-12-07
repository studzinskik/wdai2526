const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let frames = 0;

const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
};

const startBtn = {
    x: 120,
    y: 263,
    w: 83,
    h: 29
};

const bgImg = new Image(); bgImg.src = "assets/Flappy Bird/background-day.png";
const fgImg = new Image(); fgImg.src = "assets/Flappy Bird/base.png";
const birdImg = [new Image(), new Image(), new Image()];

birdImg[0].src = "assets/Flappy Bird/yellowbird-upflap.png";
birdImg[1].src = "assets/Flappy Bird/yellowbird-midflap.png";
birdImg[2].src = "assets/Flappy Bird/yellowbird-downflap.png";

const pipeImg = new Image(); pipeImg.src = "assets/Flappy Bird/pipe-green.png"; 

const gameOverImg = new Image(); gameOverImg.src = "assets/UI/gameover.png";
const getReadyImg = new Image(); getReadyImg.src = "assets/UI/message.png";

const scoreImages = [];
for (let i = 0; i < 10; i++) {
    scoreImages[i] = new Image();
    scoreImages[i].src = `assets/UI/Numbers/${i}.png`;
}

const SCORE_S = new Audio("assets/Sound Efects/point.wav");
const FLAP_S = new Audio("assets/Sound Efects/wing.wav");
const HIT_S = new Audio("assets/Sound Efects/hit.wav");
const SWOOSH_S = new Audio("assets/Sound Efects/swoosh.wav");
const DIE_S = new Audio("assets/Sound Efects/die.wav");

function playAudio(audioElement) {
    const clone = audioElement.cloneNode();
    clone.play()
}

const bg = {
    x: 0, y: 0, w: 320, h: 480,
    draw: function() {
        ctx.drawImage(bgImg, this.x, this.y, this.w, this.h);
        ctx.drawImage(bgImg, this.x + this.w, this.y, this.w, this.h);
    }
};

const fg = {
    x: 0, y: canvas.height - 112, w: 336, h: 112, dx: 2,
    draw: function() {
        ctx.drawImage(fgImg, this.x, this.y, this.w, this.h);
        ctx.drawImage(fgImg, this.x + this.w, this.y, this.w, this.h);
    },
    update: function() {
        if (state.current == state.game) {
            this.x = (this.x - this.dx) % (this.w / 2);
        }
    }
};

const bird = {
    animation: [0, 1, 2, 1],
    x: 50,
    y: 150,
    speed: 0,
    gravity: 0.25,
    jump: 4.6,
    rotation: 0,
    radius: 12,
    frame: 0,
    
    draw: function() {
        let bird = birdImg[this.animation[this.frame]];
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(bird, -(bird.width / 2), -(bird.height/  2), bird.width, bird.height);
        ctx.restore();
    },
    
    flap: function() {
        this.speed = -this.jump;
        this.rotation = -25 * (Math.PI / 180);
        playAudio(FLAP_S);
    },
    
    update: function() {
        const period = state.current == state.getReady ? 10 : 5;
        this.frame += frames % period == 0 ? 1 : 0;
        this.frame = this.frame % this.animation.length;

        if (state.current == state.getReady) {
            this.y = 150;
            this.rotation = 0 * (Math.PI / 180);
        } else {
            this.speed += this.gravity;
            this.y += this.speed;

            if (this.speed >= this.jump) {
                this.rotation = 90 * (Math.PI / 180);
                this.frame = 1;
            } else {
                this.rotation = -25 * (Math.PI / 180);
            }

            if (this.y + this.radius >= canvas.height - fg.h) {
                this.y = canvas.height - fg.h - this.radius;
                if (state.current == state.game) {
                    state.current = state.over;
                    playAudio(HIT_S);
                    playAudio(DIE_S);
                }
            }
        }
    }
};

const pipes = {
    position: [],
    w: 52,
    h: 320, 
    gap: 100,
    dx: 2,
    
    draw: function() {
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            let topY = p.y;
            let bottomY = p.y + this.h + this.gap;
            
            ctx.save(); 
            ctx.translate(p.x + (this.w / 2), topY + (this.h / 2));
            ctx.rotate(Math.PI);
            ctx.drawImage(pipeImg, -(this.w / 2), -(this.h / 2), this.w, this.h);
            ctx.restore();

            ctx.drawImage(pipeImg, p.x, bottomY, this.w, this.h);
        }
    },
    
    update: function() {
        if (state.current !== state.game) {
            return
        };
        
        if (frames % 100 == 0) {
            this.position.push({
                x: canvas.width,
                y: -150 * (Math.random() + 1),
                passed: false
            });
        }
        
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            p.x -= this.dx;

            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w &&
                bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h) {
                state.current = state.over;
                playAudio(HIT_S);
            }

            let bottomPipeY = p.y + this.h + this.gap;
            
            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w &&
                bird.y + bird.radius > bottomPipeY && bird.y - bird.radius < bottomPipeY + this.h) {
                state.current = state.over;
                playAudio(HIT_S);
            }
            
            if (!p.passed && bird.x > p.x + (this.w / 2)) {
                score.value += 1;
                playAudio(SCORE_S);
                
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("flappy_best", score.best);
                
                p.passed = true; 
            }
            
            if (p.x + this.w <= 0) {
                this.position.shift();
            }
        }
    },
    
    reset: function() {
        this.position = [];
    }
};

const score = {
    best: localStorage.getItem("flappy_best") || 0,
    value: 0,
    
    drawNumber: function(val, x, y, scale = 1, align = "center") {
        let valStr = val.toString();
        
        let totalWidth = 0;

        for (let char of valStr) {
            let img = scoreImages[parseInt(char)];
            totalWidth += (img.width || 24) * scale;
        }

        let currentX = x;

        if (align === "center") {
            currentX = x - (totalWidth / 2);
        } else if (align === "right") {
            currentX = x - totalWidth;
        }

        for (let char of valStr) {
            let img = scoreImages[parseInt(char)];
            let w = (img.width || 24) * scale;
            let h = (img.height || 36) * scale;
            
            ctx.drawImage(img, currentX, y, w, h);
            currentX += w;
        }
    },

    draw: function() {
        if (state.current == state.game) {
            this.drawNumber(this.value, canvas.width / 2, 50, 1, "center");
        } else if (state.current == state.over) {
            this.drawNumber(this.value, 225, 182, 0.6, "right");
            this.drawNumber(this.best, 225, 224, 0.6, "right");
        }
    },
    
    reset: function() {
        this.value = 0;
    }
};

function updateHighScoresOnGameOver() {
    let highScores = JSON.parse(localStorage.getItem("flappy_top5")) || [];

    highScores.push(score.value);
    highScores.sort((a, b) => b - a);
    highScores = highScores.slice(0, 5);

    localStorage.setItem("flappy_top5", JSON.stringify(highScores));
}

function drawGameOver() {
    ctx.drawImage(gameOverImg, (canvas.width / 2) - 96, 90);
}

function action() {
    switch(state.current) {
        case state.getReady:
            state.current = state.game;
            playAudio(SWOOSH_S);
            break;
        case state.game:
            bird.flap();
            break;
        case state.over:
            pipes.reset();
            bird.speed = 0;
            score.reset();
            state.current = state.getReady;
            break;
    }
}

window.addEventListener("click", function(evt) {
    action();
});

window.addEventListener("keydown", function(e) {
    if (e.code === "Space") {
        action();
    }
});

function draw() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    score.draw();

    if (state.current == state.getReady) {
        ctx.drawImage(getReadyImg, (canvas.width / 2) - 92, 80);
    }
    
    if (state.current == state.over) {
        drawGameOver();
    }
}

function update() {
    bird.update();
    fg.update();
    pipes.update();
}

let isGameOverProcessed = false;

function loop() {
    update();
    draw();
    
    if (state.current == state.over && !isGameOverProcessed) {
        updateHighScoresOnGameOver();
        isGameOverProcessed = true;
    }
    if (state.current != state.over) {
        isGameOverProcessed = false;
    }

    frames++;
    requestAnimationFrame(loop);
}

loop();