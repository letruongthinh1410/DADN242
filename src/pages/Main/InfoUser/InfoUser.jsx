import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import avatar from "../../../assets/jack.jpg";
import "../InfoUser/InfoUser.css";
import { FiTool } from "react-icons/fi";

const UserProfile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name] = useState("Trịnh Trần Phương Tuấn");
  const [username] = useState("Tuan");
  const [email] = useState("Jack1997@gmail.com");
  const [image, setImage] = useState(avatar);

  return (
    <Container fluid className="d-flex justify-content-center align-items-center">
      <Row className="w-100 d-flex justify-content-center">
        <Col md={11} className="p-4">
          <Card className="p-4 shadow-sm">
            <Row>
              <Col md={3} className="text-center">
                <img
                  src={image}
                  alt="User"
                  className="img-fluid"
                  style={{ borderRadius: "8px", width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Col>
              <Col md={6}>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Họ và Tên</Form.Label>
                    <Form.Control type="text" value={name} readOnly />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" value={username} readOnly />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <Form.Control type={showPassword ? "text" : "password"} value="123" readOnly />
                      <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} readOnly />
                  </Form.Group>
                </Form>
              </Col>
              <Col md={3} className="d-flex flex-column justify-content-center text-center">
                <h6 className="border-bottom w-auto pb-1 d-inline">Số thiết bị hiện có:</h6>
                <span className="fw-bold text-success fs-3 d-block">2</span>
                <h6 className="border-bottom w-auto pb-1 d-inline mt-3">Số cây trồng hiện có:</h6>
                <span className="fw-bold text-success fs-3 d-block">2</span>
              </Col>
            </Row>

            <div className="text-end mt-3">
              <NavLink to="edit-profile" style={{ textDecoration: "none" }}>
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
