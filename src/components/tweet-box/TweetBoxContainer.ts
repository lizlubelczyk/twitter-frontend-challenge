import styled from "styled-components";

interface StyledTweetBoxContainerProps {
    borderless?: boolean;
}

export const StyledTweetBoxContainer = styled.div<StyledTweetBoxContainerProps>`
    border: ${(props) => (props.borderless ? "none" : "1px solid #e1e8ed")};
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    box-sizing: border-box;
    width: 100%;
    button {
        display: flex;
    }
`;
