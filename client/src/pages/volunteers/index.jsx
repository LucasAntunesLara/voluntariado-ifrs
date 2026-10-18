import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  GraduationCap,
  Mail,
  Phone,
  RefreshCw,
  UsersRound,
} from "lucide-react";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "../../services/api";

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? "—"
    : new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(
        parsedDate,
      );
};

const statusLabels = {
  approved: "Confirmada",
  pending: "Pendente",
  rejected: "Recusada",
};

const statusStyles = {
  approved: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  rejected: "bg-rose-50 text-rose-700",
};

async function fetchVolunteers() {
  const response = await api.get("/volunteers");
  if (!Array.isArray(response.data)) {
    throw new Error("Formato inesperado na resposta da API.");
  }
  return response.data;
}

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVolunteers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setVolunteers(await fetchVolunteers());
    } catch {
      setError("Não foi possível carregar os voluntários. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetchVolunteers()
      .then((data) => {
        if (active) setVolunteers(data);
      })
      .catch(() => {
        if (active) {
          setError(
            "Não foi possível carregar os voluntários. Tente novamente.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredVolunteers = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
    if (!normalizedSearch) return volunteers;

    return volunteers.filter((volunteer) => {
      const searchableValues = [
        volunteer.name,
        volunteer.email,
        volunteer.phone,
        volunteer.courseOrAffiliation,
        ...(volunteer.events || []).map((event) => event.eventTitle),
      ];

      return searchableValues.some((value) =>
        String(value || "")
          .toLocaleLowerCase("pt-BR")
          .includes(normalizedSearch),
      );
    });
  }, [search, volunteers]);

  const registrationCount = volunteers.reduce(
    (total, volunteer) => total + (volunteer.events?.length || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-[#fbfaf6] font-sans text-emerald-950">
      <Header />

      <main className="mx-auto max-w-6xl">
        <section className="mb-8 flex flex-wrap items-end justify-between gap-5 ">
          <h1 className="mb-2 text-3xl font-bold text-emerald-950">
            Voluntários
          </h1>
          <Button
            type="button"
            variant="outline"
            onClick={loadVolunteers}
            disabled={loading}
            className="gap-2 rounded-full border-[#d9e0d9] bg-[#fffefa] text-emerald-800 hover:bg-[#f1f5ef]"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar lista
          </Button>
        </section>

        <section
          className="mb-6 grid gap-4 sm:grid-cols-2"
          aria-label="Resumo dos voluntários"
        >
          <Card className="rounded-md border-[#e8e9e1] bg-[#fffefa] shadow-none">
            <CardContent className="flex flex-row items-center gap-4 p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-700">
                <UsersRound className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-[#63736a]">Pessoas cadastradas</p>
                <p className="text-2xl font-bold text-emerald-950">
                  {volunteers.length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-md border-[#e8e9e1] bg-[#fffefa] shadow-none">
            <CardContent className="flex flex-row items-center gap-4 p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-600">
                <CalendarDays className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-[#63736a]">Inscrições em ações</p>
                <p className="text-2xl font-bold text-emerald-950">
                  {registrationCount}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Card className="gap-0 overflow-hidden rounded-md border-[#e8e9e1] bg-[#fffefa] py-0 shadow-[0_18px_50px_#243d2c0d] p-6">
          <CardHeader className="gap-4 border-b border-[#e8e9e1] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-emerald-950">
                Diretório de voluntários
              </CardTitle>
              <CardDescription className="mt-1 text-[#63736a]">
                Informações de contato, vínculo e participação nas ações.
              </CardDescription>
            </div>
            <label className="relative block w-full sm:max-w-70">
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar voluntário..."
                aria-label="Buscar voluntário"
                className="h-10 rounded-full border-[#dfe5dc] bg-white pl-9 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
              />
            </label>
          </CardHeader>

          {error ? (
            <div
              className="flex flex-col items-center gap-3 px-6 py-14 text-center"
              role="alert"
            >
              <p className="text-sm text-rose-700">{error}</p>
              <Button
                type="button"
                variant="outline"
                onClick={loadVolunteers}
                className="rounded-full border-[#d9e0d9] text-emerald-800"
              >
                Tentar novamente
              </Button>
            </div>
          ) : loading ? (
            <div
              className="flex flex-col items-center gap-3 px-6 py-16 text-center text-[#63736a]"
              role="status"
            >
              <RefreshCw className="size-5 animate-spin text-emerald-600" />
              <p className="text-sm">Carregando voluntários...</p>
            </div>
          ) : filteredVolunteers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <UsersRound className="mx-auto mb-3 size-8 text-[#a4b2a3]" />
              <p className="font-medium text-emerald-950">
                {search
                  ? "Nenhum voluntário encontrado"
                  : "Ainda não há voluntários cadastrados"}
              </p>
              <p className="mt-1 text-sm text-[#63736a]">
                {search
                  ? "Tente buscar por outro nome, e-mail ou ação."
                  : "Os cadastros aparecerão aqui assim que forem realizados."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#f7f7f1]">
                  <TableRow className="border-[#e8e9e1] hover:bg-[#f7f7f1]">
                    <TableHead className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#63736a]">
                      Voluntário
                    </TableHead>
                    <TableHead className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#63736a]">
                      Contato
                    </TableHead>
                    <TableHead className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#63736a]">
                      Vínculo
                    </TableHead>
                    <TableHead className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#63736a]">
                      Ações e inscrições
                    </TableHead>
                    <TableHead className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#63736a]">
                      Cadastro
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVolunteers.map((volunteer) => (
                    <TableRow
                      key={volunteer.id}
                      className="border-[#eef0e9] align-top hover:bg-[#fafbf7]"
                    >
                      <TableCell className="px-5 py-4">
                        <div className="flex min-w-48 items-center gap-3">
                          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                            {(volunteer.name || "?")
                              .split(/\s+/)
                              .slice(0, 2)
                              .map((part) => part[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                          <div>
                            <p className="font-semibold text-emerald-950">
                              {volunteer.name}
                            </p>
                            <p className="mt-0.5 text-xs text-[#829087]">
                              Voluntário
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex min-w-48 flex-col gap-2 text-sm">
                          <a
                            className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-600"
                            href={`mailto:${volunteer.email}`}
                          >
                            <Mail
                              className="size-3.5 shrink-0 text-[#829087]"
                              aria-hidden="true"
                            />
                            {volunteer.email}
                          </a>
                          {volunteer.phone ? (
                            <a
                              className="inline-flex items-center gap-2 text-[#63736a] hover:text-emerald-700"
                              href={`tel:${volunteer.phone}`}
                            >
                              <Phone
                                className="size-3.5 shrink-0 text-[#829087]"
                                aria-hidden="true"
                              />
                              {volunteer.phone}
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-2 text-xs text-[#929b91]">
                              <Phone className="size-3.5" aria-hidden="true" />
                              Telefone não informado
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <span className="inline-flex min-w-40 items-start gap-2 text-sm leading-5 text-[#63736a]">
                          <GraduationCap
                            className="mt-0.5 size-4 shrink-0 text-rose-500"
                            aria-hidden="true"
                          />
                          {volunteer.courseOrAffiliation ||
                            "Comunidade Externa"}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex min-w-52 flex-col gap-2">
                          {volunteer.events?.length ? (
                            volunteer.events.map((event, index) => (
                              <div
                                className="flex items-start justify-between gap-3"
                                key={`${event.eventTitle}-${event.registeredAt}-${index}`}
                              >
                                <div className="min-w-0">
                                  <p className="max-w-56 whitespace-normal text-sm font-medium leading-5 text-emerald-950">
                                    {event.eventTitle}
                                  </p>
                                  <p className="mt-0.5 text-xs text-[#829087]">
                                    Inscrição em{" "}
                                    {formatDate(event.registeredAt)}
                                  </p>
                                </div>
                                <span
                                  className={`shrink-0 rounded-full px-2 py-1 text-[0.68rem] font-semibold ${
                                    statusStyles[event.status] ||
                                    "bg-[#f1f3ed] text-[#63736a]"
                                  }`}
                                >
                                  {statusLabels[event.status] || "Sem status"}
                                </span>
                              </div>
                            ))
                          ) : (
                            <span className="text-sm text-[#929b91]">
                              Ainda sem inscrições
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-[#63736a]">
                        {formatDate(volunteer.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="border-t border-[#e8e9e1] px-5 py-3 text-xs text-[#829087]">
                Exibindo {filteredVolunteers.length} de {volunteers.length}{" "}
                voluntários
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
