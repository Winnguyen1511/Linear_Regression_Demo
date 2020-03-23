
const numSample = 100;
const eta = 1;
const errPression = 1e-4
var X;
var Y;
var Y_real;
// var Y_hat;
var X_bar;
var W_estimate;
var pointVector = [];
function makeNoise(mean, margin)
{
    return Math.random() * (margin * 2) - margin + mean;
}
function randomPoint()
{
    const tmpX = [];
    const tmpY = [];
    const tmpYreal = [];
    const tmpPointVector = [];
    const tmpXbar = [];
    for(let i = 0; i < numSample; i++)
    {
        const tmpx = Math.random();
        let tmpy = linear_model(tmpx);
        tmpYreal.push(tmpy);
        let noise = makeNoise(0, 0.5);
        tmpy = tmpy + noise;
        // Y = 
        tmpX.push([tmpx]);
        tmpXbar.push([1, tmpx]);
        tmpY.push([tmpy]);
        tmpPointVector.push(new Point(tmpx * axisXScale, linear_model(tmpx * axisXScale) + noise));
    }
    X = tmpX;
    Y_real = tmpYreal;
    Y = tmpY;
    X_bar = tmpXbar;
    pointVector = tmpPointVector;
}
function linear_model(val)
{
    return b + w * val;
}

function grad(w)
{
    let N = numSample;
    let product = mulDot(transpose(X_bar), diffVec(mulDot(X_bar, w), Y));
    return mulMatScalar(product,  1 / N);
}

// function loss(w)
// {
//     let l_mat = diffVec(,y);
// }
// function norm
//Still need to work !!!!
function gradientDescent(w_init, eta)
{
    let w = [w_init];
    for(let i = 0; i < numSample; i++)
    {
        let gd = grad(w[w.length - 1]);
        // console.log(math.norm(transpose(gd)));
        if(math.norm(transpose(gd)) < errPression)
        {
            console.log("Finished after "+i+" iters");
            break;
        }
        let tmpUpdate = mulMatScalar(gd, eta);
        let w_new = diffVec(w[w.length - 1], tmpUpdate);
        //Add stop point here when norm(grad(w_new)) / len(w_new) < 1e-3
        let tmp = transpose(w_new);
        let n = math.norm(tmp) / w.length;
        // console.log("n="+n);
        w.push(w_new);
    }
    weightTrainedArr = w;
    W_estimate = w[w.length - 1];
    // console.log(w[w.length - 1]);
}

function transpose(A)
{
    let transpose = [];
    let rA = A.length; let cA = A[0].length;
    if(cA != undefined)
    {   
        //A-matrix rA * cA
        //A canbe 3 * 1 (ca == 1)
        for(let j = 0 ; j < cA; j++)
        {
            let tmpRow = [];
            for(let i = 0; i < rA; i++)
            {
                tmpRow.push(A[i][j]);
            }
            transpose.push(tmpRow);
        }
        if(cA == 1)
        {
            transpose = transpose[0];
        }
    }
    else{
        //row Vector: A 1 * cA ( 1 * rA ) 
        //because cA == undefine, we can just use rA instead
        for(let i = 0; i < rA; i++)
        {
            transpose.push([A[i]]);
        }
    }
    return transpose;
}
function mulDot(A, B)
{
    let product = [];
    let rA = A.length; let cA = A[0].length;
    let rB = B.length; let cB = B[0].length;
    // console.log("cb="+cB);
    if(cA != undefined && cB != undefined)
    {
        //A-matrix, B-matrix:
        //A can be 1 * 3 ( rA == 1), it is normal
        //product - rA * cB
        if (cA == rB)
        {
            for(let i = 0; i < rA; i++)
            {
                let tmpRow = [];
                for(let j = 0; j < cB; j++)
                {
                    let tmpVal = 0;
                    for(let k=0; k < rB; k++)
                    {
                        tmpVal += A[i][k] * B[k][j];
                    }
                    tmpRow.push(tmpVal);
                }
                product.push(tmpRow);
            }
        }
        else{
            console.log("Error: Multiplication size conflict");
        }
    }
    else{
        //row vector:
        if(cA == undefined && cB != undefined)
        {
            //A-row, B-matrix
            //B canbe column (rB * 1)
            //product (1 * cB)
            if(rA == rB)
            {
                for(let i = 0; i < cB; i++)
                {
                    let tmpVal = 0;
                    for(let j = 0; j < rB; j++)
                    {
                        tmpVal += A[j] * B[j][i];
                    }
                    product.push(tmpVal);
                }
            }
            else{
                console.log("Error: Multilication size conflict");
            }
            
        }
        else if (cA != undefined && cB == undefined)
        {
            //A-matrix, B-row:
            //A canbe column (rA * 1)
            //product (rA * rB) because cB is undefined
            //we can just use rB instead
            if(cA == 1)
            {
                for(let i = 0; i < rA; i++)
                {   
                    let tmpRow = [];
                    for(let j = 0 ; j < rB; j++)
                    {
                        tmpRow.push(A[i][0] * B[j]);
                    }
                    product.push(tmpRow);
                }
            }
            else{
                console.log("Error: Multilication size conflict");
            }
            
        }
        else{
            console.log("Error: Multiplication Row vector len conflict");
        }
    }
    

    return product;
}

function mulMatScalar(mat, sca)
{
    let product = [];
    let rMat = mat.length; let cMat = mat[0].length;
    if(cMat != undefined)
    {
        //if mat is a matrix or column vector,
        //multiply all with scalar 
        for(let i = 0; i < rMat; i++)
        {
            let tmpRow = [];
            for(let j = 0; j < cMat; j++)
            {
                tmpRow.push(mat[i][j] * sca);
            }
            product.push(tmpRow);
        }
    }
    else{
        //row Vector:
        for(let i = 0; i < rMat; i++)
        {
            product.push(mat[i] * sca);
        }
    }
    
    return product;
}

function diffVec(A, B)
{
    let diff = [];
    let rA = A.length; let cA = A[0].length;
    let rB = B.length; let cB = B[0].length;
    if(cA != undefined && cB != undefined)
    {
        //if A and be both matrix or column vector
        //with same size/len
        if(rA == rB && cA == cB)
        {
            for(let i = 0; i < rA; i++)
            {
                let tmpRow = [];
                for(let j = 0; j < cA; j++)
                {
                    tmpRow.push(A[i][j] - B[i][j]);
                }
                diff.push(tmpRow);
            }
        }
        else{
            console.log("Error: Different matrix size conflict");
        }
    }
    else{
        //Row vector:
        //only if A and B are row vectors
        //with same len
        if(rA == rB)
        {
            for(let i = 0; i < rA; i++)
            {
                diff.push(A[i] - B[i]);
            }
        }
        else{
            console.log("Error: Different row vector len conflict");
        }
    }
    return diff;
}