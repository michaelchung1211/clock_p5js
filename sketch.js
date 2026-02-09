let snowflakes = [];

function setup() {
  createCanvas(1535, 600);
  bgimg = loadImage("assets/background.png");
  
  time_h = 0;
  time_m = 0;
  time_s = 0;
  
  style_R = 60;
  style_ST = 6;
  
  chart = [
    [4, 5, 5, 1,
     6, 4, 1, 6,
     6, 6, 6, 6,
     6, 6, 6, 6,
     6, 3, 2, 6,
     3, 5, 5, 2,
    ],
    [4, 5, 1, 7,
     3, 1, 6, 7,
     7, 6, 6, 7,
     7, 6, 6, 7,
     4, 2, 3, 1,
     3, 5, 5, 2,
    ],
    [4, 5, 5, 1,
     3, 5, 1, 6,
     4, 5, 2, 6,
     6, 4, 5, 2,
     6, 3, 5, 1,
     3, 5, 5, 2,
    ],
    [4, 5, 5, 1,
     3, 5, 1, 6,
     7, 4, 2, 6,
     7, 3, 1, 6,
     4, 5, 2, 6,
     3, 5, 5, 2,
    ],
    [4, 1, 4, 1,
     6, 6, 6, 6,
     6, 3, 2, 6,
     3, 5, 1, 6,
     7, 7, 6, 6,
     7, 7, 3, 2,
    ],
    [4, 5, 5, 1,
     6, 4, 5, 2,
     6, 3, 5, 1,
     3, 5, 1, 6,
     4, 5, 2, 6,
     3, 5, 5, 2,
    ],
    [4, 5, 5, 1,
     6, 4, 5, 2,
     6, 3, 5, 1,
     6, 4, 1, 6,
     6, 3, 2, 6,
     3, 5, 5, 2,
    ],
    [4, 5, 5, 1,
     3, 5, 1, 6,
     7, 7, 6, 6,
     7, 7, 6, 6,
     7, 7, 6, 6,
     7, 7, 3, 2,
    ],
    [4, 5, 5, 1,
     6, 4, 1, 6,
     6, 3, 2, 6,
     6, 4, 1, 6,
     6, 3, 2, 6,
     3, 5, 5, 2,
    ],
    [4, 5, 5, 1,
     6, 4, 1, 6,
     6, 3, 2, 6,
     3, 5, 1, 6,
     4, 5, 2, 6,
     3, 5, 5, 2,
    ],
  ]
  
  decode = {
    0: [PI/2, PI/2],
    1: [PI/2,PI*2/2],
    2: [PI*2/2,PI*3/2],
    3: [0/2,PI*3/2],
    4: [0/2,PI/2],
    5: [0/2,PI*2/2], 
    6: [PI/2,PI*3/2], 
    7: [PI*3/4,PI*3/4]
  }
  
  rotation_init();
  
  for (let i = 0; i < 70; i++) {
    snowflakes.push(new Snowflake());
  }
}

function draw() {
  // fill(255, 255, 255);
  // rect(0, 0, 1535, 600)
  image(bgimg, 0, 0);
  time_h = hour();
  time_m = minute();
  time_s = second();
  
  x = 60
  y = 100
  
  // Hour
  single(x + style_R*0 + 0, y, floor(time_h/10), 1)
  single(x + style_R*4 + 0, y, time_h%10, 2)
  
  // Minute
  single(x + style_R*8 + 20, y, floor(time_m/10), 3)
  single(x + style_R*12 + 20, y, time_m%10, 4)
  
  // Second
  single(x + style_R*16 + 40, y, floor(time_s/10), 5)
  single(x + style_R*20 + 40, y, time_s%10, 6)
  
  for (let s of snowflakes) {
    s.update();
    s.show();
  }
}

function single(xx, yy, t, id){
  push()
  translate(xx, yy)
  let x = 0
  let y = 0
  for (let i = 0; i < 6; i++){
    for (let j = 0; j < 4; j++){
      clock(x, y, chart[t][i*4+j], id*100+i*10+j)
      x += style_R
    }
    x -= style_R*4
    y += style_R
  }
  pop()
}

function clock(x, y, n, id){
  push()
    translate(x, y)
    fill(224, 252, 255)
    circle(0,0,style_R)
    fill(0,0,0)
    push()
      rotate(rotation_logic(id, 0, decode[n][0]))
      rect(0, -style_ST/2, style_R-32, style_ST, 2)
    pop()
    rotate(rotation_logic(id, 1, decode[n][1]))
    rect(0, -style_ST/2, style_R-32, style_ST, 2)
  pop()
}

function rotation_logic(id, subid, tar){
  let curr = statemap.get(id)[subid];
  if (abs(curr - tar) < 0.12){
    statemap.get(id)[subid] = tar;
    return tar;
  } else{
    statemap.get(id)[subid] = (curr + 0.12) %(2*PI);
    return (curr + 0.12);
  }
}

function rotation_init(){
  statemap = new Map();
  for (let i = 1; i <=6; i++){
    for (let j = 0; j < 6; j++){
      for (let k = 0; k < 4; k++){
        let id = i*100+j*10+k;
        statemap.set(id, [0, 0]);
      }
    }
  }
}

class Snowflake {
  constructor() {
    this.reset();
    this.size = 15;
    this.offset = random(1000);
    this.alpha = random(120, 200);
  }
  reset() {
    this.x = random(width);
    this.y = random(-height, 0);
    this.speed = random(1, 2);
  }
  update() {
    this.y += this.speed;
    let drift = map(noise(this.offset + frameCount * 0.01), 0, 1, -1, 1);
    this.x += drift * 0.5;
    if (this.x < -20) this.x = width + 20;
    if (this.x > width + 20) this.x = -20;
    if (this.y > height + 10) {
    this.reset();
    this.y = -10;
    }
  }
  show() {
    noStroke();
    fill(255, this.alpha);
    circle(this.x, this.y, this.size);
  }
}

