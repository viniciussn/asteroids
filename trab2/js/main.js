$(function()
{   
    var gl;
    var mat4 = glMatrix.mat4;
    var vec3 = glMatrix.vec3;
    var shaderProgram;
    var piramideVertexPositionBuffer;
    var cuboVertexPositionBuffer;
    var mMatrix = mat4.create();
    var pMatrix = mat4.create();
    var vMatrix = mat4.create();
    
    var piramideVertexPositionBuffer;
    var cuboVertexPositionBuffer;
    var cuboVertexTextureCoordBuffer;
    var cuboVertexIndexBuffer;
    var piramideVertexTextureCoordBuffer;

    var rPiramide = 0;
    var rCubo= 0;
    var ultimo = 0;
    var mMatrixPilha = [];

    var cuboTextura;
    var piramideTextura;

    var xRotC = 0;
    var yRotC = 0;
    var zRotC = 0;

    var xRotP = 0;
    var yRotP = 0;
    var zRotP = 0;

    var yRotPVel = 0;
    var xRotCVel = 0;

    var teclasPressionadas = {};

    var angulo_orbita = 0;
    var velocidade_orbita = 0;
    var orbitando = false;    

    var camera_girar_x = 0;
    var camera_girar_y = 0;
    var camera_girar_z = 0;
    var camera_mover_z = 0;
    var camera_mover_x = 0;
    var camera_mover_y = 0;
   // Iniciar o ambiente quando a página for carregada
    $(function()
    {
        iniciaWebGL();
    });  
            
    function iniciaWebGL()
    {
        var canvas = $('#canvas-webgl')[0];
        iniciarGL(canvas); // Definir como um canvas 3D
        iniciarShaders();  // Obter e processar os Shaders
        iniciarBuffers();  // Enviar o triângulo e quadrado na GPU
        iniciarAmbiente(); // Definir background e cor do objeto
        iniciarTextura();
        document.onkeydown = eventoTeclaPress;
        document.onkeyup = eventoTeclaSolta;
        tick();
    }
    

    function tick()
    {
      requestAnimationFrame(tick);
      tratarTeclado();
      desenharCena();
      animar();
    }                     

    function iniciarGL(canvas){
        try{
            gl = canvas.getContext("webgl") || 
            canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        }
        catch(e){
            if(!gl)
                alert("Não pode inicializar WebGL, desculpe");
        }
    }	
    
    function iniciarShaders()
    {
        var vertexShader = getShader(gl, "#shader-vs");
        var fragmentShader = getShader(gl, "#shader-fs");
    
        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
    
        if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
            alert("Não pode inicializar shaders");
        }
    
        gl.useProgram(shaderProgram);
    
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    
        // shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        // gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
        shaderProgram.vertexTextureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
        gl.enableVertexAttribArray(shaderProgram.vertexTextureCoordAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
        shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");    
    }

    function getShader(gl, id) {
        var shaderScript = $(id)[0];
        if(!shaderScript) {
            return null;
        }
    
        var str = "";
        var k = shaderScript.firstChild;
        while(k){
            if(k.nodeType == 3){
                str += k.textContent;
            }
            k = k.nextSibling;
        }
    
        var shader;
        
        if(shaderScript.type == "x-shader/x-fragment"){
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        }else if(shaderScript.type == "x-shader/x-vertex"){
            shader = gl.createShader(gl.VERTEX_SHADER);
        }else{
            return null;
        }
    
        gl.shaderSource(shader, str);
        gl.compileShader(shader);
    
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
    
        return shader;
    }		
    
    function iniciarBuffers(){
        piramideVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, piramideVertexPositionBuffer);
        var vertices = [
            // Frente
              0.0,  1.0,  0.0,
            -1.0, -1.0,  1.0,
              1.0, -1.0,  1.0,
            // Direita
              0.0,  1.0,  0.0,
              1.0, -1.0,  1.0,
              1.0, -1.0, -1.0,
            // Trás
              0.0,  1.0,  0.0,
              1.0, -1.0, -1.0,
            -1.0, -1.0, -1.0,
            // Esquerda
              0.0,  1.0,  0.0,
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        piramideVertexPositionBuffer.itemSize = 3;
        piramideVertexPositionBuffer.numItems = 12;

        // piramideVertexColorBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, piramideVertexColorBuffer);
        // var cores = [
        //     // Frente
        //     1.0, 0.0, 0.0, 1.0,
        //     0.0, 1.0, 0.0, 1.0,
        //     0.0, 0.0, 1.0, 1.0,
        //     // Direita
        //     1.0, 0.0, 0.0, 1.0,
        //     0.0, 0.0, 1.0, 1.0,
        //     0.0, 1.0, 0.0, 1.0,
        //     // Trás
        //     1.0, 0.0, 0.0, 1.0,
        //     0.0, 1.0, 0.0, 1.0,
        //     0.0, 0.0, 1.0, 1.0,
        //     // Esquerda
        //     1.0, 0.0, 0.0, 1.0,
        //     0.0, 0.0, 1.0, 1.0,
        //     0.0, 1.0, 0.0, 1.0
        // ];
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cores), gl.STATIC_DRAW);
        // piramideVertexColorBuffer.itemSize = 4;
        // piramideVertexColorBuffer.numItems = 12;

        piramideVertexTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, piramideVertexTextureCoordBuffer);
        var coordTextura = [
            // Frente
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            // Trás
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,

            // Topo
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,

            // Base
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,

            // Direita
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,

            // Esquerda
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordTextura), gl.STATIC_DRAW);
        piramideVertexTextureCoordBuffer.itemSize = 2;
        piramideVertexTextureCoordBuffer.numItems = 24;
        /*cubo----------------------------------------------------------- */
        cuboVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cuboVertexPositionBuffer);
        vertices = [
            // Frente
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
          
            // Trás
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0,
          
            // Topo
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0,
          
            // Base
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,
          
            // Direita
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0,
          
            // Esquerda
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0,
          ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        cuboVertexPositionBuffer.itemSize = 3;
        cuboVertexPositionBuffer.numItems = 24;

        // cuboVertexColorBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, cuboVertexColorBuffer);
        // cores = [
        //     [1.0, 0.0, 0.0, 1.0],     // Frente
        //     [1.0, 1.0, 0.0, 1.0],     // Trás
        //     [0.0, 1.0, 0.0, 1.0],     // Topo
        //     [1.0, 0.5, 0.5, 1.0],     // Base
        //     [1.0, 0.0, 1.0, 1.0],     // Direita
        //     [0.0, 0.0, 1.0, 1.0],     // Esquerda
        //   ];
        //     var coresReplicadas = [];
        //     for (var i in cores) {
        //         var cor = cores[i];
        //         for (var j=0; j < 4; j++) {
        //             coresReplicadas = coresReplicadas.concat(cor);
        //         }
        //     }
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coresReplicadas), gl.STATIC_DRAW);
        // cuboVertexColorBuffer.itemSize = 4;
        // cuboVertexColorBuffer.numItems = 24;
        cuboVertexTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cuboVertexTextureCoordBuffer);
        coordTextura = [
            // Frente
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

            // Trás
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,

            // Topo
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,

            // Base
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,

            // Direita
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,

            // Esquerda
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordTextura), gl.STATIC_DRAW);
        cuboVertexTextureCoordBuffer.itemSize = 2;
        cuboVertexTextureCoordBuffer.numItems = 24;
        
        cuboVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cuboVertexIndexBuffer);
        var indices = [
        0, 1, 2,      0, 2, 3,    // Frente
        4, 5, 6,      4, 6, 7,    // Trás
        8, 9, 10,     8, 10, 11,  // Topo
        12, 13, 14,   12, 14, 15, // Base
        16, 17, 18,   16, 18, 19, // Direita
        20, 21, 22,   20, 22, 23  // Esquerda
        ]
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        cuboVertexIndexBuffer.itemSize = 1;
        cuboVertexIndexBuffer.numItems = 36;
    }	

    function iniciarAmbiente() {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
    }	
    
    function desenharCena(){
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
        if(camera_girar_x>360 || camera_girar_x<-360) camera_girar_x = 0;
        
        mat4.identity(vMatrix);

        
        mat4.translate(vMatrix, vMatrix, [0, -8 , 0]);
        // mat4.rotate(vMatrix, vMatrix, degToRad(-90), [1, 0, 0]);

        mat4.translate(vMatrix, vMatrix, [camera_mover_x, camera_mover_y, camera_mover_z]);
        mat4.rotate(vMatrix, vMatrix, degToRad(-camera_girar_x), [1, 0, 0]);
        mat4.rotate(vMatrix, vMatrix, degToRad(camera_girar_y), [0, 1, 0]);
        mat4.rotate(vMatrix, vMatrix, degToRad(camera_girar_z), [0, 0, 1]);
        
        

        mat4.identity(mMatrix);

        /*Piramide */ 
        mPushMatrix();
            mat4.translate(mMatrix, mMatrix, [0, 0.0, -15.0]);
            mPushMatrix();
                mat4.rotate(mMatrix, mMatrix, degToRad(xRotP), [1, 0, 0]);
                mat4.rotate(mMatrix, mMatrix, degToRad(yRotP), [0, 1, 0]);
                mat4.rotate(mMatrix, mMatrix, degToRad(zRotP), [0, 0, 1]);

                gl.bindBuffer(gl.ARRAY_BUFFER, piramideVertexPositionBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, piramideVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

                // gl.bindBuffer(gl.ARRAY_BUFFER, piramideVertexColorBuffer);
                // gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, piramideVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ARRAY_BUFFER, piramideVertexTextureCoordBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexTextureCoordAttribute, piramideVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, piramideTextura);
                gl.uniform1i(shaderProgram.samplerUniform,0);
                setMatrixUniforms();
                gl.drawArrays(gl.TRIANGLES, 0, piramideVertexPositionBuffer.numItems);
            mPopMatrix();
            /*---CUBO---*/
            mPushMatrix();
                if(orbitando){
                    angulo_orbita += velocidade_orbita;
                    if(angulo_orbita>360) angulo_orbita=0;
                }
                mat4.rotate(mMatrix, mMatrix, degToRad(angulo_orbita), [0, 1, 0]);

                mat4.translate(mMatrix, mMatrix, [5, 0,0]);

                mat4.rotate(mMatrix, mMatrix, degToRad(xRotC), [1, 0, 0]);
                
                gl.bindBuffer(gl.ARRAY_BUFFER, cuboVertexPositionBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cuboVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, cuboVertexTextureCoordBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexTextureCoordAttribute, cuboVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.activeTexture(gl.TEXTURE0);

                gl.bindTexture(gl.TEXTURE_2D, cuboTextura);
                gl.uniform1i(shaderProgram.samplerUniform,0);

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cuboVertexIndexBuffer);
                setMatrixUniforms();
                gl.drawElements(gl.TRIANGLES, cuboVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT,0);
            mPopMatrix();
        mPopMatrix();

        var canvas = document.getElementById("text");
        var ctx = canvas.getContext("2d");
        ctx.font = "16px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("Girar cubo: cima/baixo", 10, 20);
        ctx.fillText("Girar pirâmide: esquerda/direita", 10, 35);
        ctx.fillText("Orbita: O", 10, 50);
        ctx.fillText("Girar câmera eixo Y: A/D", 10, 65);
        ctx.fillText("Girar câmera eixo X: W/S", 10, 80);
        ctx.fillText("Girar câmera eixo Z: Z/X", 10, 95);
        ctx.fillText("Mover câmera eixo Y: I/K", 10, 110);
        ctx.fillText("Mover câmera eixo X: J/L", 10, 125);
        ctx.fillText("Mover câmera eixo Z: N/M", 10, 140);

    }

    function animar()
    {
        yRotP  += yRotPVel%360.0;
        xRotC += xRotCVel%360;
    }

    function setMatrixUniforms(){
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, vMatrix);
        gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, mMatrix);
    }	

    function mPushMatrix() {
        var copy = mat4.clone(mMatrix);
        mMatrixPilha.push(copy);
    }
    
    function mPopMatrix() {
        if (mMatrixPilha.length == 0) {
            throw "inválido popMatrix!";
        }
        mMatrix = mMatrixPilha.pop();
    }		
    
    function degToRad(graus) {
        return graus * Math.PI / 180;
    }

  
    function iniciarTextura()
    {
      cuboTextura = gl.createTexture();
      cuboTextura.image = new Image();
      cuboTextura.image.onload = function()
      {
        tratarTextura(cuboTextura);
      }
      cuboTextura.image.src = "metal.png";
      shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
  
      piramideTextura = gl.createTexture();
      piramideTextura.image = new Image();
      piramideTextura.image.onload = function()
      {
        tratarTextura(piramideTextura);
      }
      piramideTextura.image.src = "madeira.png";
      shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
    }

    function tratarTextura(textura) {
        gl.bindTexture(gl.TEXTURE_2D, textura);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textura.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    function eventoTeclaPress(evento) {
        teclasPressionadas[evento.keyCode] = true;
    }
    function eventoTeclaSolta(evento) {
        teclasPressionadas[evento.keyCode] = false;
    }

    function tratarTeclado() {
        if (teclasPressionadas[37]) {
            if(yRotPVel>-180){
                yRotPVel--;
            }
        }
        if (teclasPressionadas[39]) {
            if(yRotPVel < 180){
                yRotPVel++;
            }
        }
        if (teclasPressionadas[38]) {
            if(xRotCVel>-180){
                xRotCVel--;
            }
        }
        if (teclasPressionadas[40]) {
            if(xRotCVel<180){
                xRotCVel++;
            }
        }
        if (teclasPressionadas[79]) {
            velocidade_orbita+=0.1;
            orbitando = true;
        }else{
            orbitando = false;
            velocidade_orbita = 0;
        }
        
        if (teclasPressionadas[78]) {
            camera_mover_z++;
        }
        if (teclasPressionadas[77]) {
            camera_mover_z--;
        }

        if (teclasPressionadas[87]) {
            camera_girar_x++;
        }
        if (teclasPressionadas[83]) {
            camera_girar_x--;
        }

        if (teclasPressionadas[65]) {
            camera_girar_y++;
        }

        if (teclasPressionadas[68]) {
            camera_girar_y--;
        }

        if (teclasPressionadas[73]) {
            camera_mover_y--;
        }

        if (teclasPressionadas[75]) {
            camera_mover_y++;
        }


        if (teclasPressionadas[74]) {
            camera_mover_x++;
        }

        if (teclasPressionadas[76]) {
            camera_mover_x--;
        }

        if (teclasPressionadas[90]) {
            camera_girar_z++;
        }

        if (teclasPressionadas[88]) {
            camera_girar_z--;
        }
            

    }
});