var socket= io();
socket.on('connect',()=>{
    console.log("connected to server");
})
var play=1;

	    if (!Detector.webgl) Detector.addGetWebGLMessage();

	    var container, stats, clock, controls,raycaster,mouse;
	    var camera, scene, renderer, mixer,angle1,angle2,angle3;
		var replay = firebase.database().ref().child('Replay');
	    const angleRef = firebase.database().ref().child('object');
		var temperatureRef = firebase.database().ref().child('temperature');
		var pressureRef = firebase.database().ref().child('pressure');

	    init();
	    setTimeout(animate, 3000);
	    container = document.getElementById('webglcontainer');
	    var objects = [];

	    var texture;

	    function init() {

			
			
			container = document.getElementById('webglcontainer');
			 scene = new THREE.Scene();
			// var color = new THREE.Color("rgb(17, 177, 238)");
			 camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		   // scene.background = color;

		   renderer = new THREE.WebGLRenderer({ antialias: true });
		   renderer.setPixelRatio(window.devicePixelRatio);
		   renderer.setSize(970, 550);
		   renderer.setSize(window.innerWidth * 0.75,window.innerHeight * 0.75);
		   container.appendChild(renderer.domElement);

		   var sphere = new THREE.Mesh(
			new THREE.SphereGeometry(100, 40, 40),
			new THREE.MeshBasicMaterial({
			  map: THREE.ImageUtils.loadTexture('images/construction.jpg'),
			  side:THREE.DoubleSide
			})
		  );
		 scene.scale.x=-1;
		  scene.add(sphere);
	     //   clock = new THREE.Clock();

		 var floorTexture = new THREE.ImageUtils.loadTexture( 'images/scene_dn.png' );
		 floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
		 floorTexture.repeat.set( 1, 1 );
		 var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
		 var floorGeometry = new THREE.PlaneGeometry(500, 500, 100, 100);
		 var floor = new THREE.Mesh(floorGeometry, floorMaterial);
		 floor.position.y = -25;
		 floor.rotation.x = Math.PI / 2;
		 scene.add(floor);

		//  var geometry = new THREE.CubeGeometry( 250, 250, 250 );
		// 	var cubeMaterials = [
		// 		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( "https://ccsbestpractice.org.uk/wp-content/uploads/2017/05/360-3.png" ), side: THREE.DoubleSide }), //front side
		// 		// new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'images/scene_bk.png' ), side: THREE.DoubleSide }), //back side
		// 		// new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'images/scene_up.png' ), side: THREE.DoubleSide }), //up side
		// 		// new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'images/scene_dn.png' ), side: THREE.DoubleSide }), //down side
		// 		// new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'images/scene_rt.png' ), side: THREE.DoubleSide }), //right side
		// 		// new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'images/scene_lf.png' ), side: THREE.DoubleSide }) //left side
		// 	];
		 
		//  var cubeMaterial = new THREE.MeshFaceMaterial( cubeMaterials );
		//  var cube = new THREE.Mesh( geometry, cubeMaterial );
		//  scene.add( cube );
		//  camera.position.z = 3;
		 camera.position.set(10, 10, 4);
			var loader = new THREE.ObjectLoader();
			loader.load('jcb.json',function ( object ) {
					scene.add( object );
					scene.children[4].traverse(function(children){
						objects.push(children);
					});
					console.log(objects);	
				},
				function ( xhr ) {
					console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
				},
				function ( error ) {
					console.log( 'An error happened' );
				}
			);



	        var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	        scene.add(ambientLight);

	        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
	        //  directionalLight.position.set( 1, 1, - 1 );
	        scene.add(directionalLight);


	        


			controls = new THREE.OrbitControls(camera, renderer.domElement);
			controls.maxPolarAngle=Math.PI / 2.1;
			
	      //  controls.update();

			raycaster=new THREE.Raycaster();
			mouse=new THREE.Vector2();

	        document.addEventListener('mousedown', onDocumentMouseDown, false);

			window.addEventListener('resize', onWindowResize, false);
			document.addEventListener( 'touchstart', onDocumentTouchStart, false ); 
			console.log(scene);


		}
		
		
		function onWindowResize(){
			renderer.setSize( window.innerWidth * 0.75,window.innerHeight * 0.75);
		}



	    
		function onDocumentTouchStart( event ) {

			event.preventDefault();
	
			event.clientX = event.touches[0].clientX;
			event.clientY = event.touches[0].clientY;
			onDocumentMouseDown( event );
	
		}
		

	    function onDocumentMouseDown(event) {

			event.preventDefault();
			var x = event.offsetX == undefined ? event.layerX : event.offsetX;
			var y = event.offsetY == undefined ? event.layerY : event.offsetY;

			mouse.x = ( x / renderer.domElement.width ) * 2 - 1;//0.97;
			mouse.y = - ( y / renderer.domElement.height ) * 2 + 1; //1.18;

			raycaster.setFromCamera( mouse, camera );
	
			var intersects = raycaster.intersectObjects( objects );
			
			var color = (Math.random() * 0xffffff);
	
			if ( intersects.length > 0 ) {
		console.log(intersects[0].object.name);
				
				intersects[ 0 ].object.material.color.setHex( color );
				var obj=intersects[0].object.name;
				if(obj=="angle1" || obj=="angle2" || obj=="angle3" || obj=="pressure" || obj=="temperature")
				clicked(intersects[0].object);
			
				
			}

	    }

	    function clicked(object) {
			putData(object);
		$("#exampleModal").modal("show");     	
	    }

		function putData(object){
			var sensorValue = document.getElementById('sensor-value');
			var modelTitle = document.getElementById('exampleModalLabel');


			angleRef.on('value',function(snapshot){
			if(object.name=="angle1"){
				modelTitle.innerHTML="<h3>Rotation Sensor Value</h3>";
				sensorValue.innerHTML ="<b>"+Math.round(snapshot.val().angle1*(180/3.14))+"°</b>";
			}
			else if(object.name=="angle2")
			{
				modelTitle.innerHTML="<h3>Rotation Sensor Value</h3>";
				sensorValue.innerHTML ="<b>"+ Math.round(snapshot.val().angle2*(180/3.14))+"°</b>";
			}
			else if(object.name=="angle3")
			{
				modelTitle.innerHTML="<h3>Rotation Sensor Value</h3>";
				sensorValue.innerHTML = "<b>"+Math.round(snapshot.val().angle3*(180/3.14))+"°</b>";
			}	
			});
		 if(object.name=="pressure"){
				pressureRef.on('value',function(snapshot){
					modelTitle.innerHTML="<h3>Pressure Sensor Value</h3>";
					sensorValue.innerHTML = "<b>"+snapshot.val()+"Pa</b>";
				})
			}
			else if(object.name=="temperature"){
				temperatureRef.on('value',function(snapshot){
					modelTitle.innerHTML="<h3>Temperature Sensor Value</h3>";
					sensorValue.innerHTML = "<b>"+snapshot.val()+"°C</b>";
				})
			}
		}


	    function animate() {

			requestAnimationFrame(animate);
		// 	 controls.center =  new THREE.Vector3(
		// 	scene.children[3].position.x,
		// 	scene.children[3].position.y,
		// 	scene.children[3].position.z
		// );
	       // controls.target.set(scene.children[3].position.x, scene.children[3].position.y, scene.children[3].position.z);
		controls.target.set(-15,-25,-15);
		controls.update();
	        render();
	    }

	    function render() {
	        scene.children[4].scale.x = 40;
	        scene.children[4].scale.y = 40;
	        scene.children[4].scale.z = 40;
		  scene.children[4].position.y = -25;
		  scene.children[4].position.x=15;
		  scene.children[4].position.z=-15;
		//    if(play==0){
	    //     angleRef.on('value', snap => {
		// 		angle1=snap.val().angle1;
		// 		angle2=snap.val().angle2;
		// 		angle3=snap.val().angle3;
	    //          scene.children[3].children[0].children[1].rotation.x = angle1;
	    //          scene.children[3].children[0].children[1].children[0].rotation.z = angle2;
		// 		 scene.children[3].children[0].children[1].children[0].children[0].children[0].children[0].rotation.x = angle3;
				
		// 	});
		// }
		// else{
			
		// 	replay.on('value', (snap) => {
		// 		//console.log(snap.val().angle1);
		// 		angle1=snap.val().angle1;
		// 		angle2=snap.val().angle2;
		// 		angle3=snap.val().angle3;
	    //          scene.children[3].children[0].children[1].rotation.x = angle1;
	    //          scene.children[3].children[0].children[1].children[0].rotation.z = angle2;
		// 		 scene.children[3].children[0].children[1].children[0].children[0].children[0].children[0].rotation.x = angle3;
				
		// 	});
	//	}

	        renderer.render(scene, camera);
			controls.update();
	    }

	