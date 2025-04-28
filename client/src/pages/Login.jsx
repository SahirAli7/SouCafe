import { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AuthFormWrapper from '../components/AuthFormWrapper';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/authContext';
import '../styles/global.css';
import '../styles/auth.css';

export default function Login() {
  const { login } = useContext(AuthContext); 
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    toast.dismiss();
    
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', form);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role); 

      login(res.data.token, res.data.user.role);

      toast.success('Login successful!');

      if (res.data.user.role === 'admin') {
        navigate('/admin');  
      } else {
        navigate('/'); 
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormWrapper title="Login to Your Account">
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="email"
          name="email"
          autoComplete="off"
          autoCorrect="off" 
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="form-input"
          required
        />
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          autoCorrect="off" 
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="form-input"
          required
        />
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="link">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </form>
    </AuthFormWrapper>
  );
}
