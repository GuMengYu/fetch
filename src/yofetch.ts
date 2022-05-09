interface FetchConfig {
    baseURL?: string
    headers?: Record<string, any>
    credentials?: 'include' | 'omit' | 'same-origin'
    method?: 'get' | 'post'
    params?: Record<string, any>
  }
type method = 'get'|'post'|'put'|'patch'|'delete'|'options'|'head'|'GET'|'POST'|'PUT'|'PATCH'|'DELETE'|'OPTIONS'|'HEAD'
type responseType = 'text'|'json'|'stream'|'blob'|'arrayBuffer'|'formData'|'stream'
type RequestHeaders = {
    [name: string]: string | Headers
}
type Response<T> = {
    status: number;
    statusText: string;
    data: T;
    headers: Headers;
    redirect: boolean;
    url: string;
    type: ResponseType;
    body: ReadableStream<Uint8Array> | null;
    bodyUsed: boolean;
}

type BodylessMethod = <T=any>(url: string, config?: Options) => Promise<Response<T>>
type BodyMethod = <T=any>(url: string, body?: any, config?: Options) => Promise<Response<T>>

interface Options {
    baseURL?: string,
    url?: string,
    method?: method
    headers?: RequestHeaders
    body?: FormData | string | object
    responseType?: responseType
    params? : Record<string,any> | URLSearchParams
    paramsSerializer?: (params: Options['params']) => string
    withCredentials?: 'include' | 'omit' | 'same-origin'
    auth?: string,
    xsrfCookieName?: string
    xsrfHeaderName?: string
    validateStatus?: (status: number) => boolean
    transformRequest?: Array<(body: any, headers?: RequestHeaders) => any>
    fetch?: typeof window.fetch
    data?: any
}
  
  class Fetch {
    baseURL: string | undefined
    defaults?: Options
  
    constructor(options: Options = {}) {
        this.defaults = options
    }
    get: BodylessMethod = function(this: Fetch, url, config) {
        return this.myFetch(url, config, 'get')
    }
    post: BodyMethod = function(this: Fetch, url, data, config) {
        return this.myFetch(url, config, 'post', data)
    }
    create(config: FetchConfig) {
        return new Fetch(config)
    }
    myFetch<T>(urlOrConfig: string | Options, config?: Options, _method?: method, data?: any): Promise<Response<T>>{
        let url = ''
        if (typeof urlOrConfig !== 'string') {
            config = urlOrConfig
        } else {
            url = urlOrConfig
        }
        let response: Response<any>
        const options = this.mergeOptions(this.defaults, config)
        const fetchFunc = options.fetch || fetch 
        return fetchFunc(url, {
            method: (_method || options.method || 'get').toUpperCase(),
			body: data,
			headers: this.mergeOptions(options.headers, {}),
			credentials: options.withCredentials ? 'include' : undefined
        }).then(res => {
            for (const i in res) {
				if (typeof res[i] !== 'function'){
                    response[i] = res[i];
                }
			}

			if (options.responseType == 'stream') {
				response.data = res.body;
				return response;
			}
            return res[options.responseType || 'text']()
            .then((data) => {
                response.data = data;
                // its okay if this fails: response.data will be the unparsed value:
                response.data = JSON.parse(data);
            })
            .catch(Object)
            .then(() => {
                const ok = options.validateStatus ? options.validateStatus(res.status) : res.ok;
                return ok ? response : Promise.reject(response);
            });
        })
    }
    private mergeOptions<T, U>(opts: T, overrides: U): {} & (T|U) {
        return {
            ...opts,
            ...overrides
        }
    }
  }
  
  function create() {
    // create default yofetch instance
    return new Fetch()
  }

  export default create()
  