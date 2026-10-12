import { useState, useEffect } from "react";
import api from "../services/api";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

/**
 * Componente responsável por listar os eventos cadastrados na plataforma.
 */
export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        setEvents(response.data);
      } catch (err) {
        setError(
          "Não foi possível carregar os eventos. Tente novamente mais tarde.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-lg font-medium text-gray-600">
          Carregando eventos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Ações de Voluntariado
          </h1>

          {events.length === 0 ? (
            <p className="text-gray-600">
              Nenhum evento cadastrado no momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col justify-between"
                >
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-800 mb-2">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-sm mb-4">
                      {event.description}
                    </CardDescription>

                    <CardContent className="text-xs text-gray-500 space-y-1 mb-4">
                      <p>
                        📅 Data: {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p>👥 Vagas máximas: {event.maxVolunteers}</p>
                    </CardContent>
                  </div>

                  <CardFooter>
                    <Button
                      onClick={() =>
                        alert(
                          `Inscrição realizada para o evento: ${event.title}`,
                        )
                      }
                      className="w-full"
                    >
                      Participar como Voluntário
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
