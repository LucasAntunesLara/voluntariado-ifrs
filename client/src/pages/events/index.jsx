import { useState, useEffect } from "react";
import api from "../../services/api";
import Header from "@/components/layout/header";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  MapPinIcon,
  Pencil,
  PlusCircle,
  Users,
  XCircleIcon,
} from "lucide-react";

export default function EventsList() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [requests, setRequests] = useState({});
  const [applyingTo, setApplyingTo] = useState(null);
  const [cancellingEventId, setCancellingEventId] = useState(null);
  const [requestErrors, setRequestErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        setEvents(response.data);
      } catch {
        setError(
          "Não foi possível carregar os eventos. Tente novamente mais tarde.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (!user) {
      setRequests({});
      return;
    }

    api
      .get("/dashboard/my-participation-requests")
      .then(({ data }) => {
        setRequests(
          Object.fromEntries(data.map((request) => [request.eventId, request])),
        );
      })
      .catch(() => {
        setRequestErrors({
          page: "Não foi possível carregar o status das suas solicitações.",
        });
      });
  }, [user]);

  const requestParticipation = async (eventId) => {
    setApplyingTo(eventId);
    setRequestErrors((current) => ({ ...current, [eventId]: "" }));

    try {
      const { data } = await api.post(`/events/${eventId}/volunteers`);
      setRequests((current) => ({
        ...current,
        [data.eventId]: data,
      }));
    } catch (error) {
      setRequestErrors((current) => ({
        ...current,
        [eventId]:
          error?.response?.data?.error ||
          "Não foi possível solicitar participação. Tente novamente.",
      }));
    } finally {
      setApplyingTo(null);
    }
  };

  const cancelEvent = async (eventId) => {
    if (!window.confirm("Tem certeza de que deseja cancelar este evento?")) {
      return;
    }

    setCancellingEventId(eventId);
    setRequestErrors((current) => ({ ...current, [eventId]: "" }));

    try {
      await api.delete(`/events/${eventId}`);
      setEvents((current) => current.filter((event) => event.id !== eventId));
    } catch (error) {
      setRequestErrors((current) => ({
        ...current,
        [eventId]:
          error?.response?.data?.error ||
          "Não foi possível cancelar o evento. Tente novamente.",
      }));
    } finally {
      setCancellingEventId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-lg font-medium text-muted-foreground">
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
          <header className="flex items-center justify-between w-full flex-wrap">
            <h1 className="text-3xl font-bold text-foreground -800 mb-6">
              Ações de Voluntariado
            </h1>

            {user.role === "admin" && (
              <Button
                asChild
                size="lg"
                className="gap-2 bg-emerald-700 hover:bg-emerald-800 text-white flex rounded-full"
              >
                <a href="/eventos/novo" className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  <span>Novo Evento</span>
                </a>
              </Button>
            )}
          </header>
          {requestErrors.page && (
            <p className="mb-4 text-sm text-red-700" role="alert">
              {requestErrors.page}
            </p>
          )}

          {events.length === 0 ? (
            <p className="text-muted-foreground">
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
                    <CardDescription className="text-muted-foreground text-sm mb-4">
                      {event.description}
                    </CardDescription>

                    <CardContent className="text-xs text-gray-500 space-y-1 mb-4 px-0">
                      <div className="flex items-center gap-2">
                        <div className="bg-emerald-100 text-emerald-800 p-2 rounded-full">
                          <Calendar className="size-5 rounded-full2" />
                        </div>
                        <p>{new Date(event.date).toLocaleDateString()}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="bg-emerald-100 text-emerald-800 p-2 rounded-full">
                          <Users className="size-5 rounded-full2" />
                        </div>
                        {event.volunteers_count || 0} vagas de
                        {event.max_volunteers} preenchidas
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="bg-emerald-100 text-emerald-800 p-2 rounded-full">
                          <MapPinIcon className="size-5 rounded-full2" />
                        </div>
                        {event.location}
                      </div>
                    </CardContent>
                  </div>

                  <CardFooter className={`flex items-stretch gap-2`}>
                    {!user ? (
                      <Button asChild className="w-full">
                        <Link to="/login">
                          Entre para solicitar participação
                        </Link>
                      </Button>
                    ) : user.role === "admin" ? (
                      <>
                        <Button asChild className="w-fit" variant="outline">
                          <Link
                            to={`/eventos/${event.id}/editar`}
                            className="flex gap-1 items-center"
                          >
                            <Pencil />
                            Editar
                          </Link>
                        </Button>
                        <Button
                          onClick={() => cancelEvent(event.id)}
                          disabled={cancellingEventId === event.id}
                          className="w-fit"
                          variant="destructive"
                        >
                          <XCircleIcon />

                          {cancellingEventId === event.id
                            ? "Cancelando evento..."
                            : "Cancelar evento"}
                        </Button>
                      </>
                    ) : requests[event.id]?.status === "pending" ? (
                      <Button disabled className="w-full">
                        Solicitação enviada
                      </Button>
                    ) : requests[event.id]?.status === "approved" ? (
                      <Button disabled className="w-full">
                        Participação confirmada
                      </Button>
                    ) : Number(event.volunteers_count) >=
                      Number(event.max_volunteers) ? (
                      <Button disabled className="w-full">
                        Vagas esgotadas
                      </Button>
                    ) : (
                      <Button
                        onClick={() => requestParticipation(event.id)}
                        disabled={applyingTo === event.id}
                        className="w-full"
                      >
                        {applyingTo === event.id
                          ? "Enviando solicitação..."
                          : requests[event.id]?.status === "rejected"
                            ? "Solicitar novamente"
                            : "Participar como voluntário"}
                      </Button>
                    )}
                    {requests[event.id]?.status === "rejected" && (
                      <p className="text-sm text-red-700">
                        Solicitação recusada
                      </p>
                    )}
                    {requestErrors[event.id] && (
                      <p className="text-sm text-red-700" role="alert">
                        {requestErrors[event.id]}
                      </p>
                    )}
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
