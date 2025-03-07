import React, {useEffect, useState} from "react";
import ProfileInfo from "./ProfileInfo";
import {useNavigate, useParams} from "react-router-dom";
import Modal from "../../components/modal/Modal";
import {useTranslation} from "react-i18next";
import {ButtonType} from "../../components/button/StyledButton";
import {useHttpRequestService} from "../../service/HttpRequestService";
import Button from "../../components/button/Button";
import ProfileFeed from "../../components/feed/ProfileFeed";
import {StyledContainer} from "../../components/common/Container";
import {StyledH5} from "../../components/common/text";
import {useGetProfile, useMe} from "../../hooks";
import {useToast} from "../../components/toast/ToastContext";
import {ToastType} from "../../components/toast/Toast";

const ProfilePage = () => {
  const [following, setFollowing] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalValues, setModalValues] = useState({
    text: "",
    title: "",
    type: ButtonType.DEFAULT,
    buttonText: "",
  });
  const service = useHttpRequestService();

  const id = useParams().id;
  const navigate = useNavigate();

  const { t } = useTranslation();
  const { data: user } = useMe();
  const { data: profile, refetch } = useGetProfile(id!);
  console.log(profile, "profile");
  const { showToast } = useToast();

  const handleButtonType = (): { component: ButtonType; text: string } => {
    if (profile?.user.id === user?.id) {
      return {component: ButtonType.DELETE, text: t("buttons.delete")};
    }
    if (following)
      return { component: ButtonType.OUTLINED, text: t("buttons.unfollow") };
    else return { component: ButtonType.FOLLOW, text: t("buttons.follow") };
  };

  const handleSubmit = async () => {
    try {
      if (profile?.id === user?.id) {
        await service.deleteProfile();
        localStorage.removeItem("token");
        navigate("/sign-in");
        showToast("Account deleted!", ToastType.SUCCESS);
      } else {
        await service.unfollowUser(profile!.user.id);
        setFollowing(false);
        setShowModal(false);
        await refetch();
        showToast("Unfollowed!", ToastType.SUCCESS);
      }
    } catch (error) {
      console.log(error);
      showToast("Error performing action!", ToastType.ALERT);
    }
  };

  useEffect(() => {
    if (profile) {
      setFollowing(
          profile.isFollowing
      );
    }
  }, [profile, user]);

  if (!id) return null;

  const handleButtonAction = async () => {
    try {
      if (profile?.id === user?.id) {
        setShowModal(true);
        setModalValues({
          title: t("modal-title.delete-account"),
          text: t("modal-content.delete-account"),
          type: ButtonType.DELETE,
          buttonText: t("buttons.delete"),
        });
      } else {
        if (following) {
          setShowModal(true);
          setModalValues({
            text: t("modal-content.unfollow"),
            title: `${t("modal-title.unfollow")} @${profile?.user.username}?`,
            type: ButtonType.FOLLOW,
            buttonText: t("buttons.unfollow"),
          });
        } else {
          await service.followUser(id);
          setFollowing(true);
          await refetch();
          showToast("Followed!", ToastType.SUCCESS);
        }
      }
    } catch (error) {
      console.log(error);
      showToast("Error performing action!", ToastType.ALERT);
    }
  };

  return (
      <>
        <StyledContainer
            maxHeight={"100vh"}
            borderRight={"1px solid #ebeef0"}
            maxWidth={"600px"}
        >
          {profile && (
              <>
                <StyledContainer
                    borderBottom={"1px solid #ebeef0"}
                    maxHeight={"212px"}
                    padding={"16px"}
                >
                  <StyledContainer
                      alignItems={"center"}
                      padding={"24px 0 0 0"}
                      flexDirection={"row"}
                  >
                    <ProfileInfo
                        name={profile.user.name}
                        username={profile!.user.username}
                        profilePicture={profile!.user.profilePicture}
                    />
                    <Button
                        buttonType={handleButtonType().component}
                        size={"100px"}
                        onClick={handleButtonAction}
                        text={handleButtonType().text}
                    />
                  </StyledContainer>
                </StyledContainer>
                <StyledContainer width={"100%"} style={{ flexGrow: 1, overflowY: "auto" }}>
                  {profile.user.followers ? (
                      <ProfileFeed />
                  ) : (
                      <StyledH5>Private account</StyledH5>
                  )}
                </StyledContainer>
                <Modal
                    show={showModal}
                    text={modalValues.text}
                    title={modalValues.title}
                    acceptButton={
                      <Button
                          buttonType={modalValues.type}
                          text={modalValues.buttonText}
                          size={"MEDIUM"}
                          onClick={handleSubmit}
                      />
                    }
                    onClose={() => {
                      setShowModal(false);
                    }}
                />
              </>
          )}
        </StyledContainer>
      </>
  );
};

export default ProfilePage;
