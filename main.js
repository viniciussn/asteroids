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
    var asteroid_speed = 0.1;
    var colors = ["#FF0000","#0000FF","#FFFF00","#00FF00"];

    
    function game_init(){
        generate_asteroids(scene, 10, 0, 10000);
    }
    
    function game_tick(){
        for(var i=0; i<qt_asteroids; i++){
            //asteroids[i].getAttribute("position")['x']-=asteroid_speed;
            //asteroids[i].getAttribute("position")['y']-=asteroid_speed;
            //asteroids[i].getAttribute("position")['z']-=asteroid_speed;
            // asteroids[i].getAttribute("position")['z']-=asteroid_speed;
        }
    }

    function generate_asteroids(scene, max, min){
        for(var i=0; i<qt_asteroids; i++){
            var sphere = document.createElement('a-sphere');
            // sphere.setAttribute('position', ''+Math.random() * (max - min) + min+' '+Math.random() * (max - min) + min+' '+Math.random() * (max - min) + min);
            sphere.setAttribute('position',  Math.floor(Math.random()*90) +' 0 -10');
            sphere.setAttribute('radius', '1.25');
            sphere.setAttribute('color', colors[Math.floor(Math.random()*colors.length)]);
            asteroids.push(sphere);
            scene.appendChild(sphere);
        }
    }
};

