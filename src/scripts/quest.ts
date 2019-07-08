type NonMethodKeys<T> = ({ [P in keyof T]: T[P] extends Function ? never : P } & { [x: string]: never })[keyof T]
type RemoveMethods<T> = Pick<T, NonMethodKeys<T>>

export class Quest {
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
