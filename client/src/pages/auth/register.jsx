import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/useAuth";
import api from "@/services/api";
import Header from "@/components/layout/header";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ name, email, password }) => {
    setSubmitError("");

    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      if (!data?.token) {
        throw new Error("O servidor não retornou um token de autenticação.");
      }

      login(data.token, data.user);
      navigate("/", { replace: true });
    } catch (error) {
      setSubmitError(
        error?.response?.data?.error ||
          error?.message ||
          "Não foi possível criar sua conta. Tente novamente.",
      );
    }
  };

  return (
    <>
      <Header />
      <main className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-4xl">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form
                className="p-6 md:p-8"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <FieldGroup>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Crie sua conta</h1>
                    <p className="text-balance text-muted-foreground">
                      Cadastre-se para participar das ações de voluntariado
                    </p>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="name">Nome completo</FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      autoComplete="name"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      {...register("name", {
                        required: "Informe seu nome.",
                        maxLength: {
                          value: 100,
                          message: "O nome deve ter no máximo 100 caracteres.",
                        },
                      })}
                    />
                    <FieldError
                      id="name-error"
                      errors={errors.name ? [errors.name] : []}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">E-mail</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      autoComplete="email"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      {...register("email", {
                        required: "Informe seu e-mail.",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Informe um e-mail válido.",
                        },
                        maxLength: {
                          value: 100,
                          message:
                            "O e-mail deve ter no máximo 100 caracteres.",
                        },
                      })}
                    />
                    <FieldError
                      id="email-error"
                      errors={errors.email ? [errors.email] : []}
                    />
                  </Field>

                  <Field className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="password">Senha</FieldLabel>
                      <Input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        aria-invalid={Boolean(errors.password)}
                        aria-describedby={
                          errors.password ? "password-error" : undefined
                        }
                        {...register("password", {
                          required: "Informe uma senha.",
                          minLength: {
                            value: 8,
                            message:
                              "A senha deve ter pelo menos 8 caracteres.",
                          },
                        })}
                      />
                      <FieldError
                        id="password-error"
                        errors={errors.password ? [errors.password] : []}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="confirmPassword">
                        Confirme a senha
                      </FieldLabel>
                      <Input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        aria-invalid={Boolean(errors.confirmPassword)}
                        aria-describedby={
                          errors.confirmPassword
                            ? "confirm-password-error"
                            : undefined
                        }
                        {...register("confirmPassword", {
                          required: "Confirme sua senha.",
                          validate: (value) =>
                            value === getValues("password") ||
                            "As senhas não coincidem.",
                        })}
                      />
                      <FieldError
                        id="confirm-password-error"
                        errors={
                          errors.confirmPassword ? [errors.confirmPassword] : []
                        }
                      />
                    </Field>
                  </Field>

                  {submitError && (
                    <FieldError role="alert">{submitError}</FieldError>
                  )}
                  <Field>
                    <Button
                      type="submit"
                      className="bg-emerald-700 text-white hover:bg-emerald-800"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Criando conta..." : "Criar conta"}
                    </Button>
                  </Field>
                  <FieldDescription className="text-center">
                    Não tem uma conta? <Link to="/login">Entrar</Link>
                  </FieldDescription>
                </FieldGroup>
              </form>
              <div className="relative hidden bg-muted md:block">
                <img
                  src="https://ifrs.edu.br/bento/wp-content/uploads/sites/13/2018/05/portico.png"
                  alt="Pórtico do IFRS Campus Bento Gonçalves"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
