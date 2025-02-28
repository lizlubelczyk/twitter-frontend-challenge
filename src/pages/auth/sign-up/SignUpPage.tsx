import React, { useState } from "react";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthWrapper from "../../../pages/auth/AuthWrapper";
import { useHttpRequestService } from "../../../service/HttpRequestService";
import LabeledInput from "../../../components/labeled-input/LabeledInput";
import Button from "../../../components/button/Button";
import { ButtonType } from "../../../components/button/StyledButton";
import { StyledH3 } from "../../../components/common/text";
import logo from "../../../assets/logo.png";

interface SignUpData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { signUp, getProfile } = useHttpRequestService();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
      values: SignUpData,
      { setSubmitting, setErrors }: any
  ) => {
    setError(null);

    try {
      await getProfile(values.username);
      setErrors({ username: t("signup.errors.userExists") });
      return;
    } catch {
      if (values.password !== values.confirmPassword) {
        setErrors({ confirmPassword: t("signup.errors.passwordMismatch") });
        return;
      }

      const { confirmPassword, ...signUpValues } = values;

      signUp(signUpValues)
          .then(() => navigate("/"))
          .catch(() => setError(t("signup.errors.failed")));
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <AuthWrapper>
        <div className="border">
          <div className="container">
            <div className="header">
              <img src={logo} alt="Twitter Logo" />
              <StyledH3>{t("title.register")}</StyledH3>
            </div>
            <Formik
                initialValues={{
                  name: "",
                  username: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                }}
                validate={(values) => {
                  const errors: Partial<SignUpData> = {};

                  if (!values.name) errors.name = t("signup.errors.required");
                  if (!values.username) errors.username = t("signup.errors.required");
                  if (!values.email) {
                    errors.email = t("signup.errors.required");
                  } else if (
                      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                  ) {
                    errors.email = t("signup.errors.invalidEmail");
                  }
                  if (!values.password) errors.password = t("signup.errors.required");
                  if (!values.confirmPassword)
                    errors.confirmPassword = t("signup.errors.required");

                  return errors;
                }}
                onSubmit={handleSubmit}
            >
              {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
                  <>
                    <div className="input-container">
                      <LabeledInput
                          name="name"
                          required
                          placeholder="Enter name..."
                          label={t("input-params.name")}
                          error={errors.name}
                          hasError={errors.name !== undefined}
                          onChange={handleChange}
                          value={values.name}
                      />
                      <LabeledInput
                          name="username"
                          required
                          placeholder="Enter username..."
                          label={t("input-params.username")}
                          error={errors.username}
                          hasError={errors.username !== undefined}
                          onChange={handleChange}
                          value={values.username}
                      />
                      <LabeledInput
                          name="email"
                          type="email"
                          required
                          placeholder="Enter email..."
                          label={t("input-params.email")}
                          error={errors.email}
                          hasError={errors.email !== undefined}
                          onChange={handleChange}
                          value={values.email}
                      />
                      <LabeledInput
                          name="password"
                          type="password"
                          required
                          placeholder="Enter password..."
                          label={t("input-params.password")}
                          error={errors.password}
                          hasError={errors.password !== undefined}
                          onChange={handleChange}
                          value={values.password}
                      />
                      <LabeledInput
                          name="confirmPassword"
                          type="password"
                          required
                          placeholder="Confirm password..."
                          label={t("input-params.confirm-password")}
                          error={errors.confirmPassword}
                          hasError={errors.confirmPassword !== undefined}
                          onChange={handleChange}
                          value={values.confirmPassword}
                      />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Button
                          text={t("buttons.register")}
                          buttonType={ButtonType.FOLLOW}
                          size="MEDIUM"
                          onClick={() => handleSubmit()}
                          disabled={isSubmitting}
                      />
                      <Button
                          text={t("buttons.login")}
                          buttonType={ButtonType.OUTLINED}
                          size="MEDIUM"
                          onClick={() => navigate("/sign-in")}
                      />
                    </div>
                  </>
              )}
            </Formik>
          </div>
        </div>
      </AuthWrapper>
  );
};

export default SignUpPage;
