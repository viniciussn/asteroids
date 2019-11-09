window.onload = function() {
    /* ============================================================================================================= */
    /* criando componente game_engine, responsável pela lógica do jogo*/ 
    AFRAME.registerComponent('game_engine', {
        init: game_init,
        tick: game_tick
    });
    /* ============================================================================================================= */
    /* criando a cena e adicionando o componente game_engine*/
    var scene = document.createElement('a-scene');
    document.body.appendChild(scene);
    var entity = document.createElement('a-entity');
    entity.setAttribute('game_engine', '');
    scene.appendChild(entity);
    /* ============================================================================================================= */
    /* configurando a câmera */    
    var camera = document.createElement('a-camera');
    camera.setAttribute('position', '0 0 0');
    camera.setAttribute('wasd-controls-enabled', 'false');
    scene.appendChild(camera);
    /* ============================================================================================================= */
    /* criando céu */    
    var ceu = document.createElement('a-sky');
    ceu.setAttribute('src', 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1504&q=80');
    ceu.setAttribute('rotation', '0 -90 0');
    scene.appendChild(ceu);
    /* ============================================================================================================= */

    /* variáveis globais */    
    var asteroids = [];
    var qt_asteroids = 10;
    var asteroid_speed = 0.5;
    var asteroid_radius;

    
    function game_init(){
        generate_asteroids(scene, 10, 0, 10000);
    }
    
    function game_tick(){
        for(var i=0; i<qt_asteroids; i++){
            asteroids[i].object3D.lookAt(0, 0, 0);
            asteroids[i].object3D.translateZ(asteroid_speed);
        }
    }

    function generate_asteroids(scene, max, min){
        for(var i=0; i<qt_asteroids; i++){
            var sphere = document.createElement('a-sphere');
            var x = 10*i, y = 0, z = -50;

            sphere.setAttribute('position', x+' '+y+' '+z);
            sphere.setAttribute('radius', asteroid_radius);
            sphere.setAttribute('color', '#'+new THREE.Color(Math.random(), Math.random(), Math.random()).getHexString());
            scene.appendChild(sphere);
            asteroids.push(sphere);
        }
    }
};

