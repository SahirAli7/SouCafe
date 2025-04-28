import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AuthFormWrapper from '../components/AuthFormWrapper';
import { toast } from 'react-toastify';  // Import toast
import '../styles/global.css';
import '../styles/auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);  // Loading state
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5001/api/auth/register', form);
      toast.success('Registration successful!');  // Use toast for success message
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');  // Use toast for error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormWrapper title="Create Your Account">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          autoComplete="off"
          autoCorrect="off"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          autoComplete="off"
          autoCorrect="off"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
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
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        <div className="link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </AuthFormWrapper>
  );
}
