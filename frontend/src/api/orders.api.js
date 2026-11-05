import { apiRequest } from "@/api/client";

function getData(response, action) {
  if (!response || !Object.hasOwn(response, "data")) {
    throw new Error(`The server returned an invalid ${action} response.`);
  }
  return response.data;
}

export async function listAllOrders({
  page = 1,
  limit = 10,
  status = "",
  search = "",
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) params.set("status", status);
  if (search.trim()) params.set("search", search.trim());

  const response = await apiRequest(`/orders/admin?${params}`);
  return getData(response, "orders");
}

export async function requestRefundAdmin(orderId, reason = null) {
  return getData(
    await apiRequest(`/orders/admin/${Number(orderId)}/refund`, {
      method: "POST",
      body: { reason: reason || null },
    }),
    "refund",
  );
}

export async function retryRefund(refundId) {
  return getData(
    await apiRequest(`/orders/admin/refunds/${Number(refundId)}/retry`, {
      method: "POST",
    }),
    "refund",
  );
}
export async function cancelOrderAdmin(orderId) {
  return getData(
    await apiRequest(`/orders/admin/${Number(orderId)}/cancel`, {
      method: "POST",
    }),
    "cancel",
  );
}
