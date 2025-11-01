import React, {useState} from 'react';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {LOGIN} from '../../redux/actions';
import {toast} from 'react-toastify';

const API_ROOT = 'http://localhost:8080';

const Login = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ phoneNumber: '', password: '' });
  const [loading, setLoading] = useState(false);

  const extractToken = (res) => {
    let t = res?.data?.accessToken || res?.data?.token || res?.data?.access_token;
    if (!t) {
      const auth = res?.headers?.authorization || res?.headers?.Authorization;
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        t = auth.split(' ')[1];
      }
    }
    return t;
  }

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = { ...form, confirmPassword: form.password };
      const tokenRes = await axios.post(`${API_ROOT}/auth/token`, body);
      const token = extractToken(tokenRes);
      if (!token) {
        throw new Error('Token not provided');
      }
      const infoRes = await axios.get(`${API_ROOT}/auth/userinfo`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const user = infoRes?.data || {};
      const payload = {
        token,
        user: {
          ...user,
          role_id: 3, // map BUYER to client role
        }
      };
      dispatch(LOGIN.success(payload));
      toast.success('Вход выполнен');
    } catch (err) {
      toast.error('Ошибка входа');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container my-4">
      <h3 className="mb-3">Вход</h3>
      <form onSubmit={submit} style={{maxWidth: 420}}>
        <div className="mb-3">
          <label className="form-label">Номер телефона</label>
          <input type="tel" className="form-control" value={form.phoneNumber}
                 onChange={e => setForm(prev => ({...prev, phoneNumber: e.target.value}))}
                 placeholder="99890XXXXXXX" required/>
        </div>
        <div className="mb-3">
          <label className="form-label">Пароль</label>
          <input type="password" className="form-control" value={form.password}
                 onChange={e => setForm(prev => ({...prev, password: e.target.value}))}
                 required/>
        </div>
        <button className="btn btn-quick-buy" type="submit" disabled={loading}>
          {loading ? 'Входим…' : 'Войти'}
        </button>
      </form>
    </div>
  );
};

export default Login;

