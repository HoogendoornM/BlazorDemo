window.setp5 = () => {
  new p5(sketch, window.document.getElementById('container'));
  return true;
};

var c;
var grid;
var cols;
var rows;
const res = 6;

let sketch = function (p) {
  p.setup = function () {

    c = p.createCanvas(600, 600);

    cols = p.width / res;
    rows = p.height / res;


    grid = Make2DArray(cols, rows, p)

  }

  p.draw = function () {
    p.background(51);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {

        x = i * res;
        y = j * res;

        if (grid[i][j].life == 1) {
          p.fill(255);
          p.rect(x, y, res, res);
        }
      }
    }

    let next = Make2DArray(cols, rows, p);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let alive = grid[i][j].life;

        // count living neighbors
        let neighbors = CountLivingNeighbors(grid, i, j);

        // rule 1: back to live if dead and 3 neighbors
        if (alive == 0 && neighbors == 3) {
          next[i][j].life = 1;
        } else if (alive == 1 && (neighbors < 2 || neighbors > 3)) {
          // rule 2: die from under/overpopulation
          next[i][j].life = 0;
        } else {
          // go to next gen with same state
          next[i][j].life = alive;
        }
      }
    }
    grid = next;
  }
};

function Make2DArray(cols, rows, p) {

  let arr = new Array(cols);

  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {

      let random = p.floor(p.random(2));
      arr[i][j] = new Cell(random);
    }
  }


  return arr;
}

function CountLivingNeighbors(grid, x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {

      // Wrap around 
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row].life;
    }
  }

  // substract self 
  sum -= grid[x][y].life;
  return sum;
}

class Cell {
  constructor(life) {
    this.life = life;
  }
}
