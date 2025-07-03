"use client";

import { register } from "@/hooks/auth_hooks/useRegister";
// import { useAuth } from "@/app/providers/AuthProvider";
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
// import { useRegister } from "@/hooks/useRegister";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
  // const { refetch } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  // const { mutate: register, isPending, error } = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const username = formData.get("username");

    if (!email || !password) {
      setFormError("Email and password are required");
      return;
    }

    if (!username) {
      setFormError("username is required");
      return;
    }

    // register(
    //   { email, password, username },
    //   {
    //     onSuccess: async () => {
    //       await refetch();
    //       router.push("/roadmaps");
    //     },
    //     onError: (err) => setFormError(err.message || "Registrations failed"),
    //   }
    // );
    const data = await register({ email, password, username });

    if (data.error) {
      setFormError("Something is wrong");
      return;
    }
    setIsLoading(false);
    router.push(data.redirectTo);
  };

  return (
    <>
      <AuthForm>
        <FormHeading>Create Account</FormHeading>
        <FormContainer onSubmit={handleSubmit}>
          <FormElement>
            <Label htmlFor="username">username</Label>
            <FormInput
              name="username"
              id="username"
              type="text"
              placeholder="ex: john hope"
            />
          </FormElement>

          <FormElement>
            <Label htmlFor="email">email</Label>
            <FormInput
              name="email"
              id="email"
              type="text"
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
          <FormErrorLabel message={formError} />
          <FormButton disabled={isLoading}>
            {isLoading ? "creating account..." : "create account"}
          </FormButton>
        </FormContainer>
      </AuthForm>
    </>
  );
}
