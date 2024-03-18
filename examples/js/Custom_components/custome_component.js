AFRAME.registerComponent('distance-trigger', {
    init: function () {
      this.camera = document.getElementById('player');
      this.triggers = document.querySelectorAll('.trigger');
      this.distanceThreshold = 5; // Adjust as needed
      this.shownBoxes = new Set();
      this.triggeredBoxes = new Set();
      this.triggerEnterEvent = this.triggerEnterEvent.bind(this);
      this.triggerLeaveEvent = this.triggerLeaveEvent.bind(this);
    },
    update: function () {
      this.triggers.forEach(trigger => {
        trigger.addEventListener('triggerenter', this.triggerEnterEvent);
        trigger.addEventListener('triggerleave', this.triggerLeaveEvent);
      });
    },
    remove: function () {
      this.triggers.forEach(trigger => {
        trigger.removeEventListener('triggerenter', this.triggerEnterEvent);
        trigger.removeEventListener('triggerleave', this.triggerLeaveEvent);
      });
    },
    triggerEnterEvent: function (event) {
      const boxId = event.target.getAttribute('id');
      const textValue = event.target.querySelector('a-text').getAttribute('value');
      const message = 'Camera entered ' + boxId + '\nText value: ' + textValue;
      if (!this.shownBoxes.has(boxId)) {
        alert('Camera entered ' + message);
        this.shownBoxes.add(boxId);
        this.triggeredBoxes.add(boxId);
        //this.createAText(boxId);
       // document.getElementById("iframe-url").setAttribute('src', `http://chatapp.mc.in/cfmchat.cfm?stallid=${textValue}&bname=${textValue}sai&name=${localStorage.getItem('name')}`)
      }
      const textElement = document.getElementById(`txt${boxId}`);
      textElement.setAttribute('visible', 'true');
      textElement.setAttribute('animation', 'property: opacity; from: 1; to: 0; dur: 1000; easing: linear; loop: true');
    },
    triggerLeaveEvent: function (event) {
      const boxId = event.target.getAttribute('id');
      const textElement = document.getElementById(`txt${boxId}`);
      textElement.setAttribute('visible', 'false');
      textElement.removeAttribute('animation');
    },
    createAText: function (boxId) {
      const box = document.getElementById(boxId);
      const text = document.createElement('a-text');
      text.setAttribute('id', `txt${boxId}`)
      text.setAttribute('position', '0 0 0');
      text.setAttribute('value', 'This is ' + boxId);
      text.setAttribute('color', 'black'); // Change text color if necessary
      text.setAttribute('scale', '2 2 2'); // Adjust text size if necessary
      text.setAttribute('visible', 'false');
      box.appendChild(text);
    },
    tick: function () {
      var cameraPosition = this.camera.object3D.position;
      var self = this;

      this.triggers.forEach((trigger) => {
        // Get updated position of the trigger
        var triggerPosition = trigger.object3D.position;
        //  //console.log("trigger position")
        //   //console.log(triggerPosition)
        var distance = self.distance3D(cameraPosition, triggerPosition);
        // //console.log("the distance is ")
        // //console.log(distance)
        var boxId = trigger.getAttribute('id');

        if (distance <= self.distanceThreshold && !self.shownBoxes.has(boxId)) {
          trigger.emit('triggerenter');
        } else if (distance > self.distanceThreshold && self.triggeredBoxes.has(boxId)) {
          trigger.emit('triggerleave');
          self.triggeredBoxes.delete(boxId);
        }
      });
    },
    distance3D: function (point1, point2) {
      var dx = point1.x - point2.x;
      var dy = point1.y - point2.y;
      var dz = point1.z - point2.z;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
  });

  AFRAME.registerComponent('alert-on-approach', {
    init: function () {
      this.triggered = false;
      this.camera = document.getElementById('player');

      this.stall = this.el;
      var id = this.stall.getAttribute('id');
     

      var textValue = document.getElementById(id).querySelector('a-entity').querySelector('a-text').getAttribute('value');
   
      this.distanceThreshold = 15; // Adjust this threshold as needed

      this.checkDistance = this.checkDistance.bind(this);
      // var resetButton = document.getElementById('restartButton');
      // resetButton.addEventListener('click', () => {
      //   this.triggered = false;
      //   //console.log("triggerd")
      // });
      // resetButton.addEventListener('click', this.reset);

    },
    tick: function () {
      this.checkDistance();
    },
    checkDistance: function () {
      var cameraPosition = this.camera.getAttribute('position');
      var stallPosition = this.stall.getAttribute('position');
      var id = this.stall.getAttribute('id')
      var textValue = document.getElementById(id).querySelector('a-entity').querySelector('a-text').getAttribute('value');
      var numericPart = id.match(/\d+/)[0]
      var bname = document.getElementById(`bname${numericPart}`).getAttribute('value');
      
   //   console.log(bname)
      //  //console.log("stall position is")
      //  //console.log(stallPosition)
      //  //console.log("camera position is")
      //  //console.log(cameraPosition)
      var distance = this.camera.object3D.position.distanceTo(stallPosition);
      //  //console.log("the distance is")
      //  //console.log(distance)
      //  //console.log(distance < this.distanceThreshold)
      if (distance < this.distanceThreshold && !this.triggered) {
        // Perform your alert action here
        //    //console.log('Camera is near the stall');
        if(!isStallVisited(textValue)){
        alert(`Camera is near the stall is ${id} and value is ${textValue} and bname is${bname}`);
        document.getElementById("iframe-url").setAttribute('src', `https://stage.marketcentral.in/expo/CHAT/cfmchat.cfm?stallid=${textValue}&bname=${bname}testing&name=${localStorage.getItem('UserName')}&uid=${localStorage.getItem('GUID')}`)
        console.log(`https://stage.marketcentral.in/expo/CHAT/cfmchat.cfm?stallid=${textValue}&bname=${bname}testing&name=${localStorage.getItem('UserName')}&uid=${localStorage.getItem('GUID')}`)
        this.triggered = true;
        markStallVisited(textValue);
        }
      }
    },
  });


  AFRAME.registerComponent('pulse-on-approach', {
    init: function () {
      // Store original scale and find the camera
      this.originalScale = this.el.getAttribute('scale');
      this.camera = document.getElementById('player');
      if (!this.camera) {
        console.error('Camera not found');
        return;
      }

      // Set up animation
      this.el.setAttribute('animation__pulse', {
        property: 'scale',
        dir: 'alternate',
        dur: 1000,
        easing: 'easeInOutQuad',
        to: {
          x: this.originalScale.x * 2.1,
          y: this.originalScale.y * 2.1,
          z: this.originalScale.z * 2.1
        },
        loop: true,
        enabled: false // Initially disabled
      });
    },
    tick: function () {
      if (!this.camera) return;

      // Get positions
      const cameraPosition = this.camera.object3D.position;
      //console.log('camera is')
      //console.log(cameraPosition)
      const elPosition = this.el.object3D.position;
      //console.log("popup-p is")
      //console.log(elPosition)
      // Calculate distance
      const distance = cameraPosition.distanceTo(elPosition);
      //console.log("distance is")
      //console.log(distance)
      // Toggle animation based on distance
      if (distance < 15) {
        this.el.setAttribute('animation__pulse', 'enabled', true);
      } else {
        this.el.setAttribute('animation__pulse', 'enabled', false);
      }
    }
  });


   
AFRAME.registerComponent('cursor-listener', {
    schema: {
        targetPage: { type: 'string' },
        uno: { type: 'string' },
        type: { type: 'string' },
        pdtname: { type: 'string' }
    },
    init: function () {
        var data = this.data;
        
        this.el.addEventListener('click', function () {
            console.log('Click event triggered!');
            console.log('Target page:', data.targetPage);
            window.open(data.targetPage, '_blank');
            // console.log('Uno:', data.uno);
            // console.log('Type:', data.type);
            // console.log('pdtname:', data.pdtname);
            // if(data.pdtname!=null){
            //    trackExpo( data.uno, data.type,data.pdtname,ipAddress)
            // }
            // else{
            //     trackExpo( data.uno, data.type,"",ipAddress)
            // }
           
            // Redirect to the specified page
           
    //         (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    //   new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    //   j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    //   'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    //   })(window,document,'script','dataLayer','GTM-K7WV592');
    //   console.log("the tracking get intiated")  
        //    trackinga(data.type)
           

            // You can use data.uno and data.type as needed
        });
       
    }
});
document.addEventListener("wheel", function (e) {
  // Get camera entity
  var cam = document.getElementById("player"); // Replace "yourCameraId" with the actual ID of your camera entity

  // Define the angle increment for navigation
  var angIncrement = 0.1; // You can adjust this value based on your scene

  // Update angle with rotation
  ang = e.deltaY < 0 ? ang + angIncrement : ang - angIncrement;

  // Calculate new position in the forward or backward direction based on the scroll direction
  var f = 5; // You can adjust this value based on your scene

  // Get the current rotation of the camera in radians
  var camRotationY = (cam.getAttribute('rotation')['y']) * (Math.PI / 180);

  // Calculate the direction based on the camera's current rotation
  var direction = e.deltaY < 0 ? 1 : -1; // 1 for upward scroll (forward), -1 for downward scroll (backward)

  var forwardDirection = {
      x: -Math.sin(camRotationY) * direction,
      y: 0,
      z: -Math.cos(camRotationY) * direction
  };

  // Normalize the direction
  var norm = Math.sqrt(forwardDirection.x ** 2 + forwardDirection.z ** 2);
  forwardDirection.x /= norm;
  forwardDirection.z /= norm;

  // Update camera position in the forward or backward direction
  var newPosition = {
      x: cam.getAttribute("position")["x"] + (f / 15) * forwardDirection.x,
      y: cam.getAttribute("position")["y"],
      z: cam.getAttribute("position")["z"] + (f / 15) * forwardDirection.z
  };

  // Set the new position to the camera
  cam.setAttribute("position", newPosition);
});