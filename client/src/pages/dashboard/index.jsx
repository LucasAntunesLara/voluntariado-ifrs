import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import { useAuth } from "@/contexts/useAuth";

const statusLabels = {
  pending: "Pendente",
  approved: "Aprovada",
  rejected: "Recusada",
};

export default function Dashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyRequest, setBusyRequest] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadRequests = useCallback(async (endpoint) => {
    setError("");
    try {
      const { data } = await api.get(endpoint);
      setRequests(data);
    } catch (loadError) {
      setError(
        loadError?.response?.data?.error ||
          "Não foi possível carregar as solicitações.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role !== "admin" && user?.role !== "volunteer") {
      setLoading(false);
      return;
    }

    const endpoint =
      user.role === "admin"
        ? "/dashboard/participation-requests"
        : "/dashboard/my-participation-requests";
    loadRequests(endpoint);
  }, [user?.role, loadRequests]);

  const reviewRequest = async (requestId, status) => {
    setBusyRequest(requestId);
    setError("");
    setNotice("");
    try {
      await api.patch(`/dashboard/participation-requests/${requestId}`, {
        status,
      });
      await loadRequests("/dashboard/participation-requests");
      setNotice(
        status === "approved"
          ? "Participação confirmada."
          : "Solicitação recusada.",
      );
    } catch (reviewError) {
      const automaticallyRejected = reviewError?.response?.data?.request;
      if (automaticallyRejected) {
        setRequests((current) =>
          current.map((request) =>
            request.id === requestId
              ? {
                  ...request,
                  status: automaticallyRejected.status,
                }
              : request,
          ),
        );
      }
      setError(
        reviewError?.response?.data?.error ||
          "Não foi possível atualizar a solicitação.",
      );
    } finally {
      setBusyRequest(null);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 p-6">
        <section className="mx-auto max-w-6xl">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            {user?.role === "admin"
              ? "Dashboard administrativo"
              : "Minhas solicitações"}
          </h1>
          <p className="mb-6 text-gray-600">
            {user?.role === "admin"
              ? "Revise as solicitações para participar dos eventos."
              : "Acompanhe o status das suas solicitações para participar dos eventos."}
          </p>

          {user?.role !== "admin" && user?.role !== "volunteer" ? (
            <div className="rounded-lg border bg-white p-6 text-gray-700">
              Esta página está disponível apenas para usuários autenticados.{" "}
              <Link className="text-emerald-700 underline" to="/eventos">
                Ver eventos
              </Link>
            </div>
          ) : loading ? (
            <p className="py-10 text-center text-gray-600">
              Carregando solicitações...
            </p>
          ) : error && requests.length === 0 ? (
            <p className="rounded-lg bg-red-50 p-4 text-red-700" role="alert">
              {error}
            </p>
          ) : user.role === "volunteer" ? (
            error ? (
              <p className="rounded-lg bg-red-50 p-4 text-red-700" role="alert">
                {error}
              </p>
            ) : (
              <div className="space-y-4">
                {requests.length === 0 ? (
                  <div className="rounded-lg border bg-white p-6 text-gray-600">
                    Você ainda não solicitou participação em eventos.{" "}
                    <Link
                      className="text-emerald-700 underline"
                      to="/eventos"
                    >
                      Ver eventos disponíveis
                    </Link>
                  </div>
                ) : (
                  requests.map((request) => (
                    <article
                      key={request.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-white p-5 shadow-sm"
                    >
                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {request.eventTitle}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                          Solicitado em{" "}
                          {new Date(request.requestedAt).toLocaleString(
                            "pt-BR",
                          )}
                        </p>
                      </div>
                      <span
                        className={
                          request.status === "approved"
                            ? "font-medium text-emerald-700"
                            : request.status === "rejected"
                              ? "font-medium text-red-700"
                              : "font-medium text-amber-700"
                        }
                      >
                        {statusLabels[request.status]}
                      </span>
                    </article>
                  ))
                )}
                <Button asChild className="bg-emerald-700 text-white hover:bg-emerald-800">
                  <Link to="/eventos">Explorar eventos</Link>
                </Button>
              </div>
            )
          ) : (
            <>
              {notice && (
                <p className="mb-4 rounded-lg bg-emerald-50 p-4 text-emerald-800">
                  {notice}
                </p>
              )}
              {error && (
                <p
                  className="mb-4 rounded-lg bg-red-50 p-4 text-red-700"
                  role="alert"
                >
                  {error}
                </p>
              )}
              {requests.length === 0 ? (
                <div className="rounded-lg border bg-white p-6 text-gray-600">
                  Ainda não há solicitações de participação.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                      <tr>
                        <th className="px-4 py-3">Voluntário</th>
                        <th className="px-4 py-3">Evento</th>
                        <th className="px-4 py-3">Solicitado em</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {requests.map((request) => (
                        <tr key={request.id}>
                          <td className="px-4 py-4">
                            <div className="font-medium text-gray-900">
                              {request.userName}
                            </div>
                            <div className="text-gray-500">
                              {request.userEmail}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-medium text-gray-900">
                              {request.eventTitle}
                            </div>
                            <div className="text-gray-500">
                              {new Date(request.eventDate).toLocaleDateString(
                                "pt-BR",
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-gray-600">
                            {new Date(request.requestedAt).toLocaleString(
                              "pt-BR",
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={
                                request.status === "approved"
                                  ? "text-emerald-700"
                                  : request.status === "rejected"
                                    ? "text-red-700"
                                    : "text-amber-700"
                              }
                            >
                              {statusLabels[request.status]}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            {request.status === "pending" ? (
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  size="sm"
                                  disabled={busyRequest === request.id}
                                  onClick={() =>
                                    reviewRequest(request.id, "approved")
                                  }
                                  className="bg-emerald-700 text-white hover:bg-emerald-800"
                                >
                                  Confirmar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={busyRequest === request.id}
                                  onClick={() =>
                                    reviewRequest(request.id, "rejected")
                                  }
                                >
                                  Negar
                                </Button>
                              </div>
                            ) : (
                              <span className="text-gray-400">Analisada</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
}
