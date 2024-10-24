import { useEffect, useState } from 'react'

import { Button } from 'antd'
import { io, Socket } from 'socket.io-client'

import { Bar, Line } from 'react-chartjs-2'
import { Card } from 'antd'
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement)
const HomePage = () => {
  const [socketClient, setSocketClient] = useState<Socket | null>(null)

  useEffect(() => {
    const newSocket = io('http://localhost:8080')
    setSocketClient(newSocket)
  }, [])

  // emit
  // useEffect(() => {
  //   if (!socketClient) return
  //   socketClient.emit('messengers')
  // }, [socketClient])

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

  // const handleAddProduct = () => {
  //   const data = {
  //     id: 1,
  //     name: 'product ' + Math.round(Math.random() + 1000)
  //   }

  //   socketClient.emit('add-product', data)
  // }

  // Dữ liệu giả doanh thu
  const data = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        label: 'Doanh thu Sản phẩm A',
        data: [1200000, 1500000, 1700000, 1400000, 1900000, 2200000],
        borderColor: '#663366',
        backgroundColor: 'rgba(102, 51, 102, 0.2)',
        pointBorderColor: '#663366',
        pointBackgroundColor: '#fff',
        tension: 0.4
      },
      {
        label: 'Doanh thu Sản phẩm B',
        data: [1000000, 1300000, 1600000, 1100000, 1800000, 2100000],
        borderColor: '#ff5733',
        backgroundColor: 'rgba(255, 87, 51, 0.2)',
        pointBorderColor: '#ff5733',
        pointBackgroundColor: '#fff',
        tension: 0.4
      },
      {
        label: 'Doanh thu Sản phẩm C',
        data: [800000, 900000, 1200000, 1500000, 1400000, 1800000],
        borderColor: '#33cc33',
        backgroundColor: 'rgba(51, 204, 51, 0.2)',
        pointBorderColor: '#33cc33',
        pointBackgroundColor: '#fff',
        tension: 0.4
      }
    ]
  }

  // Bar chart data (doanh thu hàng tháng)
  const barData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        label: 'Sản phẩm A',
        data: [1200000, 1500000, 1700000, 1400000, 1900000, 2200000],
        backgroundColor: '#663366'
      },
      {
        label: 'Sản phẩm B',
        data: [1000000, 1300000, 1600000, 1100000, 1800000, 2100000],
        backgroundColor: '#ff5733'
      },
      {
        label: 'Sản phẩm C',
        data: [800000, 900000, 1200000, 1500000, 1400000, 1800000],
        backgroundColor: '#33cc33'
      }
    ]
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'Thống kê doanh thu (Sản phẩm A, B, C)',
        font: {
          size: 20
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 14
          },
          color: '#000'
        }
      },
      y: {
        ticks: {
          font: {
            size: 14
          },
          color: '#000',
          callback: (tickValue: string | number) => {
            if (typeof tickValue === 'number') {
              return tickValue + 'VND'
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
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    maxWidth: '900px',
    backgroundColor: '#f8f9fa',
    textAlign: 'center'
  }

  const buttonStyle = {
    backgroundColor: '#663366',
    color: '#fff',
    border: 'none',
    marginTop: '20px',
    padding: '12px 28px',
    fontSize: '16px',
    borderRadius: '8px',
    transition: 'background-color 0.3s, transform 0.3s',
    cursor: 'pointer'
  }

  return (
    <div style={{ padding: '60px 20px', backgroundColor: '#e6e6e6', minHeight: '100vh' }}>
      <Card style={cardStyle}>
        <h2>Biểu đồ Doanh thu</h2>
        <Line data={data} options={options} />
        <h2>Biểu đồ Cột (Doanh thu hàng tháng)</h2>
        <Bar data={barData} />
        <Button
          style={buttonStyle}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4e1a57')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#663366')}
        >
          Tải thêm dữ liệu
        </Button>
      </Card>
    </div>
  )
}

export default HomePage
