import { NavigateFunction } from 'react-router-dom'

interface Props {
  keyTab: string
  paginate: {
    _page: number
    _limit: number
  }
  setQuery: (query: string) => void
  navigate: NavigateFunction
}

export const handleChangeTab = ({ keyTab, paginate, setQuery, navigate }: Props) => {
  // set key for url
  switch (keyTab) {
    case '1': {
      navigate(`?_page=${paginate._page}&_limit=${paginate._limit}`)
      setQuery(`?_page=${paginate._page}&_limit=${paginate._limit}`)
      break
    }
    case '2': {
      navigate(`?status=active&deleted=false&_page=${paginate._page}&_limit=${paginate._limit}`)
      setQuery(`?status=active&deleted=false&_page=${paginate._page}&_limit=${paginate._limit}`)
      break
    }
    case '3': {
      navigate(`?status=inactive&deleted=false&_page=${paginate._page}&_limit=${paginate._limit}`)
      setQuery(`?status=inactive&deleted=false&_page=${paginate._page}&_limit=${paginate._limit}`)
      break
    }
    case '4': {
      navigate(`?deleted=true&_page=${paginate._page}&_limit=${paginate._limit}`)
      setQuery(`?deleted=true&_page=${paginate._page}&_limit=${paginate._limit}`)
      break
    }
  }
}
