(function() {
  // CLASSES

  function Circle(options) {
    this.x              = options.x;
    this.y              = options.y;
    this.velocityX      = options.velocityX;
    this.velocityY      = options.velocityY;
    this.radius         = options.radius;
    this.colour         = options.colour;
    this.originalColour = options.colour;
    this.minRad         = options.minRad;
    this.maxRad         = options.maxRad;
    this.mouseRange     = 50;
    this.clickRange     = 250;
    this.distanceArray  = [0,0];
  }

  Circle.prototype.update = function() {
    // Reverse direction if Circle hits left or right canvas edge
    if(this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.velocityX = -this.velocityX;
    }

    // Reverse direction if Circle hits top or bottom canvas edge
    if(this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.velocityY = -this.velocityY;
    }

    // Update Circle coordinates
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Record distance from mouse
    this.distanceArray.shift();
    this.distanceArray.push(this.distanceFromMouse());

    // React to mouse position
    if(this._inMouseRange(this.mouseRange) && this._canGrow()) {
      this.radius += 1;
      this.colour = '#badc58';
    } else if(this._canShrink()) {
      this.radius -= 1;
      if(this.radius === this.minRad) {
        this.colour = this.originalColour;
      }
    }

    // Reverse direction of circles within range on mousedown
    if(mouse.down && this._inMouseRange(this.clickRange) && this._isApproachingMouse()) {
      this.velocityX = -this.velocityX;
      this.velocityY = -this.velocityY;
    }

    this._draw();    
  };

  Circle.prototype._draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.colour;
    ctx.fill();    
  };

  Circle.prototype._horizontallyInRange = function(range) {
    return mouse.x - this.x < range && mouse.x - this.x > -range;
  };

  Circle.prototype._verticallyInRange = function(range) {
    return mouse.y - this.y < range && mouse.y - this.y > -range;
  };

  Circle.prototype._inMouseRange = function(range) {
    return this._horizontallyInRange(range) && this._verticallyInRange(range);
  };

  Circle.prototype._canGrow = function() {
    const canGrow = this.radius < this.maxRad;
    const horizontallyInBounds = canvas.width - this.radius > this.x && this.x - this.radius > 0;
    const verticallyInBounds = canvas.height - this.radius > this.y && this.y - this.radius > 0;
    return canGrow && horizontallyInBounds && verticallyInBounds;    
  };

  Circle.prototype._canShrink = function() {
    return this.radius > this.minRad;
  };

  Circle.prototype.distanceFromMouse = function() {
    const xDist = this.x - mouse.x;
    const yDist = this.y - mouse.y;
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
  };

  Circle.prototype._isApproachingMouse = function() {
    return this.distanceArray[1] < this.distanceArray[0];
  };

  // UTILITY FUNCTIONS

  function intInRange(min, max) {
    return Math.random() * (max - min + 1) + min;
  }

  function pointWithinBounds(widthOrHeight, radius) {
    return Math.random() * (widthOrHeight - radius * 2) + radius;
  }

  function animate() {
    requestAnimationFrame(animate);
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Redraw background
    ctx.fillStyle = '#130f40';
    ctx.fillRect(0, 0, 800, 800);
    // Redraw circles
    for(let i = 0; i < circles.length; i++) {
      circles[i].update();
    }    
  }

  // IMPLEMENTATION

  const colours = [
    '#821E64',
    '#DC2B50',
    '#F9564F',
    '#F3C677'
  ];
  const mouse = {
    x: undefined,
    y: undefined,
    down: false
  }
  const circles = [];
  const canvas = document.getElementById('canvas');
  const ctx    = canvas.getContext('2d');
  // Set correct context size
  canvas.height = canvas.scrollHeight;
  canvas.width  = canvas.scrollWidth;

  window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
  });

  window.addEventListener('mousedown', function(event) {
    mouse.down = true;
  });

  window.addEventListener('mouseup', function(event) {
    mouse.down = false;
  });


  // Populate Circles array
  for(let i = 0; i < 1600; i++) {
    const options = {
      velocityX: intInRange(-2, 2),
      velocityY: intInRange(-2, 2),
      radius: 10,
      minRad: 10,
      maxRad: 50,
      x: pointWithinBounds(canvas.width, 10),
      y: pointWithinBounds(canvas.height, 10),
      colour: colours[Math.floor(Math.random() * colours.length)]
    }

    circles.push(new Circle(options));
  }

  animate();
})();
