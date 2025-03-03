function getUsername(username: string | null) {
  if (username !== null) {
    return `User: ${username}`
  } else {
    return 'Guest'
  }
}

console.log(getUsername("Alice"))
console.log(getUsername(null))

type Direction = "up" | "Down" | "Left" | "Right"

function move(direction: Direction, distance: number) {
  console.log(`move ${distance}km ${direction}`)
}

move("Left", 20)

function validateUsername(username: string | null): boolean {
  if (typeof username == "string") {
    return username.length > 5
  }
  return false
}

console.log(validateUsername("Samwel"))
console.log(validateUsername("Sam"))
console.log(validateUsername(null))


// const appElement = document.getElementById("app") as HTMLElement

// if(!appElement) {
//  throw new Error("Not a HTMLElement")
// }

// console.log(appElement)

type APIResponse =
  | {
    data: {
      id: string
    }
  }
  | {
    error: string
  }

const handleResponse = (response: APIResponse) => {
  // How do we check if 'data' is in the response?

  if ('data' in response) {
    console.log(response.data.id)
  } else {
    throw new Error(response.error)
  }
}

const apiResponse: APIResponse = {
  data: {
    id: "werwf"
  }
}

handleResponse(apiResponse)


const somethingDangerous = () => {
  if (Math.random() > 0.5) {
    throw new Error('Something went wrong')
  }

  return 'all good'
}

try {
  console.log(somethingDangerous())
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message)
  }
}

type Value = {
  data: {
    id: string | null,
  }
}

const user: Value = {
  data: {
    id: "erte"
  }
}


const parseValue = (value: Value) => {
  if (typeof value === 'object' &&
    value !== null &&
    'data' in value &&
    typeof value.data === 'object' &&
    value.data !== null &&
    'id' in value.data &&
    typeof value.data.id === 'string') {
    return value.data.id
  }

  throw new Error('Parsing error!')
}

console.log(parseValue(user))


type Circle = {
  kind: 'circle'
  radius: number
}

type Square = {
  kind: 'square'
  sideLength: number
}

type Shape = Circle | Square


function calculateArea(shape: Shape) {

  if (shape.kind === 'circle') {
    return Math.PI * shape.radius * shape.radius
  } else if (shape.kind == 'square') {
    return shape.sideLength * shape.sideLength
  }
  else {
    throw new Error("Wrong shape")
  }
}


const myShape: Shape = {
  kind: "circle",
  radius: 8
}
console.log(calculateArea(myShape))



function calculateArea2(shape: Shape) {

  switch (shape.kind) {
    case "square":
      return shape.sideLength * shape.sideLength;
      break;
    case "circle":
      return Math.PI * shape.radius * shape.radius

  }
}

console.log(calculateArea2(myShape))


const sum = (numbers: number[]) => {
  return numbers.reduce((prev,next) => prev+next)
}

console.log(sum([1,2,4,5]))