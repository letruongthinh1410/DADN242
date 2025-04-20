import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, InputGroup } from "react-bootstrap";
import { Save, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import avatar from "../../../assets/jack.jpg";

const EditProfile = () => {
  const [name, setName] = useState("Trịnh Trần Phương Tuấn");
  const [image, setImage] = useState(avatar);
  const [username] = useState("Tuan");
  const [showPassword, setShowPassword] = useState(false);
  const [email] = useState("Jack1997@gmail.com");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleSave = () => {
    // Giả lập lưu dữ liệu vào backend, sau đó quay về trang hồ sơ
    navigate("/profile");
  };

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
                <Form.Group className="mt-2">
                  <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Họ và Tên</Form.Label>
                    <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
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
                        {showPassword ? <EyeOff /> : <Eye />}
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
              <Button variant="success" className="me-2" onClick={handleSave}>
                <Save style={{ marginRight: "0.5rem" }} /> Lưu
              </Button>
              <NavLink to="/infor-account" style={{ textDecoration: "none" }}>
                <Button variant="secondary">
                  <ArrowLeft style={{ marginRight: "0.5rem" }} /> Hủy
                </Button>
              </NavLink>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProfile;
