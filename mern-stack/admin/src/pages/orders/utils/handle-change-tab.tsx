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
  //set key to url
  switch (keyTab) {
    case '1': {
      navigate(`?_page=${paginate._page}&_limit=${paginate._limit}`)
      setQuery(`?_page=${paginate._page}&_limit=${paginate._limit}`)
      break
    }
    case '2': {
      navigate(`?status=pending&_page=${paginate._page}&_limit=${paginate._limit}`)
      setQuery(`?status=pending&_page=${paginate._page}&_limit=${paginate._limit}`)
      break
    }
    case '3': {
      navigate(`?status=confirmed&_page=${paginate._page}&_limit=${paginate._limit}`)
      setQuery(`?status=confirmed&_page=${paginate._page}&_limit=${paginate._limit}`)
      break
    }
    case '4': {
      navigate(`?status=delivery&_page=${paginate._page}&_limit=${paginate._limit}`)
      setQuery(`?status=delivery&_page=${paginate._page}&_limit=${paginate._limit}`)
      break
    }
    case '5': {
      navigate(`?status=completed&_page=${paginate._page}&_limit=${paginate._limit}`)
      setQuery(`?status=completed&_page=${paginate._page}&_limit=${paginate._limit}`)
      break
    }
    case '6': {
      navigate(`?status=cancelled&_page=${paginate._page}&_limit=${paginate._limit}`)
      setQuery(`?status=cancelled&_page=${paginate._page}&_limit=${paginate._limit}`)
      break
    }
  }
}
