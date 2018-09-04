(function() {
  // CLASSES
  function Rect(x, y, w, h, colour, ctx) {
    this.x      = x;
    this.y      = y;
    this.width  = w;
    this.height = h;
    this.colour = colour;
    this.ctx    = ctx;

    this.draw = () => {
      this.ctx.fillStyle = this.colour;
      this.ctx.fillRect(this.x, this.y, this.height, this.width);
    };
  };

  function CanvasState(canvas) {
    this.shapes    = [];
    this.dragOn    = false;
    this.offsetX   = null;
    this.offsetY   = null;
    this.target    = null;
    this.canvas    = canvas;
    this.ctx       = canvas.getContext('2d');


    this.init = () => {
      // Set correct width and height
      this.canvas.width  = canvas.scrollWidth;
      this.canvas.height = canvas.scrollHeight;
      // Set event listeners      
      this._addMouseDown();
      this._addMouseUp();
      this._addMouseMove();
      // Draw initial shapes
      this._drawShapes();
    }

    ///////

    this._drawShapes = () => {
      for(let i = 0; i < this.shapes.length; i++) {
        this.shapes[i].draw();
      }
    }

    this._shapeUnderPointer = (x,y) => {
      // When we search the shapes array we want to reverse it first
      // so we start from the shape that was drawn last. This
      // prevents us returning a shape that is positioned beneath
      // the shape under our pointer.
      this.shapes.reverse();
      for(let i = 0; i < this.shapes.length; i++) {
        const shape = this.shapes[i];
        const xMin  = shape.x;
        const xMax  = shape.x + shape.width;
        const yMin  = shape.y;
        const yMax  = shape.y + shape.height;

        if(x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
          if (!this.offsetX && !this.offsetY) {
            this.offsetX = x - shape.x;
            this.offsetY = y - shape.y;
          }
          this.shapes.reverse();
          return shape;
        }
      }
      this.shapes.reverse();
    }

    this._addMouseDown = () => {
      document.addEventListener('mousedown', (e) => {
        this.dragOn = true;
      });
    }

    this._addMouseUp = () => {
      document.addEventListener('mouseup', (e) => {
        this.dragOn      = false;
        this.dragStart    = null;
        this.offsetX      = null;
        this.offsetY      = null;
        this.target       = null;
      });
    }

    this._clearCanvas = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this._addMouseMove = () => {
      document.addEventListener('mousemove', (e) => {
        if(this.dragOn) {
          if(this.target) {
            this.shapes.splice(this.shapes.indexOf(this.target), 1)
            this.target.x = e.x - this.offsetX;
            this.target.y = e.y - this.offsetY;
            this._clearCanvas();
            this._drawShapes();
            this.target.draw();
            this.shapes.push(this.target);
          } else {
            this.target = this._shapeUnderPointer(e.x, e.y);
          }
        }
      });
    }
  }

  // IMPLEMENTATION

  const canvas  = document.getElementById('canvas');
  const canvasState = new CanvasState(canvas);
  const ctx = canvas.getContext('2d');

  canvasState.shapes.push(new Rect(100, 100, 100, 100, 'blue', ctx));
  canvasState.shapes.push(new Rect(600, 600, 100, 100, 'red', ctx));
  canvasState.shapes.push(new Rect(300, 600, 100, 100, 'yellow', ctx));
  canvasState.init();
})();
