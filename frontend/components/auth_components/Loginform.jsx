"use client";
import { useState } from "react";
import {
  AuthForm,
  FormContainer,
  FormHeading,
  FormElement,
  FormInput,
  Label,
  FormButton,
  FormErrorLabel,
} from "./AuthForm";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/auth_hooks/useLogin";
import { useAuth } from "@/app/providers/AuthProvider";

export default function Loginform() {
  const { refetch } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      setFormError("Email and password are required");
      return;
    }

    login(
      { email, password },
      {
        onSuccess: async () => {
          await refetch();
          router.push("/roadmaps");
        },
        onError: (err) => setFormError(err.message || "Login failed"),
      }
    );
  };

  return (
    <>
      <AuthForm>
        <FormHeading>Sign in</FormHeading>
        <FormContainer onSubmit={handleSubmit}>
          <FormElement>
            <Label htmlFor="email">email</Label>
            <FormInput
              name="email"
              id="email"
              type="email"
              placeholder="ex: john@gmail.com"
            />
          </FormElement>
          <FormElement>
            <Label htmlFor="password">password</Label>
            <FormInput
              name="password"
              id="password"
              type="password"
              placeholder="********"
            />
          </FormElement>
          <FormErrorLabel message={formError || error?.message} />
          <FormButton disabled={isPending}>
            {isPending ? "loggin in..." : "login"}
          </FormButton>
        </FormContainer>
      </AuthForm>
    </>
  );
}
