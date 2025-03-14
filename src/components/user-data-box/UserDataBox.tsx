import React from "react";
import Avatar from "../common/avatar/Avatar";
import icon from "../../assets/icon.jpg";
import { useNavigate } from "react-router-dom";
import {Paragraph, UserContainer, UserInfoContainer} from "./StyledUserDataBox";
import ReactDOM from "react-dom";

interface UserDataBoxProps {
  name?: string;
  username?: string;
  profilePicture?: string;
  id: string;
  onClick?: () => void;
}
export const UserDataBox = ({
  name,
  username,
  profilePicture,
  id,
  onClick,
}: UserDataBoxProps) => {
  const navigate = useNavigate();

  return(
    <UserContainer onClick={onClick}>
      <Avatar
        width={"48px"}
        height={"48px"}
        src={profilePicture ?? icon}
        onClick={() => onClick ?? navigate(`/profile/${id}`)}
        alt={name ?? "Name"}
      />
      <UserInfoContainer>
        <Paragraph>{name ?? "Name"}</Paragraph>
        <Paragraph style={{ color: "#566370" }}>{"@" + username ?? "@Username"}</Paragraph>
      </UserInfoContainer>
    </UserContainer>
  );
};

export default UserDataBox;
