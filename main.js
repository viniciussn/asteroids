window.onload = function() {
    /* ============================================================================================================= */
    /* criando componente game_engine, responsável pela lógica do jogo*/ 
    AFRAME.registerComponent('game_engine', {
        init: game_init,
        tick: game_tick
    });
     /* ============================================================================================================= */
    /* variáveis globais */    
    var scene = document.createElement('a-scene');
    var camera = document.createElement('a-camera');
    var ceu = document.createElement('a-sky');

    var asteroids = [];
    var qt_asteroids = 100;
    var asteroid_speed = 0.5;
    var asteroid_radius = 1;
    var asteroid_min_origem = -100;
    var asteroid_max_origem = 100;
    var asteroid_min_initial_distance = 50;

    /* ============================================================================================================= */
    /* criando a cena e adicionando o componente game_engine*/    
    document.body.appendChild(scene);
    var entity = document.createElement('a-entity');
    entity.setAttribute('game_engine', '');
    scene.appendChild(entity);
    /* ============================================================================================================= */
    /* configurando a câmera */        
    camera.setAttribute('position', '0 0 0');
    camera.setAttribute('wasd-controls-enabled', 'false');
    scene.appendChild(camera);
    /* ============================================================================================================= */
    /* criando céu */        
    ceu.setAttribute('src', 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1504&q=80');
    ceu.setAttribute('rotation', '0 -90 0');
    scene.appendChild(ceu);
   

    
    function game_init(){
        generate_asteroids();
    }
    
    function game_tick(){
        for(var i=0; i<qt_asteroids; i++){
            asteroids[i].object3D.translateZ(asteroid_speed);
            console.log(asteroids[0].object3D.position);
        }
    }

    function generate_asteroids(){
        for(var i=0; i<qt_asteroids; i++){
            var sphere = document.createElement('a-sphere');
            var x = Math.random() * (asteroid_max_origem - asteroid_min_origem) + asteroid_min_origem;
            var y = Math.random() * (asteroid_max_origem - asteroid_min_origem) + asteroid_min_origem;
            var z = Math.random() * (asteroid_max_origem - asteroid_min_origem) + asteroid_min_origem;

            sphere.object3D.position.set(x, y, z);
            sphere.object3D.lookAt(0, 0, 0);
            sphere.object3D.translateZ(-asteroid_min_initial_distance);
            sphere.setAttribute('radius', asteroid_radius);
            sphere.setAttribute('color', '#'+new THREE.Color(Math.random(), Math.random(), Math.random()).getHexString());
            scene.appendChild(sphere);
            asteroids.push(sphere);
        }
    }
};

