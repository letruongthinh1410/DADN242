import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, InputGroup,Spinner } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import avatar from "../../../assets/user-info.jpg";
import "../InfoUser/InfoUser.css";
import { FiTool } from "react-icons/fi";
import { useEffect } from "react";
import api from "../../../pages/api.jsx";

const UserProfile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get("/user/info");
        console.log("Thông tin người dùng:", response.data.data);
        setUserInfo(response.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }
  if (!userInfo) {
    return <div className="text-center mt-5 text-danger">Không thể tải thông tin người dùng.</div>;
  }

  // Tính số thiết bị (feed) và số cây trồng (group)
  const totalDevices = userInfo.groups
    .filter(group => group.key !== "default")
    .reduce((acc, group) => acc + group.feeds.length, 0);
  const totalGroups = userInfo.groups.filter(group => group.key !== "default").length;
  

  return (
    <Container fluid className="d-flex justify-content-center align-items-center">
      <Row className="w-100 d-flex justify-content-center">
        <Col md={11} className="p-4">
          <Card className="p-4 shadow-sm">
            <Row>
              <Col md={3} className="text-center">
                <img
                  src={avatar}
                  alt="User"
                  className="img-fluid"
                  style={{ borderRadius: "8px", width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Col>
              <Col md={6}>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" value={userInfo.username} readOnly />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <Form.Control type={showPassword ? "text" : "password"} value="***********" readOnly />
                      {/* <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button> */}
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={userInfo.email} readOnly />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>API Key</Form.Label>
                    <Form.Control type="text" value={userInfo.apikey || "Không có API Key"} readOnly />
                  </Form.Group>
                </Form>
              </Col>
              <Col md={3} className="d-flex flex-column justify-content-center text-center">
                <h6 className="border-bottom w-auto pb-1 d-inline">Số thiết bị hiện có:</h6>
                <span className="fw-bold text-success fs-3 d-block">{totalDevices}</span>
                <h6 className="border-bottom w-auto pb-1 d-inline mt-3">Số cây trồng hiện có:</h6>
                <span className="fw-bold text-success fs-3 d-block">{totalGroups}</span>
              </Col>
            </Row>

            <div className="text-end mt-3">
              <NavLink to="edit-profile" state={{ userInfo }} style={{ textDecoration: "none" }}>
                <Button
                  variant="success" 
                  style={{
                    borderRadius: "10px",
                    textTransform: "none",
                    padding: "0.3rem 0.5rem",
                  }}
                >
                  <FiTool style={{ marginRight: "0.6rem" }} /> Chỉnh sửa thông tin
                </Button>
              </NavLink>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
