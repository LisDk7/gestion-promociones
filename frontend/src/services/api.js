const API_URL = 'http://localhost:3000/api';

export async function getPromotions() {
  const response = await fetch(`${API_URL}/promotions`);

  if (!response.ok) {
    throw new Error('No fue posible cargar las promociones.');
  }

  return response.json();
}

export async function getPromotionSummary() {
  const response = await fetch(`${API_URL}/promotions/summary`);

  if (!response.ok) {
    throw new Error('No fue posible cargar el resumen.');
  }

  return response.json();
}

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error('No fue posible cargar los productos.');
  }

  return response.json();
}

export async function getCategories() {
  const response = await fetch(`${API_URL}/categories`);

  if (!response.ok) {
    throw new Error('No fue posible cargar las categorías.');
  }

  return response.json();
}

export async function createPromotion(promotion) {
  const response = await fetch(`${API_URL}/promotions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(promotion),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'No fue posible crear la promoción.');
  }

  return data;
}

export async function updatePromotionStatus(id, status) {
  const response = await fetch(`${API_URL}/promotions/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'No fue posible actualizar el estado.'
    );
  }

  return data;
}

export async function deletePromotion(id) {
  const response = await fetch(`${API_URL}/promotions/${id}`, {
    method: 'DELETE',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'No fue posible eliminar la promoción.'
    );
  }

  return data;
}