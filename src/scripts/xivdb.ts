const fetch = require('fetch-retry')

export class XIVDB {
  static baseUrl: string = "https://xivapi.com"

  static search(query: string, indexes?: string[]) {
    const queryUrl = new URL(`${XIVDB.baseUrl}/search`)
    queryUrl.searchParams.append("string", query)

    if (indexes) {
      queryUrl.searchParams.append("indexes", indexes.join(","))
    }

    return fetch(queryUrl.toString()).catch((err: any) => {
      console.error(err)
    }).then((response: any) => (response as any).json())
  }

  static getQuest(id: number) {
    const queryUrl = new URL(`${XIVDB.baseUrl}/quest/${id}`)
    return fetch(queryUrl.toString(), {
      retries: 3,
      retryDelay: 1000,
      retryOn: function(attempt: any, error: any, response: any) {
        // retry on any network error, or 4xx or 5xx status codes
        if (error !== null || response.status >= 400) {
          console.log(`retrying, attempt number ${attempt + 1}`)
          return true
        }
        return false
      },
    }).catch((err: any) => {
      console.error(err)
    }).then((response: any) => (response as any).json())
  }
}
