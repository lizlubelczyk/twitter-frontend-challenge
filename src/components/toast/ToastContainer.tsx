import styled, {ThemedStyledProps} from "styled-components";
import { ToastType } from "./Toast";
import { Theme } from "../../util/LightTheme";

interface ToastContainerProps {
  type: ToastType;
}

const getContainerColor = (props: ToastContainerProps & { theme: Theme }) => {
    switch (props.type) {
        case ToastType.ALERT:
        return props.theme.colors.errorContainer;
        case ToastType.SUCCESS:
            console.log(props.theme.colors.black);
        return props.theme.colors.black;
        default:
        return props.theme.colors.containerLine;
    }
}
export const StyledToastContainer = styled.div`
  display: flex;
  padding: 8px 16px;
  align-items: center;
  gap: 16px;
  position: fixed;
  border-radius: 8px;
  border: 1px solid
    ${(props) => getContainerColor(props)};
  background: ${(props) => props.theme.background};

  p {
    color: ${getContainerColor};
    margin: 0;
    font-variant-numeric: lining-nums tabular-nums;
    /* Body-2 */
    font-family: ${({ theme }) => theme.font.default};
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 110%; /* 13.2px */
    letter-spacing: -0.12px;
  }
  transition: 0.3s ease-in-out;
  &:hover {
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  }
`;
