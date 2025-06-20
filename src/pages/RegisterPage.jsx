import { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

console.log('toast:', toast);
console.log('toast.success:', typeof toast.success);
console.log('toast.error:', typeof toast.error);

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.log('About to call toast.error with: Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    try {
      const data = await authService.register(name, email, password);

      if (data && data.token) {
        setAuth(data);
        toast.success('Registration successful!');
        navigate('/');
      } else {
        throw new Error('Invalid registration response');
      }
    } catch (error) {
      console.error('❌ Registration error caught:', error);

      let message = error.message || 'Registration failed';

      if (error.response?.data?.message) {
        if (typeof error.response.data.message === 'string') {
          message = error.response.data.message;
        } else {
          console.warn('⚠️ Non-string error.response.data.message:', error.response.data.message);
          message = 'Unexpected error occurred';
        }
      }

      console.log('✅ Calling toast.error with:', message);
      toast.error(message);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <Col md={6}>
        <h1>Sign Up</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="my-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="my-3" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="my-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="my-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary">
            Register
          </Button>
        </Form>

        <Row className="py-3">
          <Col>
            Have an Account? <Link to="/login">Login</Link>
          </Col>
        </Row>
      </Col>
    </div>
  );
}

export default RegisterPage;