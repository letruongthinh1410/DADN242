import './HomePage.css';
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Container, Row, Col, Card , Modal, Spinner } from "react-bootstrap"; 
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import image from "../../../assets/image5.png";
import api from "../../../pages/api.jsx";
// import axios from "axios";
import { jwtDecode } from "jwt-decode";

function TChu() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);
  const [showRPasswordRegister, setRShowPasswordRegister] = useState(false);
  const [showPasswordRs, setShowPasswordRs] = useState(false);
  const [showRPasswordRs, setRShowPasswordRs] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [password, setPassword] = useState("");
  const [PasswordRegister, setPasswordRegister] = useState("");
  const [RPasswordRegister, setRPasswordRegister] = useState("");
  const [modalState, setModalState] = useState({  
    login: false,
    register: false,
    resetPwEmail: false,
    resetPw: false,
  });
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerApiKey, setRegisterApiKey] = useState("");
  // usestate của rspw
  const [rsEmail,setRsEmail] = useState("");
  const [rsToken,setRsToken] = useState("");
  const [PasswordRs, setPasswordRs] = useState("");
  const [RPasswordRs, setRPasswordRs] = useState("");

  // let token = localStorage.getItem("accessToken");
  let [token, setToken] = useState(() => localStorage.getItem("accessToken") || "");
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false);
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now(); // true nếu đã hết hạn
    } catch (e) {
      return true;
    }
  };

  const handleModal = (modal, value) => {
    setModalState((prev) => ({ ...prev, [modal]: value }));
  };
  const clearTokens = () => {
    localStorage.removeItem("accessToken");
  };
  
  const handleLogin = async () => {
    const token = localStorage.getItem("accessToken");
    if (token && isTokenExpired(token)) {
      localStorage.removeItem("accessToken");
      return;
    }
    console.log(loginEmail , password);
   
    console.log("Token đã được xóa khỏi localStorage.");
    if (loginEmail.trim() === "" || password.trim() === "") {
      alert("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }
    setLoading(true);
    try {
      clearTokens();
      const response = await api.post("/auth/login", {
        email: loginEmail,
        password: password,
      }, {
        headers: { "Content-Type": "application/json" } // Đảm bảo header JSON
      });
      console.log("Login Success:", response.data);
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      setToken(response.data.data.accessToken);

      console.log("Access Token:", localStorage.getItem("accessToken"));
      console.log("Refresh Token:", localStorage.getItem("refreshToken"));
      
      navigate("/plants");
    } catch (error) {
      alert(error.response?.data?.message ||"Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.");
      console.error("Lỗi đăng nhập:", error.response?.data || error.message);
    }
    finally {
      setLoading(false); // Set loading to false after the operation ends
    }
  };

  const handleRegister = async () => {
    console.log(registerEmail , registerUsername , registerApiKey , PasswordRegister , RPasswordRegister);
      if (!registerEmail || !registerUsername || !registerApiKey || !PasswordRegister || !RPasswordRegister) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
      }
      
      if (PasswordRegister !== RPasswordRegister) {
        alert("Mật khẩu nhập lại không khớp!");
        return;
      }
      setLoading(true); // Set loading to true when starting registration
      try {
        await api.post("/auth/register", {
          email: registerEmail,
          username: registerUsername,
          apikey: registerApiKey,
          password: PasswordRegister,
        }, {
          headers: { "Content-Type": "application/json" } // Đảm bảo header JSON
        });

        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        // navigate("/"); // Chuyển hướng về trang chủ sau khi đăng ký thành công
        handleModal("register", false); // Đóng modal đăng ký
        handleModal("login", true); // Mở modal đăng nhập
        
      } catch (error) {
        alert("Đăng ký thất bại! Vui lòng kiểm tra lại thông tin.");
        console.error("Lỗi đăng ký:", error.response?.data || error.message);
      }
      finally {
        setLoading(false); // Set loading to false after the operation ends
      }
    
  };

  const handleForgotPassword = async () => {
    setLoading(true); // Set loading to true when starting password reset request
    try {
      await api.post("/user/forgot-password", {
        email: rsEmail,
      });
      alert("Đã gửi token về email của bạn");  // Thành công
      handleModal("resetPw",true) ; 
      handleModal("resetPwEmail",false);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);  
      } else {
        alert("Gửi email thất bại!"); 
      }
    }
    finally {
      setLoading(false); // Set loading to false after the operation ends
    }
  };

  const handleResetPassword = async () => {
    setLoading(true); // Set loading to true when starting reset password
    try {
      if(PasswordRs !== RPasswordRs){
        alert("Mật khẩu nhập lại không khớp!");
        return;
      }
      const res = await api.post("/user/reset-password", {
        token: rsToken,
        newPassword: PasswordRs,
      });
      alert(res.data.message || "Đặt lại mật khẩu thành công!");
      handleModal("resetPw", false);
      setRsToken("");
      setPasswordRs("");
      setRPasswordRs("");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message); // báo lỗi từ BE
      } else {
        alert("Đặt lại mật khẩu thất bại!");
      }
    }
    finally {
      setLoading(false); // Set loading to false after the operation ends
    }
  };

  return (
    <div className="home-page">

      <div className="header-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="text-white">
              <div className="lg-ns" style={{display:"flex" , marginBottom : "10px"}} >
                <div className="logo">
                  <img src={logo} alt="Logo" className="logo-img" />
                </div>
                <div  style={{display:"flex" , alignItems:"flex-end" , justifyContent:"center" , marginLeft:"10px" , textAlign:"left" }}> 
                <h4 className="text" style={{color: "#00FF00" , fontWeight:"bold"}} >
                  Trường Đại học Bách Khoa - ĐHQG TPHCM
                  Giám sát cây trồng
                </h4>
                
                </div>
              </div>
              <p>Phần mềm giám sát cây trồng là một dự án được thực hiện dưới sự quản lý của Trường Đại học Bách Khoa - ĐHQG TPHCM. Phần mềm giúp nông dân có thể theo dõi các thông số như ánh sáng, nhiệt độ, độ ẩm đất của môi trường của cây trong nhà kính, đặt lịch theo dõi, từ đó dựa trên các thông số mà điều chỉnh cho phù hợp.</p>
              <div style={{display:"flex", gap: "10px" , marginBottom:"15px"  }}>
                <button className="button-home"  onClick={()=>{handleModal("register",true)}} ><span className="BtText">Đăng ký</span></button>
                <button className="button-home dn"  onClick={()=>handleModal("login",true)} style={{backgroundColor:"#0F6918"}} ><span className="BtText">Đăng nhập</span></button>
              </div>
              
            </Col>
            <Col lg={6}>
              <img src={image} alt="Greenhouse" className="header-img" />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Dịch vụ Section */}
      <Container className="text-center my-5">
        <h2 style={{fontWeight:"bold"}}>Dịch vụ</h2>
        <Row className="mt-4">
          <Col md={4}>
            <Card className="service-card">
              <Card.Body>
                <i className="bi bi-tree-fill service-icon text-success"></i>
                <Card.Title>Cây trồng</Card.Title>
                <Card.Text>Quản lý danh sách cây trồng</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="service-card">
              <Card.Body>
                <i className="bi bi-bar-chart-line-fill service-icon text-success"></i>
                <Card.Title>Thống kê</Card.Title>
                <Card.Text>Theo dõi thông số nhiệt độ, độ ẩm, ánh sáng</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="service-card">
              <Card.Body>
                <i className="bi bi-calendar-check-fill service-icon text-success"></i>
                <Card.Title>Lên lịch</Card.Title>
                <Card.Text>Đặt lịch nhắc nhở cho cây trồng</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <div className="footer bg-success text-white text-center py-3" >
        <p style={{marginBottom:"0"}}>
          © 2025 Giám sát cây trồng - Trường Đại học Bách Khoa - ĐHQG TPHCM
        </p>
      </div>

      {/* ---------------------Login------------------------ */}

      <Modal show ={modalState.login}  onHide={() => handleModal("login", false)} size='lg' centered dialogClassName="custom-modal" >

        <Modal.Header closeButton style={{ borderBottom: "none" , paddingBottom:"0"}} >
        </Modal.Header>

        <Modal.Body className = "custom-modal-body"  >
 
        <div className = "login container">
          <div className = "login row">
            <div className = "login-logo col">
              <div className="logo">
                <img src={logo} alt="Logo" />
              </div>
                <h4>Giám sát cây trồng</h4>
              
            </div>
            
            <div className = "login-content col-lg-6 col-12"  >
              {loading ? (
                <Container className="d-flex flex-column justify-content-center align-items-center" style={{ height: "35vh" }}>
                <Spinner animation="border" variant="success" />
                <div style={{ marginTop: "15px", fontSize: "1rem", color: "#487853" }}>
                  Đang đăng nhập...
                </div>
                </Container>
                ) : (
                <>
              <h3>Đăng nhập</h3>
              <div className="mb-3">
                <label>Email:</label>
                <input 
                type="email" 
                className="form-control" 
                placeholder="Nhập email" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
                />
              </div>
              <div className="mb-3">
                <label>Mật khẩu:</label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleLogin();
                      }
                    }}
                  />
                  {password.length > 0 && ( // Chỉ hiển thị khi có ký tự
                    <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                       {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  )}
                </div>
                <div className ="forgot-password" style = {{fontWeight: "bold" }}>
                <p style={{marginBottom: "10px"}} onClick={() => { handleModal("login", false); handleModal("resetPwEmail", true); }}>Quên mật khẩu?</p>
                </div>
              </div>
              
              <div className="button-group-login"> 
                <button className="button-33"  onClick={() => {handleModal("login", false); handleModal("register", true); }} >Tạo tài khoản</button>
                <button className="button-33" onClick={handleLogin} >Đăng nhập</button>
              </div>
              </>
              )}
              
            </div>

          </div>
        </div>
        </Modal.Body>
        
      </Modal>

      {/* ---------------------Register------------------------ */}
      <Modal show ={modalState.register} onHide={()=>{handleModal("register",false)}} size='lg' centered dialogClassName="custom-modal" >

        <Modal.Header closeButton style={{ borderBottom: "none" , paddingBottom:"0"}} >
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <div className="register container">
            <div className="register row">
              <div className="register-logo col">
                <div className="logo">
                  <img src={logo} alt="Logo"/>
                </div>
                
                <h4>Giám sát cây trồng</h4>
              </div>

              <div className="register-content col-lg-6 col-12">
                {loading ? (
                <Container className="d-flex flex-column justify-content-center align-items-center" style={{ height: "40vh" }}>
                <Spinner animation="border" variant="success" />
                <div style={{ marginTop: "15px", fontSize: "1rem", color: "#487853" }}>
                  Đang đăng kí...
                </div>
                </Container>
                ) : (
                <>
                <h3>Đăng ký</h3>
                <div className="mb-3">
                  <label>Email:</label>
                  <input 
                  type="email"
                  className="form-control" 
                  placeholder="Nhập email"  
                  value={registerEmail}  
                  onChange={(e) => setRegisterEmail(e.target.value)} 
                  onKeyDown={(e) => {
                   if (e.key === "Enter") {
                     handleRegister();
                   }
                  }} />
                </div>
                <div className="mb-3">
                  <label>Adafruit username:</label>
                  <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Username" 
                  value={registerUsername} 
                  onChange={(e) => setRegisterUsername(e.target.value)} 
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRegister();
                    }
                  }}/>
                </div>
                <div className="mb-3">
                  <label>Adafruit API key:</label>
                  <input type="text" className="form-control" placeholder="Nhập API key" value={registerApiKey}  onChange={(e) => setRegisterApiKey(e.target.value)} onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRegister();
                    }
                  }}/>
                </div>
                <div className="mb-3">
                  <label>Mật khẩu:</label>
                  <div className="password-input">
                    <input 
                    type={showPasswordRegister ? "text" : "password"} 
                    className="form-control" 
                    placeholder="Nhập mật khẩu" 
                    value={PasswordRegister}
                    onChange={(e) => setPasswordRegister(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRegister();
                      }
                    }}
                    />
                    { PasswordRegister.length > 0 &&
                      <span className="toggle-password-r1" onClick={() => setShowPasswordRegister(!showPasswordRegister)}>
                      {showPasswordRegister ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    }
                    
                  </div>
                </div>
                <div className="mb-3r">
                  <label>Nhập lại mật khẩu:</label>
                  <div className="password-input">
                    <input 
                    type={showRPasswordRegister ? "text" : "password"}
                    className="form-control" 
                    placeholder="Nhập lại mật khẩu" 
                    value={RPasswordRegister}
                    onChange={(e) => setRPasswordRegister(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRegister();
                      }
                    }}
                     />
                    {  RPasswordRegister.length > 0 &&
                      <span className="toggle-password-r2" onClick={() => setRShowPasswordRegister(!showRPasswordRegister)}>
                      {showRPasswordRegister ? <FaEyeSlash /> : <FaEye />}
                    </span>}
                  </div>
                </div>
                <div className="button-group-login"> 
                <button className="button-33 Regis"  onClick={handleRegister}>Đăng ký</button>
                </div>
                <p style={{ marginTop: "10px" }}>
                  Đã có tài khoản? <span onClick={() => { handleModal("login",true); handleModal("register",false); }} style={{ fontWeight: "bold", cursor: "pointer" }}>Đăng nhập</span>
                </p>
                </>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>  
      
      {/* ---------------------Reset Password/email------------------------ */}
      <Modal show ={modalState.resetPwEmail} onHide={()=>{handleModal("resetPwEmail",false)}} size='lg' centered dialogClassName="custom-modal">
        <Modal.Header closeButton style={{ borderBottom: "none" , paddingBottom:"0"}} >
        </Modal.Header>
        <Modal.Body className = "custom-modal-body"  >
        <div className = "login container">
          <div className = "login row">
            <div className = "login-logo col">
              <div className="logo">
                <img src={logo} alt="Logo" />
              </div>
              
              <h4>Giám sát cây trồng</h4>
            </div>

            <div className = "login-content col-lg-6 col-12"  >
            {loading ? (
                  <Container className="d-flex flex-column justify-content-center align-items-center" style={{ height: "20vh" }}>
                  <Spinner animation="border" variant="success" />
                  <div style={{ marginTop: "15px", fontSize: "1rem", color: "#487853" }}>
                    Đang check và gửi token về email...
                  </div>
                </Container>
              ) : (
                <>
              <h3>Đặt lại mật khẩu</h3>
              <div className="mb-3" >
                <label>Email:</label>
                <input 
                type="email" 
                className="form-control" 
                placeholder="Nhập email" 
                value={rsEmail} 
                onChange={(e)=>setRsEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleForgotPassword();
                  }}}
                />
              </div>
              <div className="button-group-forget"> 
                <button className="button-33"  onClick={() => {handleForgotPassword();}} >Xác nhận</button>
              </div>
                </>
              )}
            </div>
             
          </div>
        </div>
        </Modal.Body>
      </Modal>   

          {/* ---------------------Reset Password/email------------------------ */}
      <Modal show ={modalState.resetPw} onHide={()=>handleModal("resetPw",false)} size='lg' centered dialogClassName="custom-modal">
        <Modal.Header closeButton style={{ borderBottom: "none" , paddingBottom:"0"}} >
        </Modal.Header>
        <Modal.Body className = "custom-modal-body"  >
        <div className = "login container">
          <div className = "login row">
            <div className = "login-logo col">
              <div className="logo">
                <img src={logo} alt="Logo" />
              </div>
              
              <h4>Giám sát cây trồng</h4>
            </div>
            <div className = "register-content col-lg-6 col-12"  >
            {loading ? (
                  <Container className="d-flex flex-column justify-content-center align-items-center" style={{ height: "40vh" }}>
                  <Spinner animation="border" variant="success" />
                  <div style={{ marginTop: "15px", fontSize: "1rem", color: "#487853" }}>
                    Đang lưu mật khẩu mới...
                  </div>
                </Container>
              ) : (
              <>
              <h3>Đặt lại mật khẩu</h3>
              <div className="mb-3">
                <label>TOKEN:</label>
                <input 
                type="token" 
                className="form-control" 
                placeholder="Nhập token đã gửi vào email" 
                value={rsToken} onChange={(e) => setRsToken(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleResetPassword();
                  }
                }}
                />
              </div>
                <div className="mb-3">
                  <label>Mật khẩu mới:</label>
                  <div className="password-input">
                    <input 
                    type={showPasswordRs ? "text" : "password"} 
                    className="form-control" 
                    placeholder="Nhập mật khẩu" 
                    value={PasswordRs}
                    onChange={(e) => setPasswordRs(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleResetPassword();
                      }
                    }}
                    />
                    { PasswordRs.length > 0 &&
                      <span className="toggle-password-rs1" onClick={() => setShowPasswordRs(!showPasswordRs)}>
                      {showPasswordRs ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    }
                    
                  </div>
                </div>
                <div className="mb-3">
                  <label>Nhập lại mật khẩu mới:</label>
                  <div className="password-input">
                    <input 
                    type={showRPasswordRs ? "text" : "password"}
                    className="form-control" 
                    placeholder="Nhập lại mật khẩu" 
                    value={RPasswordRs}
                    onChange={(e) => setRPasswordRs(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleResetPassword();
                      }
                    }}
                     />
                    {  RPasswordRs.length > 0 &&
                      <span className="toggle-password-rs2" onClick={() => setRShowPasswordRs(!showRPasswordRs)}>
                      {showRPasswordRs ? <FaEyeSlash /> : <FaEye />}
                    </span>}
                  </div>
                </div>
                
              <div className="button-group-forget"> 
                <button className="button-33" onClick={handleResetPassword} >Xác nhận</button>
              </div>
              </>
              )}
            </div>
          </div>
        </div>
        </Modal.Body>
      </Modal> 

    </div>
  );
}

export default TChu;
