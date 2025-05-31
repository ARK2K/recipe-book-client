import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await signup(name, email, password);
      toast.success('Account created');
      navigate('/');
    } catch (err) {
      toast.error('Signup failed');
    }
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" className="form-control mb-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input type="email" className="form-control mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" className="form-control mb-2" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="btn btn-primary w-100">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;