var socket= io();
socket.on('connect',()=>{
    console.log("connected to server");
})
var play=1;

	    if (!Detector.webgl) Detector.addGetWebGLMessage();

	    var container, stats, clock, controls,raycaster,mouse;
	    var camera, scene, renderer, mixer;
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
	        camera = new THREE.PerspectiveCamera(25, 400 / 200, 1, 10000);
	        camera.position.set(15, 10, -15);
	        var color = new THREE.Color("rgb(17, 177, 238)");
	        scene = new THREE.Scene();
	        scene.background = color;

	        clock = new THREE.Clock();

	        texture = new THREE.TextureLoader().load("red.png");

			var loader = new THREE.ObjectLoader();
			loader.load('jcb.json',function ( object ) {
					scene.add( object );
					scene.children[3].traverse(function(children){
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


	        var gridHelper = new THREE.GridHelper(10, 20);
	        scene.add(gridHelper);


	        var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	        scene.add(ambientLight);

	        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
	        //  directionalLight.position.set( 1, 1, - 1 );
	        scene.add(directionalLight);


	        renderer = new THREE.WebGLRenderer({ antialias: true });
	        renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(970, 550);
			renderer.setSize(window.innerWidth * 0.75,window.innerHeight * 0.75);
	        container.appendChild(renderer.domElement);


	        controls = new THREE.OrbitControls(camera, renderer.domElement);
	        controls.target.set(0, 2, 0);
	        controls.update();

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

	        render();
	    }

	    function render() {

	     //   console.log(scene);

	        scene.children[3].scale.x = 10;
	        scene.children[3].scale.y = 10;
	        scene.children[3].scale.z = 10;
		   // scene.children[3].rotation.y = 1.5;
		   if(play==0){
	        angleRef.on('value', snap => {
				angle1=snap.val().angle1;
				angle2=snap.val().angle2;
				angle3=snap.val().angle3;
	             scene.children[3].children[0].children[1].rotation.x = angle1;
	             scene.children[3].children[0].children[1].children[0].rotation.z = angle2;
				 scene.children[3].children[0].children[1].children[0].children[0].children[0].children[0].rotation.x = angle3;
				
			});
		}
		else{
			replay.on('value', snap => {
				angle1=snap.val().angle1;
				angle2=snap.val().angle2;
				angle3=snap.val().angle3;
	             scene.children[3].children[0].children[1].rotation.x = angle1;
	             scene.children[3].children[0].children[1].children[0].rotation.z = angle2;
				 scene.children[3].children[0].children[1].children[0].children[0].children[0].children[0].rotation.x = angle3;
				
			});
		}

	        renderer.render(scene, camera);

	    }

	