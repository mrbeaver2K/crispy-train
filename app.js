const DEBUG = false

class Maze {
    constructor(width, height) {
        this.width = width * 2 - 1
        this.height = height * 2 - 1
        this.init()
    }
    init() {
        this.grid = []
        for (let i = 0; i < this.height; i++) {
            let row = []
            for (let j = 0; j < this.width; j++) {
                row.push(((i + 1) % 2 + (j + 1) % 2 == 2)?new Cell(j, i):((i + 1) % 2 + (j + 1) % 2 == 1)?new Wall(j, i):new Tile(j, i, "off"))
            }
            this.grid.push(row)
        }
        console.log(this.grid)
    }
    get(x, y) {
        return this.grid[y][x]
    }
    iterate() {
        let setWall = walls[Math.random() * walls.length | 0]
        walls.splice(walls.indexOf(setWall), 1)
        if(setWall.x % 2 == 1) {
            let set1 = this.get(setWall.x - 1, setWall.y).set
            let set2 = this.get(setWall.x + 1, setWall.y).set
            if(set1 != set2) {
                if(set1 < set2) {
                    this.setParse(set2, set1)
                }
                else {
                    this.setParse(set1, set2)
                }
                setWall.color = "on"
                return true
            }
        }
        else {
            let set1 = this.get(setWall.x, setWall.y - 1).set
            let set2 = this.get(setWall.x, setWall.y + 1).set
            if(set1 != set2) {
                if(set1 < set2) {
                    this.setParse(set2, set1)
                }
                else {
                    this.setParse(set1, set2)
                }
                setWall.color = "on"
                return true
            }
        }
        return false
    }
    setParse(oldSet, newSet) {
        for(let i = 0; i < this.height; i++) {
            for(let j = 0; j < this.width; j++) {
                if(this.get(j, i).set == oldSet) {
                    this.get(j, i).set = newSet
                }
            }
        }
    }
}

class Tile {
    constructor(x, y, color) {
        this.x = x
        this.y = y
        this.color = color
    }
    toString() {
        return `Tile(${[this.x, this.y, this.color]})`
    }
}

let walls = []

class Wall extends Tile {
    constructor(x, y) {
        super(x, y, DEBUG?"indicator":"off")
        walls.push(this)
    }
    toString() {
        return `Wall(${[this.x, this.y, this.color]})`
    }
}

cellSetIncrementer = 0

class Cell extends Tile {
    constructor(x, y) {
        super(x, y, "on")
        this.set = cellSetIncrementer
        cellSetIncrementer++
    }
    toString() {
        return `Cell(${[this.x, this.y, this.set]})`
    }
}

const PIXEL_SQUARE_SIZE = 16;
function renderMaze(maze, pixelSquareSize) {
    let html = "<table cellspacing=\"0\" cellpadding=\"0\"><tr>" + "<td class=off></td>".repeat(maze.width + 2) + "</tr>"
    for (let i = 0; i < maze.height; i++) {
        html += "<tr><td class=off></td>"
        for (let j = 0; j < maze.width; j++) {
            html += `<td class="${maze.get(j, i).color}" xtitle="${maze.get(j, i).toString()}"></td>`
        }
        html += "<td class=off></td></tr>"
    }
    html += "<tr>" + "<td class=off></td>".repeat(maze.width + 2) + "</tr></table><br class=\"mazebr\">"
    return html
}

function generateMaze(width, height) {
    let maze = new Maze(width, height)
    while(walls.length > 0) {
        maze.iterate()
    }
    return maze
}

function handleClick() {
    if($("#empty").is(":checked")) {
        handleClear()
    }
    $(".warning").remove()
    const width = $("#width").val()
    const height = $("#height").val()
    if(Math.floor(screen.width / 20) >= width) {
        $("body").append(renderMaze(generateMaze(width, height), 10))
    }
    else {
        $("body").append("<p class=\"warning\">Maze too wide!</p>") 
    }
}

function handleClear() {
    $("table").remove()
    $(".mazebr").remove()
}

$(()=>{
    $("button.60").click(handleClick)
    $("button.Erase").click(handleClear)
    console.log($("button"))
})