function formatDate(date) {
  return new Date(date).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getDiscountText(promotion) {
  if (promotion.discount_type === 'PORCENTAJE') {
    return `${promotion.discount_value}%`;
  }

  return `$${Number(promotion.discount_value).toLocaleString('es-CO')}`;
}

function getStatusClass(status) {
  return status.toLowerCase();
}

function PromotionTable({
  promotions,
  onStatusChange,
  onDelete,
}) {
  return (
    <div className="table-container">
      <table className="promotions-table">
        <thead>
          <tr>
            <th>Promoción</th>
            <th>Asociado a</th>
            <th>Descuento</th>
            <th>Vigencia</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {promotions.map((promotion) => (
            <tr key={promotion.id}>
              <td>
                <strong>{promotion.name}</strong>
              </td>

              <td>
                {promotion.product_name
                  ? promotion.product_name
                  : promotion.category_name}
              </td>

              <td>
                {getDiscountText(promotion)}
              </td>

              <td>
                <div>
                  {formatDate(promotion.start_date)}
                </div>

                <small>
                  hasta {formatDate(promotion.end_date)}
                </small>
              </td>

              <td>
                <span
                  className={`status-badge ${getStatusClass(
                    promotion.status
                  )}`}
                >
                  {promotion.status}
                </span>
              </td>

              <td>
                <div className="actions">
                  {promotion.status === 'PROGRAMADA' && (
                    <>
                      <button
                        className="action-button"
                        onClick={() =>
                          onStatusChange(
                            promotion.id,
                            'ACTIVA'
                          )
                        }
                      >
                        Activar
                      </button>

                      <button
                        className="action-button danger"
                        onClick={() =>
                          onDelete(promotion.id)
                        }
                      >
                        Eliminar
                      </button>
                    </>
                  )}

                  {promotion.status === 'ACTIVA' && (
                    <button
                      className="action-button"
                      onClick={() =>
                        onStatusChange(
                          promotion.id,
                          'FINALIZADA'
                        )
                      }
                    >
                      Finalizar
                    </button>
                  )}

                  {promotion.status === 'FINALIZADA' && (
                    <span className="no-actions">
                      Sin acciones
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PromotionTable;