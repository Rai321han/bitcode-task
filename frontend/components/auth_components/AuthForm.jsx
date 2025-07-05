import { cn } from "@/libs/cn";
import Form from "next/form";

export function FormHeading({ children, className, ...rest }) {
  return (
    <h1
      className={cn(
        "text-2xl text-center font-bold text-light-title dark:text-dark-title",
        className
      )}
      {...rest}
    >
      {children}
    </h1>
  );
}

export function FormContainer({ children, className, ...rest }) {
  return (
    <Form
      className={cn("p-5 min-w-[300px] flex flex-col gap-3", className)}
      {...rest}
    >
      {children}
    </Form>
  );
}

export function FormElement({ children, className, ...rest }) {
  return (
    <div className={cn("flex flex-col gap-1 w-full", className)} {...rest}>
      {children}
    </div>
  );
}

export function Label({ children, className, ...rest }) {
  return (
    <label
      className={cn("text-sm text-light-title dark:text-dark-title", className)}
      {...rest}
    >
      {children}
    </label>
  );
}

export function FormInput({ children, className, ...rest }) {
  return (
    <input
      className={cn(
        "w-full text-sm text-light-body dark:text-dark-body py-2 px-3 outline-1 outline-light-line dark:outline-dark-line rounded-md",
        className
      )}
      {...rest}
    />
  );
}

export function FormButton({ className, children, disabled, ...rest }) {
  const disabledStyle = disabled
    ? "bg-dark-bg dark:bg-light-bg border-b-dark-fg dark:border-b-light-fg text-dark-title dark:text-light-title cursor-not-allowed border-b-l"
    : "";
  return (
    <button
      disabled={disabled}
      type="submit"
      className={cn(
        "p-2 bg-orange-500 text-md rounded-md text-white mt-4 cursor-pointer shadow-sm border-b-2 border-b-orange-600 transition-colors duration-200 hover:bg-orange-700",
        className,
        disabledStyle
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function FormErrorLabel({ className, message }) {
  return (
    message && (
      <div className="bg-red-200 text-red-700 text-sm p-2 rounded-md">
        {message}
      </div>
    )
  );
}

export function AuthForm({ children }) {
  return <>{children}</>;
}
