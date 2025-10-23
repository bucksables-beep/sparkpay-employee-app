import React from "react";
import { useLogin } from "../hooks/useLogin";
import { Input } from "../components/Input";
import { PasswordInput } from "../components/PasswordInput";
import { Button } from "../components/Button";

const Login: React.FC = () => {
  const { form, message, handleForgotPassword } = useLogin();

  return (
    <div className="flex min-h-screen flex-col justify-center bg-background-light p-6 dark:bg-background-dark">
      <div className="mx-auto w-full max-w-sm">
        <div className="flex w-full items-center justify-center gap-2 mb-8">
          <div className="h-2 w-8 rounded-full bg-primary"></div>
          <div className="h-2 w-8 rounded-full bg-primary/20 dark:bg-primary/30"></div>
          <div className="h-2 w-8 rounded-full bg-primary/20 dark:bg-primary/30"></div>
        </div>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-text-light dark:text-text-dark">
            Welcome to Sparkpay
          </h1>
          <p className="text-subtext-light dark:text-subtext-dark max-w-sm mx-auto">
            Your all-in-one financial hub for seamless transactions and smart
            money management.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-lg bg-primary/10 dark:bg-accent-blue/20 p-4 text-center text-sm font-medium text-primary dark:text-accent-blue">
            {message}
          </div>
        )}

        <form onSubmit={form.handleSubmit} className="space-y-4">
          <Input
            id="email"
            name="email"
            label="Email or Phone"
            type="email"
            placeholder="Email or Phone"
            autoComplete="email"
            required
            value={form.values.email}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.errors.email}
            touched={form.touched.email}
            icon="mail"
            hideLabel
          />

          <PasswordInput
            id="password"
            name="password"
            label="Password"
            placeholder="Password"
            autoComplete="current-password"
            required
            value={form.values.password}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.errors.password}
            touched={form.touched.password}
            icon="lock"
            hideLabel
          />

          <a
            className="text-sm text-primary font-medium text-right mt-4 block cursor-pointer"
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </a>

          <Button
            type="submit"
            isLoading={form.isSubmitting}
            disabled={!form.isValid || !form.dirty}
            className="w-full mt-8"
          >
            Log In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
