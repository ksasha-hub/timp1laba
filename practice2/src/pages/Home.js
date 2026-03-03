import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllThreats, deleteThreat } from '../api/threatsApi';

// Возвращает CSS-класс бейджа в зависимости от уровня угрозы
const getBadgeClass = (severity) => {
  const map = {
    'Критическая': 'badge badge-critical',
    'Высокая':     'badge badge-high',
    'Средняя':     'badge badge-medium',
    'Низкая':      'badge badge-low',
  };
  return map[severity] || 'badge badge-low';
};

const Home = () => {
  const [threats, setThreats] = useState([]);   // список угроз
  const [loading, setLoading] = useState(true); // флаг загрузки
  const [error,   setError]   = useState(null); // сообщение об ошибке
  const navigate = useNavigate();

  // GET: загрузка всех угроз при монтировании компонента
  useEffect(() => {
    getAllThreats()
      .then(response => {
        setThreats(response.data); // JSON-массив → state
        setLoading(false);
      })
      .catch(err => {
        const status = err.response?.status;
        if      (status >= 500)  setError('Ошибка сервера (5xx). Проверьте, запущен ли json-server.');
        else if (status === 404) setError('Ресурс не найден (404).');
        else                     setError(`Ошибка загрузки данных: ${err.message}`);
        setLoading(false);
      });
  }, []);

  // DELETE: удаление угрозы с подтверждением
  const handleDelete = (id, name) => {
    if (!window.confirm(`Удалить угрозу "${name}"?`)) return;
    deleteThreat(id)
      .then(() => {
        // Обновление UI без перезагрузки страницы
        setThreats(prev => prev.filter(t => t.id !== id));
      })
      .catch(err => setError(`Ошибка удаления: ${err.message}`));
  };

  // Спиннер при загрузке
  if (loading) return <div className="spinner">⏳ Загрузка данных...</div>;

  return (
    <div>
      <h1 className="page-title">🛡️ Угрозы информационной безопасности</h1>

      {/* Блок ошибки */}
      {error && <div className="error-box">❌ {error}</div>}

      {/* Пустой список */}
      {threats.length === 0 && !error ? (
        <div className="empty-state">
          <div className="icon">🔒</div>
          <p>Угроз не добавлено. Начните с первой!</p>
          <Link to="/add" className="btn btn-save">+ Добавить угрозу</Link>
        </div>
      ) : (
        // Сетка карточек угроз
        <div className="cards-grid">
          {threats.map(threat => (
            <div className="card" key={threat.id}>
              {/* Цветной бейдж уровня угрозы */}
              <span className={getBadgeClass(threat.severity)}>{threat.severity}</span>

              {/* Название — ссылка на страницу детализации */}
              <Link to={`/detail/${threat.id}`} className="card-title">
                {threat.name}
              </Link>

              {/* Мета-информация: категория и год */}
              <div className="card-meta">
                📁 {threat.category} &nbsp;|&nbsp; 📅 {threat.year}
              </div>

              {/* Краткое описание (3 строки) */}
              <p className="card-desc">{threat.description}</p>

              {/* Кнопки: редактировать и удалить */}
              <div className="card-actions">
                <button className="btn btn-edit"
                  onClick={() => navigate(`/edit/${threat.id}`)}>
                  ✏️ Изменить
                </button>
                <button className="btn btn-delete"
                  onClick={() => handleDelete(threat.id, threat.name)}>
                  🗑️ Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
