import { instances } from '@/configs/instances'

const api = instances(`${import.meta.env.VITE_API_URL}`)
export default api
