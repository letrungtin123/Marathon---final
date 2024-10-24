import axios, { AxiosInstance } from 'axios'

class Http {
  instance: AxiosInstance

  constructor(url: string) {
    this.instance = axios.create({
      baseURL: url
    })

    this.requestInterceptor()
    // this.responseInterceptor()
  }

  requestInterceptor() {
    this.instance.interceptors.request.use(async (config) => {
      // const BearerToken = config.headers.Authorization
      // const token = BearerToken ? (BearerToken as string).split(' ')[1] : null

      // const date = new Date()

      // // Kiểm tra nếu không có token
      // if (!token) {
      //   console.log('No token provided')
      //   // window.location.href = '/auth/login'
      //   return Promise.reject('No token provided')
      // }

      // try {
      //   const decodeToken: any = jwtDecode(token)

      //   // Kiểm tra nếu token hết hạn
      //   if (decodeToken && decodeToken.exp && decodeToken.exp < date.getTime() / 1000) {
      //     console.log('Token expired')
      //     // window.location.href = '/auth/login'
      //     return Promise.reject('Token expired')
      //   }
      // } catch (error) {
      //   console.error('Error decoding token:', error)
      //   // window.location.href = '/auth/login'
      //   return Promise.reject('Invalid token')
      // }
      return config
    })
  }

  responseInterceptor() {
    this.instance.interceptors.response.use(
      async (response) => {
        return response
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }
}

export const instances = (url: string) => {
  const http = new Http(url)

  return http.instance
}
