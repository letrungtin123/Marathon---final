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
      navigate(`?status=active&_page=${paginate._page}&_limit=${paginate._limit}`)
      setQuery(`?status=active&_page=${paginate._page}&_limit=${paginate._limit}`)
      break
    }
    case '3': {
      navigate(`?status=inactive&_page=${paginate._page}&_limit=${paginate._limit}`)
      setQuery(`?status=inactive&_page=${paginate._page}&_limit=${paginate._limit}`)
      break
    }
  }
}
