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
    var lasers = [];
    var asteroids_visible = [];
    var qt_asteroids = 100;
    var asteroid_speed = 0.3;
    var laser_speed = 1;
    var asteroid_min_origem = -100;
    var asteroid_max_origem = 100;
    var asteroid_min_initial_distance = 50;

    var running = false;

    var asteroid_obj;
    var laser_obj;
    var nave;

    /* ============================================================================================================= */
    /* criando a cena e adicionando o componente game_engine*/    
    document.body.appendChild(scene);
    var entity = document.createElement('a-entity');
    entity.setAttribute('game_engine', '');
    scene.appendChild(entity);
    /* ============================================================================================================= */
    /* configurando a câmera */        
    camera.setAttribute('position', '0 0 0');
    // camera.setAttribute('wasd-controls-enabled', 'false');
    scene.appendChild(camera);
    /* ============================================================================================================= */
    /* criando céu */        
    ceu.setAttribute('color', '#000000');
    scene.appendChild(ceu);

    document.onkeydown = press_keyboard;
    
    function game_init(){
        
        generate_stars();
        console.log('Carregando texturas...');    
        load_materials().then(function(){
            console.log('Texturas carregadas!');    

            console.log('Criando objetos...');    
            generate_objects();
            console.log('Objetos criados!');
            
            running = true;
            console.log('Jogo iniciado!')
        });

    }
    
    function game_tick(){
        if(running){
            for(var i=0; i<qt_asteroids; i++){
                asteroids[i].translateZ(asteroid_speed);
            }
            for(var i=0; i< lasers.length; i++){
                lasers[i].translateZ(laser_speed);
            }
        }
    }

    function load_materials(){
        var promises = [];

        promises.push(new Promise(function(resolve){
            var mtlLoader = new THREE.MTLLoader();
            mtlLoader.setPath('model/nave/'); 
            mtlLoader.load('HumanSpaceFighter.mtl', function(materials){
                materials.preload();
                var objLoader = new THREE.OBJLoader();
                objLoader.setMaterials( materials );
                objLoader.setPath('model/nave/' ); 
                objLoader.load('HumanSpaceFighter.obj', function(obj){
                    console.log('textura nave caregada!')
                    nave = obj;
                    resolve(true);
                });
            });
        }));

        promises.push(new Promise(function(resolve){
            var mtlLoader = new THREE.MTLLoader();
            mtlLoader.setPath('model/'); 
            mtlLoader.load('asteroid.mtl', function(materials){
                materials.preload();
                var objLoader = new THREE.OBJLoader();
                objLoader.setMaterials( materials );
                objLoader.setPath('model/' ); 
                objLoader.load('asteroid.obj', function(obj){
                    console.log('textura asteroid carregada!')
                    asteroid_obj = obj;
                    resolve(true);
                });
            });
        }));
        
        promises.push(new Promise(function(resolve){
            var mtlLoader = new THREE.MTLLoader();
            mtlLoader.setPath('model/laser/'); 
            mtlLoader.load('laser.mtl', function(materials){
                materials.preload();
                var objLoader = new THREE.OBJLoader();
                objLoader.setMaterials( materials );
                objLoader.setPath('model/laser/' ); 
                objLoader.load('laser.obj', function(obj){
                    console.log('textura laser carregada!')
                    laser_obj = obj;
                    resolve(true);
                });
            });
        }));

        return new Promise(function(resolve){
            Promise.all(promises).then(function(){
                resolve(true);
            });
        });
    }

    function generate_objects(){
        /* ASTEROIDS */
        for(var i=0; i<qt_asteroids; i++){
            var asteroid = asteroid_obj.clone();
            var x = Math.random() * (asteroid_max_origem - asteroid_min_origem) + asteroid_min_origem;
            var y = Math.random() * (asteroid_max_origem - asteroid_min_origem) + asteroid_min_origem;
            var z = Math.random() * (asteroid_max_origem - asteroid_min_origem) + asteroid_min_origem;

            asteroid.position.set(x, y, z);
            asteroid.lookAt(0, 0, 0);
            asteroid.translateZ(-asteroid_min_initial_distance);
            scene.object3D.add(asteroid);
            asteroids.push(asteroid);
            asteroids_visible.push(1);
        } 

        /* NAVE */
        nave.position.set(0, 0, 2);
        nave.updateMatrix();
        nave.rotation.set(0,  Math.PI, 0);                
        camera.object3D.add(nave);
       
    }

    function generate_stars(){
        for(var i=0; i<5000; i++){
            var sphere = document.createElement('a-sphere');
            var x = Math.random() * (asteroid_max_origem - asteroid_min_origem) + asteroid_min_origem;
            var y = Math.random() * (asteroid_max_origem - asteroid_min_origem) + asteroid_min_origem;
            var z = Math.random() * (asteroid_max_origem - asteroid_min_origem) + asteroid_min_origem;

            sphere.object3D.position.set(x, y, z);
            sphere.object3D.lookAt(0, 0, 0);
            sphere.object3D.translateZ(-100);
            sphere.setAttribute('radius', 0.1);
            sphere.setAttribute('color', '#ffffff');
            scene.appendChild(sphere);
            
        }
    }

    function disparar(){
        var laser = laser_obj.clone() ;
        
        laser.position.set(0, 0, -10);
        laser.updateMatrix();
        laser.rotation.set(Math.PI/2, 0, 0); 
        
        var lookAtVector = new THREE.Vector3(0,0, -1);
        lookAtVector.applyQuaternion(camera.object3D.quaternion);
        laser.lookAt(lookAtVector);

        var light = new THREE.PointLight( 0xff0000, 1, 100 );
        laser.add(light);

        scene.object3D.add(laser);
        lasers.push(laser);


    }

    function press_keyboard(evento) {
      if (String.fromCharCode(evento.keyCode) == 'O'){
      	console.log('Apertou O!');
      }
      if (evento.keyCode == 32){
          console.log('Apertou Espaço');
          disparar();
      }
	}

};

