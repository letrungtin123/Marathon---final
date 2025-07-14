import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, Spin, Row, Col, Typography, Pagination } from 'antd'

const { Title, Text } = Typography

interface Lead {
  user_id: string
  email: string
  address: string
  phone: string
  total_spent: number
  order_count: number
}

const LeadPrediction: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalLeads, setTotalLeads] = useState(0)
  const leadsPerPage = 6

  useEffect(() => {
    setLoading(true)
    const apiUrl = `http://localhost:5000/predicted-leads?page=${currentPage}&limit=${leadsPerPage}`
    console.log('API URL:', apiUrl) // Debug API URL

    axios
      .get(apiUrl)
      .then((res) => {
        console.log('API Response:', res.data) // Debug response data
        if (res.data && res.data.length) {
          setLeads(res.data)
          setTotalLeads(res.data.length) // Đếm số lượng khách hàng trong response
        } else {
          setLeads([])
          setTotalLeads(0)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Lỗi khi tải khách hàng tiềm năng:', err.response || err.message || err)
        setLeads([])
        setTotalLeads(0)
        setLoading(false)
      })
  }, [currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className='p-10 bg-gray-100 h-auto rounded-xl'>
      <Title level={2} className='text-center text-gray-800 mb-8 font-semibold'>
        Danh sách khách hàng tiềm năng{' '}
      </Title>

      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <Spin size='large' />
        </div>
      ) : leads.length === 0 ? (
        <div className='text-center text-gray-800 text-xl'>Không tìm thấy khách hàng nào.</div>
      ) : (
        <>
          <Row gutter={[16, 16]} justify='center'>
            {leads.map((lead) => (
              <Col xs={24} sm={12} md={8} lg={6} key={lead.user_id}>
                <Card
                  title={
                    <Text strong className='text-xl text-gray-800'>
                      {lead.email}
                    </Text>
                  }
                  bordered={false}
                  className='bg-white shadow-md rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg h-full'
                >
                  <div className='space-y-4'>
                    <p className='text-gray-600'>
                      📍 <Text type='secondary'>Địa chỉ:</Text> {lead.address || 'Không có'}
                    </p>
                    <p className='text-gray-600'>
                      📞 <Text type='secondary'>SĐT:</Text> {lead.phone || 'Không có'}
                    </p>
                    <p className='text-gray-600'>
                      🛍️ <Text type='secondary'>Số đơn hàng:</Text> {lead.order_count}
                    </p>
                    <p className='text-gray-600'>
                      💰 <Text type='secondary'>Tổng chi tiêu:</Text> {lead.total_spent.toLocaleString()}đ
                    </p>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination Component */}
          <div className='flex justify-center mt-8'>
            <Pagination
              current={currentPage}
              pageSize={leadsPerPage}
              total={totalLeads}
              onChange={handlePageChange}
              showSizeChanger={false}
              className='text-gray-800'
              style={{
                backgroundColor: '#fff',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default LeadPrediction
