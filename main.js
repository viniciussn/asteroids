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
    /* variáveis globais */    
    var asteroids = [];
    var qt_asteroids = 10;
    var asteroid_speed = 0.1;

    
    function game_init(){
        generate_asteroids(scene, 10, 0, 10000);
    }
    
    function game_tick(){
        for(var i=0; i<qt_asteroids; i++){
            //asteroids[i].getAttribute("position")['x']-=asteroid_speed;
            //asteroids[i].getAttribute("position")['y']-=asteroid_speed;
            asteroids[i].getAttribute("position")['z']-=asteroid_speed;
        }
    }

    function generate_asteroids(scene, max, min){
        for(var i=0; i<qt_asteroids; i++){
            var sphere = document.createElement('a-sphere');
            // sphere.setAttribute('position', ''+Math.random() * (max - min) + min+' '+Math.random() * (max - min) + min+' '+Math.random() * (max - min) + min);
            sphere.setAttribute('position', '0 0 -10');
            sphere.setAttribute('radius', '1.25');
            sphere.setAttribute('color', '#FF0000');
            asteroids.push(sphere);
            scene.appendChild(sphere);
        }
    }
};

