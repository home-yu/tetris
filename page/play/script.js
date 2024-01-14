//フィールドの列
const field_col = 10;
//フィールドの行
const field_row = 20;

//テトロミノ1ブロックのサイズ
const block_size = 27;

//テトロミノのマス目数
const tetro_size = 4;

//スクリーンサイズ
const screen_w = block_size * field_col;
const screen_h = block_size * field_row;

//ネクストミノスクリーンサイズ
const next_screen = block_size * tetro_size+4;

//スタートする座標
const start_x = field_col/2 - tetro_size/2;
const start_y = 0;
//
const next_tetro_field_x = 0;
const next_tetro_field_y = 0;

//落ちる速度
let game_speed = 700;

//スタート時の座標をセット
let tetro_x = start_x;
let tetro_y = start_y;

//メインスクリーン
let can = document.getElementById("can");
let con = can.getContext("2d");
can.width = screen_w;
can.height = screen_h;
can.style.border = "4px solid #555";

//ネクストミノスクリーン
let can2 = document.getElementById("can2");
let con2 = can2.getContext("2d");
can2.width = next_screen;
can2.height = next_screen;
can2.style.border = "4px solid #555";

const retry = document.getElementById('retry');
const back = document.getElementById('back');
retry.classList.add("none");
back.classList.add("none")

//[TETRIS][ALLCLEAR][GAMEOVER]表示
let tetris_text = document.getElementById("comment");

//スコアの表示
let score_text = document.getElementById("score");

//RENの表示
let ren_text = document.getElementById("ren");


//BGM,効果音
const audio = new Audio('../../musics/play_bgm.mp3');
audio.loop = true;
audio.volume = 0.5;

const keypush = new Audio('../../musics/move.mp3');
keypush.volume = 1;

const harddrop = new Audio('../../musics/harddrop.mp3');
harddrop.volume = 1;

const linecut = new Audio('../../musics/cut.mp3');
linecut.volume = 1;

const tetrisaudio = new Audio('../../musics/tetris.mp3');
tetrisaudio.volume = 1;

const overaudio = new Audio('../../musics/over_bgm.mp3');
overaudio.loop = true;
overaudio.volume = 0.5;

const allcaudio = new Audio('../../musics/allclear.mp3');
allcaudio.volume = 1; 

//テトロカラー
const tetro_color = [
    "#eefaee",
    "#6CF", //水色
    "#66F", //青
    "#F92", //橙
    "#C5C", //紫
    "#FD2", //黄
    "#F44", //赤
    "#5B5", //緑
]

//ネクストテトロカラー
const ntetro_color = [
    "#FFF",
    "#6CF", //水色
    "#AACEFF", //青
    "#F92", //橙
    "#C5C", //紫
    "#FD2", //黄
    "#F44", //赤
    "#5B5", //緑
]

//テトロミノタイプ
const tetro_types = [
    [],
    [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0],//I
    ],
    [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,1,0],
        [0,0,0,0],//L
    ],
    [
        [0,0,1,0],
        [0,0,1,0],
        [0,1,1,0],
        [0,0,0,0],//J
    ],
    [
        [0,0,0,0],
        [1,1,1,0],
        [0,1,0,0],
        [0,0,0,0],//T
    ],
    [
        [0,0,0,0],
        [0,1,1,0],
        [0,1,1,0],
        [0,0,0,0],//O
    ],
    [
        [0,0,0,0],
        [0,1,1,0],
        [1,1,0,0],
        [0,0,0,0],//Z
    ],
    [
        [0,0,0,0],
        [1,1,0,0],
        [0,1,1,0],
        [0,0,0,0],//S
    ],
]



//テトロミノの形
let tetro;

//ネクストテトロのナンバー
let tetro_next = 0;

//フィールド
let field = [];

//ゲームオーバー
let over = false;

//スコアナンバー
let score_num = 0;

init();

function start(){

}

//初期化
function init(){
    //フィールドのクリア
    for(let y=0; y<field_row; y++){
        field[y] = [];
        for(let x=0; x<field_col; x++){
            field[y][x] =0;
        }
    }
    
    //ネクストテトロの作成
    tetro_next = Math.floor(Math.random()*(tetro_types.length-1))+1;

    setTetro();
    drawAll();
    setInterval(dropTetro,game_speed);
    audio.play();
    overaudio.pause();
}

//ネクストテトロのセット
function setTetro(){
    tetro_shape = tetro_next;
    tetro = tetro_types[tetro_shape];
    tetro_next = Math.floor(Math.random()*(tetro_types.length-1))+1;

    tetro_x = start_x;
    tetro_y = start_y;

}


//ブロックの描画
function drawBlock(x,y,c,lw){
    let px = x*block_size;
    let py = y*block_size;

    con.fillStyle = tetro_color[c];
    con.fillRect(px,py,block_size,block_size);
    con.strokeStyle = "black"
    con.lineWidth = lw;
    con.strokeRect(px,py,block_size,block_size);
}


//ネクストミノの描画
function drawNextBlock(x,y,c){
    let qx = x*block_size+2;
    let qy = y*block_size+2;

    con2.fillStyle = tetro_color[c];
    con2.fillRect(qx,qy,block_size,block_size);
    con2.strokeStyle = "black"
    con2.lineWidth = 4;
    con2.strokeRect(qx,qy,block_size,block_size);
}


