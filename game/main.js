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

    var lasers = [];
    var laser_speed = 10;

    var asteroids = [];
    var qt_asteroids = 100;
    var asteroid_radius = 5;
    var asteroid_speed = 0.5;
    var asteroid_min_origem = -100;
    var asteroid_max_origem = 100;
    var asteroid_min_initial_distance = 200;

    var collisions = 0;
    var ship_radius = 2;

    var y_height = 90;
    var z_height = -150;

    var running = false;

    var bitmap;
    var g;
    var score_t;

    var asteroid_obj;
    var nave;

    var score;
    var initial_msg;


    var laser_interval = 0;

    var bateu = 0;

    
    /* ============================================================================================================= */
    /* criando a cena e adicionando o componente game_engine*/    
    document.body.appendChild(scene);
    var entity = document.createElement('a-entity');
    entity.setAttribute('game_engine', '');
    scene.appendChild(entity);
    /* ============================================================================================================= */
    /* configurando a câmera */        
    camera.setAttribute('position', '0 0 0');
    camera.setAttribute('look-controls', 'pointerLockEnabled: true;'); 
    camera.setAttribute('wasd-controls', 'acceleration: 1000;'); 
    // camera.setAttribute('wasd-controls-enabled', 'false');
    scene.appendChild(camera);
    /* ============================================================================================================= */
    /* criando céu */        
    ceu.setAttribute('src', 'space.jpg');
    // ceu.setAttribute('color', '#000000');
    scene.appendChild(ceu);




    document.onkeydown = press_keyboard;
    
    function game_init(){
        
        console.log('Carregando texturas...');    
        load_materials().then(function(){
            console.log('Texturas carregadas!');    
            console.log('Criando objetos...');    
            generate_objects();
            console.log('Objetos criados!');
        });
        
        generate_target();
        console.log('Mira criada');

        update_score(true);
        console.log('Textos score criado');

        create_lives();
        console.log('Criou as vidas');

        initial_text();
        
    }
    
    function game_tick(){
        if(running){
            for(var i = 0; i < qt_asteroids; i++){
                asteroids[i].translateZ(asteroid_speed);
                asteroid_laser_collision(i);
                asteroid_ship_collision(i);
            }
            for(var i = 0; i < lasers.length; i++){
                lasers[i].object3D.translateZ(laser_speed);
            }
        }
    }

    


    var s1,s2,s3;
    function create_lives(){

    	var loader = new THREE.TextureLoader();
    	loader.setCrossOrigin('');

        var material = new THREE.MeshLambertMaterial({
		  map: loader.load('https://upload.wikimedia.org/wikipedia/commons/9/99/Star_icon_stylized.svg'),
		  transparent: true, 
    	  opacity:1,
		});

        var geometry = new THREE.PlaneGeometry(20, 20*.75, {
			size:40,
		});

		s1 = new THREE.Mesh(geometry, material);
		s1.position.set(-220,y_height,z_height);
		camera.object3D.add(s1);

		s2 = new THREE.Mesh(geometry, material);
		s2.position.set(-190,y_height,z_height);
		camera.object3D.add(s2);

		s3 = new THREE.Mesh(geometry, material);
		s3.position.set(-160,y_height,z_height);
		camera.object3D.add(s3);

    }

    function update_lives(){
    	if(bateu == 1){
    		camera.object3D.remove(s3);
    	}
    	if(bateu == 2){
    		camera.object3D.remove(s2);
    	}
    	if(bateu == 3){
    		camera.object3D.remove(s1);
    		console.log('PERDEU O GAME');
    		running = false;
    		end_game_text();
    	}
    }


    function initial_text(){

    	var loader = new THREE.FontLoader();
		loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
			var textGeo = new THREE.TextBufferGeometry( "Welcome to the Asteroids\n            Press Enter!", {
                font: font,
                size: 10,
                height: 5,
                curveSegments: 1.2,
                bevelThickness: 0.2,
                bevelSize: 0.5,
                bevelEnabled: true
			});
            textGeo.computeBoundingBox();
            var textMaterial = new THREE.MeshPhongMaterial( { color: 0xfff000, specular: 0xffffff } );
            initial_msg = new THREE.Mesh( textGeo, textMaterial );
            initial_msg.position.x = -80;
            initial_msg.position.y = 20;
            initial_msg.position.z = -100;
            initial_msg.castShadow = true;
            initial_msg.receiveShadow = true;
            scene.object3D.add( initial_msg );
		} );
    }

    function end_game_text(){

    	var loader = new THREE.FontLoader();
		loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
			var textGeo = new THREE.TextBufferGeometry( "       End game\nThanks for Playing", {
                font: font,
                size: 10,
                height: 5,
                align:'center',
                curveSegments: 1.2,
                bevelThickness: 0.2,
                bevelSize: 0.5,
                bevelEnabled: true
			});
            textGeo.computeBoundingBox();
            var textMaterial = new THREE.MeshPhongMaterial( { color: 0xfff000, specular: 0xffffff } );
            initial_msg = new THREE.Mesh( textGeo, textMaterial );
            initial_msg.position.x = -50;
            initial_msg.position.y = 20;
            initial_msg.position.z = -100;
            initial_msg.castShadow = true;
            initial_msg.receiveShadow = true;
            camera.object3D.add( initial_msg );
		} );
    }


    function update_score(isInitial = false){
    	if(!isInitial){
    		camera.object3D.remove( score );
    	}
    	

    	bitmap = document.createElement('canvas');
		g = bitmap.getContext('2d');
		bitmap.width = 120;
		bitmap.height = 100;
		g.font = 'Bold 25px Arial';

		g.fillStyle = 'red';
		g.fillText('Score '+collisions, 0, 20);
		g.strokeStyle = 'black';
		//g.strokeText('nada', 0, 20);

		// canvas contents will be used for a texture
		score_t = new THREE.Texture(bitmap) 
		score_t.needsUpdate = true;

		var material = new THREE.MeshBasicMaterial({
    		map: score_t,
    		transparent: true, 
    		opacity:1,
		});
		var geometry = new THREE.PlaneGeometry(100, 100*.75, {
			size:100,
		});
		score = new THREE.Mesh(geometry, material);
		score.position.set(160,y_height-30,z_height);
		score.geometry.dynamic = true;
		score.geometry.verticesNeedUpdate = true;


		camera.object3D.add( score );


    	/*
    	camera.object3D.remove(score);
    	var loader = new THREE.FontLoader();

		loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
			var textGeo = new THREE.TextBufferGeometry( "Score: "+collisions, {
                font: font,
                size: 10,
                height: 0.5,
                curveSegments: 0.5,
                bevelThickness: 0.2,
                bevelSize: 0.1,
                bevelEnabled: true
			} );
            textGeo.computeBoundingBox();
            var textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff } );
            score = new THREE.Mesh( textGeo, textMaterial );
            score.position.x = 140;//centerOffset;
            score.position.y = y_height;//-250 + 67;
            score.position.z = z_height;
            score.castShadow = true;
            score.receiveShadow = true;
            camera.object3D.add( score );
		} );
		*/
    }

    function asteroid_laser_collision(asteroid){
    	var distance;
    	for(var j = 0; j < lasers.length; j++){
    		distance = Math.sqrt(Math.pow(asteroids[asteroid].position.x-lasers[j].object3D.position.x,2)+Math.pow(asteroids[asteroid].position.y-lasers[j].object3D.position.y,2)
    		+Math.pow(asteroids[asteroid].position.z-lasers[j].object3D.position.z,2));
    		if(distance < asteroid_radius && asteroids[asteroid].visible == true){
    			console.log("Colidiu");
    			collisions++;
    			update_score();
                posionar_asteroid(asteroids[asteroid]);
    		}
    	}
    }

    function asteroid_ship_collision(asteroid){
    	var distance;
		distance = Math.sqrt(Math.pow(asteroids[asteroid].position.x-nave.position.x,2)+Math.pow(asteroids[asteroid].position.y-nave.position.y,2)
		+Math.pow(asteroids[asteroid].position.z-nave.position.z,2));
		if(distance < ship_radius && asteroids[asteroid].visible == true){
			console.log("Colidiu asteroid nave");
			bateu++;
			update_lives();
			posionar_asteroid(asteroids[asteroid]);
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
            mtlLoader.setPath('model/asteroid/'); 
            mtlLoader.load('asteroid.mtl', function(materials){
                materials.preload();
                var objLoader = new THREE.OBJLoader();
                objLoader.setMaterials( materials );
                objLoader.setPath('model/asteroid/' ); 
                objLoader.load('asteroid.obj', function(obj){
                    console.log('textura asteroid carregada!')
                    asteroid_obj = obj;
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
            posionar_asteroid(asteroid);
            asteroid.scale.set(asteroid_radius, asteroid_radius, asteroid_radius);
            scene.object3D.add(asteroid);
            asteroids.push(asteroid);
        } 


        /* NAVE */
        nave.position.set(0, 0, 2);
        nave.updateMatrix();
        nave.rotation.set(0,  Math.PI, 0);                
        camera.object3D.add(nave);

        var light = new THREE.PointLight( 0x4842F6, 3, 100 );
        light.position.set(0, 0, 2);
        nave.add(light);
       
    }

    function posionar_asteroid(asteroid){
        var x = Math.random() * (asteroid_max_origem - asteroid_min_origem) + asteroid_min_origem;
        var y = Math.random() * (asteroid_max_origem - asteroid_min_origem) + asteroid_min_origem;
        var z = Math.random() * (asteroid_max_origem - asteroid_min_origem) + asteroid_min_origem;
        
        asteroid.position.set(x, y, z);
        asteroid.lookAt(nave.position.x, nave.position.y, nave.position.z);
        
        asteroid.translateZ(-asteroid_min_initial_distance);
    }

    function generate_target(){
    	var sphere = document.createElement('a-sphere');
    	sphere.object3D.position.set(0, 0,0);
        sphere.object3D.lookAt(0, 0, 0);
        sphere.object3D.translateZ(-15);
        sphere.object3D.translateY(0);
        sphere.setAttribute('radius', 0.2);
        sphere.setAttribute('color', '#39ff14');
        camera.appendChild(sphere);
    }

    function disparar(){
    	//Laser Esquerda
        var laser = document.createElement('a-sphere');
        laser.setAttribute('color', '#ff0000');
        laser.setAttribute('radius', 0.2);
        
        var lookAtVector = new THREE.Vector3(0,0, -1);
        lookAtVector.applyQuaternion(camera.object3D.quaternion);

        var rotacao = new THREE.Matrix4();
        rotacao.makeRotationFromQuaternion(camera.object3D.quaternion);

        laser.object3D.quaternion.setFromRotationMatrix(rotacao);
        laser.object3D.lookAt(lookAtVector);

        laser.object3D.position.x = camera.object3D.position.x;
        laser.object3D.position.y = camera.object3D.position.y;
        laser.object3D.position.z = camera.object3D.position.z;

        laser.setAttribute('scale', '1 1 20');

        laser.object3D.translateX(-2);
        laser.object3D.translateY(-0.7);
        laser.object3D.translateZ(2.6); //a ponta do canhão é 3.6

       

        //Laser Direita 
        var laser2 = document.createElement('a-sphere');
        laser2.setAttribute('color', '#ff0000');
        laser2.setAttribute('radius', 0.2);
        
        laser2.object3D.quaternion.setFromRotationMatrix(rotacao);
        laser2.object3D.lookAt(lookAtVector);

        laser2.object3D.position.x = camera.object3D.position.x;
        laser2.object3D.position.y = camera.object3D.position.y;
        laser2.object3D.position.z = camera.object3D.position.z;

        laser2.setAttribute('scale', '1 1 20');

        laser2.object3D.translateX(2);
        laser2.object3D.translateY(-0.7);
        laser2.object3D.translateZ(2.6); //a ponta do canhão é 3.6

        scene.appendChild(laser);
        scene.appendChild(laser2);
        lasers.push(laser);
        lasers.push(laser2);

    }

    function press_keyboard(evento) {
      if (String.fromCharCode(evento.keyCode) == 'O'){
      	console.log('Apertou O!');
      }
      if (evento.keyCode == 13){//enter
      	  scene.object3D.remove(initial_msg);
          running = true;
          console.log('Jogo iniciado!')
      }
      if (evento.keyCode == 32){
          //console.log('Piu!');
          disparar();
      }
	}




};

