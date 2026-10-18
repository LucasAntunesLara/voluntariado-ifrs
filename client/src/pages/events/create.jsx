import {useEffect, useState} from 'react'
import {Link, Navigate, useParams} from 'react-router-dom'
import {ArrowLeft, CalendarPlus} from 'lucide-react'
import Header from '@/components/layout/header'
import {Button} from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import api from '../../services/api'
import {useAuth} from '@/contexts/useAuth'

function getLocalDateTimeValue(date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localDate.toISOString().slice(0, 16)
}

export default function CreateEvent() {
  const {user} = useAuth()
  const {id} = useParams()
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    max_volunteers: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [loadedEventId, setLoadedEventId] = useState(null)
  const loadingEvent = Boolean(id) && loadedEventId !== id
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchEvent = async () => {
      try {
        const {data} = await api.get(`/events/${id}`)
        setForm({
          title: data.title,
          description: data.description,
          location: data.location,
          date: getLocalDateTimeValue(new Date(data.date)),
          max_volunteers: String(data.max_volunteers),
        })
      } catch (requestError) {
        setError(
          requestError?.response?.data?.error ||
            'Não foi possível carregar os dados do evento.',
        )
      } finally {
        setLoadedEventId(id)
      }
    }

    fetchEvent()
  }, [id])

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/eventos" replace />

  const updateField = event => {
    const {name, value} = event.target
    setForm(current => ({...current, [name]: value}))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setError('')
    setSuccess(false)

    if (!id && new Date(form.date).getTime() <= Date.now()) {
      setError('A data do evento deve ser futura.')
      return
    }

    setSubmitting(true)
    try {
      const eventData = {
        ...form,
        date: `${form.date.replace('T', ' ')}:00`,
        max_volunteers: Number(form.max_volunteers),
      }
      if (id) {
        await api.put(`/events/${id}`, eventData)
      } else {
        await api.post('/events', eventData)
      }
      setSuccess(true)
      if (!id) {
        setForm({
          title: '',
          description: '',
          location: '',
          date: '',
          max_volunteers: '',
        })
      }
    } catch (requestError) {
      setError(
        requestError?.response?.data?.error ||
          'Não foi possível criar o evento. Tente novamente.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/eventos" className="flex gap-1 items-center">
              <ArrowLeft />
              Voltar
            </Link>
          </Button>

          <Card className="bg-white">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                <CalendarPlus aria-hidden="true" />
              </div>
              <CardTitle className="text-2xl font-bold">
                {id ? 'Editar evento' : 'Criar evento'}
              </CardTitle>
              <CardDescription>
                {id
                  ? 'Atualize os dados da ação de voluntariado.'
                  : 'Preencha os dados da ação de voluntariado.'}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {loadingEvent && (
                <p className="mb-5 text-sm text-muted-foreground" role="status">
                  Carregando dados do evento...
                </p>
              )}

              {error && (
                <p
                  className="mb-5 rounded-md bg-red-50 p-3 text-sm text-red-700"
                  role="alert">
                  {error}
                </p>
              )}

              {success && (
                <div
                  className="mb-5 rounded-md bg-emerald-50 p-3 text-sm text-emerald-800"
                  role="status">
                  {id
                    ? 'Evento atualizado com sucesso.'
                    : 'Evento criado com sucesso.'}{' '}
                  <Link to="/eventos" className="font-semibold underline">
                    Ver eventos
                  </Link>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title">Nome do evento</Label>
                  <Input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={updateField}
                    maxLength={150}
                    placeholder="Ex.: Mutirão de arrecadação"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={updateField}
                    rows={4}
                    placeholder="Descreva a ação e como será a participação dos voluntários."
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Local</Label>
                  <Input
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={updateField}
                    maxLength={150}
                    placeholder="Endereço ou local de encontro"
                    required
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">Data e horário</Label>
                    <Input
                      id="date"
                      name="date"
                      type="datetime-local"
                      value={form.date}
                      onChange={updateField}
                      min={!id ? getLocalDateTimeValue(new Date()) : undefined}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max_volunteers">
                      Vagas para voluntários
                    </Label>
                    <Input
                      id="max_volunteers"
                      name="max_volunteers"
                      type="number"
                      min="1"
                      step="1"
                      value={form.max_volunteers}
                      onChange={updateField}
                      placeholder="Ex.: 20"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                  <Button asChild type="button" variant="outline">
                    <Link to="/eventos">Cancelar</Link>
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      submitting || loadingEvent || Boolean(error && id)
                    }
                    className="bg-emerald-700 text-white hover:bg-emerald-800">
                    {submitting
                      ? id
                        ? 'Salvando alterações...'
                        : 'Criando evento...'
                      : id
                        ? 'Salvar alterações'
                        : 'Criar evento'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
