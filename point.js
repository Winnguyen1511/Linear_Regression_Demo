
class Point{
    constructor(x, y, color = [0, 100, 255])
    {
        this._dx = planeWidth / axisXScale;
        this._dy = - planeHeight / axixYScale;
        this._color = color;
        this._x = x * this._dx;
        this._y = y * this._dy;
    }
    get x()
    {
        return this._x / this._dx;
    }
    set x(val)
    {
        this._x = val * this._dx;
    }

    get y()
    {
        return this._y / this._dy;
    }

    set y(val)
    {
        this._y = val * this._dy;
    }

    get color()
    {
        return this._color;
    }
    set color(val)
    {
        this._color = val;
    }
    draw()
    {
        stroke(...this._color);
        strokeWeight(5);
        point(this._x, this._y);
    }
}


class Line
{
    constructor(start, end, color = [201, 201, 0])
    {
        this._start = start;
        this._end = end;
        this._color = color;
    }
    draw()
    {
        stroke(...this._color);
        strokeWeight(2);
        line(this._start._x, this._start._y,
            this._end._x, this._end._y);
    }
}

function createLine(w, b, color)
{
    const select = [];
    function y(x){
        return b + w * x;
    }
    function x(y)
    {
        return (y - b) / w;
    }

    //intersection with x = 0, x = 10, y = 0, y = 10;
    let isX0 = new Point(0, y(0));
    let isX10 = new Point(10, y(10));
    let isY0 = new Point(x(0), 0);
    let isY10 = new Point(x(10), 10);
    let meanX = (isX0.x + isX10.x + isY0.x + isY10.x) / 4;
    let meanY = (isX0.y + isX10.y + isY0.y + isY10.y) / 4;
    let mean = new Point(meanX, meanY);
    
    let tmpArr = [{
                    "obj":isX0,
                    "dist":distance_square(isX0, mean)
                },
                {
                    "obj":isX10,
                    "dist":distance_square(isX10, mean)
                },
                {
                    "obj":isY0,
                    "dist":distance_square(isY0, mean)
                },
                {
                    "obj":isY10,
                    "dist":distance_square(isY10, mean)
                }];
    const max_1 = tmpArr.reduce((prev, cur) =>{
        return prev.dist > cur.dist ? prev : cur;
    });
    tmpArr = tmpArr.filter((ele)=>{
        return ele.obj != max_1.obj;
    });
    const max_2 = tmpArr.reduce((prev, cur) =>{
        return prev.dist > cur.dist ? prev : cur;
    });
    
    // stroke(255, 0, 0);
    // strokeWeight(1.5);
    // line(max_1._x, max_1._y, max_2._y, max_2._y);
    return new Line(max_1.obj, max_2.obj, color);
    
}

function distance_square(pointA, pointB)
{
    let xA = pointA.x; let yA = pointA.y;
    let xB = pointB.x; let yB = pointB.y;
    return (xA - xB) ** 2 + (yA - yB) **2;
}