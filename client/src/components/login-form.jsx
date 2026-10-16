import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import api from "@/services/api";
import { useAuth } from "@/contexts/useAuth";

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ email, password }) => {
    setSubmitError("");

    try {
      const { data } = await api.post("/auth/login", { email, password });

      if (!data?.token) {
        throw new Error("O servidor não retornou um token de autenticação.");
      }

      login(data.token, data.user);
      navigate("/", { replace: true });
    } catch (error) {
      setSubmitError(
        error?.response?.data?.error ||
          error?.message ||
          "Não foi possível realizar o login. Tente novamente.",
      );
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold text-brand-2">
                  Bem-vindo de volta!
                </h1>
                <p className="text-balance text-muted-foreground">
                  Entre com a sua conta
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  {...register("email", {
                    required: "Informe seu e-mail.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Informe um e-mail válido.",
                    },
                  })}
                />
                <FieldError
                  id="email-error"
                  errors={errors.email ? [errors.email] : []}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  {...register("password", {
                    required: "Informe sua senha.",
                  })}
                />
                <FieldError
                  id="password-error"
                  errors={errors.password ? [errors.password] : []}
                />
              </Field>
              {submitError && (
                <FieldError role="alert">{submitError}</FieldError>
              )}
              <Field>
                <Button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Entrando..." : "Entrar"}
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Não tem uma conta? <Link to="/cadastro">Inscrever-se</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="https://ifrs.edu.br/bento/wp-content/uploads/sites/13/2018/05/portico.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