//フィールド、テトロミノの描画
function drawAll(){
    //フィールドのクリア
    con.clearRect(0,0,screen_w,screen_h);
    //フィールドの描画
    for (let y=0; y<field_row; y++){
        for (let x=0; x<field_col; x++){
            if (!field[y][x]){
                drawBlock(x,y,0,0.5);
            }
        }
    }
    for (let y=0; y<field_row; y++){
        for (let x=0; x<field_col; x++){
            if (field[y][x]){
                drawBlock(x,y,field[y][x],4);
            }
        }
    }
    //落下予測の計算
    let plus = 0;
    while (checkMove(0,plus+1)){
        plus++;
    }
    //テトロミノの描画
    for (let y=0; y<tetro_size; y++){
        for (let x=0; x<tetro_size; x++){
            if (tetro[y][x]){
                //予測ミノ
                drawBlock(tetro_x+x,tetro_y+y+plus,0,4);
                //ミノ本体
                drawBlock(tetro_x+x,tetro_y+y,tetro_shape,4);
            }
            
            if (tetro_types[tetro_next][y][x]){
                //ネクストミノ
                switch (tetro_next){
                    case 1:
                    case 2:
                    case 3:
                        drawNextBlock(x,y,tetro_next);
                        break;
                    
                    case 4:
                    case 6:
                    case 7:
                        drawNextBlock(x,y,tetro_next);
                        break;

                    default:
                        drawNextBlock(x,y,tetro_next);
                }
            }
        }
    }
    //ゲームオーバーの表示
    if(over){
        tetris_text.textContent = "GAMEOVER";
        audio.pause();
        overaudio.play();
        retry.classList.remove("none");
        back.classList.remove("none");
    }
}


//テトロミノの衝突判定
function checkMove(mx,my,ntetro){
    if (ntetro == undefined){
        ntetro = tetro;
    }
    for (let y=0; y<tetro_size; y++){
        for (let x=0; x<tetro_size; x++){
            let nx = tetro_x + mx + x;
            let ny = tetro_y + my + y;

            if (ntetro[y][x]){
                if (ny<0||nx<0||ny >= field_row||nx >= field_col||field[ny][nx]){
                    return false;
                }
            }
        }
    }
    return true;
}


//テトロミノの回転
function rotate(angle){
    let newtetro = [];

    for (let y=0; y<tetro_size; y++){
        newtetro[y] = [];

        for (let x=0; x<tetro_size; x++){
            if (angle === "l"){
                newtetro[y][x] = tetro[tetro_size-x-1][y];
            } else if (angle === "j"){
                newtetro[y][x] = tetro[x][tetro_size-y-1];
            }
        }
    }
    return newtetro;
}


//テトロミノの固定
function fixTetro(){
    harddrop.play();
    for (let y=0; y<tetro_size; y++){
        for (let x=0; x<tetro_size; x++){
            if (tetro[y][x]){
                field[tetro_y+y][tetro_x+x] = tetro_shape;
                con2.clearRect(next_tetro_field_x,next_tetro_field_y,next_screen,next_screen);
            }
        }
    }
}

let linec = 0;
let ren = -1;
ren_text.textContent = "0";

//ラインが揃っているか確認
function checkLine(){
    linec = 0;
    tetris_text.textContent = "";
    let allclrear = true;

    for (let y=0; y<field_row; y++){
        let flag = true;
        
        for (let x=0; x<field_col; x++){
            if (!field[y][x]){
                flag = false;
                break;
            }
        }
        
        if (flag){
            linec++;
            
            for (let ny=y; ny>0; ny--){
                for (let nx=0; nx<field_col; nx++){
                    field[ny][nx] = field[ny-1][nx];
                }
            }
        }
    }

    for (let y=0; y<field_row; y++){
        for (let x=0; x<field_col; x++){
            if (field[y][x]){
                allclrear = false;
                break;
            }
        }
    }

    if(allclrear){
        allcaudio.play();
        linec = 50;
        tetris_text.textContent = "ALLCREAR";
    }

    //消したライン数によるスコア計算
    switch(linec){
        case 1:
            if(!allclrear){
                linecut.play();
            }
            ren++;
            break;
        case 4:
            linec = 10;
            if(!allclrear){
                tetrisaudio.play();
                tetris_text.textContent = "TETRIS";
            }
            ren++;
            break;
        case 0:
            ren = -1;
            break;
        case 50:
            ren++;
            break;
        default:
            if(!allclrear){
                linecut.play();
                linec = linec*2;
            }
            ren++;
            break;
    }

    switch(ren){
        case -1:
        case 0:
            score_num += linec;
            ren_text.textContent = "0";
            break;
        default:
            score_num += linec*ren;
            ren_text.textContent = String(ren);
            break;
    }
    score_text.textContent = String(score_num);
}


//テトロミノの落下
function dropTetro(){
    if(over){
        return;
    }

    if (checkMove(0,1)){
        tetro_y++;
    } else{
        fixTetro();
        checkLine();
        setTetro();
        
        if (!checkMove(0,0)){
            over = true;
        }

    }
    drawAll();
}


//テトロミノの移動
document.onkeydown =function(e){
    if (over){
        return;
    }

    if (e.key === "a"){
        keypush.play();
        if (checkMove(-1,0)){
            tetro_x--;
        }
    } else if (e.key === "w"){
        while (checkMove(0,1)){
            tetro_y++;
        }
    } else if (e.key === "d"){
        keypush.play();
        if (checkMove(1,0)){
            tetro_x++;
        }
    } else if (e.key === "s"){
        keypush.play();
        if (checkMove(0,1)){
            tetro_y++;
        }
    } else if (e.key === "j"){
        let ntetro = rotate("j");
        if (checkMove(0,0,ntetro)){
            tetro = rotate("j");
        }
    } else if (e.key === "l"){
        let ntetro = rotate("l");
        if (checkMove(0,0,ntetro)){
            tetro = rotate("l");
        }
    } 
    drawAll();
}