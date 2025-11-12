import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import ReactCodeInput from 'react-code-input';
import {LOGIN} from '../../redux/actions';
import {api, session} from 'services';
import InputPhone from '../../components/Fields/InputPhone';
import get from 'lodash.get';

const normalizeDigits = (value = '') => `${value}`.replace(/\D/g, '');

const formatPhoneForApi = (value = '') => {
  const digits = normalizeDigits(value);
  if (!digits) {
    return '';
  }
  if (digits.startsWith('998')) {
    return `+${digits}`;
  }
  return `+998${digits}`;
};

const ROLE_MAP = {
  ADMIN: 1,
  MODERATOR: 2,
  BUYER: 3,
  SELLER: 4,
  COURIER: 5
};

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [txId, setTxId] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [sendLoading, setSendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const phoneDigits = normalizeDigits(phone);
  const canSend = phoneDigits.length === 9 && !sendLoading && countdown === 0;
  const canVerify = code.length === 5 && txId && !verifyLoading;

  useEffect(() => {
    if (!countdown) {
      return undefined;
    }
    const timerId = setInterval(() => {
      setCountdown(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timerId);
  }, [countdown]);

  const handleSendCode = async () => {
    if (!canSend) {
      return;
    }
    const formatted = formatPhoneForApi(phone);
    if (!formatted) {
      toast.error('Введите корректный номер телефона');
      return;
    }
    setSendLoading(true);
    try {
      const response = await api.customerAuth.startAdmin({phoneNumber: formatted});
      const payload = get(response, 'data', response);
      const receivedTx = get(payload, 'txId') || get(payload, 'data.txId');
      if (!receivedTx) {
        throw new Error('txId not returned');
      }
      setTxId(receivedTx);
      setCountdown(60);
      setCode('');
      toast.success('Код отправлен на указанный номер');
    } catch (error) {
      const message = get(error, 'response.data.message') || 'Не удалось отправить код';
      toast.error(message);
    } finally {
      setSendLoading(false);
    }
  };

  const handleResend = async () => {
    if (!txId || countdown > 0) {
      return;
    }
    setResendLoading(true);
    try {
      await api.customerAuth.resend({txId});
      setCountdown(60);
      toast.success('Код отправлен повторно');
    } catch (error) {
      const message = get(error, 'response.data.message') || 'Ошибка при повторной отправке кода';
      toast.error(message);
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!canVerify) {
      return;
    }
    setVerifyLoading(true);
    try {
      const verifyResponse = await api.customerAuth.verifyAdmin({
        txId,
        code
      });
      const tokens = get(verifyResponse, 'data', verifyResponse);
      const accessToken = get(tokens, 'accessToken');
      const refreshToken = get(tokens, 'refreshToken');
      const userId = get(tokens, 'userId');
      const phoneNumber = get(tokens, 'phoneNumber', formatPhoneForApi(phone));

      if (!accessToken || !refreshToken) {
        throw new Error('Token pair not returned');
      }

      const infoResponse = await api.customerAuth.userInfo({accessToken});
      const info = get(infoResponse, 'data', infoResponse) || {};

      session.set('refreshToken', refreshToken);
      const role = get(info, 'role', 'ADMIN');
      const userPayload = {
        id: userId || get(info, 'id'),
        identifier: phoneNumber,
        phone_number: phoneNumber,
        first_name: get(info, 'firstName', ''),
        last_name: get(info, 'lastName', ''),
        middle_name: get(info, 'middleName', ''),
        role,
        role_id: ROLE_MAP[role] || 1,
        permissions: Array.isArray(info.permissions) ? info.permissions : []
      };

      dispatch(LOGIN.success({
        token: accessToken,
        user: userPayload
      }));

      toast.success('Добро пожаловать в админ-панель!');
      navigate('/dashboard', {replace: true});
    } catch (error) {
      const message = get(error, 'response.data.message') || 'Не удалось подтвердить код';
      toast.error(message);
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="container my-5 py-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7">
          <div className="card border-0 shadow-lg custom-rounded-20">
            <div className="card-body p-4 p-md-5">
              <h2 className="mb-3 text-center text-212640 fw-bold">Admin Panel</h2>
              <p className="text-center text-75758b mb-4">
                Авторизация по одноразовому коду. Используйте корпоративный номер телефона.
              </p>

              <div className="mb-4">
                <label className="form-label text-141316 fw-600">Номер телефона</label>
                <InputPhone
                  format="+998 ## ### ## ##"
                  className="form-control custom-rounded-12 focus-none"
                  type="tel"
                  value={phone}
                  onValueChange={event => setPhone(event.value)}
                  allowEmptyFormatting
                  isNumericString
                  disabled={!!txId}
                  style={{minHeight: 50}}
                />
              </div>

              {txId ? (
                <>
                  <div className="mb-4">
                    <label className="form-label text-141316 fw-600">Код подтверждения</label>
                    <ReactCodeInput
                      className="d-flex align-items-center justify-content-evenly mt-2 code-input-group"
                      type="number"
                      name="otp"
                      fields={5}
                      inputMode="numeric"
                      value={code}
                      onChange={setCode}
                    />
                    {countdown === 0 ? (
                      <button
                        type="button"
                        className="btn btn-special focus-none hover-orange w-100 mt-3"
                        disabled={resendLoading}
                        onClick={handleResend}
                      >
                        {resendLoading ? 'Отправляем…' : 'Отправить код повторно'}
                      </button>
                    ) : (
                      <p className="text-center text-334150 mt-3">
                        Можно запросить новый код через {countdown} сек.
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn btn-menu w-100 custom-rounded-12 focus-none"
                    style={{minHeight: 48}}
                    onClick={handleVerify}
                    disabled={!canVerify}
                  >
                    <span className="bg-gradient-custom reverse custom-rounded-12"></span>
                    <span className="position-relative custom-zindex-2 fw-600">
                      {verifyLoading ? 'Проверяем…' : 'Войти'}
                    </span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn-menu w-100 custom-rounded-12 focus-none"
                  style={{minHeight: 48}}
                  onClick={handleSendCode}
                  disabled={!canSend}
                >
                  <span className="bg-gradient-custom reverse custom-rounded-12"></span>
                  <span className="position-relative custom-zindex-2 fw-600">
                    {sendLoading ? 'Отправляем…' : 'Получить код'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
