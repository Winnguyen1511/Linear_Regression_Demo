
const canvasWidth = 402;
const canvasHeight = 402;
const planeWidth  = 400;
const planeHeight = 400;
const axisXScale = 10;
const axixYScale = 10;
const defaultBias = 2;
const defaultWeight = 0.5;
const RED = [255, 0, 0];
const YELLOW = [201, 201, 0];

var b = defaultBias;//default
var w = defaultWeight;//default

function BIT(X){
    return (1 << X);
}
const state_enum ={
    Reset_state:0,
    Plot_state:1,
    Random_state:2,
    LRGD_state:3
};
var state = BIT(state_enum.Reset_state);

//Element and buttons:
var txtWeight, txtBias;
var btnPlot, btnRandom, btnLRGD, btnReset;
//Linear Regression result to render:
var realLine;
var estimateLineArr = [];
var weightTrainedArr = [];
var count = 0;

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    addElements();
    addEvents();
    frameRate(10);
    // let tmp = plotLine(-1.5, 5);
    // console.log("x: "+tmp[0].x+" y: "+tmp[0].y);
    // console.log("x: "+tmp[1].x+" y: "+tmp[1].y);
    
    // l = new Line(tmp[0], tmp[1]);
}

function draw() {
    background(240);
    translate(canvasWidth / 2, canvasHeight / 2);
    stroke(0);
    strokeWeight(4);
    noFill();
    rectMode(CENTER);
    rect(0,0, planeWidth, planeHeight);
    translate(-planeWidth / 2 , planeHeight / 2);
    grid();
    
    //Handle state of 
    if(!(state & BIT(state_enum.Reset_state)))
    {
        if(state & BIT(state_enum.Random_state))
        {
            for(let i = 0; i < numSample; i++)
            {
                // X[i].draw();
                pointVector[i].draw()
            }  
        }
        if(state & BIT(state_enum.Plot_state))
        {
            //plot the real line here
            // console.log("Plot func");
            realLine.draw();
        }

        if(state & BIT(state_enum.LRGD_state))
        {
            //Plot iterately the estimate line
            //remember to delay the frame rate here
            estimateLineArr[count].draw();
            if(count < estimateLineArr.length - 1)
                count++;
        }
        
    }
}

function addElements()
{
    //Add all elements from html File
    txtWeight = document.getElementById("txtWeight");
    txtBias = document.getElementById("txtBias");
    
    btnPlot = document.getElementById("btnPlot");
    btnRandom = document.getElementById("btnRandom");
    btnLRGD = document.getElementById("btnLRGD");
    btnReset = document.getElementById("btnReset");

}

function addEvents()
{
    btnPlot.addEventListener("click", ()=>{
        //handle Plot btn
        console.log("Plot");
        let tmpb = parseFloat(txtBias.value);
        let tmpw = parseFloat(txtWeight.value);
        if((txtBias.value != "") && (txtWeight.value != ""))
        {
            // console.log("err")
            b = tmpb;
            w = tmpw;
        }
        else{
            b = defaultBias; w = defaultWeight;
        }
        realLine = createLine(w, b, YELLOW);
        state &= ~BIT(state_enum.Reset_state);
        state |= BIT(state_enum.Plot_state);
    });

    btnRandom.addEventListener("click", ()=>{
        //handle Random btn
        console.log("Random");
        let tmpb = parseFloat(txtBias.value);
        let tmpw = parseFloat(txtWeight.value);
        if((txtBias.value != "") && (txtWeight.value != ""))
        {
            // console.log("err")
            b = tmpb;
            w = tmpw;
        }
        else{
            b = defaultBias; w = defaultWeight;
        }
        
        // console.log(b)
        // console.log(w);
        randomPoint();
        state &= ~BIT(state_enum.Reset_state);
        state |= BIT(state_enum.Random_state);
    });

    btnLRGD.addEventListener("click", ()=>{
        //handle LRGD btn
        console.log("LRGD");
        if(!(state & BIT(state_enum.Random_state)))
        {
            console.log("Please Random first");
            return undefined;
        }
        let tmpb = parseFloat(txtBias.value);
        let tmpw = parseFloat(txtWeight.value);
        if((txtBias.value != "") && (txtWeight.value != ""))
        {
            // console.log("err")
            b = tmpb;
            w = tmpw;
        }
        else{
            b = defaultBias; w = defaultWeight;
        }
        gradientDescent([[2],[1]], eta);
        estimateLineArr = [];
        for(let i = 0; i < weightTrainedArr.length ; i++)
        {
            // console.log("w="+weightTrainedArr[i][1][0]);
            // console.log("b="+weightTrainedArr[i][0][0]);
            estimateLineArr.push(createLine(weightTrainedArr[i][1][0],
                                            weightTrainedArr[i][0][0],
                                            RED));
        }
        // console.log(weightTrainedArr);
        console.log("w_estimate:"+W_estimate);
        count = 0;
        state &= ~BIT(state_enum.Reset_state);
        state |= BIT(state_enum.LRGD_state);
    });

    btnReset.addEventListener("click", ()=>{
        //handle Reset btn
        console.log("Reset");
        pointVector = [];
        realLine=[]; estimateLineArr = [];
        b =defaultBias;
        w = defaultWeight;
        state = 0;
        state |= BIT(state_enum.Reset_state);
    });
}

  
function grid()
{
    stroke(210);
    strokeWeight(1);

    for(let i = 1; i < axisXScale; i++)
    {
        //draw vertical scale 0 -> 10
        let dx = planeWidth / axisXScale;
        line(i * dx, 0, i * dx, - planeHeight);
    }
    for(let i = 1; i < axixYScale; i++)
    {
        //draw horizontal scale 0 -> 10
        let dy = planeHeight / axixYScale;
        line(0, - i * dy, planeWidth, - i * dy);
    }
}
