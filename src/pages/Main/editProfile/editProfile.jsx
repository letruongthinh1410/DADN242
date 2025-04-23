import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import avatar from "../../../assets/user-info.jpg";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import api from "../../../pages/api.jsx";

const EditProfile = () => {
  const location = useLocation();
  const userInfo = location.state?.userInfo;
  const [image, setImage] = useState(avatar);
  const [Username, setUserName] = useState(userInfo?.username || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [apiKey, setApiKey] = useState(userInfo?.apikey || "");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordNewCheck, setShowPasswordNewCheck] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [totalDevices, setTotalDevices] = useState(0);
  const [totalGroups, setTotalGroups] = useState(0);
  const navigate = useNavigate();

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  // Handle save
  const handleSave = async () => {
    // So sánh thông tin hiện tại với thông tin ban đầu
    const isInfoUnchanged =
      email === userInfo.email &&
      apiKey === userInfo.apikey &&
      (!showChangePassword || (oldPassword === "" && newPassword === "" && confirmNewPassword === ""));
  
    if (isInfoUnchanged) {
      alert("Thông tin vẫn như cũ, không có gì được cập nhật.");
      return;
    }
  
    if (showChangePassword) {
      if (newPassword !== confirmNewPassword) {
        alert("Mật khẩu mới nhập lại không khớp.");
        return;
      }
    }
  
    const updatedInfo = {
      email,
      apiKey,
    };
  
    if (showChangePassword) {
      updatedInfo.oldPassword = oldPassword;
      updatedInfo.newPassword = newPassword;
    }
  
    try {
      const response = await api.put("/user/info", updatedInfo);
      if (response.status === 200) {
        alert("Thông tin đã được cập nhật thành công!");
        navigate("/infor-account");
      } else {
        alert("Đã có lỗi xảy ra khi cập nhật thông tin.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Có lỗi không xác định từ server.";
      alert(`Cập nhật thất bại: ${errorMessage}`);
    }
  };
  

  // Calculate total devices and groups
  useEffect(() => {
    if (userInfo?.groups) {
      const filteredGroups = userInfo.groups.filter(group => group.key !== "default");
      const deviceCount = filteredGroups.reduce((acc, group) => acc + group.feeds.length, 0);
      setTotalDevices(deviceCount);
      setTotalGroups(filteredGroups.length);
    }
  }, [userInfo]);

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
                {/* <Form.Group className="mt-2">
                  <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                </Form.Group> */}
              </Col>
              <Col md={6}>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" value={Username} readOnly />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </Form.Group>

                  {/* Form API Key */}
                  <Form.Group className="mb-3">
                    <Form.Label>API Key</Form.Label>
                    <Form.Control
                      type="text"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Nhập API Key mới"
                    />
                  </Form.Group>

                  {/* Chỉnh sửa mật khẩu */}
                  <Button variant="link" onClick={() => setShowChangePassword(!showChangePassword)}>
                    {showChangePassword ? "Hủy chỉnh sửa mật khẩu" : "Chỉnh sửa mật khẩu"}
                  </Button>
                  {showChangePassword && (
                    <div>
                      <Form.Group className="mb-3">
                        <Form.Label>Mật khẩu cũ</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Nhập mật khẩu cũ"
                          />
                          <InputGroup.Text onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </InputGroup.Text>
                        </InputGroup>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Mật khẩu mới</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={showPasswordNew ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Nhập mật khẩu mới"
                          />
                          <InputGroup.Text onClick={() => setShowPasswordNew(!showPasswordNew)}>
                            {showPasswordNew ? <FaEyeSlash /> : <FaEye />}
                          </InputGroup.Text>
                        </InputGroup>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={showPasswordNewCheck ? "text" : "password"}
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            placeholder="Xác nhận mật khẩu mới"
                          />
                          <InputGroup.Text onClick={() => setShowPasswordNewCheck(!showPasswordNewCheck)}>
                            {showPasswordNewCheck ? <FaEyeSlash /> : <FaEye />}
                          </InputGroup.Text>
                        </InputGroup>
                      </Form.Group>
                    </div>
                  )}
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
              <Button variant="success" className="me-2" onClick={handleSave}>
                <FiSave style={{ marginRight: "0.5rem" }} /> Lưu
              </Button>
              <NavLink to="/infor-account" style={{ textDecoration: "none" }}>
                <Button variant="secondary">
                  <FiArrowLeft style={{ marginRight: "0.5rem" }} /> Hủy
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
