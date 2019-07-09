const uuidv4 = require("uuid/v4")

type NonMethodKeys<T> = ({ [P in keyof T]: T[P] extends Function ? never : P } & { [x: string]: never })[keyof T]
type RemoveMethods<T> = Pick<T, NonMethodKeys<T>>

export class QuestPath {
  uuid: string
  path: Quest[]

  constructor(path: Quest[], uuid?: string) {
    if (uuid) {
      this.uuid = uuid
    } else {
      this.uuid = uuidv4()
    }
    this.path = path
  }

  toObject(): Object {
    return JSON.parse(JSON.stringify(this))
  }

  unshift(quest: Quest) {
    this.path.unshift(quest)
  }

  empty() {
    this.path.splice(0, this.path.length)
  }
}

export class Quest {
  uuid?: string = uuidv4()
  id: number = -1
  name: string = ""
  iconUrl?: string

  startLocation?: string

  previousQuests?: Quest[]
  nextQuests?: Quest[]

  completed?: boolean = false

  constructor(data: RemoveMethods<Quest>) {
    Object.assign(this, data)
  }

  toObject(): Object {
    return JSON.parse(JSON.stringify(this))
  }
}
