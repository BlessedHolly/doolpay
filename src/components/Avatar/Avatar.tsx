import { useState } from "react";
import styles from "./Avatar.module.scss";
import { useUploadAvatarMutation } from "../../store/apiAccountSlice";
import changeAvatar from "/change_avatar.png";

interface IAvatarProps {
  classNameAvatar: keyof typeof styles;
  className?: string;
  avatar: string;
  refetch: () => void;
}

function Avatar({ classNameAvatar, className, avatar, refetch }: IAvatarProps) {
  const [, setSelectedFile] = useState<File | null>(null);
  const [uploadAvatar] = useUploadAvatarMutation();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      try {
        await uploadAvatar(file).unwrap();
        refetch();
      } catch (error) {
        console.error("Error uploading avatar:", error);
      }
    }
  };

  return (
    <div className={`${styles[classNameAvatar]} ${className || ""}`.trim()}>
      <img className={styles.avatar} src={avatar || undefined} alt="" />

      <label htmlFor="fileUpload" className={styles.uploadButton}>
        <img className={styles.changeAvatarImage} src={changeAvatar} alt="" />
      </label>
      <input
        id="fileUpload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.fileInput}
      />
    </div>
  );
}

export default Avatar;
