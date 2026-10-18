import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {
  CalendarDays,
  Check,
  Mail,
  Pencil,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from 'lucide-react'
import Header from '@/components/layout/header'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {useAuth} from '@/contexts/useAuth'
import api from '@/services/api'

const roleLabels = {
  admin: 'Administrador',
  volunteer: 'Voluntário',
}

export default function Profile() {
  const {user, updateUser, logout} = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({name: '', email: ''})
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const {data} = await api.get('/auth/me')
        setProfile(data)
        setForm({name: data.name, email: data.email})
      } catch (loadError) {
        setError(
          loadError?.response?.data?.error ||
            'Não foi possível carregar os dados da conta.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const updateField = event => {
    setForm(current => ({...current, [event.target.name]: event.target.value}))
  }

  const cancelEditing = () => {
    setForm({name: profile.name, email: profile.email})
    setEditing(false)
    setError('')
    setNotice('')
  }

  const saveProfile = async event => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')

    try {
      const {data} = await api.patch('/auth/me', form)
      setProfile(data)
      setForm({name: data.name, email: data.email})
      updateUser({...user, name: data.name, email: data.email})
      setEditing(false)
      setNotice('Seus dados foram atualizados.')
    } catch (saveError) {
      setError(
        saveError?.response?.data?.error ||
          'Não foi possível atualizar seus dados.',
      )
    } finally {
      setSaving(false)
    }
  }

  const deleteAccount = async () => {
    const confirmed = window.confirm(
      'Tem certeza de que deseja excluir sua conta? Essa ação é permanente e não pode ser desfeita.',
    )
    if (!confirmed) return

    setDeleting(true)
    setError('')
    try {
      await api.delete('/auth/me')
      logout()
      navigate('/cadastro', {replace: true})
    } catch (deleteError) {
      setError(
        deleteError?.response?.data?.error ||
          'Não foi possível excluir sua conta.',
      )
      setDeleting(false)
    }
  }

  const initials = (profile?.name || user?.name || user?.email || '?')
    .slice(0, 2)
    .toUpperCase()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
        <section className="mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Minha conta
            </p>
            <h1 className="text-3xl font-bold text-gray-900">
              Perfil e informações
            </h1>
            <p className="mt-2 text-gray-600">
              Consulte e mantenha seus dados pessoais atualizados.
            </p>
          </div>

          {error && (
            <p
              className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p
              className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
              role="status">
              {notice}
            </p>
          )}

          {loading ? (
            <div
              className="rounded-xl border bg-white p-8 text-center text-gray-600 shadow-sm"
              role="status">
              Carregando seus dados...
            </div>
          ) : profile ? (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
              <form
                onSubmit={saveProfile}
                className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-800"
                      aria-hidden="true">
                      {initials}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Seus dados pessoais
                      </h2>
                      <p className="text-sm text-gray-500">
                        As informações usadas na sua conta
                      </p>
                    </div>
                  </div>
                  {!editing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditing(true)
                        setNotice('')
                        setError('')
                      }}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar dados
                    </Button>
                  )}
                </div>

                <div className="space-y-5 p-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="profile-name"
                      className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <UserRound className="h-4 w-4 text-gray-400" />
                      Nome completo
                    </label>
                    <Input
                      id="profile-name"
                      name="name"
                      autoComplete="name"
                      maxLength={100}
                      required
                      disabled={!editing || saving}
                      value={form.name}
                      onChange={updateField}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="profile-email"
                      className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Mail className="h-4 w-4 text-gray-400" />
                      E-mail
                    </label>
                    <Input
                      id="profile-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      maxLength={100}
                      required
                      disabled={!editing || saving}
                      value={form.email}
                      onChange={updateField}
                      className="h-11"
                    />
                  </div>

                  {editing && (
                    <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={cancelEditing}
                        disabled={saving}>
                        <X className="mr-2 h-4 w-4" />
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={saving}
                        className="bg-emerald-700 text-white hover:bg-emerald-800">
                        <Check className="mr-2 h-4 w-4" />
                        {saving ? 'Salvando...' : 'Salvar alterações'}
                      </Button>
                    </div>
                  )}
                </div>
              </form>

              <aside className="space-y-6">
                <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-5 font-semibold text-gray-900">
                    Detalhes da conta
                  </h2>
                  <dl className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-700" />
                      <div>
                        <dt className="text-gray-500">Tipo de conta</dt>
                        <dd className="font-medium text-gray-900">
                          {roleLabels[profile.role] || profile.role}
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CalendarDays className="mt-0.5 h-4 w-4 text-emerald-700" />
                      <div>
                        <dt className="text-gray-500">Membro desde</dt>
                        <dd className="font-medium text-gray-900">
                          {new Date(profile.createdAt).toLocaleDateString(
                            'pt-BR',
                          )}
                        </dd>
                      </div>
                    </div>
                  </dl>
                </section>

                <section className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
                  <h2 className="font-semibold text-gray-900">Excluir conta</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    A exclusão é permanente e remove seu acesso e seus dados
                    associados.
                  </p>
                  <Button
                    type="button"
                    variant="destructive"
                    className="mt-5 w-full"
                    onClick={deleteAccount}
                    disabled={deleting}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    {deleting ? 'Excluindo conta...' : 'Excluir minha conta'}
                  </Button>
                </section>
              </aside>
            </div>
          ) : (
            <div className="rounded-xl border bg-white p-6 text-gray-700 shadow-sm">
              Não foi possível localizar os dados da sua conta. Atualize a
              página ou entre novamente.
            </div>
          )}
        </section>
      </main>
    </>
  )
}
