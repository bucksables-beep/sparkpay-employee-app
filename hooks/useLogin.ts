import { $api } from "@/services/api";
import { FormikHelpers, useFormik } from "formik";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import * as yup from "yup";

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    avatar?: string;
  };
}

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;
  const [searchParams] = useSearchParams();

  const onboardingToken = searchParams.get("onboarding_token");

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const handleFormikSubmit = async (
    values: LoginFormValues,
    helpers: FormikHelpers<LoginFormValues>
  ) => {
    helpers.setSubmitting(true);
    try {
      const response = await $api.post<LoginResponse>("auth/login", {
        username: values.email,
        password: values.password,
      });

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      if (onboardingToken) {
        await $api.post(
          "employees/join",
          {
            token: onboardingToken,
            country: "6151053e38bc69b9207a53d5",
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
      }

      // Navigate to dashboard on success
      navigate("/app/dashboard");
    } catch (error) {
      helpers.setFieldError("email", "Invalid email or password");
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const form = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: handleFormikSubmit,
  });

  const handleForgotPassword = () => {
    // TODO: Implement forgot password flow
    console.log("Forgot password clicked");
  };

  return {
    form,
    message,
    handleForgotPassword,
  };
};
