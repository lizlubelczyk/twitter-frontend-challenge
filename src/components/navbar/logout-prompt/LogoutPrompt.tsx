import React, {useEffect, useRef, useState} from "react";
import Modal from "../../modal/Modal";
import logo from "../../../assets/logo.png";
import Button from "../../button/Button";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import SwitchButton from "../../switch/SwitchButton";
import {ButtonType} from "../../button/StyledButton";
import {StyledPromptContainer} from "./PromptContainer";
import {StyledContainer} from "../../common/Container";
import {StyledP} from "../../common/text";
import {useMe} from "../../../hooks";
import {useToast} from "../../toast/ToastContext";
import {ToastType} from "../../toast/Toast";

interface LogoutPromptProps {
  show: boolean;
}

const LogoutPrompt = ({ show }: LogoutPromptProps) => {
  const [showPrompt, setShowPrompt] = useState<boolean>(show);
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { data: user, error, isLoading } = useMe();
  const promptRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const handleClickOutside = (event: MouseEvent) => {
    if (promptRef.current && !promptRef.current.contains(event.target as Node)) {
      setShowPrompt(false);
    }
  };

  const handleClick = () => {
    setShowModal(true);
  };

  const handleLanguageChange = () => {
    if (i18n.language === "es") {
      i18n.changeLanguage("en");
    } else {
      i18n.changeLanguage("es");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    showToast("Successfully logged out!", ToastType.SUCCESS);
    navigate("/sign-in");
  };

  useEffect(() => {
    if (showPrompt) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPrompt]);

  useEffect(() => {
    setShowPrompt(show);
  }, [show]);

  return (
      <>
        {showPrompt && (
            <StyledPromptContainer ref={promptRef}>
              <StyledContainer
                  flexDirection={"row"}
                  gap={"16px"}
                  borderBottom={"1px solid #ebeef0"}
                  padding={"16px"}
                  alignItems={"center"}
              >
                <StyledP primary>Es:</StyledP>
                <SwitchButton
                    checked={i18n.language === "es"}
                    onChange={handleLanguageChange}
                />
              </StyledContainer>
              <StyledContainer onClick={handleClick} alignItems={"center"}>
                <StyledP primary>{`${t("buttons.logout")} @${
                    user?.username
                }`}</StyledP>
              </StyledContainer>
            </StyledPromptContainer>
        )}
        <Modal
            show={showModal}
            text={t("modal-content.logout")}
            img={logo}
            title={t("modal-title.logout")}
            acceptButton={
              <Button
                  buttonType={ButtonType.FOLLOW}
                  text={t("buttons.logout")}
                  size={"MEDIUM"}
                  onClick={handleLogout}
              />
            }
            onClose={() => setShowModal(false)}
        />
      </>
  );
};

export default LogoutPrompt;
