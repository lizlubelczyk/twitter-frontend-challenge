import React, { useState } from "react";
import { StyledToastContainer } from "./ToastContainer";
import {AlertIcon, SuccessIcon} from "../icon/Icon";
import {Theme} from "../../util/LightTheme";
import ReactDOM from "react-dom";

export enum ToastType {
  ALERT = "ALERT",
  SUCCESS = "SUCCESS",
}

interface ToastProps {
  message: string;
  type: ToastType;
  show?: boolean;
}

const Toast = ({ message, type, show }: ToastProps) => {
  const [isShown, setIsShown] = useState<boolean>(show ?? true);

  const iconMap = {
    [ToastType.ALERT]: <AlertIcon />,
    [ToastType.SUCCESS]: <SuccessIcon />,

  };

  const toastIcon = iconMap[type] || null;

  return ReactDOM.createPortal(
    <>
      {isShown && (
        <StyledToastContainer type={type} onClick={() => setIsShown(false)}>
          {toastIcon}
          <p>{message}</p>
        </StyledToastContainer>
      )}
    </>,
    document.getElementById("toast-root") as HTMLElement
  );
};

export default Toast;
