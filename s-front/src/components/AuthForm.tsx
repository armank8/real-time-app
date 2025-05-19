// src/components/AuthForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Input from "./Input";
import Button from "./Button";

interface AuthFormProps {
  onAuthSuccess: (token: string) => void;
}

type FormValues = {
  name?: string;
  email: string;
  password: string;
};

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      const url = isLogin ? "/api/auth/login" : "/api/auth/register";
      const response = await axios.post(url, data);
      localStorage.setItem("token", response.data.token);
      onAuthSuccess(response.data.token);
      setServerError("");
    } catch (err:unknown) {
      setServerError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isLogin ? "Login" : "Register"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {!isLogin && (
          <Input
            label="Name"
            {...register("name", { required: !isLogin })}
            error={errors.name?.message}
          />
        )}

        <Input
          label="Email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Invalid email",
            },
          })}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Min 6 characters" },
          })}
          error={errors.password?.message}
        />

        {serverError && <p className="text-red-500 mb-4">{serverError}</p>}

        <Button label={isLogin ? "Login" : "Register"} type="submit" />

        <p className="mt-4 text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
}
