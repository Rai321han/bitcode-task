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
} from "./AuthForm/AuthForm";
import { useFormState } from "react-dom";
import { registerAction } from "@/actions/registerAction";

const initialState = {
  success: true,
  message: "",
  errors: [],
};

export default function RegisterForm() {
  const [state, formAction] = useFormState(registerAction, initialState);

  const isLoading = state === initialState;

  const getFieldError = (field) => {
    return state.errors?.find((err) => err.field === field)?.message;
  };

  return (
    <>
      <AuthForm>
        <FormHeading>Create Account</FormHeading>
        <FormContainer action={formAction}>
          <FormElement>
            <Label htmlFor="username">username</Label>
            <FormInput
              name="username"
              id="username"
              type="text"
              placeholder="ex: john hope"
            />
          </FormElement>
          {getFieldError("username") && (
            <FormErrorLabel message={getFieldError("username")} />
          )}
          <FormElement>
            <Label htmlFor="email">email</Label>
            <FormInput
              name="email"
              id="email"
              type="text"
              placeholder="ex: john@gmail.com"
            />
            {getFieldError("email") && (
              <FormErrorLabel message={getFieldError("email")} />
            )}
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
          {getFieldError("password") && (
            <FormErrorLabel message={getFieldError("password")} />
          )}
          {!state.success && state.message && (
            <FormErrorLabel message={state.message} />
          )}
          <FormButton disabled={isLoading}>
            {isLoading ? "creating account..." : "create account"}
          </FormButton>
        </FormContainer>
      </AuthForm>
    </>
  );
}
