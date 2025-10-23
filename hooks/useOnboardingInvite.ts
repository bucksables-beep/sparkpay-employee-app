import { $api, ApiError } from "@/services/api";
import { FormikHelpers, useFormik } from "formik";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";

interface OnboardingData {
  email: string;
  firstname: string;
  lastname: string;
  company: {
    name: string;
  };
}

interface OnboardingResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
  };
}

const onboardingSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  firstname: yup.string().required("First name is required"),
  lastname: yup.string().required("Last name is required"),
});

export const useAcceptInvite = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const onboardingToken = searchParams.get("token");

  const [orgName, setOrgName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initialValues = {
    email: "",
    password: "",
    firstname: "",
    lastname: "",
  };

  const handleFormikSubmit = (
    values: typeof initialValues,
    helpers: FormikHelpers<typeof initialValues>
  ) => {
    helpers.setSubmitting(true);
    $api
      .post<OnboardingResponse>("auth/signup", {
        ...values,
        country: "6151053e38bc69b9207a53d5",
        inviteCode: onboardingToken,
      })
      .then(({ data }) => {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        return $api.post(
          "employees/join",
          {
            token: onboardingToken,
            country: "6151053e38bc69b9207a53d5",
          },
          {
            headers: {
              Authorization: `Bearer ${data.accessToken}`,
            },
          }
        );
      })
      .then(() => {
        navigate("/login", {
          state: {
            message:
              "Account created successfully! Please sign in to continue.",
          },
        });
      })
      .catch((err) => {
        if (err instanceof ApiError && err.errors) {
          helpers.setErrors(err.errors as Record<string, string>);
        }

        setError(err.message);
      })
      .finally(() => {
        helpers.setSubmitting(false);
      });
  };

  const form = useFormik({
    initialValues,
    validationSchema: onboardingSchema,
    onSubmit: handleFormikSubmit,
  });

  useEffect(() => {
    if (onboardingToken) {
      $api
        .get<OnboardingData>(`employees/onboard/${onboardingToken}`)
        .then(({ data }) => {
          form.setValues({
            email: data.email,
            password: "",
            firstname: data.firstname,
            lastname: data.lastname,
          });
          setOrgName(data.company.name);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setIsLoading(false);
        });
    } else {
      setError("No onboarding token provided.");
      setIsLoading(false);
    }
  }, [onboardingToken, form.setValues]);

  const handleSignInRedirect = () => {
    navigate(`/login?onboarding_token=${onboardingToken}`, {
      state: { message: `Please sign in to join ${orgName}.` },
    });
  };

  return {
    orgName,
    isLoading,
    error,
    form,
    handleSignInRedirect,
  };
};
