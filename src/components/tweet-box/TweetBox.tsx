import React, {useEffect, useState} from "react";
import Button from "../button/Button";
import TweetInput from "../tweet-input/TweetInput";
import {setLength, updateFeed} from "../../redux/user";
import ImageContainer from "../tweet/tweet-image/ImageContainer";
import {BackArrowIcon} from "../icon/Icon";
import ImageInput from "../common/ImageInput";
import {useTranslation} from "react-i18next";
import {ButtonType} from "../button/StyledButton";
import {StyledTweetBoxContainer} from "./TweetBoxContainer";
import {StyledContainer} from "../common/Container";
import {StyledButtonContainer} from "./ButtonContainer";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import { useMe, useGetPosts } from "../../hooks";
import {useHttpRequestService} from "../../service/HttpRequestService";
import {useToast} from "../toast/ToastContext";
import {ToastType} from "../toast/Toast";

interface TweetBoxProps {
    parentId?: string;
    close?: () => void;
    mobile?: boolean;
    borderless?: boolean;
}

const TweetBox: React.FC<TweetBoxProps> = (props: TweetBoxProps) => {
    const {parentId, close, mobile} = props;
    const [content, setContent] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [imagesPreview, setImagesPreview] = useState<string[]>([]);

    const {length, query} = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const limit = 10;
    const skip = 0;

    const { data: user, error, isLoading } = useMe();
    const { data: posts, error: postsError, isLoading: postsLoading } = useGetPosts(query, limit, skip);
    const { createPost } = useHttpRequestService();
    const { showToast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };
    const handleSubmit = async () => {
        try {
            await createPost({content, images, parentId});
            setContent("");
            setImages([]);
            setImagesPreview([]);
            dispatch(setLength(length + 1));
            dispatch(updateFeed(posts));
            showToast("Tweeted!", ToastType.SUCCESS);
            close && close();
        } catch (e) {
            console.log(e);
            showToast("Error tweeting!", ToastType.ALERT);
        }
    };

    const handleRemoveImage = (index: number) => {
        const newImages = images.filter((i, idx) => idx !== index);
        const newImagesPreview = newImages.map((i) => URL.createObjectURL(i));
        setImages(newImages);
        setImagesPreview(newImagesPreview);
    };

    const handleAddImage = (newImages: File[]) => {
        setImages(newImages);
        const newImagesPreview = newImages.map((i: File) => URL.createObjectURL(i));
        setImagesPreview(newImagesPreview);
    };

    return (
        <StyledTweetBoxContainer borderless={props.borderless}>
            {mobile && (
                <StyledContainer
                    flexDirection={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <BackArrowIcon onClick={close}/>
                    <Button
                        text={"Tweet"}
                        buttonType={ButtonType.DEFAULT}
                        size={"SMALL"}
                        onClick={handleSubmit}
                        disabled={content.length === 0}
                    />
                </StyledContainer>
            )}
            <StyledContainer style={{width: "100%"}}>
                <TweetInput
                    onChange={handleChange}
                    maxLength={240}
                    placeholder={t("placeholder.tweet")}
                    value={content}
                    src={user?.profilePicture}
                />
                <StyledContainer padding={"0 0 0 10%"}>
                    <ImageContainer
                        editable
                        images={imagesPreview}
                        removeFunction={handleRemoveImage}
                    />
                </StyledContainer>
                <StyledButtonContainer>
                    <ImageInput setImages={handleAddImage} parentId={parentId}/>
                    {!mobile && (
                        <Button
                            text={"Tweet"}
                            buttonType={ButtonType.DEFAULT}
                            size={"SMALL"}
                            onClick={handleSubmit}
                            disabled={
                                content.length <= 0 ||
                                content.length > 240 ||
                                images.length > 4 ||
                                images.length < 0
                            }
                        />
                    )}
                </StyledButtonContainer>
            </StyledContainer>
        </StyledTweetBoxContainer>
    );
};

export default TweetBox;
