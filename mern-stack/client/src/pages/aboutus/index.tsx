import { Card, Col, Image, Layout, Row, Typography } from "antd";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import bgflower1 from "@/assets/bgflower1.png"
import bgflower2 from "@/assets/bgflower2.png"
import bgflower3 from "@/assets/bgflower3.png"
import React from "react";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const cardStyle: React.CSSProperties = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const imageContainerStyle: React.CSSProperties = {
  height: 200,
  overflow: "hidden",
};

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const AboutUs: React.FC = () => {
  return (
    <Layout>
      <Content style={{ padding: "0 50px", backgroundColor: "#f0f2f5" }}>
        <div
          style={{
            backgroundColor: "#fff",
            padding: 24,
            minHeight: 380,
            marginTop: 24,
          }}
        >
          <section className="flex items-center justify-center w-full h-header mb-3">
            <div className="text-xl font-extrabold font-nunito-sans ">
              <span> 🌸 Chào mừng bạn đã đến với </span>
              <span className="text-green-900">Dash</span>
              <span className="">Stack. </span>
              <span>Nơi kết nối bạn với những sắc hoa tuyệt đẹp! 🌸</span>
            </div>
          </section>
          <Paragraph>
            Tại Dash Stack, chúng tôi hiểu rằng mỗi bông hoa đều mang trong mình
            một thông điệp đặc biệt. Từ những bó hoa tươi thắm cho ngày lễ, hoa
            chúc mừng đầy màu sắc cho sự kiện, đến hoa trang trí lãng mạn dành
            tặng người thân yêu, chúng tôi luôn sẵn sàng giúp bạn truyền tải
            tình cảm một cách trọn vẹn. Chúng tôi tự hào về sự đa dạng của mình
            với các bộ sưu tập hoa theo chủ đề: hoa lễ, hoa sự kiện, hoa tình
            yêu và hoa chia buồn – tất cả đều được chuẩn bị bởi những người thợ
            tài hoa, giàu kinh nghiệm.
          </Paragraph>

          <section className="flex w-full h-header mb-3">
            <div className="text-xl font-extrabold font-nunito-sans ">
              <span> 🌷 Cam kết của chúng tôi: </span>
            </div>
          </section>
          <div>
            <p>Hoa tươi, chất lượng cao – nhập từ những nguồn uy tín.</p>
            <p>Dịch vụ tận tâm – giao hoa nhanh chóng và đúng hẹn.</p>
            <p>
              Tư vấn nhiệt tình – để bạn luôn chọn được những bó hoa hoàn hảo
              nhất.
            </p>
          </div>
          <Row gutter={16} style={{ marginTop: 32 }}>
            <Col span={8}>
              <Card
                hoverable
                style={cardStyle}
                cover={
                  <div style={imageContainerStyle}>
                    <Image
                      alt="Our History"
                      src={bgflower1}
                      style={imageStyle}
                    />
                  </div>
                }
              >
                <Title level={4}>Về chúng tôi</Title>
                <Paragraph>
                  DashStack ra đời từ niềm đam mê và tình yêu dành cho hoa. Bắt
                  đầu từ một cửa hàng nhỏ vào năm 2003, chúng tôi đã không ngừng
                  nỗ lực phát triển để trở thành một trong những thương hiệu hoa
                  uy tín.
                </Paragraph>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                hoverable
                style={cardStyle}
                cover={
                  <div style={imageContainerStyle}>
                    <Image
                      alt="Our Services"
                      src={bgflower3}
                      style={imageStyle}
                    />
                  </div>
                }
              >
                <Title level={4}>Dịch vụ</Title>
                <Paragraph>
                  Tại DashStack, chúng tôi cam kết mang đến những dịch
                  vụ hoàn hảo, đáp ứng mọi nhu cầu của khách hàng: Giao
                  hoa tận nơi: Dịch vụ giao hoa nhanh chóng, tận tâm, đảm bảo
                  hoa đến tay người nhận trong tình trạng tươi mới nhất.
                </Paragraph>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                hoverable
                style={cardStyle}
                cover={
                  <div style={imageContainerStyle}>
                    <Image
                      alt="Contact Us"
                      src={bgflower2}
                      style={imageStyle}
                    />
                  </div>
                }
              >
                <Title level={4}>Liên hệ</Title>
                <Paragraph>
                  <Text>
                    <PhoneOutlined /> +123 456 789
                  </Text>
                  <br />
                  <Text>
                    <MailOutlined /> contact@DashStack.com
                  </Text>
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default AboutUs;
