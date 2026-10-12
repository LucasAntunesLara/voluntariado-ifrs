import { useState, useEffect } from "react";
import api from "../services/api";

/**
 * Componente para exibição e gerenciamento de voluntários.
 */
export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await api.get("/volunteers");
        setVolunteers(response.data);
      } catch (err) {
        setError("Erro ao carregar a lista de voluntários.");
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600">
        Carregando voluntários...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-800 text-white">
          <h2 className="text-xl font-semibold">
            Lista de Voluntários Cadastrados
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-xs">
                <th className="py-3 px-6">Nome</th>
                <th className="py-3 px-6">E-mail</th>
                <th className="py-3 px-6">Ação / Evento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-600">
              {volunteers.map((vol) => (
                <tr key={vol.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">
                    {vol.name}
                  </td>
                  <td className="py-4 px-6">{vol.email}</td>
                  <td className="py-4 px-6">{vol.eventTitle || "Geral"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
