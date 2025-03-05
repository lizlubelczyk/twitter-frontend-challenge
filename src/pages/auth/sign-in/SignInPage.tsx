import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthWrapper from "../AuthWrapper";
import LabeledInput from "../../../components/labeled-input/LabeledInput";
import Button from "../../../components/button/Button";
import {ButtonType} from "../../../components/button/StyledButton";
import { StyledH3 } from "../../../components/common/text";
import { useQueryClient } from "@tanstack/react-query";
import { Formik } from "formik";
import {useHttpRequestService} from "../../../service/HttpRequestService";
import {useState} from "react";
import {useToast} from "../../../components/toast/ToastContext";
import {ToastType} from "../../../components/toast/Toast";

const SignInPage = () => {
  const queryClient = useQueryClient();

  const { signIn } = useHttpRequestService();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const {showToast} = useToast();

  const submit = async ({ email, password }: { email: string; password: string }) => {
    try {
      setError(null);
      await signIn({ email, password });
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      await queryClient.refetchQueries({ queryKey: ["me"] });
      showToast("Successfully logged in!", ToastType.SUCCESS);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
      <AuthWrapper>
        <div className={"border"}>
          <div className={"container"}>
            <div className={"header"}>
              <img src={logo} alt={"Twitter Logo"} />
              <StyledH3>{t("title.login")}</StyledH3>
            </div>
            <Formik
                initialValues={{ email: "", password: "" }}
                validate={(values) => {
                  const errors: { email?: string; password?: string } = {};
                  if (!values.email) {
                    errors.email = t("login.required");
                  } else if (
                      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                  ) {
                    errors.email = t("login.email.invalid");
                  }

                  if (!values.password) {
                    errors.password = t("login.required");
                  }
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  submit(values);
                  setSubmitting(false);
                }}
            >
              {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
                  <>
                    <div className={"input-container"}>
                      <LabeledInput
                          name="email"
                          type="email"
                          required
                          placeholder={"Enter user..."}
                          label={t("input-params.email")}
                          error={errors.email}
                          hasError={errors.email !== undefined || error !== null}
                          onChange={handleChange}
                          value={values.email}
                      />
                      <LabeledInput
                          name="password"
                          type="password"
                          required
                          placeholder={"Enter password..."}
                          label={t("input-params.password")}
                          error={errors.password}
                          hasError={errors.password !== undefined || error !== null}
                          onChange={handleChange}
                          value={values.password}
                      />
                    </div>
                    <p className={"error-message"}>{error}</p>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Button
                          text={t("buttons.login")}
                          buttonType={ButtonType.FOLLOW}
                          size={"MEDIUM"}
                          onClick={() => handleSubmit()}
                      />
                      <Button
                          text={t("buttons.register")}
                          buttonType={ButtonType.OUTLINED}
                          size={"MEDIUM"}
                          onClick={() => navigate("/sign-up")}
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

export default SignInPage;
