import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {LOGIN} from '../../redux/actions';
import {session} from 'services';

const DUMMY_CREDENTIALS = {
  login: 'admin',
  password: 'Muamalat@2025'
};

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({login: '', password: ''});
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (event) => {
    setForm(prev => ({...prev, [field]: event.target.value}));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);

    const isValid =
      form.login.trim() === DUMMY_CREDENTIALS.login &&
      form.password === DUMMY_CREDENTIALS.password;

    if (!isValid) {
      toast.error('Неверный логин или пароль администратора.');
      setLoading(false);
      return;
    }

    const payload = {
      token: 'master-token',
      user: {
        id: 'master-admin',
        name: 'Главный администратор',
        role_id: 1,
        email: 'master@muamalat.uz'
      }
    };

    session.set('refreshToken', 'master-refresh-token');
    dispatch(LOGIN.success(payload));
    toast.success('Добро пожаловать в панель администратора!');
    navigate('/dashboard', {replace: true});
  };

  return (
    <div className="container my-5 py-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7">
          <div className="card border-0 shadow-lg custom-rounded-20">
            <div className="card-body p-4 p-md-5">
              <h2 className="mb-3 text-center text-212640 fw-bold">Admin Panel</h2>
              <p className="text-center text-75758b mb-4">
                Введите служебные учётные данные, чтобы открыть панель управления.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-141316 fw-600">Логин</label>
                  <input
                    type="text"
                    className="form-control custom-rounded-12"
                    placeholder="admin"
                    value={form.login}
                    onChange={handleChange('login')}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-141316 fw-600">Пароль</label>
                  <input
                    type="password"
                    className="form-control custom-rounded-12"
                    placeholder="Muamalat@2025"
                    value={form.password}
                    onChange={handleChange('password')}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-menu w-100 custom-rounded-12 focus-none"
                  style={{minHeight: 48}}
                  disabled={loading}
                >
                  <span className="bg-gradient-custom reverse custom-rounded-12"></span>
                  <span className="position-relative custom-zindex-2 fw-600">
                    {loading ? 'Проверяем…' : 'Войти в панель'}
                  </span>
                </button>
              </form>

              <div className="mt-4 text-center">
                <p className="mb-1 text-75758b fs-12">
                  Тестовые данные:
                </p>
                <code className="d-block">Логин: {DUMMY_CREDENTIALS.login}</code>
                <code className="d-block">Пароль: {DUMMY_CREDENTIALS.password}</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
