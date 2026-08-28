import { useEffect, useState } from 'react';

import './App.css';

import {
  getPromotionSummary,
  getPromotions,
  updatePromotionStatus,
  deletePromotion,
} from './services/api';

import PromotionTable from './components/PromotionTable';
import PromotionForm from './components/PromotionForm';

function App() {
  const [summary, setSummary] = useState({
    programadas: 0,
    activas: 0,
    finalizadas: 0,
    vigentesHoy: 0,
  });

  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      setError('');

      const [summaryData, promotionsData] = await Promise.all([
        getPromotionSummary(),
        getPromotions(),
      ]);

      setSummary(summaryData);
      setPromotions(promotionsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleStatusChange(id, status) {
    try {
      setError('');

      await updatePromotionStatus(id, status);

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      '¿Estás seguro de que deseas eliminar esta promoción?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setError('');

      await deletePromotion(id);

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Gestión de Promociones</h1>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm(true)}
        >
          + Nueva promoción
        </button>
      </header>

      <main className="main-content">
        <section className="summary">
          <div className="summary-card">
            <span>Programadas</span>
            <strong>{summary.programadas}</strong>
          </div>

          <div className="summary-card">
            <span>Activas</span>
            <strong>{summary.activas}</strong>
          </div>

          <div className="summary-card">
            <span>Finalizadas</span>
            <strong>{summary.finalizadas}</strong>
          </div>

          <div className="summary-card">
            <span>Vigentes hoy</span>
            <strong>{summary.vigentesHoy}</strong>
          </div>
        </section>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <section className="promotions-section">
          <div className="section-header">
            <div>
              <h2>Promociones</h2>
              <p>
                Consulta y administra las promociones registradas.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              <p>Cargando promociones...</p>
            </div>
          ) : promotions.length === 0 ? (
            <div className="empty-state">
              <h3>No hay promociones para mostrar</h3>
              <p>
                Cuando crees una promoción aparecerá aquí.
              </p>
            </div>
          ) : (
            <PromotionTable
              promotions={promotions}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>

      {showForm && (
        <PromotionForm
          onClose={() => setShowForm(false)}
          onCreated={loadData}
        />
      )}
    </div>
  );
}

export default App;