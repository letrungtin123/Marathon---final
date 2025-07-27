import { useEffect, useState } from 'react'
import { Button, Card } from 'antd'
import { io, Socket } from 'socket.io-client'
import { Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ArcElement,
  BarElement
} from 'chart.js'
import { cn } from '@/utils/cn'
import Forecast from './forecast/forecast'
import LeadPrediction from './prediction/leadPrediction'
import BusinessStrategy from './BusinessStrategy/BusinessStrategy'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement)

const HomePage = () => {
  const [socketClient, setSocketClient] = useState<Socket | null>(null)

  useEffect(() => {
    const newSocket = io('http://localhost:8080')
    setSocketClient(newSocket)
  }, [])

  useEffect(() => {
    if (!socketClient) return
    socketClient.on('send-data', (data: string) => {
      console.log('🚀 ~ socketClient.on ~ data:', data)
    })
  }, [socketClient])

  useEffect(() => {
    if (!socketClient) return
    socketClient.on('add-product', (data: string) => {
      console.log('🚀 ~ socketClient.on ~ data:', data)
    })
  }, [socketClient])

  const data = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        label: 'Doanh thu',
        data: [12000000, 15000000, 17000000, 24000000, 19000000, 22000000],
        backgroundColor: '#14532D',
        pointBorderColor: '#14532D',
        pointBackgroundColor: '#ffffff',
        tension: 0.4
      },
      {
        label: 'Lợi nhuận',
        data: [4000000, 4000000, 5000000, 9000000, 5000000, 3000000],
        backgroundColor: '#b04e4e',
        pointBorderColor: '#14532D',
        pointBackgroundColor: '#ffffff',
        tension: 0.4
      },
      {
        label: 'Chi tiêu',
        data: [8000000, 9000000, 12000000, 15000000, 14000000, 18000000],
        backgroundColor: '#3b5998',
        pointBorderColor: '#14532D',
        pointBackgroundColor: '#ffffff',
        tension: 0.4
      }
    ]
  }

  const barData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        label: 'Doanh thu',
        data: [12000000, 15000000, 17000000, 24000000, 19000000, 22000000],
        backgroundColor: '#14532D',
        pointBorderColor: '#14532D',
        pointBackgroundColor: '#ffffff',
        tension: 0.4
      },
      {
        label: 'Lợi nhuận',
        data: [4000000, 4000000, 5000000, 9000000, 5000000, 3000000],
        backgroundColor: '#b04e4e',
        pointBorderColor: '#14532D',
        pointBackgroundColor: '#ffffff',
        tension: 0.4
      },
      {
        label: 'Chi tiêu',
        data: [8000000, 9000000, 12000000, 15000000, 14000000, 18000000],
        backgroundColor: '#3b5998',
        pointBorderColor: '#14532D',
        pointBackgroundColor: '#ffffff',
        tension: 0.4
      }
    ]
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          },
          color: '#333'
        }
      },
      title: {
        display: true,
        text: 'Biểu đồ đường',
        font: {
          size: 22,
          weight: 'bold'
        },
        color: '#14532D'
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 14
          },
          color: '#333'
        }
      },
      y: {
        ticks: {
          font: {
            size: 14
          },
          color: '#333',
          callback: (tickValue: string | number) => {
            if (typeof tickValue === 'number') {
              return tickValue.toLocaleString()
            }
            return tickValue
          }
        }
      }
    }
  }

  const cardStyle: React.CSSProperties = {
    padding: '40px',
    margin: '20px auto',
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)',
    borderRadius: '16px',
    maxWidth: '1000px',
    backgroundColor: '#ffffff',
    textAlign: 'center'
  }

  return (
    <div className='bg-gray-100 py-10 px-6'>
      <Card style={cardStyle}>
        <h2 className='text-xl font-bold text-gray-700 mb-8'>Thống kê doanh thu</h2>
        <Line data={data} options={options} />
        <h2 className='text-xl font-bold text-gray-700 mb-8'>Biểu đồ Cột</h2>
        <Bar data={barData} />
        <Button
          className={cn(
            'px-5 py-2 mt-8 rounded-lg text-lg font-semibold text-white bg-green-900 hover:bg-green-700 transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-green-800'
          )}
        >
          Tải thêm dữ liệu
        </Button>
      </Card>
      <LeadPrediction />
      <Forecast />
      <BusinessStrategy />
    </div>
  )
}

export default HomePage
