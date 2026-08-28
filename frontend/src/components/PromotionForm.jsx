import { useEffect, useState } from 'react';

import {
  getProducts,
  getCategories,
  createPromotion,
} from '../services/api';

function PromotionForm({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    targetType: 'PRODUCT',
    product_id: '',
    category_id: '',
    discount_type: 'PORCENTAJE',
    discount_value: '',
    start_date: '',
    end_date: '',
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadOptions() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingOptions(false);
      }
    }

    loadOptions();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleTargetTypeChange(event) {
    const targetType = event.target.value;

    setFormData((previous) => ({
      ...previous,
      targetType,
      product_id: '',
      category_id: '',
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');

    const promotion = {
      name: formData.name,
      product_id:
        formData.targetType === 'PRODUCT'
          ? Number(formData.product_id)
          : null,
      category_id:
        formData.targetType === 'CATEGORY'
          ? Number(formData.category_id)
          : null,
      discount_type: formData.discount_type,
      discount_value: Number(formData.discount_value),
      start_date: formData.start_date,
      end_date: formData.end_date,
    };

    try {
      setSaving(true);

      await createPromotion(promotion);

      onCreated();

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="promotion-form">
        <div className="form-header">
          <div>
            <h2>Nueva promoción</h2>

            <p>
              Completa los datos para crear una promoción.
            </p>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              Nombre de la promoción
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Descuento de verano"
            />
          </div>

          <div className="form-group">
            <label htmlFor="targetType">
              Aplicar promoción a
            </label>

            <select
              id="targetType"
              value={formData.targetType}
              onChange={handleTargetTypeChange}
            >
              <option value="PRODUCT">
                Producto
              </option>

              <option value="CATEGORY">
                Categoría
              </option>
            </select>
          </div>

          {formData.targetType === 'PRODUCT' && (
            <div className="form-group">
              <label htmlFor="product_id">
                Producto
              </label>

              <select
                id="product_id"
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                disabled={loadingOptions}
              >
                <option value="">
                  {loadingOptions
                    ? 'Cargando productos...'
                    : 'Selecciona un producto'}
                </option>

                {products.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.targetType === 'CATEGORY' && (
            <div className="form-group">
              <label htmlFor="category_id">
                Categoría
              </label>

              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                disabled={loadingOptions}
              >
                <option value="">
                  {loadingOptions
                    ? 'Cargando categorías...'
                    : 'Selecciona una categoría'}
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="discount_type">
              Tipo de descuento
            </label>

            <select
              id="discount_type"
              name="discount_type"
              value={formData.discount_type}
              onChange={handleChange}
            >
              <option value="PORCENTAJE">
                Porcentaje
              </option>

              <option value="MONTO_FIJO">
                Monto fijo
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="discount_value">
              Valor del descuento
            </label>

            <input
              id="discount_value"
              name="discount_value"
              type="number"
              min="1"
              value={formData.discount_value}
              onChange={handleChange}
              placeholder="Ej: 20"
            />
          </div>

          <div className="form-group">
            <label htmlFor="start_date">
              Fecha de inicio
            </label>

            <input
              id="start_date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="end_date">
              Fecha de fin
            </label>

            <input
              id="end_date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving
                ? 'Creando...'
                : 'Crear promoción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PromotionForm;