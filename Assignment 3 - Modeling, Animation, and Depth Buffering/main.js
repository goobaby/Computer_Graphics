//
//  main.js
//
angle = 0;

function init()
{
    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST)
    cube = new Cube(gl);
    render();
}

function render()
{

    var canvas;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //motion var
    angle += 1;

    R = rotate(angle, [1,1,1]);

    //var width = canvas.clientWidth, height = canvas.clientHeight;

    //gl.viewport(0, 0,width, height);

    //aspect = width, height;

    

    P = perspective(120, 1, 10, 100)

    //console.log(P)

    cube.mv = R;

    cube.p = P;

    cube.render();

    requestAnimationFrame(render);
}



window.onload = init;